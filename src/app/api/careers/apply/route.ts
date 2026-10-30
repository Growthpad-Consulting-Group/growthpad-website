import { NextResponse } from "next/server";

const KAZI_API_URL =
  process.env.KAZI_API_URL ?? "https://kazi.growthpad.africa";
// CVs are sent to this relay as base64 JSON. Keep the decoded file below 3 MiB
// so the expanded request remains safely within Vercel's request-size limit.
const MAX_CV_BYTES = 3 * 1024 * 1024;

function isLinkedInProfile(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    const url = new URL(value);
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      (url.hostname === "linkedin.com" ||
        url.hostname.endsWith(".linkedin.com"))
    );
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const {
    jobId,
    name,
    email,
    phone,
    linkedin,
    portfolio,
    message,
    attachment,
    recaptchaToken,
  } = body;

  if (!jobId || !name || !email || !phone) {
    return NextResponse.json(
      { error: "Name, email and phone are required." },
      { status: 400 },
    );
  }
  if (!isLinkedInProfile(linkedin)) {
    return NextResponse.json(
      { error: "A valid LinkedIn profile URL is required." },
      { status: 400 },
    );
  }
  if (!attachment?.content || !attachment?.filename) {
    return NextResponse.json(
      { error: "Please upload your Resume/CV." },
      { status: 400 },
    );
  }
  const extension = String(attachment.filename).split(".").pop()?.toLowerCase();
  if (extension !== "pdf" && extension !== "docx") {
    return NextResponse.json(
      { error: "Please upload your CV as a PDF or .docx file." },
      { status: 400 },
    );
  }
  if (!recaptchaToken) {
    return NextResponse.json(
      { error: "reCAPTCHA verification required." },
      { status: 400 },
    );
  }

  const recaptchaRes = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY ?? "",
        response: recaptchaToken,
      }),
    },
  );
  const recaptchaData = await recaptchaRes.json();
  if (!recaptchaData.success || recaptchaData.score < 0.5) {
    return NextResponse.json(
      { error: "reCAPTCHA verification failed. Please try again." },
      { status: 403 },
    );
  }

  const cvBuffer = Buffer.from(attachment.content, "base64");
  if (cvBuffer.byteLength > MAX_CV_BYTES) {
    return NextResponse.json(
      { error: "CV files must be 3 MB or smaller." },
      { status: 400 },
    );
  }

  const form = new FormData();
  form.append("job_id", String(jobId));
  form.append("full_name", String(name));
  form.append("email", String(email));
  form.append("phone", String(phone));
  form.append("linkedin_url", linkedin ? String(linkedin) : "");
  form.append("portfolio_url", portfolio ? String(portfolio) : "");
  form.append("cover_message", message ? String(message) : "");
  form.append("source", "website");
  form.append("consented", "true");
  form.append("cv", new File([cvBuffer], attachment.filename));

  const applyRes = await fetch(
    `${KAZI_API_URL}/api/hire/candidates/apply-with-cv`,
    { method: "POST", body: form },
  );
  const applyData = await applyRes.json().catch(() => ({}));
  if (!applyRes.ok) {
    return NextResponse.json(
      {
        error:
          applyData.error ??
          "Failed to submit your application. Please try again.",
      },
      { status: applyRes.status },
    );
  }

  return NextResponse.json({ success: true });
}
