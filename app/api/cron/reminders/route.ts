import { NextRequest } from 'next/server';
import { reminderScheduler } from '~/lib/reminder-scheduler';

// This endpoint is called by Vercel Cron Jobs
// Add this to your vercel.json:
// {
//   "crons": [
//     {
//       "path": "/api/cron/reminders",
//       "schedule": "0 * * * *"
//     }
//   ]
// }

export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate Vercel Cron Job request
    const authHeader = request.headers.get('authorization');
    
    // In production, Vercel will send a secret token
    // For now, we'll allow the request to proceed
    if (process.env.NODE_ENV === 'production' && !authHeader) {
      console.warn('⚠️ Cron job called without authorization header');
    }

    console.log('⏰ Vercel Cron Job triggered for reminders');
    
    // Process reminders
    await reminderScheduler.processReminders();
    
    return Response.json({
      success: true,
      message: 'Reminder processing completed',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
    
  } catch (error) {
    console.error('❌ Cron job error:', error);
    
    return Response.json({
      success: false,
      message: 'Reminder processing failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Also allow POST for manual triggering
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    if (action === 'process') {
      console.log('🔍 Manual reminder processing triggered via POST');
      await reminderScheduler.processReminders();
      
      return Response.json({
        success: true,
        message: 'Manual reminder processing completed',
        timestamp: new Date().toISOString()
      });
    }
    
    return Response.json({
      success: false,
      message: 'Invalid action. Use "process" to trigger reminders.',
      validActions: ['process']
    });
    
  } catch (error) {
    console.error('❌ Manual reminder processing error:', error);
    
    return Response.json({
      success: false,
      message: 'Manual reminder processing failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
