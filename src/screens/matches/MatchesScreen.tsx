import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Heart, UserCheck, Filter } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import { MatchCard } from '@/components/travel/MatchCard';
import { matchingService } from '@/services/matching.service';
import { Match, MatchStatus } from '@/models';
import { cn } from '@/lib/utils';

type TabType = 'all' | 'pending' | 'connected';

export const MatchesScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const data = await matchingService.getMatches();
      setMatches(data);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (matchId: string) => {
    await matchingService.acceptMatch(matchId);
    loadMatches();
  };

  const handleDecline = async (matchId: string) => {
    await matchingService.declineMatch(matchId);
    loadMatches();
  };

  const filteredMatches = matches.filter(match => {
    if (activeTab === 'pending') return match.status === 'pending';
    if (activeTab === 'connected') return match.status === 'connected' || match.status === 'accepted';
    return true;
  });

  const pendingCount = matches.filter(m => m.status === 'pending').length;
  const connectedCount = matches.filter(m => m.status === 'connected' || m.status === 'accepted').length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Matches" showNotifications />
      
      <main className="pt-20 px-4 max-w-lg mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6 animate-fade-in">
          <Card variant="gradient" className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-sunset/10 flex items-center justify-center">
              <Heart className="h-5 w-5 text-sunset" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </Card>
          <Card variant="gradient" className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-forest/10 flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-forest" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{connectedCount}</p>
              <p className="text-xs text-muted-foreground">Connected</p>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide mb-4 animate-fade-in"
             style={{ animationDelay: '0.1s' }}>
          {[
            { id: 'all', label: 'All Matches' },
            { id: 'pending', label: 'Pending', count: pendingCount },
            { id: 'connected', label: 'Connected', count: connectedCount }
          ].map(tab => (
            <Badge
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              size="lg"
              className={cn(
                "cursor-pointer whitespace-nowrap transition-all duration-200",
                activeTab === tab.id 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              )}
              onClick={() => setActiveTab(tab.id as TabType)}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1.5 bg-primary-foreground/20 px-1.5 py-0.5 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </Badge>
          ))}
        </div>

        {/* Find More Matches */}
        {activeTab !== 'pending' && pendingCount === 0 && (
          <Card 
            variant="interactive" 
            className="mb-6 p-4 border-2 border-dashed border-primary/30 bg-primary/5 animate-fade-in"
            style={{ animationDelay: '0.15s' }}
            onClick={() => navigate('/discover')}
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-sunset flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">
                  Find Travel Companions
                </h3>
                <p className="text-sm text-muted-foreground">
                  Discover people who share your travel style
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Matches List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="h-32 animate-pulse bg-muted" />
            ))}
          </div>
        ) : filteredMatches.length > 0 ? (
          <div className="space-y-4">
            {filteredMatches.map((match, index) => (
              <MatchCard
                key={match.id}
                match={match}
                onAccept={() => handleAccept(match.id)}
                onDecline={() => handleDecline(match.id)}
                onMessage={() => navigate(`/chat/${match.user.id}`)}
                className="animate-fade-in"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              />
            ))}
          </div>
        ) : (
          <Card variant="gradient" className="p-8 text-center animate-fade-in"
                style={{ animationDelay: '0.2s' }}>
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              {activeTab === 'pending' 
                ? 'No pending matches'
                : activeTab === 'connected'
                  ? 'No connections yet'
                  : 'No matches found'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Explore destinations and trips to find compatible travel companions
            </p>
            <Button variant="sunset" onClick={() => navigate('/discover')}>
              <Sparkles className="h-4 w-4 mr-2" />
              Discover Travelers
            </Button>
          </Card>
        )}
      </main>

      <BottomNav />
    </div>
  );
};
