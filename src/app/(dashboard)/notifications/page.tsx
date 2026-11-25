'use client';

import * as React from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  Clock,
  Trash2,
  Check,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface SystemNotification {
  id: string;
  type: 'stock' | 'security' | 'order' | 'payment';
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  is_read: boolean;
  time: string;
}

const INITIAL_SYSTEM_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    type: 'security',
    priority: 'high',
    title: 'Security Alert: Repeated Exit Pass Presentation',
    message: 'Turnstile Gate 2 blocked duplicate clearance of Exit Pass PENGO-EXIT-SECURE-9841-A8F1 at Connaught Place.',
    is_read: false,
    time: '8 minutes ago',
  },
  {
    id: 'notif-2',
    type: 'stock',
    priority: 'high',
    title: 'Out of Stock: Cadbury Dairy Milk Silk Roast Almond',
    message: 'Shelf inventory depleted to 0 units. Customer attempted to scan at Aisle 4.',
    is_read: false,
    time: '24 minutes ago',
  },
  {
    id: 'notif-3',
    type: 'stock',
    priority: 'medium',
    title: 'Low Stock Buffer Trigger: Amul Taaza Milk 1L',
    message: '18 units remaining on shelf, breaching the minimum safe buffer threshold of 25 units.',
    is_read: false,
    time: '1 hour ago',
  },
  {
    id: 'notif-4',
    type: 'order',
    priority: 'low',
    title: 'High Basket Value Checkout: ₹1,655.60',
    message: 'Customer Aarav Sharma completed seamless self-checkout of 6 items at Indiranagar outlet.',
    is_read: true,
    time: '3 hours ago',
  },
  {
    id: 'notif-5',
    type: 'payment',
    priority: 'low',
    title: 'Razorpay Auto-Settlement Completed',
    message: 'Daily batch transfer of ₹38,450 successfully reconciled with central retail treasury.',
    is_read: true,
    time: '5 hours ago',
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<SystemNotification[]>(INITIAL_SYSTEM_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
    toast.success('All alerts marked as read');
  };

  const clearAll = () => {
    setNotifications([]);
    toast.info('Notifications cleared');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bell className="h-6 w-6 text-red-600" />
            Centralized Operational Notification Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time telemetry stream from smart carts, payment webhooks, stock depletion alerts and turnstiles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllRead}
            className="h-8 gap-1.5 text-xs"
          >
            <Check className="h-3.5 w-3.5" />
            Mark All Read
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-8 gap-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <Card>
        <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Bell className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="font-semibold text-sm">No new operational alerts</p>
              <p className="text-xs mt-0.5">All retail systems running smoothly</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                  !notif.is_read
                    ? 'bg-red-50/20 dark:bg-red-950/10'
                    : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold ${
                      notif.priority === 'high'
                        ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60'
                        : notif.priority === 'medium'
                        ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/60'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
                    }`}
                  >
                    {notif.priority === 'high' ? (
                      <AlertOctagon className="h-4 w-4" />
                    ) : notif.priority === 'medium' ? (
                      <AlertTriangle className="h-4 w-4" />
                    ) : (
                      <Info className="h-4 w-4" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                        {notif.title}
                      </p>
                      {!notif.is_read && (
                        <span className="h-2 w-2 rounded-full bg-red-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {notif.message}
                    </p>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {notif.time}
                    </span>
                  </div>
                </div>

                <Badge
                  variant={
                    notif.priority === 'high'
                      ? 'destructive'
                      : notif.priority === 'medium'
                      ? 'warning'
                      : 'secondary'
                  }
                  className="text-[10px] uppercase font-bold shrink-0"
                >
                  {notif.priority}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
