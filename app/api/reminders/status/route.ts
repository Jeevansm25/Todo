import { NextRequest } from 'next/server';
import { reminderScheduler } from '~/lib/reminder-scheduler';

export async function GET(request: NextRequest) {
  try {
    const status = reminderScheduler.getStatus();
    
    return Response.json({
      success: true,
      message: 'Reminder system status retrieved',
      status
    });
  } catch (error) {
    console.error('Error getting reminder status:', error);
    return Response.json({
      success: false,
      message: 'Failed to get reminder status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    switch (action) {
      case 'start':
        reminderScheduler.start();
        return Response.json({
          success: true,
          message: 'Reminder scheduler started',
          status: reminderScheduler.getStatus()
        });
        
      case 'stop':
        reminderScheduler.stop();
        return Response.json({
          success: true,
          message: 'Reminder scheduler stopped',
          status: reminderScheduler.getStatus()
        });
        
      case 'check':
        await reminderScheduler.manualCheck();
        return Response.json({
          success: true,
          message: 'Manual reminder check completed',
          status: reminderScheduler.getStatus()
        });
        
      default:
        return Response.json({
          success: false,
          message: 'Invalid action. Use: start, stop, or check',
          validActions: ['start', 'stop', 'check']
        });
    }
  } catch (error) {
    console.error('Error controlling reminder system:', error);
    return Response.json({
      success: false,
      message: 'Failed to control reminder system',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
