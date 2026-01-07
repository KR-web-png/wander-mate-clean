import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Sparkles, ChevronRight, MapPin, Users } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { DestinationCard } from '@/components/travel/DestinationCard';
import { TripCard } from '@/components/travel/TripCard';
import { tripService } from '@/services/trip.service';
import { travelMatesService } from '@/services/travelMates.service';
import { currentUser } from '@/services/mock.data';
import { Destination, Trip, User } from '@/models';
import { cn } from '@/lib/utils';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [mates, setMates] = useState<Partial<User>[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [destData, tripData] = await Promise.all([
        tripService.getPopularDestinations(6),
        tripService.getUpcomingTrips(3)
      ]);
      
      setDestinations(destData);
      setTrips(tripData);
      
      // Load travel mates
      const mateIds = travelMatesService.getTravelMates();
      const mateProfiles = mateIds
        .map(id => travelMatesService.getUserById(id))
        .filter(Boolean)
        .slice(0, 3);
      setMates(mateProfiles);
      
      // Count incoming requests
      const requests = travelMatesService.getIncomingRequests();
      setIncomingRequests(requests.length);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header 
        showProfile 
        showNotifications 
        user={{ name: currentUser.name, avatar: currentUser.avatar }}
        notificationCount={2}
      />
      
      <main className="pt-20 px-4 max-w-lg mx-auto">
        {/* Search Bar */}
        <div className="mb-6 animate-fade-in">
          <Input
            placeholder="Search destinations, trips..."
            icon={Search}
            variant="filled"
            inputSize="lg"
            onClick={() => navigate('/discover')}
            readOnly
            className="cursor-pointer"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Card variant="gradient" className="p-3 text-center">
            <p className="text-2xl font-bold text-gradient-sunset">{currentUser.tripsCompleted}</p>
            <p className="text-xs text-muted-foreground">Trips</p>
          </Card>
          <Card variant="gradient" className="p-3 text-center">
            <p className="text-2xl font-bold text-ocean">{mates.length}</p>
            <p className="text-xs text-muted-foreground">Mates</p>
          </Card>
          <Card variant="gradient" className="p-3 text-center">
            <p className="text-2xl font-bold text-forest">{currentUser.rating}</p>
            <p className="text-xs text-muted-foreground">Rating</p>
          </Card>
        </div>

        {/* Featured Destination */}
        {destinations[0] && (
          <section className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative rounded-2xl overflow-hidden shadow-elevated">
              <img 
                src={destinations[0].image} 
                alt={destinations[0].name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <Badge variant="new" className="mb-2">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
                <h2 className="font-display text-2xl font-bold text-primary-foreground">
                  {destinations[0].name}
                </h2>
                <p className="text-sm text-primary-foreground/80 flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {destinations[0].country}
                </p>
              </div>
              <Button 
                variant="glass"
                size="sm"
                className="absolute top-4 right-4"
                onClick={() => navigate(`/destination/${destinations[0].id}`)}
              >
                Explore
              </Button>
            </div>
          </section>
        )}

        {/* Travel Mates */}
        <section className="mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-sunset" />
              Travel Mates
              {incomingRequests > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {incomingRequests} new
                </Badge>
              )}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/travel-mates')}>
              See All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          {mates.length === 0 ? (
            <Card variant="gradient" className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="font-semibold text-foreground mb-2">
                No Travel Mates Yet
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Connect with fellow travelers in the community
              </p>
              <Button variant="sunset" size="sm" onClick={() => navigate('/community')}>
                Explore Community
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {mates.map((mate, index) => (
                <Card
                  key={mate.id}
                  variant="elevated"
                  className="p-4 animate-fade-in cursor-pointer hover:shadow-lg transition-all"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  onClick={() => navigate(`/profile/${mate.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar src={mate.avatar} alt={mate.name} size="default" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {mate.name}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {mate.location}
                      </p>
                      <div className="flex gap-1 mt-1">
                        {mate.interests?.slice(0, 2).map((interest: string) => (
                          <Badge key={interest} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Trending Destinations */}
        <section className="mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-ocean" />
              Trending Destinations
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/discover')}>
              See All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {destinations.slice(1, 5).map((destination, index) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                variant="featured"
                onClick={() => navigate(`/destination/${destination.id}`)}
                className="min-w-[260px] animate-fade-in"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              />
            ))}
          </div>
        </section>

        {/* Upcoming Trips */}
        <section className="mb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-foreground">
              Open Trips
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/trips')}>
              See All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {trips.map((trip, index) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onClick={() => navigate(`/trip/${trip.id}`)}
                className="animate-fade-in"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              />
            ))}
          </div>
        </section>

        {/* Create Trip CTA */}
        <Card variant="gradient" className="p-5 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h3 className="font-display text-lg font-bold text-foreground mb-2">
            Ready to explore?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your own trip and find travel companions
          </p>
          <Button variant="sunset" onClick={() => navigate('/trips/create')}>
            Create a Trip
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};
