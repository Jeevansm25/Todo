'use client';

import { toast } from 'sonner';
import { useAction } from 'next-safe-action/hooks';

import { Icons } from '~/components/icons';

import { toggle } from '~/app/actions';

export function DoneCheckbox({ id, done }: { id: string; done: boolean }) {
  const { execute, status, result } = useAction(toggle, {
    onSuccess: (data) => {
      if (data && 'failure' in data) {
        toast.error(data.failure);
        return;
      }
      // Show success message for better UX
      if (data && 'done' in data) {
        const status = data.done ? 'completed' : 'marked as incomplete';
        toast.success(`Task ${status}!`);
      }
    },
    onError: (error) => {
      console.error('Toggle action error:', error);
      toast.error('Failed to update task status. Please try again.');
    }
  });

  // to init use done state from server component, then use return value from server action
  // it prevents flickering; doesn't wait for revalidation
  const d = result.data?.done === undefined ? done : result.data.done;

  return (
    <>
      {status === 'executing' ? (
        <Icons.spinner className='size-6 animate-spin' />
      ) : d ? (
        <Icons.checkedSquare
          onClick={() => {
            execute({ id, done: false });
          }}
          className='size-6 cursor-pointer hover:opacity-80 transition-opacity'
          title="Mark as incomplete"
        />
      ) : (
        <Icons.square
          onClick={() => {
            execute({ id, done: true });
          }}
          className='size-6 cursor-pointer hover:opacity-80 transition-opacity'
          title="Mark as complete"
        />
      )}
    </>
  );
}
