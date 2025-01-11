import { type Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Mail, Target, Github } from 'lucide-react';

import { Button } from '~/components/ui/button';

import { PAGES } from '~/lib/constants';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '~/components/ui/dropdown-menu';

export const metadata: Metadata = {
  title: 'Welcome to TaskMaster',
  description: 'Manage your tasks and goals with email reminders'
};

const CONTRIBUTORS = [
  {
    name: 'Jeevan S M',
    github: 'https://github.com/jeevansm25',
  },
];

export default function RootPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col justify-center items-center p-4">
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="px-4 py-2 bg-black text-white rounded hover:bg-blue transition-colors duration-200 text-sm font-medium">
            Contributor
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white shadow-lg rounded-md">
            {CONTRIBUTORS.map((contributor, index) => (
              <DropdownMenuItem key={index} className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-4 py-2 text-sm">
                <Github className="w-5 h-5 text-gray-700" />
                <a href={contributor.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {contributor.name}
                </a>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to TaskMaster</h1>
        <p className="text-lg text-gray-600 mb-6">Your personal task and goal management solution</p>
        
        <div className="grid gap-6 mb-8">
          <FeatureItem 
            icon={<CheckCircle className="w-6 h-6 text-green-500" />}
            title="Set Tasks"
            description="Create and organize your daily tasks with ease"
          />
          <FeatureItem 
            icon={<Target className="w-6 h-6 text-blue-500" />}
            title="Define Goals"
            description="Set long-term goals and break them down into actionable steps"
          />
          <FeatureItem 
            icon={<Mail className="w-6 h-6 text-red-500" />}
            title="Email Reminders"
            description="Receive timely email reminders to stay on top of your tasks"
          />
        </div>

        <p className="text-sm text-gray-600 mb-6">To use the app, you need to sign in or create an account</p>
        
        <div className="flex justify-center gap-4">
          <Button asChild variant="default">
            <Link href={PAGES.SIGN_IN}>Sign In</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={PAGES.SIGN_UP}>Create Account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

interface FeatureItemProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex items-center gap-4">
      {icon}
      <div className="text-left">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
