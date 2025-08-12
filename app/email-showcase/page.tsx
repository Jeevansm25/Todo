'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Bell, Calendar, Clock, CheckCircle, AlertCircle, Info, ArrowRight, Sparkles, Eye, Plus } from 'lucide-react';
import Link from 'next/link';

export default function EmailShowcasePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'demo'>('overview');

  const features = [
    {
      icon: Bell,
      title: 'Smart Reminder System',
      description: 'Automatically calculates when to send reminders based on task due dates',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Calendar,
      title: 'Perfect Timing',
      description: 'Reminders sent exactly 24 hours before due dates for optimal user experience',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Clock,
      title: 'Hourly Monitoring',
      description: 'Vercel Cron Jobs check every hour for tasks needing reminders',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: CheckCircle,
      title: 'No Duplicate Reminders',
      description: 'Smart tracking prevents sending multiple reminders for the same task',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const demoSteps = [
    {
      step: 1,
      title: 'Create a Task',
      description: 'Add a new task with a due date',
      icon: '📝'
    },
    {
      step: 2,
      title: 'System Calculates',
      description: 'Automatically determines when to send reminder',
      icon: '🧮'
    },
    {
      step: 3,
      title: 'Preview Schedule',
      description: 'See exactly when your reminder will be sent',
      icon: '👀'
    },
    {
      step: 4,
      title: 'Perfect Timing',
      description: 'Reminder sent 24 hours before due date',
      icon: '⏰'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
              <Bell className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Reminder Preview System
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of task management with our intelligent reminder system. 
            See exactly when your reminders will be sent - no emails required!
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm">
              ✅ No Email Setup Required
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm">
              🚀 Vercel Cron Jobs Powered
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 px-4 py-2 text-sm">
              ⚡ Real-time Preview
            </Badge>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            {['overview', 'features', 'demo'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  🎯 Why Choose Our Reminder System?
                </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                                     Traditional email systems require complex setup and can fail. Our preview system 
                   shows you exactly what&apos;s happening without any external dependencies.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-4xl mb-2">🚫</div>
                    <h3 className="font-semibold mb-2">No Email Setup</h3>
                    <p className="text-blue-100 text-sm">Skip complex SMTP configuration</p>
                  </div>
                  <div>
                    <div className="text-4xl mb-2">👁️</div>
                    <h3 className="font-semibold mb-2">Full Transparency</h3>
                    <p className="text-blue-100 text-sm">See exactly when reminders trigger</p>
                  </div>
                  <div>
                    <div className="text-4xl mb-2">⚡</div>
                    <h3 className="font-semibold mb-2">Instant Feedback</h3>
                    <p className="text-blue-100 text-sm">Real-time preview of your schedule</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Demo CTA */}
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Sparkles className="h-8 w-8 text-green-600" />
                  <h3 className="text-2xl font-bold text-green-800">
                    Ready to See It in Action?
                  </h3>
                </div>
                <p className="text-green-700 mb-6 max-w-2xl mx-auto">
                  Experience the power of our reminder preview system. Create tasks with due dates 
                  and watch the magic happen in real-time!
                </p>
                <Link href="/reminder-preview">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                    <Calendar className="h-5 w-5 mr-2" />
                    View Reminder Preview
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              🚀 Advanced Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0">
                    <CardContent className="p-6">
                      <div className={`${feature.bgColor} p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4`}>
                        <Icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Technical Details */}
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Technical Implementation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Backend Architecture</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Prisma ORM with PostgreSQL</li>
                      <li>• Next.js API Routes</li>
                      <li>• TypeScript for type safety</li>
                      <li>• Vercel Cron Jobs integration</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Frontend Features</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Real-time data updates</li>
                      <li>• Responsive design</li>
                      <li>• Beautiful UI components</li>
                      <li>• Interactive preview system</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'demo' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              🎬 How It Works
            </h2>
            
            {/* Step-by-step demo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {demoSteps.map((step, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-0">
                  <CardContent className="p-6">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl mx-auto mb-4">
                      {step.step}
                    </div>
                    <div className="text-4xl mb-3">{step.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Interactive Demo */}
            <Card className="border-2 border-purple-200 bg-purple-50">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-purple-800 mb-4">
                  🎯 Try It Yourself!
                </h3>
                <p className="text-purple-700 mb-6">
                  Create a task with a due date and watch our system calculate the perfect reminder timing.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/reminder-preview">
                    <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-100">
                      <Eye className="h-5 w-5 mr-2" />
                      View Preview
                    </Button>
                  </Link>
                  <Link href="/[username]">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      <Plus className="h-5 w-5 mr-2" />
                      Create Task
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to Transform Your Task Management?
            </h3>
            <p className="text-gray-600 mb-6">
              Experience the future of reminders without the complexity of email setup.
            </p>
            <Link href="/reminder-preview">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
                <Bell className="h-5 w-5 mr-2" />
                Launch Reminder Preview
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
