import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/shared/lib/supabase";
import { buildInternalHtml, buildResponderHtml } from "../email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  if (!fromEmail) {
    return NextResponse.json({ error: "Email configuration error." }, { status: 500 });
  }

  const { data: failedRows, error: fetchError } = await supabaseAdmin
    .from("form_submissions")
    .select("*")
    .eq("email_status", "failed");

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!failedRows || failedRows.length === 0) {
    return NextResponse.json({ success: true, retried: 0 });
  }

  const results = await Promise.allSettled(
    failedRows.map((row) => retryRow(row, fromEmail))
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return NextResponse.json({ success: true, retried: failedRows.length, succeeded, failed });
}

async function retryRow(row: Record<string, any>, fromEmail: string) {
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

  // Re-fetch resume from Supabase Storage if this is a career submission
  let attachmentBuffer: Buffer | null = null;
  let attachmentFilename: string | null = null;
  if (isApplication && row.resume_url) {
    const { data: fileData, error: downloadError } = await supabaseAdmin.storage
      .from("resumes")
      .download(row.resume_url);

    if (!downloadError && fileData) {
      attachmentBuffer = Buffer.from(await fileData.arrayBuffer());
      attachmentFilename = row.resume_url.replace(/^\d+-/, ""); // strip timestamp prefix
    } else {
      console.warn(`Could not download resume for submission ${row.id}:`, downloadError?.message);
    }
  }

  const internalEmailOptions: {
    from: string; to: string; subject: string; html: string; replyTo: string;
    attachments?: { filename: string; content: Buffer }[];
  } = {
    from: fromEmail,
    to: toEmail,
    subject: internalSubject,
    html: buildInternalHtml({ name, email, phone, company, service, message, role, linkedin, portfolio, isApplication, attachmentFilename: attachmentFilename ?? undefined }),
    replyTo: email,
  };

  if (attachmentBuffer && attachmentFilename) {
    internalEmailOptions.attachments = [{ filename: attachmentFilename, content: attachmentBuffer }];
  }

  const internalResult = await resend.emails.send(internalEmailOptions);
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
    console.warn(`Auto-responder failed on retry for ${row.id}:`, respErr instanceof Error ? respErr.message : respErr);
  }

  await supabaseAdmin
    .from("form_submissions")
    .update({ email_status: "sent", email_error: null })
    .eq("id", row.id);
}
