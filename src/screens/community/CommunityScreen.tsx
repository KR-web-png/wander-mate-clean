import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ThumbsUp, MessageSquare, Send, Star, TrendingUp, Filter } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Avatar } from '@/components/common/Avatar';
import { cn } from '@/lib/utils';
import { feedbackService, Feedback } from '@/services/feedback.service';
import { tripService } from '@/services/trip.service';
import { format, formatDistanceToNow } from 'date-fns';
import { MapPin } from 'lucide-react';

export const CommunityScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<string>('all');
  const [newFeedbackDestination, setNewFeedbackDestination] = useState('');
  const [newFeedbackDestinationId, setNewFeedbackDestinationId] = useState('');
  const [newFeedbackContent, setNewFeedbackContent] = useState('');
  const [newFeedbackRating, setNewFeedbackRating] = useState<number>(5);
  const [showNewPost, setShowNewPost] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [destinationSuggestions, setDestinationSuggestions] = useState<Array<{ id: string; name: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    loadFeedback();
  }, []);

  useEffect(() => {
    let filtered = feedbacks;

    if (selectedDestination !== 'all') {
      filtered = filtered.filter(fb => fb.destinationId === selectedDestination);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(fb =>
        fb.destinationName.toLowerCase().includes(query) ||
        fb.content.toLowerCase().includes(query) ||
        fb.userName.toLowerCase().includes(query)
      );
    }

    setFilteredFeedbacks(filtered);
  }, [searchQuery, selectedDestination, feedbacks]);

  const loadFeedback = () => {
    const allFeedback = feedbackService.getAllFeedback();
    setFeedbacks(allFeedback);
  };

  const handleDestinationInput = async (value: string) => {
    setNewFeedbackDestination(value);
    
    if (value.trim()) {
      const destinations = await tripService.getDestinations();
      const suggestions = destinations
        .filter(d => d.name.toLowerCase().includes(value.toLowerCase()))
        .map(d => ({ id: d.id, name: d.name }))
        .slice(0, 5);
      setDestinationSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectDestination = (id: string, name: string) => {
    setNewFeedbackDestination(name);
    setNewFeedbackDestinationId(id);
    setShowSuggestions(false);
  };

  const handlePostFeedback = () => {
    if (!newFeedbackContent.trim() || !newFeedbackDestination.trim()) return;

    const destId = newFeedbackDestinationId || newFeedbackDestination.toLowerCase().replace(/\s+/g, '-');
    
    feedbackService.addFeedback(
      destId,
      newFeedbackDestination,
      newFeedbackContent,
      newFeedbackRating
    );

    setNewFeedbackContent('');
    setNewFeedbackDestination('');
    setNewFeedbackDestinationId('');
    setNewFeedbackRating(5);
    setShowNewPost(false);
    setShowSuggestions(false);
    loadFeedback();
  };

  const handleReply = (feedbackId: string) => {
    if (!replyContent.trim()) return;

    feedbackService.addReply(feedbackId, replyContent);
    setReplyContent('');
    setReplyingTo(null);
    loadFeedback();
  };

  const handleLike = (feedbackId: string) => {
    feedbackService.toggleLikeFeedback(feedbackId);
    loadFeedback();
  };

  const handleLikeReply = (feedbackId: string, replyId: string) => {
    feedbackService.toggleLikeReply(feedbackId, replyId);
    loadFeedback();
  };

  const toggleExpanded = (postId: string) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const destinations = feedbackService.getDestinationList();

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Community" showNotifications notificationCount={2} />
      
      <main className="pt-20 px-4 max-w-2xl mx-auto">
        {/* Search and Filter */}
        <div className="mb-4 space-y-3 animate-fade-in">
          <Input
            placeholder="Search destinations or feedback..."
            icon={Search}
            variant="filled"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedDestination('all')}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                selectedDestination === 'all'
                  ? "bg-gradient-sunset text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              All Destinations
            </button>
            {destinations.map(dest => (
              <button
                key={dest.id}
                onClick={() => setSelectedDestination(dest.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                  selectedDestination === dest.id
                    ? "bg-gradient-sunset text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {dest.name} ({dest.feedbackCount})
              </button>
            ))}
          </div>
        </div>

        {/* New Post Button */}
        <div className="mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Button
            variant="sunset"
            className="w-full"
            onClick={() => setShowNewPost(!showNewPost)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Share Your Experience
          </Button>
        </div>

        {/* New Post Form */}
        {showNewPost && (
          <Card variant="elevated" className="p-4 mb-4 animate-fade-in">
            <h3 className="font-display font-semibold text-foreground mb-3">
              Share Your Feedback
            </h3>
            
            <div className="space-y-3">
              <div className="relative">
                <Input
                  placeholder="Search destination..."
                  value={newFeedbackDestination}
                  onChange={(e) => handleDestinationInput(e.target.value)}
                  onFocus={() => newFeedbackDestination && setShowSuggestions(true)}
                  variant="filled"
                />
                
                {showSuggestions && destinationSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {destinationSuggestions.map((dest) => (
                      <button
                        key={dest.id}
                        onClick={() => handleSelectDestination(dest.id, dest.name)}
                        className="w-full px-4 py-2 text-left hover:bg-muted transition-colors flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-foreground">{dest.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <textarea
                placeholder="Share your experience..."
                value={newFeedbackContent}
                onChange={(e) => setNewFeedbackContent(e.target.value)}
                className="w-full p-3 rounded-lg border border-border bg-muted/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={4}
              />

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rating:</span>
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setNewFeedbackRating(rating)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={cn(
                        "h-6 w-6",
                        rating <= newFeedbackRating
                          ? "fill-sunset text-sunset"
                          : "text-muted-foreground"
                      )}
                    />
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowNewPost(false)} className="flex-1">
                  Cancel
                </Button>
                <Button variant="sunset" onClick={handlePostFeedback} className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Post
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Feedback Feed */}
        <div className="space-y-4">
          {filteredFeedbacks.length === 0 ? (
            <Card variant="gradient" className="p-12 text-center animate-fade-in">
              <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                No feedback yet
              </h3>
              <p className="text-sm text-muted-foreground">
                Be the first to share your experience!
              </p>
            </Card>
          ) : (
            filteredFeedbacks.map((feedback, index) => {
              const isExpanded = expandedPosts.has(feedback.id);
              const isLiked = feedback.likedBy.includes('current_user');

              return (
                <Card
                  key={feedback.id}
                  variant="elevated"
                  className="p-4 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar 
                      src={feedback.userAvatar} 
                      alt={feedback.userName} 
                      size="default"
                      onClick={() => navigate(`/profile/${feedback.userId}`)}
                      className="cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span 
                          className="font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
                          onClick={() => navigate(`/profile/${feedback.userId}`)}
                        >
                          {feedback.userName}
                        </span>
                        {feedback.rating && (
                          <div className="flex items-center gap-1">
                            {Array.from({ length: feedback.rating }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-sunset text-sunset" />
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => navigate(`/destination/${feedback.destinationId}`)}
                        className="text-sm text-primary hover:underline"
                      >
                        {feedback.destinationName}
                      </button>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(feedback.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-foreground mb-3 leading-relaxed">
                    {feedback.content}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-4 mb-3">
                    <button
                      onClick={() => handleLike(feedback.id)}
                      className={cn(
                        "flex items-center gap-1 text-sm transition-colors",
                        isLiked ? "text-primary" : "text-muted-foreground hover:text-primary"
                      )}
                    >
                      <ThumbsUp className={cn("h-4 w-4", isLiked && "fill-current")} />
                      <span>{feedback.likes}</span>
                    </button>

                    <button
                      onClick={() => toggleExpanded(feedback.id)}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>{feedback.replies.length}</span>
                    </button>

                    <button
                      onClick={() => setReplyingTo(feedback.id)}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Reply
                    </button>
                  </div>

                  {/* Reply Input */}
                  {replyingTo === feedback.id && (
                    <div className="mb-3 flex gap-2 animate-fade-in">
                      <Input
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        variant="filled"
                        className="flex-1"
                      />
                      <Button
                        variant="sunset"
                        size="sm"
                        onClick={() => handleReply(feedback.id)}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyContent('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  {/* Replies */}
                  {isExpanded && feedback.replies.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border space-y-3">
                      {feedback.replies.map(reply => {
                        const isReplyLiked = reply.likedBy.includes('current_user');
                        
                        return (
                          <div key={reply.id} className="flex gap-2 animate-fade-in">
                            <Avatar src={reply.userAvatar} alt={reply.userName} size="sm" />
                            <div className="flex-1">
                              <div className="bg-muted/50 rounded-lg p-3">
                                <p className="font-semibold text-sm text-foreground mb-1">
                                  {reply.userName}
                                </p>
                                <p className="text-sm text-foreground">{reply.content}</p>
                              </div>
                              <div className="flex items-center gap-3 mt-1 ml-1">
                                <button
                                  onClick={() => handleLikeReply(feedback.id, reply.id)}
                                  className={cn(
                                    "flex items-center gap-1 text-xs transition-colors",
                                    isReplyLiked
                                      ? "text-primary"
                                      : "text-muted-foreground hover:text-primary"
                                  )}
                                >
                                  <ThumbsUp className={cn("h-3 w-3", isReplyLiked && "fill-current")} />
                                  <span>{reply.likes}</span>
                                </button>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(reply.timestamp, { addSuffix: true })}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};
