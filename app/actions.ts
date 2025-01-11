'use server';

import { getSession } from 'next-auth/react';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { db } from '~/lib/db';
import { sendMail } from '~/lib/mail';
import { action } from '~/lib/safe-action';

const SESSION_EXPIRED_MESSAGE =
  'Your session has expired. To use the app sign in again';

// Utility to send action-specific emails
const sendTaskMail = async ({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) => {
  await sendMail({
    to,
    name: 'Todo User', // Replace with a dynamic name if available
    subject,
    body,
  });
};

const doneSchema = z.object({
  id: z.string(),
  done: z.boolean(),
});

export const toogle = action(doneSchema, async ({ id, done }, { userId }) => {
  try {
    if (!userId)
      return {
        failure: SESSION_EXPIRED_MESSAGE,
      };

    const task = await db.task.update({
      where: {
        id,
      },
      data: {
        done,
      },
      include: {
        author: true, // Fetch the author's email
      },
    });

    revalidatePath('/[username]', 'page');

    // Adjust email based on toggle state
    const taskStatus = done ? 'done' : 'incomplete';
    const subject = `Task Marked as ${taskStatus.toUpperCase()}`;
    const body = `
      <p>Your task <strong>${task.title}</strong> has been marked as <strong>${taskStatus}</strong>.</p>
      <p>Thank you for staying on top of your tasks!</p>
    `;

    // Send an email notification
    await sendTaskMail({
      to: task.author.username,
      subject,
      body,
    });

    return {
      done: task.done,
    };
  } catch (e) {
    console.log(e);
    return {
      failure: 'Error occurred while toggling the done state!',
    };
  }
});


const deleteTaskSchema = z.object({
  id: z.string(),
});

export const deleteTask = action(
  deleteTaskSchema,
  async ({ id }, { userId }) => {
    try {
      if (!userId)
        return {
          failure: SESSION_EXPIRED_MESSAGE,
        };

      const task = await db.task.delete({
        where: {
          id,
        },
        include: {
          author: true, // Fetch the author's email
        },
      });

      revalidatePath('/[username]', 'page');

      // Send a delete-specific email
      await sendTaskMail({
        to: task.author.username,
        subject: 'Task Deleted',
        body: `<p>Your task <strong>${task.title}</strong> has been deleted.</p>`,
      });

      return task;
    } catch (e) {
      console.log(e);
      return {
        failure: 'Error occurred while deleting the task!',
      };
    }
  }
);

const createCommentSchema = z.object({
  taskId: z.string(),
  text: z.string(),
});

export const createComment = action(
  createCommentSchema,
  async ({ taskId, text }, { userId }) => {
    try {
      if (!userId)
        return {
          failure: SESSION_EXPIRED_MESSAGE,
        };

      const comment = await db.comment.create({
        data: {
          taskId,
          senderId: userId,
          text,
        },
        include: {
          task: {
            include: {
              author: true, // Fetch the author's email
            },
          },
        },
      });

      revalidatePath('/[username]/[taskId]', 'page');

      // Send a comment-specific email
      await sendTaskMail({
        to: comment.task.author.username,
        subject: 'New Comment on Your Task',
        body: `<p>A new comment was added to your task <strong>${comment.task.title}</strong>:</p>
               <p>"${text}"</p>`,
      });

      return comment;
    } catch (e) {
      console.log(e);
      return {
        failure: 'Error occurred while creating the comment!',
      };
    }
  }
);

const linkRepoSchema = z.object({
  taskId: z.string(),
  link: z
    .string()
    .min(1, { message: 'There is no link' })
    .regex(new RegExp('https://github.com/.*/.*'), {
      message: `It's not a GitHub repo link 😡`,
    }),
});

export const linkRepo = action(
  linkRepoSchema,
  async ({ link, taskId }, { userId }) => {
    try {
      if (!userId)
        return {
          failure: SESSION_EXPIRED_MESSAGE,
        };

      const splitted = link.split('/');
      const repoName = splitted[splitted.length - 1];
      const ownerName = splitted[splitted.length - 2];
      const fullName = `${ownerName}/${repoName}`;

      const repo = await db.repo.upsert({
        where: {
          taskId,
        },
        update: {
          repoName,
          owner: ownerName,
          fullName,
        },
        create: {
          taskId,
          repoName,
          owner: ownerName,
          fullName,
        },
      });

      const task = await db.task.findUnique({
        where: { id: taskId },
        include: { author: true },
      });

      revalidatePath('/[username]', 'page');

      // Send a repo-link-specific email
      await sendTaskMail({
        to: task?.author.username || 'noreply@example.com',
        subject: 'Repository Linked to Task',
        body: `<p>The GitHub repository <strong>${fullName}</strong> has been linked to your task <strong>${task?.title}</strong>.</p>`,
      });

      return repo;
    } catch (e) {
      console.log(e);
      return {
        failure: 'Error occurred while linking the repo!',
      };
    }
  }
);
