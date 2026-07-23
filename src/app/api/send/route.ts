import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/shared/lib/supabase";
import { buildInternalHtml, buildResponderHtml } from "./email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();
  const {
    name,
    email,
    phone,
    company,
    service,
    message,
    role,
    linkedin,
    portfolio,
    attachment, // { content: string, filename: string }
  } = body;

  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required fields." },
      { status: 400 },
    );
  }

  const isApplication = !!role;

  // Resume goes to Supabase Storage as a durable copy — independent of
  // whether the email (which also carries it as an attachment) succeeds.
  let resumeUrl: string | null = null;
  if (attachment?.content && attachment?.filename) {
    const buffer = Buffer.from(attachment.content, "base64");
    const storagePath = `${Date.now()}-${attachment.filename}`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from("resumes")
      .upload(storagePath, buffer);

    if (uploadError) {
      console.warn("Resume upload to Supabase failed:", uploadError.message);
    } else {
      resumeUrl = storagePath;
    }
  }

  // Persist the submission before attempting email — this is the durable
  // record of the lead/application; email delivery is best-effort on top
  // of it, so a Resend outage never loses the actual submission.
  const { data: submission, error: insertError } = await supabaseAdmin
    .from("form_submissions")
    .insert({
      type: isApplication ? "career" : "contact",
      payload: { name, email, phone, company, service, message, role, linkedin, portfolio },
      resume_url: resumeUrl,
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("Failed to save submission to Supabase:", insertError.message);
    return NextResponse.json(
      { error: "Failed to save your submission. Please try again." },
      { status: 500 },
    );
  }

  // Route target recipient: Careers go to careers@growthpad.co.ke, inquiries to strategic@growthpad.co.ke
  const toEmail = isApplication
    ? (process.env.CAREERS_TO_EMAIL || "careers@growthpad.co.ke")
    : (process.env.CONTACT_TO_EMAIL || "strategic@growthpad.co.ke");

  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  if (!fromEmail) {
    console.error("CONTACT_FROM_EMAIL env var is not set");
    return NextResponse.json({ error: "Email configuration error." }, { status: 500 });
  }

  const internalSubject = isApplication
    ? `[Careers Submission] ${role} Application - ${name}`
    : `[Inquiry Submission] ${service || "General Inquiry"} - ${name}`;

  const internalHtml = buildInternalHtml({
    name, email, phone, company, service, message, role, linkedin, portfolio, isApplication,
    attachmentFilename: attachment?.filename,
  });

  const responderSubject = isApplication
    ? `Application Received — Growthpad Consulting Group`
    : `Thank you for contacting Growthpad`;

  const responderHtml = buildResponderHtml({ name, role, service, isApplication });

  type EmailOptions = {
    from: string;
    to: string;
    subject: string;
    html: string;
    replyTo?: string;
    attachments?: { filename: string; content: Buffer }[];
  };

  const internalEmailOptions: EmailOptions = {
    from: fromEmail,
    to: toEmail,
    subject: internalSubject,
    html: internalHtml,
    replyTo: email,
  };

  if (attachment?.content && attachment?.filename) {
    internalEmailOptions.attachments = [{
      filename: attachment.filename,
      content: Buffer.from(attachment.content, "base64"),
    }];
  }

  const responderEmailOptions: EmailOptions = {
    from: fromEmail,
    to: email,
    subject: responderSubject,
    html: responderHtml,
  };

  try {
    // Send internal alert email. Resend's SDK resolves with { data, error }
    // on API-level failures (e.g. sandbox restrictions) instead of
    // throwing — only network/unexpected errors land in the catch block,
    // so an `error` field on the resolved result has to be checked explicitly.
    const internalResult = await resend.emails.send(internalEmailOptions);
    if (internalResult.error) {
      throw new Error(internalResult.error.message);
    }

    // Send responder receipt email to user
    let responderResult = null;
    try {
      responderResult = await resend.emails.send(responderEmailOptions);
      if (responderResult.error) {
        throw new Error(responderResult.error.message);
      }
    } catch (respErr) {
      // Gracefully catch validation errors (e.g. sending to unverified addresses in sandbox)
      const message = respErr instanceof Error ? respErr.message : String(respErr);
      console.warn("Auto-responder receipt could not be sent:", message);
      responderResult = null;
    }

    await supabaseAdmin
      .from("form_submissions")
      .update({ email_status: "sent" })
      .eq("id", submission.id);

    return NextResponse.json({
      success: true,
      data: internalResult,
      responder: responderResult,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    // The submission is already safely stored in Supabase even though the
    // notification email failed — still report success to the user, but
    // flag the row so it can be followed up on manually.
    await supabaseAdmin
      .from("form_submissions")
      .update({ email_status: "failed", email_error: message })
      .eq("id", submission.id);

    console.error("Failed to send notification email:", message);

    return NextResponse.json({
      success: true,
      warning: "Your submission was saved, but the notification email could not be sent.",
    });
  }
}
