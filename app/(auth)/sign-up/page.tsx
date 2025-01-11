import { type Metadata } from 'next';
import Link from 'next/link';

import { SignUpForm } from '~/components/sign-up-form';

import { PAGES } from '~/lib/constants';

export const metadata: Metadata = {
  title: 'Auth / Sign up',
  description: 'Create a new account',
};


export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col justify-center items-center p-4">
      {/* Top-Right Contributor Menu */}
      

      {/* Main Content */}
      <div className='w-full max-w-md bg-white shadow-md rounded-lg p-8'>
        <h1 className='text-center text-2xl font-bold text-gray-800 mb-8'>
          Create New Account
        </h1>
        <SignUpForm />
        <div className='mt-6 text-center text-sm text-gray-600'>
          <span>Already have an account?</span>
          <Link href={PAGES.SIGN_IN} className='ml-2 text-blue-600 hover:text-blue-800 font-medium'>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

