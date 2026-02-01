import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

type InquiryPayload = {
  name: string;
  email: string;
  message: string;
  project?: string | null;
};

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const resendKey = Deno.env.get("RESEND_API_KEY");
  const notifyEmail = Deno.env.get("INQUIRY_NOTIFY_EMAIL");
  const fromEmail =
    Deno.env.get("INQUIRY_FROM_EMAIL") || "Portfolio <onboarding@resend.dev>";

  if (!resendKey || !notifyEmail) {
    return new Response("Missing email configuration.", { status: 500 });
  }

  let payload: InquiryPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response("Invalid JSON payload.", { status: 400 });
  }

  const name = payload?.name?.trim();
  const email = payload?.email?.trim();
  const message = payload?.message?.trim();
  const project = payload?.project?.trim();

  if (!name || !email || !message) {
    return new Response("Missing inquiry fields.", { status: 400 });
  }

  const subject = project
    ? `New inquiry about ${project}`
    : "New portfolio inquiry";

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="margin-bottom: 8px;">New inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${project ? `<p><strong>Project:</strong> ${project}</p>` : ""}
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br />")}</p>
    </div>
  `;

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [notifyEmail],
      reply_to: email,
      subject,
      html
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    return new Response(errorText || "Failed to send email.", { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
});
