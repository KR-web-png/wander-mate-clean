import { currentUser } from './mock.data';
import { User } from '@/models';

export interface TravelMateRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: Date;
}

const TRAVEL_MATES_KEY = 'travel_mates';
const REQUESTS_KEY = 'travel_mate_requests';

// Mock users for travel mates
const mockUsers: Partial<User>[] = [
  {
    id: 'user1',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    bio: 'Adventure seeker and beach lover',
    location: 'Colombo, Sri Lanka',
    interests: ['Beach', 'Adventure', 'Photography'],
    travelStyle: 'adventure',
    languages: ['English', 'Sinhala']
  },
  {
    id: 'user2',
    name: 'Mike Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    bio: 'Cultural explorer and food enthusiast',
    location: 'Kandy, Sri Lanka',
    interests: ['Culture', 'Food', 'History'],
    travelStyle: 'cultural',
    languages: ['English', 'Tamil']
  },
  {
    id: 'user3',
    name: 'Priya Kumar',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    bio: 'Nature photographer and hiking enthusiast',
    location: 'Ella, Sri Lanka',
    interests: ['Nature', 'Photography', 'Hiking'],
    travelStyle: 'adventure',
    languages: ['English', 'Tamil', 'Sinhala']
  },
  {
    id: 'user4',
    name: 'David Wilson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    bio: 'History buff and architecture lover',
    location: 'Galle, Sri Lanka',
    interests: ['History', 'Culture', 'Photography'],
    travelStyle: 'cultural',
    languages: ['English']
  },
  {
    id: 'user5',
    name: 'Emma Brown',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop',
    bio: 'Beach bum and water sports enthusiast',
    location: 'Mirissa, Sri Lanka',
    interests: ['Beach', 'Sports', 'Diving'],
    travelStyle: 'relaxation',
    languages: ['English', 'Sinhala']
  }
];

export const travelMatesService = {
  // Get all accepted travel mates
  getTravelMates(): string[] {
    try {
      const stored = localStorage.getItem(TRAVEL_MATES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading travel mates:', error);
      return [];
    }
  },

  // Get all requests
  getAllRequests(): TravelMateRequest[] {
    try {
      const stored = localStorage.getItem(REQUESTS_KEY);
      const requests: TravelMateRequest[] = stored ? JSON.parse(stored) : [];
      return requests.map(req => ({ ...req, timestamp: new Date(req.timestamp) }));
    } catch (error) {
      console.error('Error loading requests:', error);
      return [];
    }
  },

  // Get incoming requests (received by current user)
  getIncomingRequests(): TravelMateRequest[] {
    return this.getAllRequests().filter(
      req => req.receiverId === currentUser.id && req.status === 'pending'
    );
  },

  // Get outgoing requests (sent by current user)
  getOutgoingRequests(): TravelMateRequest[] {
    return this.getAllRequests().filter(
      req => req.senderId === currentUser.id && req.status === 'pending'
    );
  },

  // Send travel mate request
  sendRequest(userId: string, userName: string, userAvatar: string): void {
    const requests = this.getAllRequests();
    
    // Check if request already exists
    const existing = requests.find(
      req => (req.senderId === currentUser.id && req.receiverId === userId) ||
             (req.senderId === userId && req.receiverId === currentUser.id)
    );

    if (existing) return;

    const newRequest: TravelMateRequest = {
      id: 'req_' + Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      receiverId: userId,
      status: 'pending',
      timestamp: new Date()
    };

    requests.push(newRequest);
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
  },

  // Accept travel mate request
  acceptRequest(requestId: string): void {
    const requests = this.getAllRequests();
    const requestIndex = requests.findIndex(req => req.id === requestId);

    if (requestIndex !== -1) {
      const request = requests[requestIndex];
      request.status = 'accepted';

      // Add to travel mates
      const mates = this.getTravelMates();
      if (!mates.includes(request.senderId)) {
        mates.push(request.senderId);
        localStorage.setItem(TRAVEL_MATES_KEY, JSON.stringify(mates));
      }

      localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
    }
  },

  // Reject travel mate request
  rejectRequest(requestId: string): void {
    const requests = this.getAllRequests();
    const filtered = requests.filter(req => req.id !== requestId);
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(filtered));
  },

  // Remove travel mate
  removeTravelMate(userId: string): void {
    const mates = this.getTravelMates();
    const filtered = mates.filter(id => id !== userId);
    localStorage.setItem(TRAVEL_MATES_KEY, JSON.stringify(filtered));
  },

  // Check if already travel mates
  isTravelMate(userId: string): boolean {
    return this.getTravelMates().includes(userId);
  },

  // Check if request pending
  hasRequestPending(userId: string): boolean {
    const requests = this.getAllRequests();
    return requests.some(
      req => req.status === 'pending' &&
             ((req.senderId === currentUser.id && req.receiverId === userId) ||
              (req.senderId === userId && req.receiverId === currentUser.id))
    );
  },

  // Get user by ID (mock data)
  getUserById(userId: string): Partial<User> | undefined {
    return mockUsers.find(u => u.id === userId);
  },

  // Get all users except current user
  getAllUsers(): Partial<User>[] {
    return mockUsers.filter(u => u.id !== currentUser.id);
  }
};
