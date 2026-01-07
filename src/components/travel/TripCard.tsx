import React from 'react';
import { Trip } from '@/models';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { MapPin, Calendar, Users, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface TripCardProps {
  trip: Trip;
  onClick?: () => void;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
  style?: React.CSSProperties;
}

export const TripCard: React.FC<TripCardProps> = ({
  trip,
  onClick,
  variant = 'default',
  className,
  style
}) => {
  const statusColors = {
    planning: 'info',
    open: 'success',
    full: 'warning',
    in_progress: 'info',
    completed: 'secondary',
    cancelled: 'destructive'
  } as const;

  const spotsLeft = trip.maxCompanions - trip.currentCompanions.length;

  if (variant === 'compact') {
    return (
      <Card 
        variant="interactive" 
        className={cn("overflow-hidden", className)}
        onClick={onClick}
      >
        <div className="flex gap-3 p-3">
          <img
            src={trip.destination.image}
            alt={trip.destination.name}
            className="h-20 w-20 rounded-xl object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display font-semibold text-foreground truncate">
                {trip.title}
              </h3>
              <Badge variant={statusColors[trip.status]} size="sm">
                {trip.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {trip.destination.name}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Calendar className="h-3 w-3" />
              {format(trip.startDate, 'MMM d')} - {format(trip.endDate, 'MMM d, yyyy')}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (variant === 'featured') {
    return (
      <Card 
        variant="elevated" 
        className={cn("overflow-hidden group", className)}
        onClick={onClick}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={trip.destination.image}
            alt={trip.destination.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/40 to-transparent" />
          
          <div className="absolute top-3 left-3 right-3 flex justify-between">
            <Badge variant={statusColors[trip.status]}>
              {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}
            </Badge>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="font-display text-xl font-bold text-primary-foreground mb-2">
              {trip.title}
            </h3>
            
            <div className="flex items-center gap-4 text-sm text-primary-foreground/80">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {trip.destination.name}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(trip.startDate, 'MMM d')} - {format(trip.endDate, 'MMM d')}
              </span>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Avatar
                  src={trip.organizer.avatar}
                  alt={trip.organizer.name}
                  size="sm"
                />
                <span className="text-sm text-primary-foreground/80">
                  by {trip.organizer.name}
                </span>
              </div>
              
              <div className="flex -space-x-2">
                {trip.currentCompanions.slice(0, 3).map(companion => (
                  <Avatar
                    key={companion.id}
                    src={companion.avatar}
                    alt={companion.name}
                    size="xs"
                    className="ring-2 ring-night"
                  />
                ))}
                {trip.currentCompanions.length > 3 && (
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium ring-2 ring-night">
                    +{trip.currentCompanions.length - 3}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Default variant
  return (
    <Card 
      variant="interactive" 
      className={cn("overflow-hidden group", className)}
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={trip.destination.image}
          alt={trip.destination.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night/60 to-transparent" />
        
        <div className="absolute top-3 left-3">
          <Badge variant={statusColors[trip.status]}>
            {trip.status === 'open' && spotsLeft > 0 ? `${spotsLeft} spots left` : trip.status}
          </Badge>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1">
          {trip.title}
        </h3>
        
        <div className="mt-2 space-y-1.5">
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            {trip.destination.name}, {trip.destination.country}
          </p>
          
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            {format(trip.startDate, 'MMM d')} - {format(trip.endDate, 'MMM d, yyyy')}
          </p>
          
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-primary" />
            ${trip.budget.min} - ${trip.budget.max} {trip.budget.currency}
          </p>
          
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-primary" />
            {trip.currentCompanions.length + 1}/{trip.maxCompanions + 1} travelers
          </p>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar
              src={trip.organizer.avatar}
              alt={trip.organizer.name}
              size="sm"
              verificationStatus={trip.organizer.verificationStatus}
              showBadge
            />
            <span className="text-sm text-muted-foreground">
              {trip.organizer.name}
            </span>
          </div>
          
          {trip.currentCompanions.length > 0 && (
            <div className="flex -space-x-2">
              {trip.currentCompanions.slice(0, 2).map(companion => (
                <Avatar
                  key={companion.id}
                  src={companion.avatar}
                  alt={companion.name}
                  size="xs"
                  className="ring-2 ring-card"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
