import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';

import { Separator } from '~/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';

import { db } from '~/lib/db';
import { formatDate, formatDistanceToNow } from '~/lib/utils';
import { authOptions } from '~/lib/auth';
import { PAGES } from '~/lib/constants';

import { DoneCheckbox } from '~/components/done-checkbox';
import { TaskMenu } from '~/components/task-menu';
import { Search } from '~/components/search';
import { Icons } from '~/components/icons';
import { CreateTaskForm } from '~/components/task-form';

export const metadata: Metadata = {
  title: 'TaskMaster Dashboard',
  description: 'Manage your tasks efficiently with TaskMaster'
};

async function getMyTasks(searchValue: string = '') {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(PAGES.SIGN_IN);
  }

  const tasks = await db.task.findMany({
    where: {
      authorId: session.user.id,
      OR: [
        {
          title: {
            contains: searchValue
          }
        },
        {
          description: {
            contains: searchValue
          }
        }
      ]
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      gh: {
        select: {
          fullName: true
        }
      },
      _count: {
        select: {
          comments: true
        }
      }
    }
  });

  return tasks;
}

export default async function HomePage({
  params,
  searchParams
}: {
  params: {
    username: string;
  };
  searchParams: {
    q: string;
  };
}) {
  const tasks = await getMyTasks(searchParams.q);
  const completedTasks = tasks.filter(task => task.done).length;
  const completionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  // Handle task without a due date for upcoming due task count
  const upcomingTasksCount = tasks.filter(task => task.due && new Date(task.due) > new Date()).length;

  // Format the next due date, handling tasks with no due date properly
  const nextDueTask = tasks.find(
    (task) => task.due && new Date(task.due) > new Date()
  );

  // Corrected formatDate usage with null check for task.due
  const dueDate = nextDueTask?.due ? new Date(nextDueTask.due) : null;

  return (
    <div className='flex w-full max-w-[900px] flex-col gap-6'>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Icons.clipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">
              +{tasks.filter(task => formatDistanceToNow(task.createdAt) === 'less than a day').length} new today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <Icons.checkCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {completionRate.toFixed(1)}% completion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Due</CardTitle>
            <Icons.clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingTasksCount}</div>
            <p className="text-xs text-muted-foreground">
              Next: {dueDate ? formatDate(dueDate.toISOString(), 'short') : 'No upcoming tasks'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">GitHub Repos</CardTitle>
            <Icons.github className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.filter(task => task.gh).length}</div>
            <p className="text-xs text-muted-foreground">
              Linked to {((tasks.filter(task => task.gh).length / tasks.length) * 100).toFixed(1)}% of tasks
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Task Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between gap-3 mb-4'>
            <Search />
            <CreateTaskForm />
          </div>
          <Separator className="my-4" />
          {tasks.length === 0 ? (
            <div className='text-center text-sm p-4 bg-muted rounded-md'>
              <Icons.inbox className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p>You have no tasks yet. Create your first task to get started!</p>
            </div>
          ) : (
            <ul className='space-y-4'>
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className='flex items-center gap-2 rounded-md border p-3 hover:bg-accent transition-colors'
                >
                  <DoneCheckbox id={task.id} done={task.done} />
                  <Link
                    className='flex-1 overflow-hidden rounded-md p-2'
                    href={`/${params.username}/${task.id}`}
                  >
                    <div className='flex flex-1 flex-col gap-2'>
                      <div className="flex justify-between items-start">
                        <h4 className='font-semibold'>{task.title}</h4>
                        <Badge variant={task.done ? "default" : "secondary"} className="ml-2">
                          {task.done ? "Completed" : "In Progress"}
                        </Badge>
                      </div>
                      <p className='text-sm text-muted-foreground line-clamp-2'>
                        {task.description || 'No description'}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {!!task.due && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Icons.calendarClock className='size-3 flex-shrink-0' />
                            <span>{formatDate(task.due.toISOString(), 'short')}</span>
                          </Badge>
                        )}
                        {task.gh && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Icons.github className='size-3 flex-shrink-0' />
                            <span className='overflow-hidden text-ellipsis text-nowrap'>
                              {task.gh.fullName}
                            </span>
                          </Badge>
                        )}
                        {task._count.comments > 0 && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Icons.comments className='size-3' />
                            <span>{task._count.comments}</span>
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                  <TaskMenu {...task} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
