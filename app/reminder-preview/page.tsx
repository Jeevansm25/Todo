'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Calendar, Clock, Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  due: string | null;
  done: boolean;
  reminderSent: boolean;
  reminderSentAt: string | null;
  createdAt: string;
}

interface ReminderPreview {
  task: Task;
  nextReminder: string; // ISO string from API
  reminderType: 'upcoming' | 'overdue' | 'completed' | 'no-due-date';
  hoursUntilDue: number;
  status: 'pending' | 'sent' | 'completed';
}

export default function ReminderPreviewPage() {
  const [reminders, setReminders] = useState<ReminderPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextCronRun, setNextCronRun] = useState<Date | null>(null);

  useEffect(() => {
    fetchReminderData();
    calculateNextCronRun();
  }, []);

  const fetchReminderData = async () => {
    try {
      const response = await fetch('/api/reminders/preview');
      if (response.ok) {
        const data = await response.json();
        setReminders(data.reminders || []);
      }
    } catch (error) {
      console.error('Failed to fetch reminder data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateNextCronRun = () => {
    // Vercel Cron Job runs every hour at minute 0
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1, 0, 0, 0);
    setNextCronRun(nextHour);
  };

  const getNextReminderDate = (nextReminderString: string) => {
    return new Date(nextReminderString);
  };

  const getReminderTypeInfo = (type: string) => {
    switch (type) {
      case 'upcoming':
        return { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock, label: 'Scheduled' };
      case 'overdue':
        return { color: 'bg-red-50 text-red-700 border-red-200', icon: AlertCircle, label: 'Overdue' };
      case 'completed':
        return { color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle, label: 'Completed' };
      default:
        return { color: 'bg-slate-50 text-slate-700 border-slate-200', icon: Info, label: 'No Due Date' };
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock, label: 'Pending' };
      case 'sent':
        return { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Bell, label: 'Delivered' };
      case 'completed':
        return { color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle, label: 'Completed' };
      default:
        return { color: 'bg-slate-50 text-slate-700 border-slate-200', icon: Info, label: 'Unknown' };
    }
  };

  const formatTimeUntil = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = dateObj.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return 'Due now';
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto"></div>
            <p className="mt-6 text-slate-600 text-lg">Loading reminder schedule...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">
            Reminder Management Dashboard
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Monitor your task reminder schedule and track notification delivery status. 
            Our system provides comprehensive oversight of your productivity timeline.
          </p>
        </div>

        {/* System Status */}
        <Card className="mb-10 border border-slate-200 shadow-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-slate-900 text-xl">
              <Bell className="h-6 w-6 text-slate-600" />
              System Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">
                  {reminders.filter(r => r.status === 'pending').length}
                </div>
                <div className="text-slate-700 font-medium">Pending Notifications</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {reminders.filter(r => r.status === 'sent').length}
                </div>
                <div className="text-slate-700 font-medium">Delivered Reminders</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-600 mb-2">
                  {nextCronRun ? formatTimeUntil(nextCronRun) : 'N/A'}
                </div>
                <div className="text-slate-700 font-medium">Next System Check</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reminders List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            Task Reminder Schedule
          </h2>
          
          {reminders.length === 0 ? (
            <Card className="text-center py-16 border border-slate-200">
              <CardContent>
                <Bell className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                <h3 className="text-xl font-medium text-slate-600 mb-3">No reminders scheduled</h3>
                <p className="text-slate-500 leading-relaxed">
                  Create tasks with due dates to establish your reminder schedule
                </p>
              </CardContent>
            </Card>
          ) : (
            reminders.map((reminder) => {
              const typeInfo = getReminderTypeInfo(reminder.reminderType);
              const statusInfo = getStatusInfo(reminder.status);
              const TypeIcon = typeInfo.icon;
              const StatusIcon = statusInfo.icon;

              return (
                <Card key={reminder.task.id} className="hover:shadow-md transition-shadow border border-slate-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-slate-900 mb-3">
                          {reminder.task.title}
                        </CardTitle>
                        {reminder.task.description && (
                          <CardDescription className="text-slate-600 mb-4 text-base">
                            {reminder.task.description}
                          </CardDescription>
                        )}
                        <div className="flex flex-wrap gap-3">
                          <Badge className={`${typeInfo.color} border`}>
                            <TypeIcon className="h-3 w-3 mr-2" />
                            {typeInfo.label}
                          </Badge>
                          <Badge className={`${statusInfo.color} border`}>
                            <StatusIcon className="h-3 w-3 mr-2" />
                            {statusInfo.label}
                          </Badge>
                          {reminder.task.done && (
                            <Badge className="bg-green-50 text-green-700 border border-green-200">
                              <CheckCircle className="h-3 w-3 mr-2" />
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <Calendar className="h-4 w-4 text-slate-500" />
                          <span className="font-medium text-slate-700">Due Date:</span>
                          <span className="text-slate-800">
                            {reminder.task.due 
                              ? formatDate(reminder.task.due)
                              : 'No due date specified'
                            }
                          </span>
                        </div>
                        {reminder.task.due && (
                          <div className="flex items-center gap-3 text-sm text-slate-600">
                            <Clock className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-slate-700">Time Remaining:</span>
                            <span className={reminder.hoursUntilDue < 0 ? 'text-red-600 font-semibold' : 'text-blue-600 font-semibold'}>
                              {reminder.hoursUntilDue < 0 
                                ? `${Math.abs(reminder.hoursUntilDue)}h overdue`
                                : formatTimeUntil(new Date(reminder.task.due))
                              }
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <Bell className="h-4 w-4 text-slate-500" />
                          <span className="font-medium text-slate-700">Next Notification:</span>
                          <span className="text-blue-600 font-semibold">
                            {formatDate(reminder.nextReminder)}
                          </span>
                        </div>
                        {reminder.task.reminderSent && reminder.task.reminderSentAt && (
                          <div className="flex items-center gap-3 text-sm text-slate-600">
                            <CheckCircle className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-slate-700">Last Delivered:</span>
                            <span className="text-green-600">
                              {formatDate(reminder.task.reminderSentAt)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* How It Works */}
        <Card className="mt-12 border border-slate-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center gap-3 text-xl">
              <Info className="h-6 w-6 text-slate-600" />
              System Architecture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-slate-100 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-slate-700 font-bold text-lg">1</span>
                </div>
                <h4 className="font-semibold text-slate-900 mb-3">Intelligent Scheduling</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Our system automatically calculates optimal reminder timing based on task due dates
                </p>
              </div>
              <div className="text-center">
                <div className="bg-slate-100 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-slate-700 font-bold text-lg">2</span>
                </div>
                <h4 className="font-semibold text-slate-900 mb-3">Automated Monitoring</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Vercel Cron Jobs perform hourly checks for tasks requiring notifications
                </p>
              </div>
              <div className="text-center">
                <div className="bg-slate-100 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-slate-700 font-bold text-lg">3</span>
                </div>
                <h4 className="font-semibold text-slate-900 mb-3">Precise Delivery</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Reminders are delivered exactly 24 hours before task deadlines
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
