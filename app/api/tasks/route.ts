import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authOptions } from '~/lib/auth';
import { db } from '~/lib/db';

const createTaskSchema = z.object({
  title: z.string(),
  description: z.string().nullish(),
  due: z.string().nullish(), // Due date as a string (e.g., ISO date string)
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json({
        success: false,
        message: 'Your session has expired. To use the app, sign in again.',
      });
    }

    const json = await request.json();
    const body = createTaskSchema.parse(json);

    // Create the task
    const newTask = await db.task.create({
      data: {
        title: body.title,
        description: body.description,
        due: body.due ? new Date(body.due) : null,
        authorId: session.user.id,
        reminderSent: false, // Initialize reminder status
      },
    });

    return Response.json({
      success: true,
      message: 'A new task was successfully created',
      task: {
        id: newTask.id,
        title: newTask.title,
        description: newTask.description,
        due: newTask.due,
        createdAt: newTask.createdAt,
      },
    });
  } catch (e) {
    console.error('Task creation error:', e);
    return Response.json({
      success: false,
      message: 'Error occurred while creating a task!',
    });
  }
}
