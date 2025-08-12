'use client';

import { useState, useTransition } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

import { Icons } from '~/components/icons';

const signInSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' })
});

type FormData = z.infer<typeof signInSchema>;

export function SignInForm() {
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  // Watch form values to debug
  const username = watch('username');
  const password = watch('password');

  async function onSubmit(data: FormData) {
    console.log('Form submitted with:', { username: data.username, password: data.password ? '***' : 'empty' });
    
    setLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        username: data.username,
        password: data.password,
        redirect: false
      });

      console.log('SignIn result:', result);

      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
        setLoading(false);
        return;
      }

      if (result?.ok) {
        toast.success('Successfully signed in');
        setLoading(false);
        
        startTransition(() => {
          router.push(`/${data.username}`);
        });
      } else {
        setError('Sign in failed. Please try again.');
        toast.error('Sign in failed. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('SignIn error:', error);
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <div className='grid gap-2'>
        <Label htmlFor='username'>Username</Label>
        <Input
          id='username'
          placeholder='ex@mple1234'
          type='text'
          autoCapitalize='none'
          autoCorrect='off'
          disabled={loading || isPending}
          {...register('username')}
        />
        {errors?.username && (
          <p className='px-1 text-xs text-red-600'>
            {errors.username.message}
          </p>
        )}
        <p className="text-xs text-gray-500">Debug: {username || 'empty'}</p>
      </div>
      
      <div className='grid gap-2'>
        <Label htmlFor='password'>Password</Label>
        <Input
          id='password'
          placeholder='pAssw0rd'
          type='password'
          autoCapitalize='none'
          autoCorrect='off'
          disabled={loading || isPending}
          {...register('password')}
        />
        {errors?.password && (
          <p className='px-1 text-xs text-red-600'>
            {errors.password.message}
          </p>
        )}
        <p className="text-xs text-gray-500">Debug: {password ? '***' : 'empty'}</p>
      </div>
      
      <Button 
        type="submit" 
        disabled={loading || isPending}
        className="w-full"
      >
        {loading || isPending ? (
          <div className='flex items-center gap-2'>
            <Icons.spinner className='size-4 animate-spin' />
            <span>Signing in...</span>
          </div>
        ) : (
          'Sign in'
        )}
      </Button>
      
      <div className="text-center text-sm text-gray-600">
        <p>Form state: {loading ? 'Loading' : isPending ? 'Pending' : 'Ready'}</p>
        <p>Username length: {username?.length || 0}</p>
        <p>Password length: {password?.length || 0}</p>
      </div>
    </form>
  );
}
