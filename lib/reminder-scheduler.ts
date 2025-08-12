// Vercel-compatible reminder system
// This will work with Vercel Cron Jobs instead of node-cron

import { getTasksNeedingReminders, sendTaskReminderEmail } from "./email-service";

// Reminder scheduler configuration
const REMINDER_CONFIG = {
  reminderHours: 24, // Send reminder 24 hours before due date
};

class ReminderScheduler {
  private isRunning = false;

  // Start the reminder scheduler (for local development)
  start(): void {
    if (this.isRunning) {
      console.log("⚠️ Reminder scheduler is already running");
      return;
    }

    this.isRunning = true;
    console.log("✅ Reminder scheduler started (local mode)");
    console.log("📝 Note: In production, reminders are handled by Vercel Cron Jobs");
  }

  // Stop the reminder scheduler
  stop(): void {
    this.isRunning = false;
    console.log("🛑 Reminder scheduler stopped");
  }

  // Process all tasks that need reminders
  async processReminders(): Promise<void> {
    const startTime = Date.now();
    console.log(`🔍 Starting reminder check at ${new Date().toISOString()}`);

    try {
      // Get tasks that need reminders
      const tasksNeedingReminders = await getTasksNeedingReminders();
      
      if (tasksNeedingReminders.length === 0) {
        console.log("📭 No tasks need reminders at this time");
        return;
      }

      console.log(`📧 Found ${tasksNeedingReminders.length} task(s) needing reminders`);

      // Process each task
      let successCount = 0;
      let failureCount = 0;

      for (const task of tasksNeedingReminders) {
        try {
          console.log(`📤 Sending reminder for task: "${task.title}" (due: ${task.due.toISOString()})`);
          
          const emailSent = await sendTaskReminderEmail(task.id);
          
          if (emailSent) {
            successCount++;
            console.log(`✅ Reminder sent successfully for task: "${task.title}"`);
          } else {
            failureCount++;
            console.log(`❌ Failed to send reminder for task: "${task.title}"`);
          }

          // Small delay to prevent overwhelming the email service
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          failureCount++;
          console.error(`❌ Error processing reminder for task "${task.title}":`, error);
        }
      }

      const duration = Date.now() - startTime;
      console.log(`📊 Reminder processing completed in ${duration}ms`);
      console.log(`✅ Success: ${successCount}, ❌ Failures: ${failureCount}`);

    } catch (error) {
      console.error("❌ Error in reminder processing:", error);
    }
  }

  // Get current status
  getStatus(): { isRunning: boolean; reminderHours: number; environment: string } {
    return {
      isRunning: this.isRunning,
      reminderHours: REMINDER_CONFIG.reminderHours,
      environment: process.env.NODE_ENV || 'development'
    };
  }

  // Manually trigger a reminder check (useful for testing)
  async manualCheck(): Promise<void> {
    console.log("🔍 Manual reminder check triggered");
    await this.processReminders();
  }
}

// Create singleton instance
export const reminderScheduler = new ReminderScheduler();

// Graceful shutdown handling (only in development)
if (process.env.NODE_ENV === 'development') {
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down reminder scheduler...');
    reminderScheduler.stop();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down reminder scheduler...');
    reminderScheduler.stop();
    process.exit(0);
  });
}

export default reminderScheduler;
