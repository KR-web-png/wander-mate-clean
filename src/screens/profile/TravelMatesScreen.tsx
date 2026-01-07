import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, UserPlus, UserMinus, Check, X, Clock } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { travelMatesService, TravelMateRequest } from '@/services/travelMates.service';
import { User } from '@/models';
import { formatDistanceToNow } from 'date-fns';

type TabType = 'mates' | 'received' | 'sent';

export const TravelMatesScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('mates');
  const [mates, setMates] = useState<Partial<User>[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<TravelMateRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<TravelMateRequest[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const mateIds = travelMatesService.getTravelMates();
    const mateProfiles = mateIds
      .map(id => travelMatesService.getUserById(id))
      .filter(Boolean);
    setMates(mateProfiles);

    setReceivedRequests(travelMatesService.getIncomingRequests());
    setSentRequests(travelMatesService.getOutgoingRequests());
  };

  const handleAcceptRequest = (requestId: string) => {
    travelMatesService.acceptRequest(requestId);
    loadData();
  };

  const handleRejectRequest = (requestId: string) => {
    travelMatesService.rejectRequest(requestId);
    loadData();
  };

  const handleCancelRequest = (requestId: string) => {
    travelMatesService.rejectRequest(requestId);
    loadData();
  };

  const handleRemoveMate = (userId: string) => {
    travelMatesService.removeTravelMate(userId);
    loadData();
  };

  const renderMates = () => {
    if (mates.length === 0) {
      return (
        <Card variant="gradient" className="p-12 text-center">
          <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            No Travel Mates Yet
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start connecting with fellow travelers!
          </p>
          <Button variant="sunset" onClick={() => navigate('/community')}>
            Explore Community
          </Button>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mates.map((mate, index) => (
          <Card
            key={mate.id}
            variant="elevated"
            className="p-4 animate-fade-in cursor-pointer hover:shadow-lg transition-all"
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => navigate(`/profile/${mate.id}`)}
          >
            <div className="flex items-start gap-3">
              <Avatar src={mate.avatar} alt={mate.name} size="default" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">
                  {mate.name}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {mate.location}
                </p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {mate.bio}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {mate.interests.slice(0, 3).map((interest: string) => (
                    <Badge key={interest} variant="secondary" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveMate(mate.id);
                }}
              >
                <UserMinus className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderReceivedRequests = () => {
    if (receivedRequests.length === 0) {
      return (
        <Card variant="gradient" className="p-12 text-center">
          <UserPlus className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            No Pending Requests
          </h3>
          <p className="text-sm text-muted-foreground">
            You don't have any incoming travel mate requests
          </p>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {receivedRequests.map((request, index) => (
          <Card
            key={request.id}
            variant="elevated"
            className="p-4 animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-start gap-3">
              <Avatar 
                src={request.senderAvatar} 
                alt={request.senderName} 
                size="default"
                onClick={() => navigate(`/profile/${request.senderId}`)}
                className="cursor-pointer hover:ring-2 hover:ring-primary transition-all"
              />
              <div className="flex-1 min-w-0">
                <h3 
                  className="font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
                  onClick={() => navigate(`/profile/${request.senderId}`)}
                >
                  {request.senderName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  wants to be your travel mate
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(request.timestamp), { addSuffix: true })}
                </p>
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="sunset"
                    size="sm"
                    onClick={() => handleAcceptRequest(request.id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRejectRequest(request.id)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderSentRequests = () => {
    if (sentRequests.length === 0) {
      return (
        <Card variant="gradient" className="p-12 text-center">
          <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            No Outgoing Requests
          </h3>
          <p className="text-sm text-muted-foreground">
            You haven't sent any travel mate requests
          </p>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {sentRequests.map((request, index) => {
          const receiver = travelMatesService.getUserById(request.receiverId);
          if (!receiver) return null;

          return (
            <Card
              key={request.id}
              variant="elevated"
              className="p-4 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start gap-3">
                <Avatar 
                  src={receiver.avatar} 
                  alt={receiver.name} 
                  size="default"
                  onClick={() => navigate(`/profile/${receiver.id}`)}
                  className="cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                />
                <div className="flex-1 min-w-0">
                  <h3 
                    className="font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
                    onClick={() => navigate(`/profile/${receiver.id}`)}
                  >
                    {receiver.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Request pending</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sent {formatDistanceToNow(new Date(request.timestamp), { addSuffix: true })}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancelRequest(request.id)}
                    className="mt-3"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel Request
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-sunset text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold">Travel Mates</h1>
            <p className="text-sm text-white/80">Manage your connections</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('mates')}
            className={`flex-1 min-w-fit px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'mates'
                ? 'bg-gradient-sunset text-white shadow-lg'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="h-4 w-4" />
              <span>My Mates</span>
              {mates.length > 0 && (
                <Badge variant={activeTab === 'mates' ? 'outline' : 'secondary'} className="ml-1">
                  {mates.length}
                </Badge>
              )}
            </div>
          </button>

          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 min-w-fit px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'received'
                ? 'bg-gradient-sunset text-white shadow-lg'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Received</span>
              {receivedRequests.length > 0 && (
                <Badge variant={activeTab === 'received' ? 'outline' : 'secondary'} className="ml-1">
                  {receivedRequests.length}
                </Badge>
              )}
            </div>
          </button>

          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 min-w-fit px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'sent'
                ? 'bg-gradient-sunset text-white shadow-lg'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Sent</span>
              {sentRequests.length > 0 && (
                <Badge variant={activeTab === 'sent' ? 'outline' : 'secondary'} className="ml-1">
                  {sentRequests.length}
                </Badge>
              )}
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          {activeTab === 'mates' && renderMates()}
          {activeTab === 'received' && renderReceivedRequests()}
          {activeTab === 'sent' && renderSentRequests()}
        </div>
      </div>
    </div>
  );
};
