import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, MapPin, Star, Calendar, Shield, 
  Edit2, ChevronRight, LogOut, Heart, Globe,
  Camera, Award
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { authService } from '@/services/auth.service';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { User, Destination } from '@/models';
import { useLanguage } from '@/contexts/LanguageContext';
import { favoritesService } from '@/services/favorites.service';

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const { t } = useLanguage();
  const [favoriteDestinations, setFavoriteDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    // Get current user on mount and when returning from edit
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    
    // Load favorite destinations
    setFavoriteDestinations(favoritesService.getFavorites());
  }, []);

  // Refresh user data when coming back to this screen
  useEffect(() => {
    const handleFocus = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      
      // Refresh favorite destinations
      setFavoriteDestinations(favoritesService.getFavorites());
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const menuItems = [
    { icon: Edit2, label: t('profile.editProfile'), path: '/profile/edit' },
    { icon: Heart, label: t('profile.myInterests'), path: '/profile/interests' },
    { icon: Globe, label: t('profile.languages'), path: '/profile/languages' },
    { icon: Shield, label: t('profile.safetyPrivacy'), path: '/profile/safety' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title={t('profile.title')} showNotifications notificationCount={3} />
      
      <main className="pt-20 px-4 max-w-lg mx-auto">
        {/* Profile Header */}
        <Card variant="elevated" className="p-6 mb-6 animate-fade-in">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <Avatar
                src={user.avatar}
                alt={user.name}
                size="2xl"
                verificationStatus={user.verificationStatus}
                showBadge
              />
              <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-medium">
                <Camera className="h-4 w-4 text-primary-foreground" />
              </button>
            </div>
            
            <h1 className="font-display text-2xl font-bold text-foreground">
              {user.name}
            </h1>
            
            {user.location && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5" />
                {user.location}
              </p>
            )}
            
            <div className="flex items-center gap-3 mt-3">
              <Badge 
                variant={user.verificationStatus === 'fully_verified' ? 'success' : 'info'}
              >
                <Shield className="h-3 w-3 mr-1" />
                {user.verificationStatus === 'fully_verified' 
                  ? t('profile.verified')
                  : t('profile.idVerified')}
              </Badge>
              <Badge variant="outline">
                <Calendar className="h-3 w-3 mr-1" />
                {t('profile.joined')} {format(user.joinedDate, 'MMM yyyy')}
              </Badge>
            </div>
          </div>
          
          {user.bio && (
            <p className="text-center text-muted-foreground mt-4">
              {user.bio}
            </p>
          )}
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-in" 
             style={{ animationDelay: '0.1s' }}>
          <Card variant="gradient" className="p-4 text-center">
            <Award className="h-5 w-5 mx-auto text-sunset mb-1" />
            <p className="text-xl font-bold text-foreground">{user.tripsCompleted || 0}</p>
            <p className="text-xs text-muted-foreground">{t('profile.trips')}</p>
          </Card>
          <Card variant="gradient" className="p-4 text-center">
            <Star className="h-5 w-5 mx-auto text-sunset fill-sunset mb-1" />
            <p className="text-xl font-bold text-foreground">{user.rating || 0}</p>
            <p className="text-xs text-muted-foreground">{t('profile.rating')}</p>
          </Card>
          <Card variant="gradient" className="p-4 text-center">
            <Globe className="h-5 w-5 mx-auto text-ocean mb-1" />
            <p className="text-xl font-bold text-foreground">{user.languages?.length || 0}</p>
            <p className="text-xs text-muted-foreground">{t('profile.languages')}</p>
          </Card>
        </div>

        {/* Travel Style */}
        {user.travelStyle && (
          <Card variant="gradient" className="p-4 mb-6 animate-fade-in"
                style={{ animationDelay: '0.15s' }}>
            <h3 className="font-display font-semibold text-foreground mb-3">
              {t('profile.travelStyle')}
            </h3>
            <Badge variant="premium" size="lg" className="capitalize">
              {user.travelStyle.replace('_', ' ')}
            </Badge>
          </Card>
        )}

        {/* Interests */}
        {user.interests && user.interests.length > 0 && (
          <Card variant="gradient" className="p-4 mb-6 animate-fade-in"
                style={{ animationDelay: '0.2s' }}>
            <h3 className="font-display font-semibold text-foreground mb-3">
              {t('profile.interests')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.interests.map(interest => (
                <Badge key={interest} variant="outline">
                  {interest}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {/* Favorite Destinations */}
        {favoriteDestinations.length > 0 && (
          <Card variant="gradient" className="p-4 mb-6 animate-fade-in"
                style={{ animationDelay: '0.225s' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500 fill-current" />
                Favorite Destinations
              </h3>
              <span className="text-xs text-muted-foreground">{favoriteDestinations.length}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {favoriteDestinations.slice(0, 4).map(destination => (
                <button
                  key={destination.id}
                  onClick={() => navigate(`/destination/${destination.id}`)}
                  className="relative rounded-xl overflow-hidden group"
                >
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <p className="text-xs font-semibold text-white truncate">{destination.name}</p>
                  </div>
                </button>
              ))}
            </div>
            {favoriteDestinations.length > 4 && (
              <button 
                onClick={() => navigate('/discover')}
                className="text-xs text-primary mt-3 hover:underline w-full text-center"
              >
                View all {favoriteDestinations.length} favorites
              </button>
            )}
          </Card>
        )}

        {/* Languages */}
        {user.languages && user.languages.length > 0 && (
          <Card variant="gradient" className="p-4 mb-6 animate-fade-in"
                style={{ animationDelay: '0.25s' }}>
            <h3 className="font-display font-semibold text-foreground mb-3">
              {t('profile.languages')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.languages.map(lang => (
                <Badge key={lang} variant="info">
                  {lang}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {/* Menu */}
        <Card variant="elevated" className="divide-y divide-border mb-6 animate-fade-in"
              style={{ animationDelay: '0.3s' }}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium text-foreground">{item.label}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            );
          })}
        </Card>

        {/* Logout */}
        <Button 
          variant="outline" 
          className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground animate-fade-in"
          style={{ animationDelay: '0.35s' }}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {t('profile.logout')}
        </Button>
      </main>

      <BottomNav />
    </div>
  );
};
