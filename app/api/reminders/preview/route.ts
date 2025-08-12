import { NextRequest } from 'next/server';
import { db } from '~/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get all tasks with their reminder information
    const tasks = await db.task.findMany({
      include: {
        author: true,
      },
      orderBy: [
        { due: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    const now = new Date();
    const reminderHours = 24; // Reminders sent 24 hours before due date

    const reminders = tasks.map(task => {
      let reminderType: 'upcoming' | 'overdue' | 'completed' | 'no-due-date';
      let hoursUntilDue = 0;
      let status: 'pending' | 'sent' | 'completed';
      let nextReminder: Date;

      if (task.done) {
        reminderType = 'completed';
        status = 'completed';
        hoursUntilDue = 0;
        nextReminder = new Date(task.createdAt); // Use creation date for completed tasks
      } else if (!task.due) {
        reminderType = 'no-due-date';
        status = 'pending';
        hoursUntilDue = 0;
        nextReminder = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Default to tomorrow
      } else {
        const dueDate = new Date(task.due);
        hoursUntilDue = Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60));

        if (hoursUntilDue < 0) {
          reminderType = 'overdue';
          status = task.reminderSent ? 'sent' : 'pending';
          nextReminder = dueDate; // Already overdue
        } else if (hoursUntilDue <= reminderHours) {
          reminderType = 'upcoming';
          status = task.reminderSent ? 'sent' : 'pending';
          nextReminder = dueDate;
        } else {
          reminderType = 'upcoming';
          status = task.reminderSent ? 'sent' : 'pending';
          // Calculate when reminder should be sent (24 hours before due)
          nextReminder = new Date(dueDate.getTime() - (reminderHours * 60 * 60 * 1000));
        }
      }

      return {
        task: {
          id: task.id,
          title: task.title,
          description: task.description,
          due: task.due?.toISOString() || null,
          done: task.done,
          reminderSent: task.reminderSent,
          reminderSentAt: task.reminderSentAt?.toISOString() || null,
          createdAt: task.createdAt.toISOString(),
        },
        nextReminder: nextReminder.toISOString(),
        reminderType,
        hoursUntilDue,
        status,
      };
    });

    // Sort reminders by priority: overdue first, then upcoming, then completed
    const sortedReminders = reminders.sort((a, b) => {
      if (a.reminderType === 'overdue' && b.reminderType !== 'overdue') return -1;
      if (a.reminderType !== 'overdue' && b.reminderType === 'overdue') return 1;
      if (a.reminderType === 'upcoming' && b.reminderType === 'completed') return -1;
      if (a.reminderType === 'completed' && b.reminderType === 'upcoming') return 1;
      
      // For same types, sort by due date or next reminder
      if (a.task.due && b.task.due) {
        return new Date(a.task.due).getTime() - new Date(b.task.due).getTime();
      }
      return a.nextReminder.getTime() - b.nextReminder.getTime();
    });

    return Response.json({
      success: true,
      reminders: sortedReminders,
      systemInfo: {
        currentTime: now.toISOString(),
        reminderHours,
        totalTasks: tasks.length,
        pendingReminders: reminders.filter(r => r.status === 'pending').length,
        sentReminders: reminders.filter(r => r.status === 'sent').length,
        completedTasks: reminders.filter(r => r.status === 'completed').length,
      }
    });

  } catch (error) {
    console.error('Error fetching reminder preview:', error);
    return Response.json({
      success: false,
      error: 'Failed to fetch reminder preview data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
