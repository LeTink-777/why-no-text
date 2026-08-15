import { Resend } from "resend";
import { SITE } from "@/lib/site";

export interface SendResultEmailInput {
  to: string;
  subject: string;
  userName: string;
  resultHtml: string;
  pdfBuffer: Buffer;
  fileName: string;
  siteName: string;
  accentColor?: string;
}

export async function sendResultEmail({
  to,
  subject,
  userName,
  resultHtml,
  pdfBuffer,
  fileName,
  siteName,
  accentColor = "#C8A96E",
}: SendResultEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const resend = new Resend(apiKey);

  return resend.emails.send({
    from: process.env.RESEND_FROM || "onboarding@resend.dev",
    to,
    subject,
    html: `
      <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
        <h1 style="color: ${accentColor}; font-size: 24px; margin: 0 0 24px;">${siteName}</h1>
        <p style="font-size: 16px; line-height: 1.6;">Здравствуйте, ${userName}!</p>
        <p style="font-size: 16px; line-height: 1.6;">Ваш персональный результат готов. PDF прикреплён к письму.</p>
        ${resultHtml}
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;" />
        <p style="font-size: 12px; color: #666; line-height: 1.6;">
          ${SITE.owner.fullName} · ИНН ${SITE.owner.inn} · ${SITE.owner.status}<br/>
          ${SITE.owner.email} · ${SITE.owner.telegram}<br/>
          <a href="${SITE.url}/offer" style="color: #666;">Оферта</a> ·
          <a href="${SITE.url}/privacy" style="color: #666;">Политика конфиденциальности</a>
        </p>
      </div>
    `,
    attachments: [{ filename: fileName, content: pdfBuffer }],
  });
}
