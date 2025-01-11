import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { sendMail } from '~/lib/mail';
import { authOptions } from '~/lib/auth';
import { db } from '~/lib/db';

const createTaskSchema = z.object({
  title: z.string(),
  description: z.string().nullish(),
  due: z.string().nullish(), // Due date as a string (e.g., ISO date string)
});

const send = async (title: string, description: string | null | undefined, due: string | null | undefined) => {
  const dueDateText = due ? `<p><strong>Due Date:</strong> ${due}</p>` : '';
  const descriptionText = description ? `<p><strong>Description:</strong> ${description}</p>` : '<p><strong>Description:</strong> No description provided</p>';

  await sendMail({
    to: "jeevansm025@gmail.com", // Replace with recipient's email or fetch dynamically
    name: "TODO",
    subject: "Todo Task Created",
    body: `
      <h2>Your Todo Task Was Successfully Created</h2>
      <p><strong>Title:</strong> ${title}</p>
      ${descriptionText}
      ${dueDateText}
    `,
  });
};

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

    const newTask = await db.task.create({
      data: {
        title: body.title,
        description: body.description,
        due: body.due ? new Date(body.due) : null, // Convert string to Date for database insertion
        authorId: session.user.id,
      },
    });

    // Convert `due` from Date to string for email
    const dueString = newTask.due ? newTask.due.toISOString().split('T')[0] : null;

    // Send email with task details
    await send(newTask.title, newTask.description, dueString);

    return Response.json({
      success: true,
      message: 'A new task was successfully created',
    });
  } catch (e) {
    console.error(e);
    return Response.json({
      success: false,
      message: 'Error occurred while creating a task!',
    });
  }
}
