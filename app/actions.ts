'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { db } from '~/lib/db';
import { action } from '~/lib/safe-action';

const SESSION_EXPIRED_MESSAGE =
  'Your session has expired. To use the app sign in again';

const doneSchema = z.object({
  id: z.string(),
  done: z.boolean(),
});

export const toggle = action(doneSchema, async ({ id, done }, { userId }) => {
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
    });

    revalidatePath('/[username]', 'page');

    return {
      done: task.done,
    };
  } catch (e) {
    console.error('Error toggling task:', e);
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
      });

      revalidatePath('/[username]', 'page');

      return task;
    } catch (e) {
      console.error('Error deleting task:', e);
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
      });

      revalidatePath('/[username]/[taskId]', 'page');

      return comment;
    } catch (e) {
      console.error('Error creating comment:', e);
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

      revalidatePath('/[username]', 'page');

      return repo;
    } catch (e) {
      console.error('Error linking repo:', e);
      return {
        failure: 'Error occurred while linking the repo!',
      };
    }
  }
);
