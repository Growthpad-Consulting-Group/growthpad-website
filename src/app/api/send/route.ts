import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
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

    // Route target recipient: Careers go to careers@growthpad.co.ke, inquiries to strategic@growthpad.co.ke
    const toEmail = isApplication
      ? (process.env.CAREERS_TO_EMAIL || "careers@growthpad.co.ke")
      : (process.env.CONTACT_TO_EMAIL || "strategic@growthpad.co.ke");
    
    // Resend requires sending from a verified domain, or onboarding@resend.dev for test accounts
    const fromEmail = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

    const internalSubject = isApplication
      ? `[Careers Submission] ${role} Application - ${name}`
      : `[Inquiry Submission] ${service || "General Inquiry"} - ${name}`;

    // 1. Clean, modern HTML grid email template for internal notification
    let internalHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <div style="text-align: left; border-bottom: 1px solid #f3f4f6; padding-bottom: 20px; margin-bottom: 24px;">
          <img src="https://growthpad.co.ke/assets/images/gcg_logo_primary.png" alt="Growthpad Logo" style="height: 38px; display: block;" />
        </div>
        <h2 style="color: #231812; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 6px;">
          ${isApplication ? "New Career Submission" : "New Website Inquiry"}
        </h2>
        <p style="color: #6b7280; font-size: 14px; margin-top: 0; margin-bottom: 24px;">
          You received a new submission from the website forms. Details are below.
        </p>
        <table style="width: 100%; border-collapse: collapse;">
          <tbody>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; width: 140px; color: #4b5563; font-size: 14px; border-bottom: 1px solid #f9fafb;">Name:</td>
              <td style="padding: 10px 0; color: #1f2937; font-size: 14px; border-bottom: 1px solid #f9fafb;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #4b5563; font-size: 14px; border-bottom: 1px solid #f9fafb;">Email:</td>
              <td style="padding: 10px 0; color: #f05d23; font-size: 14px; border-bottom: 1px solid #f9fafb;"><a href="mailto:${email}" style="color: #f05d23; text-decoration: none;">${email}</a></td>
            </tr>
    `;

    if (phone) {
      internalHtml += `
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #4b5563; font-size: 14px; border-bottom: 1px solid #f9fafb;">Phone:</td>
              <td style="padding: 10px 0; color: #1f2937; font-size: 14px; border-bottom: 1px solid #f9fafb;"><a href="tel:${phone}" style="color: #1f2937; text-decoration: none;">${phone}</a></td>
            </tr>
      `;
    }

    if (company) {
      internalHtml += `
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #4b5563; font-size: 14px; border-bottom: 1px solid #f9fafb;">Company:</td>
              <td style="padding: 10px 0; color: #1f2937; font-size: 14px; border-bottom: 1px solid #f9fafb;">${company}</td>
            </tr>
      `;
    }

    if (role) {
      internalHtml += `
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #4b5563; font-size: 14px; border-bottom: 1px solid #f9fafb;">Position:</td>
              <td style="padding: 10px 0; color: #f05d23; font-weight: 700; font-size: 14px; border-bottom: 1px solid #f9fafb;">${role}</td>
            </tr>
      `;
    }

    if (service) {
      internalHtml += `
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #4b5563; font-size: 14px; border-bottom: 1px solid #f9fafb;">Service Area:</td>
              <td style="padding: 10px 0; color: #1f2937; font-size: 14px; border-bottom: 1px solid #f9fafb;">${service}</td>
            </tr>
      `;
    }

    if (linkedin) {
      internalHtml += `
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #4b5563; font-size: 14px; border-bottom: 1px solid #f9fafb;">LinkedIn:</td>
              <td style="padding: 10px 0; color: #1f2937; font-size: 14px; border-bottom: 1px solid #f9fafb;"><a href="${linkedin}" target="_blank" style="color: #f05d23; text-decoration: none;">View Profile</a></td>
            </tr>
      `;
    }

    if (portfolio) {
      internalHtml += `
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #4b5563; font-size: 14px; border-bottom: 1px solid #f9fafb;">Portfolio:</td>
              <td style="padding: 10px 0; color: #1f2937; font-size: 14px; border-bottom: 1px solid #f9fafb;"><a href="${portfolio}" target="_blank" style="color: #f05d23; text-decoration: none;">View Site</a></td>
            </tr>
      `;
    }

    internalHtml += `
          </tbody>
        </table>
    `;

    if (message) {
      internalHtml += `
        <div style="margin-top: 24px; padding: 20px; border-radius: 8px; background-color: #f9fafb; border: 1px solid #f3f4f6;">
          <h4 style="margin-top: 0; margin-bottom: 10px; color: #231812; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Message text:</h4>
          <p style="margin: 0; line-height: 1.6; white-space: pre-wrap; color: #4b5563; font-size: 14px;">${message}</p>
        </div>
      `;
    }

    if (attachment && attachment.filename) {
      internalHtml += `
        <div style="margin-top: 24px; padding: 12px 16px; border-radius: 8px; background-color: #f0fdf4; border: 1px solid #dcfce7; display: inline-flex; align-items: center; gap: 8px;">
          <span style="font-size: 14px; color: #15803d; font-weight: 500;">📎 Attached Resume:</span>
          <span style="font-size: 14px; color: #166534; font-weight: 600; margin-left: 4px;">${attachment.filename}</span>
        </div>
      `;
    }

    internalHtml += `
        <div style="margin-top: 32px; font-size: 12px; text-align: center; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 16px; line-height: 1.5;">
          Growthpad Digital Consulting Group Website submissions
        </div>
      </div>
    `;

    // 2. Modern HTML template for user auto-responder confirmation receipt
    const responderSubject = isApplication
      ? `Application Received — Growthpad Consulting Group`
      : `Thank you for contacting Growthpad`;

    const responderHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <div style="text-align: left; border-bottom: 1px solid #f3f4f6; padding-bottom: 20px; margin-bottom: 24px;">
          <img src="https://growthpad.co.ke/assets/images/gcg_logo_primary.png" alt="Growthpad Logo" style="height: 38px; display: block;" />
        </div>
        
        <h2 style="color: #231812; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 12px;">
          Hi ${name.split(" ")[0]},
        </h2>
        
        <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">
          ${
            isApplication
              ? `Thank you for your interest in joining Growthpad! We have successfully received your application credentials for the <strong>${role}</strong> role.`
              : `Thank you for reaching out to Growthpad Digital Consulting. We have received your inquiry regarding <strong>${service || "our services"}</strong>.`
          }
        </p>
        
        <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
          ${
            isApplication
              ? "Our recruitment and talent acquisition team is currently reviewing your resume. If your profile matches what we're looking for, we will reach out to schedule an initial interview."
              : "Our consulting team is already reviewing your details. A Growthpad consultant will be in touch with you shortly (usually within 1 business day) to discuss how we can work together."
          }
        </p>
        
        <div style="margin: 32px 0; text-align: left;">
          <a href="https://growthpad.co.ke" style="background-color: #f05d23; color: #ffffff; text-decoration: none; padding: 12px 24px; font-weight: 600; border-radius: 8px; font-size: 14px; display: inline-block;">
            Visit Our Website
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 0; border-top: 1px solid #f3f4f6; padding-top: 20px; line-height: 1.5;">
          Best regards,<br />
          <strong>Growthpad Consulting Group</strong><br />
          <span style="font-size: 13px; color: #9ca3af;">Nairobi, Kenya</span>
        </p>
      </div>
    `;

    // Package email options for internal notification
    const internalEmailOptions: any = {
      from: fromEmail,
      to: toEmail,
      subject: internalSubject,
      html: internalHtml,
      replyTo: email,
    };

    if (attachment && attachment.content && attachment.filename) {
      internalEmailOptions.attachments = [
        {
          filename: attachment.filename,
          content: Buffer.from(attachment.content, "base64"),
        },
      ];
    }

    // Package email options for user receipt
    const responderEmailOptions: any = {
      from: fromEmail,
      to: email, // Sent to user
      subject: responderSubject,
      html: responderHtml,
    };

    // Send internal alert email
    const internalResult = await resend.emails.send(internalEmailOptions);

    // Send responder receipt email to user
    let responderResult = null;
    try {
      responderResult = await resend.emails.send(responderEmailOptions);
    } catch (respErr: any) {
      // Gracefully catch validation errors (e.g. sending to unverified addresses in sandbox)
      console.warn("Auto-responder receipt could not be sent:", respErr.message);
    }

    return NextResponse.json({
      success: true,
      data: internalResult,
      responder: responderResult,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
