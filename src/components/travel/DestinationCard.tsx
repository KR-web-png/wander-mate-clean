import React from 'react';
import { Destination } from '@/models';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { MapPin, Star, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DestinationCardProps {
  destination: Destination;
  onClick?: () => void;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
  style?: React.CSSProperties;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onClick,
  variant = 'default',
  className,
  style
}) => {
  const costColors = {
    budget: 'success',
    moderate: 'info',
    expensive: 'warning',
    luxury: 'premium'
  } as const;

  if (variant === 'compact') {
    return (
      <Card 
        variant="interactive" 
        className={cn("overflow-hidden", className)}
        onClick={onClick}
      >
        <div className="flex gap-3 p-3">
          <img
            src={destination.image}
            alt={destination.name}
            className="h-16 w-16 rounded-xl object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-foreground truncate">
              {destination.name}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {destination.country}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-3 w-3 text-sunset fill-sunset" />
              <span className="text-xs font-medium">{destination.rating}</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (variant === 'featured') {
    return (
      <Card 
        variant="interactive" 
        className={cn("overflow-hidden group", className)}
        onClick={onClick}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={destination.image}
            alt={destination.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/20 to-transparent" />
          
          <div className="absolute top-3 left-3 flex gap-2">
            {destination.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="secondary" className="bg-background/80 backdrop-blur-sm">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-1 text-sunset mb-1">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-semibold">{destination.rating}</span>
            </div>
            <h3 className="font-display text-xl font-bold text-primary-foreground">
              {destination.name}
            </h3>
            <p className="text-sm text-primary-foreground/80 flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {destination.country}
            </p>
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
          src={destination.image}
          alt={destination.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night/60 to-transparent" />
        
        <div className="absolute top-3 right-3">
          <Badge variant={costColors[destination.averageCost]}>
            {destination.averageCost}
          </Badge>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">
              {destination.name}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {destination.country}
            </p>
          </div>
          <div className="flex items-center gap-1 text-sunset">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-semibold">{destination.rating}</span>
          </div>
        </div>
        
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {destination.description}
        </p>
        
        <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Best: {destination.bestTimeToVisit}</span>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {destination.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" size="sm">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};
