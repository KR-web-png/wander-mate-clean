import React from 'react';
import { Match } from '@/models';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { MapPin, Heart, MessageCircle, X, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchCardProps {
  match: Match;
  onAccept?: () => void;
  onDecline?: () => void;
  onMessage?: () => void;
  variant?: 'default' | 'compact' | 'swipe';
  className?: string;
  style?: React.CSSProperties;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onAccept,
  onDecline,
  onMessage,
  variant = 'default',
  className,
  style
}) => {
  const { user, compatibilityScore, sharedInterests, status } = match;

  const getCompatibilityColor = (score: number) => {
    if (score >= 85) return 'text-forest';
    if (score >= 70) return 'text-ocean';
    if (score >= 50) return 'text-sunset';
    return 'text-muted-foreground';
  };

  if (variant === 'swipe') {
    return (
      <Card 
        variant="elevated" 
        className={cn("overflow-hidden w-full max-w-sm mx-auto", className)}
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-transparent" />
          
          <div className="absolute top-4 right-4">
            <div className="bg-background/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-sunset" />
              <span className={cn("font-bold", getCompatibilityColor(compatibilityScore))}>
                {compatibilityScore}%
              </span>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="font-display text-2xl font-bold text-primary-foreground">
              {user.name}
            </h3>
            <p className="text-sm text-primary-foreground/80 flex items-center gap-1 mt-1">
              <MapPin className="h-4 w-4" />
              {user.location}
            </p>
            
            <p className="text-sm text-primary-foreground/70 mt-2 line-clamp-2">
              {user.bio}
            </p>
            
            <div className="flex flex-wrap gap-1.5 mt-3">
              {sharedInterests.slice(0, 3).map(interest => (
                <Badge key={interest} variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-4 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={onDecline}
          >
            <X className="h-6 w-6" />
          </Button>
          
          <Button
            variant="sunset"
            size="icon"
            className="h-16 w-16 rounded-full"
            onClick={onAccept}
          >
            <Heart className="h-7 w-7" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full border-2 border-ocean text-ocean hover:bg-ocean hover:text-ocean-foreground"
            onClick={onMessage}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <Card 
        variant="interactive" 
        className={cn("overflow-hidden", className)}
      >
        <div className="flex items-center gap-3 p-3">
          <Avatar
            src={user.avatar}
            alt={user.name}
            size="lg"
            verificationStatus={user.verificationStatus}
            showBadge
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display font-semibold text-foreground truncate">
                {user.name}
              </h3>
              <div className={cn("font-bold text-sm", getCompatibilityColor(compatibilityScore))}>
                {compatibilityScore}%
              </div>
            </div>
            <p className="text-sm text-muted-foreground truncate">{user.location}</p>
            <div className="flex gap-1 mt-1">
              {sharedInterests.slice(0, 2).map(interest => (
                <Badge key={interest} variant="outline" size="sm">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
          
          {status === 'pending' && (
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={onDecline}>
                <X className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="sunset" onClick={onAccept}>
                <Check className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Default variant
  return (
    <Card 
      variant="elevated" 
      className={cn("overflow-hidden", className)}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <Avatar
            src={user.avatar}
            alt={user.name}
            size="xl"
            verificationStatus={user.verificationStatus}
            showBadge
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {user.name}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {user.location}
                </p>
              </div>
              
              <div className="text-center">
                <div className={cn("text-2xl font-bold", getCompatibilityColor(compatibilityScore))}>
                  {compatibilityScore}%
                </div>
                <p className="text-xs text-muted-foreground">Match</p>
              </div>
            </div>
            
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
              {user.bio}
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            Shared Interests
          </p>
          <div className="flex flex-wrap gap-1.5">
            {sharedInterests.map(interest => (
              <Badge key={interest} variant="info">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mt-4 flex gap-2">
          {status === 'pending' && (
            <>
              <Button variant="outline" className="flex-1" onClick={onDecline}>
                <X className="h-4 w-4 mr-1" />
                Pass
              </Button>
              <Button variant="sunset" className="flex-1" onClick={onAccept}>
                <Heart className="h-4 w-4 mr-1" />
                Connect
              </Button>
            </>
          )}
          
          {(status === 'accepted' || status === 'connected') && (
            <Button variant="ocean" className="w-full" onClick={onMessage}>
              <MessageCircle className="h-4 w-4 mr-1" />
              Send Message
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
