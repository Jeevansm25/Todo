import nodemailer from "nodemailer";

export async function sendMail({
  to,
  name,
  subject,
  body,
}: {
  to: string;
  name: string;
  subject: string;
  body: string;
}) {
  // Load SMTP credentials from environment variables
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

  if (!SMTP_EMAIL || !SMTP_PASSWORD) {
    console.error("SMTP credentials are missing!");
    throw new Error("SMTP_EMAIL or SMTP_PASSWORD is not defined in the environment.");
  }

  const transport = nodemailer.createTransport({
    service: "gmail", // Alternatively, use host/port for more flexibility
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    // Verify connection
    const testResult = await transport.verify();
    console.log("Transport verified:", testResult);

    // Send email
    const sendResult = await transport.sendMail({
      from: `${name} <${SMTP_EMAIL}>`, // Sender name and email
      to, // Receiver email
      subject, // Email subject
      html: body, // Email body in HTML format
    });

    console.log("Email sent successfully:", sendResult);
    return sendResult;
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    throw new Error("Failed to send email.");
  }
}
