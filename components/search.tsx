'use client';

import { useTransition } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

import { Icons } from '~/components/icons';
import { Input } from '~/components/ui/input';

export const QUERY_NAME = 'q';

export function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  // Convert `ReadonlyURLSearchParams` to a mutable `URLSearchParams`
  const getMutableSearchParams = () =>
    new URLSearchParams(Array.from(searchParams.entries()));

  const debounced = useDebouncedCallback((searchInput: string) => {
    const params = getMutableSearchParams();

    if (searchInput) {
      params.set(QUERY_NAME, searchInput);
    } else {
      params.delete(QUERY_NAME);
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }, 400);

  return (
    <div className='flex w-full max-w-[425px] items-center gap-3'>
      <Input
        defaultValue={searchParams.get(QUERY_NAME) ?? ''}
        placeholder='title or description...'
        onChange={(e) => debounced(e.target.value)}
      />
      <div className='min-h-6 min-w-6'>
        {isPending && (
          <Icons.spinner className='size-6 flex-shrink-0 animate-spin' />
        )}
      </div>
    </div>
  );
}
