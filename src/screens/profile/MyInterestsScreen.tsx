import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, X } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { cn } from '@/lib/utils';
import { Destination } from '@/models';
import { favoritesService } from '@/services/favorites.service';

const availableInterests = [
  'Adventure', 'Beach', 'Culture', 'Food', 'History',
  'Nature', 'Photography', 'Shopping', 'Wildlife', 'Nightlife',
  'Relaxation', 'Sports', 'Hiking', 'Camping', 'Diving'
];

export const MyInterestsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [favoriteDestinations, setFavoriteDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    // Load from localStorage or user profile
    const saved = localStorage.getItem('user_interests');
    if (saved) {
      setSelectedInterests(JSON.parse(saved));
    }
    
    // Load favorite destinations
    setFavoriteDestinations(favoritesService.getFavorites());
  }, []);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => {
      const newInterests = prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest];
      
      // Save to localStorage
      localStorage.setItem('user_interests', JSON.stringify(newInterests));
      return newInterests;
    });
  };

  const removeFavorite = (destinationId: string) => {
    favoritesService.removeFavorite(destinationId);
    setFavoriteDestinations(favoritesService.getFavorites());
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="My Interests" showBack />
      
      <main className="pt-20 px-4 max-w-lg mx-auto">
        {/* Travel Interests Section */}
        <section className="mb-8 animate-fade-in">
          <div className="mb-4">
            <h2 className="font-display text-xl font-bold text-foreground mb-1">
              Travel Interests
            </h2>
            <p className="text-sm text-muted-foreground">
              Select your interests to get personalized recommendations
            </p>
          </div>

          <Card variant="gradient" className="p-4">
            <div className="flex flex-wrap gap-2">
              {availableInterests.map((interest, index) => {
                const isSelected = selectedInterests.includes(interest);
                
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all animate-fade-in",
                      isSelected
                        ? "bg-gradient-sunset text-white shadow-md"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                    style={{ animationDelay: `${index * 0.03}s` }}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
            
            {selectedInterests.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  {selectedInterests.length} interest{selectedInterests.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            )}
          </Card>
        </section>

        {/* Favorite Destinations Section */}
        <section className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500 fill-current" />
              Favorite Destinations
            </h2>
            <Badge variant="outline">{favoriteDestinations.length}</Badge>
          </div>

          {favoriteDestinations.length === 0 ? (
            <Card variant="gradient" className="p-8 text-center">
              <div className="inline-flex h-16 w-16 rounded-full bg-muted items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                No favorites yet
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start exploring and save your favorite destinations
              </p>
              <Button variant="sunset" onClick={() => navigate('/discover')}>
                Discover Destinations
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {favoriteDestinations.map((destination, index) => (
                <Card
                  key={destination.id}
                  variant="interactive"
                  className="overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                >
                  <div className="flex gap-3 p-3">
                    <button
                      onClick={() => navigate(`/destination/${destination.id}`)}
                      className="relative flex-shrink-0 group"
                    >
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="h-20 w-20 rounded-xl object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-night/60 to-transparent rounded-xl" />
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => navigate(`/destination/${destination.id}`)}
                        className="text-left w-full"
                      >
                        <h3 className="font-display font-semibold text-foreground truncate mb-1">
                          {destination.name}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                          <MapPin className="h-3 w-3" />
                          {destination.country}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {destination.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </button>
                    </div>

                    <button
                      onClick={() => removeFavorite(destination.id)}
                      className="flex-shrink-0 h-8 w-8 rounded-full bg-muted hover:bg-destructive/10 hover:text-destructive transition-colors flex items-center justify-center"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Save Button */}
        {selectedInterests.length > 0 && (
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button 
              variant="sunset" 
              className="w-full"
              onClick={() => {
                // Save and go back
                navigate(-1);
              }}
            >
              Save Changes
            </Button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};
