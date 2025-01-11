import { type Metadata } from 'next';
import Link from 'next/link';

import { SignInForm } from '~/components/sign-in-form';

import { PAGES } from '~/lib/constants';

export const metadata: Metadata = {
  title: 'Auth / Sign in',
  description: 'Sign in to your account'
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col justify-center items-center p-4">
      <div className='w-full max-w-md bg-white shadow-md rounded-lg p-8'>
        <div className='space-y-6 text-center'>
          <h1 className='text-2xl font-bold text-gray-800'>
            Welcome Back
          </h1>
          <p className='text-sm text-gray-600'>
            Enter your credentials to sign in to your account
          </p>
        </div>
        <SignInForm />
        <div className='mt-6 text-center text-sm text-gray-600'>
          <span>Don&apos;t have an account?</span>
          <Link href={PAGES.SIGN_UP} className='ml-2 text-blue-600 hover:text-blue-800 font-medium'>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

