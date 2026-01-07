import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Languages, Plane, UserPlus, UserMinus, Clock } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { travelMatesService } from '@/services/travelMates.service';
import { User } from '@/models';

export const UserProfileScreen: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [isMate, setIsMate] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [requestSentByMe, setRequestSentByMe] = useState(false);

  useEffect(() => {
    if (userId) {
      const userData = travelMatesService.getUserById(userId);
      setUser(userData);
      setIsMate(travelMatesService.isTravelMate(userId));
      
      const pending = travelMatesService.hasRequestPending(userId);
      setHasPendingRequest(pending);
      
      // Check if I sent the request
      const outgoingRequests = travelMatesService.getOutgoingRequests();
      const sentByMe = outgoingRequests.some(req => req.receiverId === userId);
      setRequestSentByMe(sentByMe);
    }
  }, [userId]);

  const handleSendRequest = () => {
    if (userId && user) {
      travelMatesService.sendRequest(userId, user.name, user.avatar);
      setHasPendingRequest(true);
      setRequestSentByMe(true);
    }
  };

  const handleRemoveMate = () => {
    if (userId) {
      travelMatesService.removeTravelMate(userId);
      setIsMate(false);
    }
  };

  const handleCancelRequest = () => {
    if (userId) {
      const outgoingRequests = travelMatesService.getOutgoingRequests();
      const request = outgoingRequests.find(req => req.receiverId === userId);
      if (request) {
        travelMatesService.rejectRequest(request.id);
        setHasPendingRequest(false);
        setRequestSentByMe(false);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">User not found</p>
      </div>
    );
  }

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
            <h1 className="font-display text-xl font-bold">{user.name}</h1>
            <p className="text-sm text-white/80">{user.location}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Profile Header */}
        <Card variant="elevated" className="p-6 animate-fade-in">
          <div className="flex flex-col items-center text-center mb-6">
            <Avatar 
              src={user.avatar} 
              alt={user.name} 
              size="xl"
              className="mb-4"
            />
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              {user.name}
            </h2>
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <MapPin className="h-4 w-4" />
              <span>{user.location}</span>
            </div>

            {/* Action Button */}
            {isMate ? (
              <Button
                variant="outline"
                onClick={handleRemoveMate}
                className="w-full max-w-xs"
              >
                <UserMinus className="h-4 w-4 mr-2" />
                Remove Travel Mate
              </Button>
            ) : hasPendingRequest ? (
              <Button
                variant="outline"
                onClick={requestSentByMe ? handleCancelRequest : undefined}
                disabled={!requestSentByMe}
                className="w-full max-w-xs"
              >
                <Clock className="h-4 w-4 mr-2" />
                {requestSentByMe ? 'Cancel Request' : 'Request Pending'}
              </Button>
            ) : (
              <Button
                variant="sunset"
                onClick={handleSendRequest}
                className="w-full max-w-xs"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Travel Mate
              </Button>
            )}
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-2">About</h3>
            <p className="text-muted-foreground">{user.bio}</p>
          </div>

          {/* Travel Style */}
          {user.travelStyle && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Plane className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-foreground">Travel Style</h3>
              </div>
              <p className="text-muted-foreground capitalize">{user.travelStyle}</p>
            </div>
          )}

          {/* Languages */}
          {user.languages && user.languages.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Languages className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-foreground">Languages</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.languages.map((lang: string) => (
                  <Badge key={lang} variant="secondary">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {user.interests && user.interests.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest: string) => (
                  <Badge key={interest} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
