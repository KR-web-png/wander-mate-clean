import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Users, Search } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { mockConversations, currentUser } from '@/services/mock.data';
import { Conversation } from '@/models';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export const ChatScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    setConversations(mockConversations);
  }, []);

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
    if (conv.type === 'group' && conv.name) {
      return conv.name.toLowerCase().includes(query);
    }
    
    const otherParticipant = conv.participants.find(p => p.id !== currentUser.id);
    return otherParticipant?.name.toLowerCase().includes(query);
  });

  const getConversationDetails = (conv: Conversation) => {
    if (conv.type === 'group') {
      return {
        name: conv.name || 'Group Chat',
        avatar: conv.avatar,
        isGroup: true
      };
    }
    
    const otherParticipant = conv.participants.find(p => p.id !== currentUser.id);
    return {
      name: otherParticipant?.name || 'Unknown',
      avatar: otherParticipant?.avatar,
      isGroup: false,
      verificationStatus: otherParticipant?.verificationStatus
    };
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Messages" showNotifications />
      
      <main className="pt-20 px-4 max-w-lg mx-auto">
        {/* Search */}
        <div className="mb-6 animate-fade-in">
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
            variant="filled"
          />
        </div>

        {/* Conversations List */}
        {filteredConversations.length > 0 ? (
          <div className="space-y-2">
            {filteredConversations.map((conv, index) => {
              const details = getConversationDetails(conv);
              
              return (
                <Card
                  key={conv.id}
                  variant="interactive"
                  className="p-4 animate-fade-in"
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                  onClick={() => navigate(`/chat/${conv.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {details.isGroup ? (
                        <div className="h-12 w-12 rounded-full bg-gradient-ocean flex items-center justify-center">
                          <Users className="h-6 w-6 text-secondary-foreground" />
                        </div>
                      ) : (
                        <Avatar
                          src={details.avatar}
                          alt={details.name}
                          size="lg"
                          verificationStatus={details.verificationStatus}
                          showBadge
                        />
                      )}
                      {conv.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-[10px] font-bold text-primary-foreground">
                            {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className={cn(
                          "font-semibold truncate",
                          conv.unreadCount > 0 ? "text-foreground" : "text-foreground"
                        )}>
                          {details.name}
                        </h3>
                        {conv.lastMessage && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(conv.lastMessage.timestamp, { addSuffix: false })}
                          </span>
                        )}
                      </div>
                      
                      {conv.lastMessage && (
                        <p className={cn(
                          "text-sm truncate mt-0.5",
                          conv.unreadCount > 0 
                            ? "text-foreground font-medium" 
                            : "text-muted-foreground"
                        )}>
                          {conv.lastMessage.content}
                        </p>
                      )}
                      
                      {details.isGroup && (
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="info" size="sm">
                            {conv.participants.length} members
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card variant="gradient" className="p-8 text-center animate-fade-in">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              No conversations yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Connect with travel companions to start chatting
            </p>
          </Card>
        )}
      </main>

      <BottomNav />
    </div>
  );
};
