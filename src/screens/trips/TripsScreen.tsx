import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Users, MapPin } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import { TripCard } from '@/components/travel/TripCard';
import { tripService } from '@/services/trip.service';
import { Trip } from '@/models';
import { cn } from '@/lib/utils';

type TabType = 'explore' | 'my-trips';

export const TripsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('explore');
  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [myTrips, setMyTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const [all, mine] = await Promise.all([
        tripService.getTrips({ status: 'open' }),
        tripService.getUserTrips()
      ]);
      setAllTrips(all);
      setMyTrips(mine);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentTrips = activeTab === 'explore' ? allTrips : myTrips;

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Trips" showNotifications />
      
      <main className="pt-20 px-4 max-w-lg mx-auto">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 animate-fade-in">
          <Button
            variant={activeTab === 'explore' ? 'default' : 'outline'}
            onClick={() => setActiveTab('explore')}
            className="flex-1"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Explore
          </Button>
          <Button
            variant={activeTab === 'my-trips' ? 'default' : 'outline'}
            onClick={() => setActiveTab('my-trips')}
            className="flex-1"
          >
            <Calendar className="h-4 w-4 mr-2" />
            My Trips
          </Button>
        </div>

        {/* Create Trip CTA */}
        <Card 
          variant="interactive" 
          className="mb-6 p-4 border-2 border-dashed border-primary/30 bg-primary/5 animate-fade-in"
          style={{ animationDelay: '0.1s' }}
          onClick={() => navigate('/trips/create')}
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">
                Create a Trip
              </h3>
              <p className="text-sm text-muted-foreground">
                Plan your adventure and find companions
              </p>
            </div>
          </div>
        </Card>

        {/* Trip Stats (for My Trips tab) */}
        {activeTab === 'my-trips' && myTrips.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-in" 
               style={{ animationDelay: '0.15s' }}>
            <Card variant="gradient" className="p-3 text-center">
              <p className="text-xl font-bold text-primary">
                {myTrips.filter(t => t.status === 'open' || t.status === 'planning').length}
              </p>
              <p className="text-xs text-muted-foreground">Upcoming</p>
            </Card>
            <Card variant="gradient" className="p-3 text-center">
              <p className="text-xl font-bold text-ocean">
                {myTrips.filter(t => t.status === 'in_progress').length}
              </p>
              <p className="text-xs text-muted-foreground">Active</p>
            </Card>
            <Card variant="gradient" className="p-3 text-center">
              <p className="text-xl font-bold text-forest">
                {myTrips.filter(t => t.status === 'completed').length}
              </p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </Card>
          </div>
        )}

        {/* Trips List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="h-64 animate-pulse bg-muted" />
            ))}
          </div>
        ) : currentTrips.length > 0 ? (
          <div className="space-y-4">
            {currentTrips.map((trip, index) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onClick={() => navigate(`/trip/${trip.id}`)}
                className="animate-fade-in"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              />
            ))}
          </div>
        ) : (
          <Card variant="gradient" className="p-8 text-center animate-fade-in" 
                style={{ animationDelay: '0.2s' }}>
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              {activeTab === 'explore' 
                ? 'No open trips available'
                : "You haven't joined any trips yet"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {activeTab === 'explore'
                ? 'Be the first to create one!'
                : 'Explore open trips or create your own adventure'}
            </p>
            <Button variant="sunset" onClick={() => navigate('/trips/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Trip
            </Button>
          </Card>
        )}
      </main>

      <BottomNav />
    </div>
  );
};
