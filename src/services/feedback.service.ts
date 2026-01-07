import { currentUser } from './mock.data';

export interface Feedback {
  id: string;
  destinationId: string;
  destinationName: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  rating?: number;
  images?: string[];
  timestamp: Date;
  likes: number;
  likedBy: string[];
  replies: Reply[];
}

export interface Reply {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
  likes: number;
  likedBy: string[];
}

const FEEDBACK_KEY = 'community_feedback';

// Mock initial feedback data
const mockFeedback: Feedback[] = [
  {
    id: 'fb1',
    destinationId: 'sigiriya',
    destinationName: 'Sigiriya Rock Fortress',
    userId: 'user1',
    userName: 'Sarah Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    content: 'Absolutely breathtaking! The climb is challenging but totally worth it. Start early in the morning to avoid the heat. The frescoes are stunning!',
    rating: 5,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    likes: 24,
    likedBy: ['user2', 'user3'],
    replies: [
      {
        id: 'r1',
        userId: 'user2',
        userName: 'Mike Chen',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        content: 'How long did the climb take you?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        likes: 3,
        likedBy: ['user1']
      },
      {
        id: 'r2',
        userId: 'user1',
        userName: 'Sarah Johnson',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
        content: 'About 2 hours including photo stops!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20),
        likes: 2,
        likedBy: ['user2']
      }
    ]
  },
  {
    id: 'fb2',
    destinationId: 'nine-arch',
    destinationName: 'Nine Arch Bridge',
    userId: 'user3',
    userName: 'Priya Kumar',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    content: 'Perfect spot for photography! Go during the train passing time for amazing shots. The walk through tea plantations is beautiful.',
    rating: 5,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    likes: 18,
    likedBy: ['user1'],
    replies: []
  },
  {
    id: 'fb3',
    destinationId: 'galle-fort',
    destinationName: 'Galle Fort',
    userId: 'user4',
    userName: 'David Wilson',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    content: 'Great historical site with amazing sunset views. The Dutch Reformed Church and lighthouse are must-visits. Lots of cafes and shops inside the fort.',
    rating: 4,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    likes: 31,
    likedBy: ['user1', 'user2', 'user3'],
    replies: [
      {
        id: 'r3',
        userId: 'user5',
        userName: 'Emma Brown',
        userAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop',
        content: 'Which cafe would you recommend?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
        likes: 1,
        likedBy: []
      }
    ]
  },
  {
    id: 'fb4',
    destinationId: 'mirissa',
    destinationName: 'Mirissa Beach',
    userId: 'user5',
    userName: 'Emma Brown',
    userAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop',
    content: 'Best beach in Sri Lanka! Crystal clear water, great for surfing. The whale watching tour is absolutely incredible - we saw blue whales!',
    rating: 5,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    likes: 42,
    likedBy: ['user1', 'user2'],
    replies: []
  }
];

export const feedbackService = {
  // Initialize with mock data if localStorage is empty
  initialize(): void {
    const stored = localStorage.getItem(FEEDBACK_KEY);
    if (!stored) {
      localStorage.setItem(FEEDBACK_KEY, JSON.stringify(mockFeedback));
    }
  },

  // Get all feedback
  getAllFeedback(): Feedback[] {
    this.initialize();
    try {
      const stored = localStorage.getItem(FEEDBACK_KEY);
      const feedback: Feedback[] = stored ? JSON.parse(stored) : mockFeedback;
      // Convert string dates back to Date objects
      return feedback.map(fb => ({
        ...fb,
        timestamp: new Date(fb.timestamp),
        replies: fb.replies.map(r => ({ ...r, timestamp: new Date(r.timestamp) }))
      }));
    } catch (error) {
      console.error('Error loading feedback:', error);
      return mockFeedback;
    }
  },

  // Get feedback for specific destination
  getFeedbackByDestination(destinationId: string): Feedback[] {
    return this.getAllFeedback().filter(fb => fb.destinationId === destinationId);
  },

  // Search feedback by destination name
  searchFeedback(query: string): Feedback[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllFeedback().filter(fb => 
      fb.destinationName.toLowerCase().includes(lowerQuery) ||
      fb.content.toLowerCase().includes(lowerQuery)
    );
  },

  // Add new feedback
  addFeedback(destinationId: string, destinationName: string, content: string, rating?: number): Feedback {
    const allFeedback = this.getAllFeedback();
    
    const newFeedback: Feedback = {
      id: 'fb' + Date.now(),
      destinationId,
      destinationName,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      rating,
      timestamp: new Date(),
      likes: 0,
      likedBy: [],
      replies: []
    };

    allFeedback.unshift(newFeedback);
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(allFeedback));
    
    return newFeedback;
  },

  // Add reply to feedback
  addReply(feedbackId: string, content: string): void {
    const allFeedback = this.getAllFeedback();
    const feedbackIndex = allFeedback.findIndex(fb => fb.id === feedbackId);
    
    if (feedbackIndex !== -1) {
      const newReply: Reply = {
        id: 'r' + Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        content,
        timestamp: new Date(),
        likes: 0,
        likedBy: []
      };

      allFeedback[feedbackIndex].replies.push(newReply);
      localStorage.setItem(FEEDBACK_KEY, JSON.stringify(allFeedback));
    }
  },

  // Toggle like on feedback
  toggleLikeFeedback(feedbackId: string): void {
    const allFeedback = this.getAllFeedback();
    const feedbackIndex = allFeedback.findIndex(fb => fb.id === feedbackId);
    
    if (feedbackIndex !== -1) {
      const feedback = allFeedback[feedbackIndex];
      const likedIndex = feedback.likedBy.indexOf(currentUser.id);
      
      if (likedIndex > -1) {
        feedback.likedBy.splice(likedIndex, 1);
        feedback.likes--;
      } else {
        feedback.likedBy.push(currentUser.id);
        feedback.likes++;
      }

      localStorage.setItem(FEEDBACK_KEY, JSON.stringify(allFeedback));
    }
  },

  // Toggle like on reply
  toggleLikeReply(feedbackId: string, replyId: string): void {
    const allFeedback = this.getAllFeedback();
    const feedback = allFeedback.find(fb => fb.id === feedbackId);
    
    if (feedback) {
      const reply = feedback.replies.find(r => r.id === replyId);
      
      if (reply) {
        const likedIndex = reply.likedBy.indexOf(currentUser.id);
        
        if (likedIndex > -1) {
          reply.likedBy.splice(likedIndex, 1);
          reply.likes--;
        } else {
          reply.likedBy.push(currentUser.id);
          reply.likes++;
        }

        localStorage.setItem(FEEDBACK_KEY, JSON.stringify(allFeedback));
      }
    }
  },

  // Get unique destinations from feedback
  getDestinationList(): Array<{ id: string; name: string; feedbackCount: number }> {
    const feedback = this.getAllFeedback();
    const destinationMap = new Map<string, { name: string; count: number }>();

    feedback.forEach(fb => {
      const existing = destinationMap.get(fb.destinationId);
      if (existing) {
        existing.count++;
      } else {
        destinationMap.set(fb.destinationId, { name: fb.destinationName, count: 1 });
      }
    });

    return Array.from(destinationMap.entries()).map(([id, data]) => ({
      id,
      name: data.name,
      feedbackCount: data.count
    }));
  }
};
