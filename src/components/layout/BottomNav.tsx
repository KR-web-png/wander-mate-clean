import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Map, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavItem {
  icon: React.ElementType;
  labelKey: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, labelKey: 'nav.home', path: '/home' },
  { icon: Search, labelKey: 'nav.discover', path: '/discover' },
  { icon: Map, labelKey: 'nav.trips', path: '/trips' },
  { icon: Users, labelKey: 'nav.community', path: '/community' },
  { icon: User, labelKey: 'nav.profile', path: '/profile' },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border/50 px-2 pb-safe">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path === '/home' && location.pathname === '/');
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 min-w-[64px] transition-all duration-200",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "relative p-1.5 rounded-xl transition-all duration-200",
                isActive && "bg-primary/10"
              )}>
                <Icon className={cn(
                  "h-5 w-5 transition-transform duration-200",
                  isActive && "scale-110"
                )} />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
              <span className={cn(
                "text-[10px] mt-1 font-medium transition-opacity duration-200",
                isActive ? "opacity-100" : "opacity-70"
              )}>
                {t(item.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
