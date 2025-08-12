import { reminderScheduler } from './reminder-scheduler';

// Initialize the reminder system
export function initializeReminderSystem(): void {
  try {
    // Start the reminder scheduler
    reminderScheduler.start();
    
    console.log('🚀 Reminder system initialized successfully');
    
    // Log the current status
    const status = reminderScheduler.getStatus();
    console.log('📊 Reminder system status:', status);
    
  } catch (error) {
    console.error('❌ Failed to initialize reminder system:', error);
  }
}

// Export the scheduler for manual control if needed
export { reminderScheduler };

// Graceful shutdown function
export function shutdownReminderSystem(): void {
  try {
    reminderScheduler.stop();
    console.log('🛑 Reminder system shutdown complete');
  } catch (error) {
    console.error('❌ Error during reminder system shutdown:', error);
  }
}
