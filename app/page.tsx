import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Bell, Calendar, Clock, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Bell,
      title: 'Intelligent Reminder System',
      description: 'Receive timely notifications 24 hours before your tasks are due',
      color: 'text-slate-700',
      bgColor: 'bg-slate-50'
    },
    {
      icon: Calendar,
      title: 'Strategic Scheduling',
      description: 'Our system ensures you never miss important deadlines',
      color: 'text-slate-700',
      bgColor: 'bg-slate-50'
    },
    {
      icon: Clock,
      title: 'Real-time Monitoring',
      description: 'Track your reminder schedule with live updates',
      color: 'text-slate-700',
      bgColor: 'bg-slate-50'
    },
    {
      icon: CheckCircle,
      title: 'Zero Configuration',
      description: 'Begin using the system immediately without setup',
      color: 'text-slate-700',
      bgColor: 'bg-slate-50'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="bg-slate-800 p-4 rounded-lg">
              <Bell className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-slate-900">
              Task Management System
            </h1>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Streamline your productivity with our intelligent reminder system. 
            Experience professional task management with automated scheduling and real-time monitoring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reminder-preview">
              <Button size="lg" className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 text-lg">
                <Bell className="h-5 w-5 mr-2" />
                View Reminder Schedule
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/email-showcase">
              <Button variant="outline" size="lg" className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3 text-lg">
                <Sparkles className="h-5 w-5 mr-2" />
                System Overview
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">
            Core System Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border border-slate-200">
                  <CardContent className="p-8 text-center">
                    <div className={`${feature.bgColor} p-4 rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-6`}>
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">
            System Workflow
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="bg-slate-800 text-white rounded-lg w-20 h-20 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Task Creation</h3>
              <p className="text-slate-600 leading-relaxed">
                Establish new tasks with specific due dates in your management system
              </p>
            </div>
            <div className="text-center">
              <div className="bg-slate-800 text-white rounded-lg w-20 h-20 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Automated Analysis</h3>
              <p className="text-slate-600 leading-relaxed">
                Our intelligent system calculates optimal reminder timing automatically
              </p>
            </div>
            <div className="text-center">
              <div className="bg-slate-800 text-white rounded-lg w-20 h-20 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Strategic Notifications</h3>
              <p className="text-slate-600 leading-relaxed">
                Receive timely reminders exactly 24 hours before task deadlines
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="border border-slate-200 shadow-lg bg-slate-50">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Ready to Enhance Your Productivity?
            </h2>
            <p className="text-slate-700 mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience the efficiency of our professional reminder system. 
              Create tasks with due dates and observe our intelligent scheduling in action.
            </p>
            <Link href="/reminder-preview">
              <Button size="lg" className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 text-lg">
                <Bell className="h-5 w-5 mr-2" />
                Access Reminder Dashboard
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
