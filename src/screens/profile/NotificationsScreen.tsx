import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MapPin, User, Shield, Check } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface Notification {
  id: string;
  type: 'destination' | 'profile' | 'account' | 'match' | 'trip';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon: React.ElementType;
  iconColor: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'destination',
    title: 'New Trending Destination',
    message: 'Ella, Sri Lanka is now trending! Check out this beautiful destination.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    icon: MapPin,
    iconColor: 'text-ocean'
  },
  {
    id: '2',
    type: 'profile',
    title: 'Profile Updated',
    message: 'Your profile has been successfully updated with new travel preferences.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    icon: User,
    iconColor: 'text-sunset'
  },
  {
    id: '3',
    type: 'account',
    title: 'Account Security',
    message: 'Your account is now fully verified. Enjoy enhanced features!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: false,
    icon: Shield,
    iconColor: 'text-green-500'
  },
  {
    id: '4',
    type: 'destination',
    title: 'New Destination Added',
    message: 'Arugam Bay has been added to trending destinations. Perfect for surfing!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    icon: MapPin,
    iconColor: 'text-ocean'
  },
  {
    id: '5',
    type: 'profile',
    title: 'Profile View',
    message: '5 travelers viewed your profile in the last 24 hours.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    read: true,
    icon: User,
    iconColor: 'text-sunset'
  },
];

export const NotificationsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);

  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return format(date, 'MMM d');
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Notifications" showBack />
      
      <main className="pt-20 px-4 max-w-lg mx-auto">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-4 animate-fade-in">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <Check className="h-4 w-4" />
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Card variant="gradient" className="p-12 text-center animate-fade-in">
            <div className="inline-flex h-16 w-16 rounded-full bg-muted items-center justify-center mb-4">
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              No notifications yet
            </h3>
            <p className="text-sm text-muted-foreground">
              We'll notify you when something new happens
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification, index) => {
              const Icon = notification.icon;
              
              return (
                <Card
                  key={notification.id}
                  variant={notification.read ? "default" : "elevated"}
                  className={cn(
                    "p-4 cursor-pointer transition-all hover:shadow-medium animate-fade-in",
                    !notification.read && "border-l-4 border-l-primary"
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className={cn(
                      "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center",
                      notification.read ? "bg-muted" : "bg-primary/10"
                    )}>
                      <Icon className={cn("h-5 w-5", notification.iconColor)} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={cn(
                          "font-semibold text-sm",
                          notification.read ? "text-muted-foreground" : "text-foreground"
                        )}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="flex-shrink-0 h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      
                      <p className={cn(
                        "text-sm mb-2",
                        notification.read ? "text-muted-foreground" : "text-foreground"
                      )}>
                        {notification.message}
                      </p>
                      
                      <p className="text-xs text-muted-foreground">
                        {getTimeAgo(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Filter/Settings */}
        <div className="mt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={() => navigate('/settings/notifications')}
            className="text-sm text-primary hover:underline mx-auto block"
          >
            Notification Settings
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};
