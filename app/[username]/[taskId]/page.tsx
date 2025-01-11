import { cache } from 'react';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import { Badge } from '~/components/ui/badge';

import { Comments } from '~/components/comments';
import { Icons } from '~/components/icons';

import { authOptions } from '~/lib/auth';
import { db } from '~/lib/db';
import { formatDate } from '~/lib/utils';
import { PAGES } from '~/lib/constants';

const getTask = cache(async (username: string, id: string) => {
  const task = await db.task.findUnique({
    where: {
      author: {
        username: decodeURIComponent(username)
      },
      id
    },
    include: {
      gh: {
        select: {
          owner: true,
          repoName: true,
          fullName: true
        }
      },
      comments: {
        select: {
          sender: {
            select: {
              username: true
            }
          },
          id: true,
          text: true,
          createdAt: true
        }
      }
    }
  });

  return task;
});

interface Props {
  params: {
    username: string;
    taskId: string;
  };
}

export async function generateMetadata({ params }: Props) {
  const task = await getTask(params.username, params.taskId);

  const title = task ? task.title : 'Task not found :(';

  return {
    title
  };
}

export default async function TaskPage({ params }: Props) {
  const session = await getServerSession(authOptions);

  if (!session) redirect(PAGES.SIGN_IN);

  const task = await getTask(params.username, params.taskId);

  if (!task) notFound();

  return (
    <div className="min-h-screen bg-gradient-to- flex flex-col justify-center items-center p-4">
      <Card className='w-full max-w-[750px] bg-white shadow-lg border-t-4 border-t-blue-500'>
        <CardHeader className="border-b border-gray-200 pb-4 flex justify-between items-center">
          <CardTitle className="text-3xl font-bold text-gray-800">{task.title}</CardTitle>
          <Badge className={`${task.done ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} px-3 py-1 rounded-full text-sm font-medium`}>
            {task.done ? 'Completed' : 'In Progress'}
          </Badge>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
            <Textarea
              className='max-h-80 min-h-[150px] bg-gray-300 border-gray-200 text-black text-xl w-full'
              readOnly
              value={task.description || 'No description provided'}
            />
          </div>

          <div className='flex flex-col sm:flex-row sm:justify-between gap-4 text-sm'>
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md">
              
              <Icons.calendarClock className='size-5 text-blue-500' />
              {task.due ? (
                <time className='text-gray-700 font-medium'>
                  Due: {formatDate(task.due.toString())} 
                </time>
              ) : (
                <span className="text-gray-500">No due date</span>
              )}
            </div>
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md">
              <Icons.github className='size-5 text-gray-700' />
              {task.gh ? (
                <Link
                  className='text-blue-600 hover:text-blue-800 font-medium'
                  href={`/${params.username}/${params.taskId}/gh`}
                >
                  {task.gh.fullName}
                </Link>
              ) : (
                <span className="text-gray-500">No linked repository</span>
              )}
            </div>
          </div>

          {decodeURIComponent(params.username) !== session.user.username && (
            <div className='bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md'>
              <Icons.share2 className="inline-block mr-2 size-5" />
              <span className='font-medium'>{decodeURIComponent(params.username)}</span> shared this task with you
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Comments</h3>
            <Comments id={task.id} comments={task.comments} />
          </div>
        </CardContent>
        <CardFooter className="border-t border-gray-200 pt-4">
          <Button variant='outline' asChild className="hover:bg-gray-100 transition-colors">
            <Link href={`/${session.user.username}`} className="flex items-center">
              <Icons.arrowLeft className="mr-2 h-4 w-4" />
              Back to Tasks
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

