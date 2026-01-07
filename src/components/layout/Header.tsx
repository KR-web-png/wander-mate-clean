import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Settings, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showProfile?: boolean;
  showNotifications?: boolean;
  showSettings?: boolean;
  user?: {
    name: string;
    avatar: string;
  };
  notificationCount?: number;
  transparent?: boolean;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showProfile = false,
  showNotifications = true,
  showSettings = false,
  user,
  notificationCount = 0,
  transparent = false,
  className
}) => {
  const navigate = useNavigate();

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-40 px-4 py-3",
      transparent 
        ? "bg-transparent" 
        : "bg-background/80 backdrop-blur-lg border-b border-border/30",
      className
    )}>
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          {showProfile && user && (
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate('/profile')}
            >
              <Avatar
                src={user.avatar}
                alt={user.name}
                size="default"
              />
              <div>
                <p className="text-xs text-muted-foreground">Welcome back</p>
                <p className="font-display font-semibold text-foreground">
                  {user.name.split(' ')[0]}
                </p>
              </div>
            </div>
          )}
          
          {title && !showProfile && (
            <h1 className="font-display text-xl font-bold text-foreground">
              {title}
            </h1>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {showNotifications && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/notifications')}
              className="relative h-9 w-9"
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge 
                  variant="new" 
                  size="sm"
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
                >
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Badge>
              )}
            </Button>
          )}
          
          {showSettings && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/settings')}
              className="h-9 w-9"
            >
              <Settings className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
