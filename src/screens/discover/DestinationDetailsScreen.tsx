import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import { tripService } from '@/services/trip.service';
import { Destination } from '@/models';

export const DestinationDetailsScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadDestination = async () => {
    if (!id) return;
    
    try {
      const data = await tripService.getDestinationById(id);
      setDestination(data);
    } catch (error) {
      console.error('Error loading destination:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDestination();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Auto-slide images every 3 seconds
  useEffect(() => {
    if (!destination?.images || destination.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === destination.images!.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [destination]);

  const handlePrevImage = () => {
    if (!destination?.images) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? destination.images!.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!destination?.images) return;
    setCurrentImageIndex((prev) => 
      prev === destination.images!.length - 1 ? 0 : prev + 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sunset"></div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold mb-2">Destination not found</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const images = destination.images && destination.images.length > 0 
    ? destination.images 
    : [destination.image];

  return (
    <div className="min-h-screen bg-background">
      {/* Image Carousel - Full Screen from Top */}
      <div className="relative w-full h-96 bg-muted overflow-hidden">
        <img
          key={currentImageIndex}
          src={images[currentImageIndex]}
          alt={`${destination.name} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-700 ease-in-out animate-fade-in"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/20 to-transparent" />

        {/* Back Button - Floating on Image */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-50 bg-white/90 hover:bg-white text-night"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Destination Name on Image */}
        <div className="absolute bottom-6 left-4 right-4 z-40">
          <h1 className="font-display text-3xl font-bold text-white mb-1 drop-shadow-lg">
            {destination.name}
          </h1>
          <p className="text-white/90 flex items-center gap-1 drop-shadow-md">
            <MapPin className="h-4 w-4" />
            {destination.country}
          </p>
        </div>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5 text-night" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5 text-night" />
              </button>
            </>
          )}

          {/* Image Indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentImageIndex 
                      ? 'w-8 bg-white' 
                      : 'w-2 bg-white/50'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Rating Badge */}
          <div className="absolute top-4 right-4 z-50">
            <Badge variant="premium" className="bg-white/90 text-night">
              <Star className="h-3 w-3 mr-1 fill-current text-yellow-500" />
              {destination.rating}
            </Badge>
          </div>
        </div>

        <div className="pb-8">
          {/* Content */}
          <div className="max-w-lg mx-auto px-4 mt-4">
            {/* Info Card */}
            <Card className="p-5 mb-6 shadow-elevated">
              {/* Address */}
              {destination.address && (
                <div className="mb-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-foreground flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-sunset" />
                    <span>{destination.address}</span>
                  </p>
                </div>
              )}

            {/* Quick Info */}
            <div className="mb-4">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Calendar className="h-5 w-5 text-ocean" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Best Time to Visit</p>
                  <p className="text-base font-medium">{destination.bestTimeToVisit}</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {destination.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Description */}
          <Card className="p-5 mb-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-3">
              About
            </h3>
            <p className="text-base text-foreground/80 leading-relaxed">
              {destination.description}
            </p>
          </Card>

          {/* Popular Activities */}
          <Card className="p-5 mb-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-3">
              Popular Activities
            </h3>
            <ul className="space-y-2.5">
              {destination.popularActivities.map((activity, index) => (
                <li key={index} className="flex items-start gap-3 text-base text-foreground/80">
                  <span className="text-sunset mt-1 text-lg">•</span>
                  <span>{activity}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="sunset" 
              className="flex-1"
              onClick={() => navigate('/trips/create', { state: { destination } })}
            >
              Create Trip
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => navigate('/discover')}
            >
              Explore More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
