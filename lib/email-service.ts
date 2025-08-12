import nodemailer from "nodemailer";
import { db } from "./db";

// Email configuration with fallbacks
const EMAIL_CONFIG = {
  from: process.env.SMTP_EMAIL || "noreply@todoapp.com",
  fromName: process.env.SMTP_FROM_NAME || "Todo App",
  reminderHours: parseInt(process.env.REMINDER_HOURS || "24"), // Send reminder 24 hours before due date
  defaultEmail: process.env.DEFAULT_USER_EMAIL || "jeevansm025@gmail.com",
};

// Create reusable transporter
let transporter: nodemailer.Transporter | null = null;

async function getTransporter(): Promise<nodemailer.Transporter> {
  if (transporter) {
    return transporter;
  }

  const { SMTP_EMAIL, SMTP_PASSWORD, SMTP_CLIENT_ID, SMTP_CLIENT_SECRET, SMTP_REFRESH_TOKEN } = process.env;

  if (!SMTP_EMAIL) {
    throw new Error("SMTP_EMAIL is not configured in environment variables");
  }

  // Try OAuth2 first (more secure)
  if (SMTP_CLIENT_ID && SMTP_CLIENT_SECRET && SMTP_REFRESH_TOKEN) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: SMTP_EMAIL,
        clientId: SMTP_CLIENT_ID,
        clientSecret: SMTP_CLIENT_SECRET,
        refreshToken: SMTP_REFRESH_TOKEN,
        accessToken: undefined,
      },
    });
  }
  // Fallback to password-based authentication
  else if (SMTP_PASSWORD) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
      },
    });
  } else {
    throw new Error("No SMTP authentication method configured. Please set either SMTP_PASSWORD or OAuth2 credentials");
  }

  // Verify connection
  try {
    await transporter.verify();
    console.log("✅ Email transporter verified successfully");
  } catch (error) {
    console.error("❌ Email transporter verification failed:", error);
    throw error;
  }

  return transporter;
}

// Email templates
const emailTemplates = {
  taskCreated: (task: { title: string; description?: string | null; due?: Date | null; author: { username: string } }) => ({
    subject: `✅ Task Created: ${task.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Task Successfully Created!</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e293b;">${task.title}</h3>
          ${task.description ? `<p style="color: #475569; margin: 10px 0;"><strong>Description:</strong> ${task.description}</p>` : ''}
          ${task.due ? `<p style="color: #dc2626; margin: 10px 0;"><strong>Due Date:</strong> ${task.due.toLocaleDateString()} at ${task.due.toLocaleTimeString()}</p>` : ''}
          <p style="color: #64748b; font-size: 14px;">Created by: ${task.author.username}</p>
        </div>
        <p style="color: #64748b; font-size: 14px;">You'll receive a reminder ${EMAIL_CONFIG.reminderHours} hours before this task is due.</p>
      </div>
    `
  }),

  taskReminder: (task: { title: string; description?: string | null; due: Date; author: { username: string } }) => ({
    subject: `⏰ Reminder: "${task.title}" is due soon!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Task Due Soon!</h2>
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <h3 style="margin-top: 0; color: #991b1b;">${task.title}</h3>
          ${task.description ? `<p style="color: #7f1d1d; margin: 10px 0;"><strong>Description:</strong> ${task.description}</p>` : ''}
          <p style="color: #dc2626; margin: 10px 0; font-weight: bold;"><strong>Due Date:</strong> ${task.due.toLocaleDateString()} at ${task.due.toLocaleTimeString()}</p>
          <p style="color: #991b1b; font-size: 14px;">Created by: ${task.author.username}</p>
        </div>
        <p style="color: #64748b; font-size: 14px;">Please complete this task before the due date!</p>
      </div>
    `
  })
};

// Send email function with proper error handling
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  taskId?: string
): Promise<boolean> {
  try {
    const emailTransporter = await getTransporter();
    
    const mailOptions = {
      from: `"${EMAIL_CONFIG.fromName}" <${EMAIL_CONFIG.from}>`,
      to,
      subject,
      html,
    };

    const result = await emailTransporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${to}:`, result.messageId);
    
    // Mark reminder as sent if this was a reminder email
    if (taskId) {
      await db.task.update({
        where: { id: taskId },
        data: {
          reminderSent: true,
          reminderSentAt: new Date(),
        },
      });
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error);
    
    // Don't throw error - just log it so it doesn't break the main flow
    return false;
  }
}

// Send task creation notification
export async function sendTaskCreatedEmail(taskId: string): Promise<boolean> {
  try {
    const task = await db.task.findUnique({
      where: { id: taskId },
      include: { author: true }
    });

    if (!task) {
      console.error(`Task not found: ${taskId}`);
      return false;
    }

    // Use user's email if available, otherwise fall back to default
    const userEmail = task.author.email || EMAIL_CONFIG.defaultEmail;
    
    if (!userEmail) {
      console.warn(`No email available for task ${taskId}, skipping email notification`);
      return false;
    }
    
    const { subject, html } = emailTemplates.taskCreated(task);
    return await sendEmail(userEmail, subject, html);
  } catch (error) {
    console.error("Failed to send task created email:", error);
    return false;
  }
}

// Send task reminder
export async function sendTaskReminderEmail(taskId: string): Promise<boolean> {
  try {
    const task = await db.task.findUnique({
      where: { id: taskId },
      include: { author: true }
    });

    if (!task) {
      console.error(`Task not found: ${taskId}`);
      return false;
    }

    // Use user's email if available, otherwise fall back to default
    const userEmail = task.author.email || EMAIL_CONFIG.defaultEmail;
    
    if (!userEmail) {
      console.warn(`No email available for task ${taskId}, skipping reminder email`);
      return false;
    }
    
    const { subject, html } = emailTemplates.taskReminder(task);
    return await sendEmail(userEmail, subject, html, taskId);
  } catch (error) {
    console.error("Failed to send task reminder email:", error);
    return false;
  }
}

// Get tasks that need reminders
export async function getTasksNeedingReminders(): Promise<Array<{ id: string; title: string; due: Date; author: { username: string; email?: string | null } }>> {
  const reminderThreshold = new Date();
  reminderThreshold.setHours(reminderThreshold.getHours() + EMAIL_CONFIG.reminderHours);

  return await db.task.findMany({
    where: {
      due: {
        gte: new Date(),
        lte: reminderThreshold,
      },
      reminderSent: false,
      done: false,
    },
    include: {
      author: {
        select: {
          username: true,
          email: true,
        },
      },
    },
  });
}

// Clean up transporter on app shutdown
export async function closeTransporter(): Promise<void> {
  if (transporter) {
    await transporter.close();
    transporter = null;
    console.log("Email transporter closed");
  }
}
