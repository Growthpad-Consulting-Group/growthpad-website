import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/shared/lib/supabase";
import { buildInternalHtml, buildResponderHtml } from "../email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Submission ID required." }, { status: 400 });

  const { data: row, error: fetchError } = await supabaseAdmin
    .from("form_submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !row) {
    return NextResponse.json({ error: "Submission not found." }, { status: 404 });
  }

  if (row.email_status === "sent") {
    return NextResponse.json({ error: "Email already sent for this submission." }, { status: 409 });
  }

  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  if (!fromEmail) {
    return NextResponse.json({ error: "Email configuration error." }, { status: 500 });
  }

  const { name, email, phone, company, service, message, role, linkedin, portfolio } = row.payload;
  const isApplication = row.type === "career";

  const toEmail = isApplication
    ? (process.env.CAREERS_TO_EMAIL || "careers@growthpad.co.ke")
    : (process.env.CONTACT_TO_EMAIL || "strategic@growthpad.co.ke");

  const internalSubject = isApplication
    ? `[Careers Submission] ${role} Application - ${name}`
    : `[Inquiry Submission] ${service || "General Inquiry"} - ${name}`;

  const responderSubject = isApplication
    ? `Application Received — Growthpad Consulting Group`
    : `Thank you for contacting Growthpad`;

  try {
    const internalResult = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: internalSubject,
      html: buildInternalHtml({ name, email, phone, company, service, message, role, linkedin, portfolio, isApplication }),
      replyTo: email,
    });
    if (internalResult.error) throw new Error(internalResult.error.message);

    try {
      const responderResult = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: responderSubject,
        html: buildResponderHtml({ name, role, service, isApplication }),
      });
      if (responderResult.error) throw new Error(responderResult.error.message);
    } catch (respErr) {
      console.warn("Auto-responder could not be sent on retry:", respErr instanceof Error ? respErr.message : respErr);
    }

    await supabaseAdmin
      .from("form_submissions")
      .update({ email_status: "sent", email_error: null })
      .eq("id", id);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await supabaseAdmin
      .from("form_submissions")
      .update({ email_status: "failed", email_error: message })
      .eq("id", id);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
