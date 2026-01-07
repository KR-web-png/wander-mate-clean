import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, X, MapPin, Star } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import { DestinationCard } from '@/components/travel/DestinationCard';
import { tripService } from '@/services/trip.service';
import { Destination } from '@/models';
import { cn } from '@/lib/utils';

const categories = ['All', 'Beach', 'Adventure', 'Culture', 'City', 'Nature', 'Romantic'];

export const DiscoverScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDestinations();
  }, []);

  useEffect(() => {
    filterDestinations();
  }, [searchQuery, selectedCategory, destinations]);

  const loadDestinations = async () => {
    try {
      const data = await tripService.getDestinations();
      setDestinations(data);
      setFilteredDestinations(data);
    } catch (error) {
      console.error('Error loading destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDestinations = () => {
    let filtered = [...destinations];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(query) ||
        d.country.toLowerCase().includes(query) ||
        d.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(d => 
        d.tags.some(tag => tag.toLowerCase() === selectedCategory.toLowerCase())
      );
    }

    setFilteredDestinations(filtered);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Discover" showBack showNotifications />
      
      <main className="pt-20 px-4 max-w-lg mx-auto">
        {/* Search */}
        <div className="relative mb-4 animate-fade-in">
          <Input
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
            variant="filled"
            inputSize="lg"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide mb-4 animate-fade-in" 
             style={{ animationDelay: '0.1s' }}>
          {categories.map(category => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="lg"
              className={cn(
                "cursor-pointer whitespace-nowrap transition-all duration-200",
                selectedCategory === category 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              )}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4 animate-fade-in" 
           style={{ animationDelay: '0.2s' }}>
          {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''} found
        </p>

        {/* Destinations Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="aspect-[3/4] animate-pulse bg-muted" />
            ))}
          </div>
        ) : filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredDestinations.map((destination, index) => (
              <Card
                key={destination.id}
                variant="interactive"
                className="overflow-hidden animate-fade-in group"
                style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                onClick={() => navigate(`/destination/${destination.id}`)}
              >
                <div className="relative aspect-[3/4]">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/30 to-transparent" />
                  
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" size="sm" className="bg-background/80 backdrop-blur-sm">
                      <Star className="h-3 w-3 mr-0.5 fill-sunset text-sunset" />
                      {destination.rating}
                    </Badge>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="font-display font-bold text-primary-foreground">
                      {destination.name}
                    </h3>
                    <p className="text-xs text-primary-foreground/80 flex items-center gap-0.5 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      {destination.country}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card variant="gradient" className="p-8 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              No destinations found
            </h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </Card>
        )}
      </main>

      <BottomNav />
    </div>
  );
};
