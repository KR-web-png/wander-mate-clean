import { User, Destination, Trip, Match, Conversation, Message, Community, Notification } from '@/models';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'sarah@example.com',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    bio: 'Adventure seeker & photography enthusiast. Always looking for the next hidden gem! 🌍✨',
    location: 'San Francisco, CA',
    interests: ['Photography', 'Hiking', 'Local Cuisine', 'History'],
    travelStyle: 'adventure',
    languages: ['English', 'Mandarin', 'Spanish'],
    verificationStatus: 'fully_verified',
    joinedDate: new Date('2023-01-15'),
    tripsCompleted: 12,
    rating: 4.9,
    emergencyContact: {
      name: 'Michael Chen',
      phone: '+1-555-0123',
      relationship: 'Brother'
    }
  },
  {
    id: '2',
    email: 'alex@example.com',
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    bio: 'Digital nomad exploring one city at a time. Coffee addict ☕',
    location: 'Austin, TX',
    interests: ['Tech', 'Coffee Culture', 'Street Art', 'Nightlife'],
    travelStyle: 'cultural',
    languages: ['English', 'Portuguese'],
    verificationStatus: 'id_verified',
    joinedDate: new Date('2023-03-20'),
    tripsCompleted: 8,
    rating: 4.7
  },
  {
    id: '3',
    email: 'emma@example.com',
    name: 'Emma Thompson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    bio: 'Yoga instructor & wellness traveler. Finding peace in every corner 🧘‍♀️',
    location: 'London, UK',
    interests: ['Yoga', 'Wellness', 'Beach', 'Meditation'],
    travelStyle: 'relaxation',
    languages: ['English', 'French'],
    verificationStatus: 'fully_verified',
    joinedDate: new Date('2022-11-10'),
    tripsCompleted: 15,
    rating: 4.95
  },
  {
    id: '4',
    email: 'marcus@example.com',
    name: 'Marcus Johnson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    bio: 'Ex-backpacker turned travel blogger. Budget tips are my specialty! 💰',
    location: 'Denver, CO',
    interests: ['Budget Travel', 'Hostels', 'Street Food', 'Volunteering'],
    travelStyle: 'budget',
    languages: ['English', 'German', 'Thai'],
    verificationStatus: 'id_verified',
    joinedDate: new Date('2023-02-28'),
    tripsCompleted: 22,
    rating: 4.8
  }
];

// Mock Destinations
export const mockDestinations: Destination[] = [
  {
    id: '1',
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    description: 'Tropical paradise with stunning temples, rice terraces, and vibrant culture.',
    coordinates: { latitude: -8.4095, longitude: 115.1889 },
    rating: 4.8,
    popularActivities: ['Temple visits', 'Surfing', 'Yoga retreats', 'Rice terrace trekking'],
    bestTimeToVisit: 'April - October',
    averageCost: 'moderate',
    tags: ['Beach', 'Culture', 'Wellness', 'Adventure']
  },
  {
    id: '2',
    name: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    description: 'A mesmerizing blend of ancient tradition and cutting-edge technology.',
    coordinates: { latitude: 35.6762, longitude: 139.6503 },
    rating: 4.9,
    popularActivities: ['Temple hopping', 'Sushi tours', 'Cherry blossom viewing', 'Robot restaurant'],
    bestTimeToVisit: 'March - May, September - November',
    averageCost: 'expensive',
    tags: ['City', 'Culture', 'Food', 'Technology']
  },
  {
    id: '3',
    name: 'Barcelona',
    country: 'Spain',
    image: 'https://images.unsplash.com/photo-1583422409516-2f8f04b4e984?w=800',
    description: 'Architectural marvels, Mediterranean beaches, and incredible nightlife.',
    coordinates: { latitude: 41.3851, longitude: 2.1734 },
    rating: 4.7,
    popularActivities: ['Sagrada Familia', 'Beach days', 'Tapas tours', 'La Rambla strolls'],
    bestTimeToVisit: 'May - June, September - October',
    averageCost: 'moderate',
    tags: ['Beach', 'Architecture', 'Nightlife', 'Food']
  },
  {
    id: '4',
    name: 'Machu Picchu',
    country: 'Peru',
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800',
    description: 'Ancient Incan citadel set against breathtaking Andean peaks.',
    coordinates: { latitude: -13.1631, longitude: -72.5450 },
    rating: 4.95,
    popularActivities: ['Inca Trail trek', 'Sunrise viewing', 'Huayna Picchu climb', 'Cultural tours'],
    bestTimeToVisit: 'May - September',
    averageCost: 'moderate',
    tags: ['Adventure', 'History', 'Hiking', 'Photography']
  },
  {
    id: '5',
    name: 'Santorini',
    country: 'Greece',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800',
    description: 'Iconic white-washed buildings with stunning caldera views and magical sunsets.',
    coordinates: { latitude: 36.3932, longitude: 25.4615 },
    rating: 4.85,
    popularActivities: ['Sunset watching', 'Wine tasting', 'Boat tours', 'Village exploring'],
    bestTimeToVisit: 'April - November',
    averageCost: 'luxury',
    tags: ['Romantic', 'Beach', 'Photography', 'Relaxation']
  },
  {
    id: '6',
    name: 'Iceland',
    country: 'Iceland',
    image: 'https://images.unsplash.com/photo-1520769945061-0a448c463865?w=800',
    description: 'Land of fire and ice with Northern Lights, glaciers, and hot springs.',
    coordinates: { latitude: 64.9631, longitude: -19.0208 },
    rating: 4.9,
    popularActivities: ['Northern Lights', 'Blue Lagoon', 'Glacier hiking', 'Whale watching'],
    bestTimeToVisit: 'June - August (summer), September - March (auroras)',
    averageCost: 'expensive',
    tags: ['Adventure', 'Nature', 'Photography', 'Unique']
  }
];

// Mock Trips
export const mockTrips: Trip[] = [
  {
    id: '1',
    title: 'Bali Adventure: Temples & Beaches',
    destination: mockDestinations[0],
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-03-25'),
    budget: { min: 1500, max: 2500, currency: 'USD' },
    maxCompanions: 4,
    currentCompanions: [mockUsers[1]],
    organizer: mockUsers[0],
    description: 'Join me for an incredible 10-day adventure exploring the best of Bali! We\'ll visit ancient temples, surf at beginner-friendly beaches, and discover hidden waterfalls.',
    activities: ['Temple visits', 'Surfing lessons', 'Rice terrace trek', 'Waterfall swimming'],
    status: 'open',
    isPublic: true,
    itinerary: [
      { id: '1', day: 1, time: '10:00', title: 'Arrival & Check-in', description: 'Settle into our villa in Ubud', location: 'Ubud' },
      { id: '2', day: 2, time: '06:00', title: 'Tegallalang Rice Terraces', description: 'Sunrise hike through famous terraces', location: 'Tegallalang' },
      { id: '3', day: 3, time: '08:00', title: 'Tirta Empul Temple', description: 'Traditional purification ceremony', location: 'Tampaksiring' }
    ]
  },
  {
    id: '2',
    title: 'Tokyo Culture & Food Tour',
    destination: mockDestinations[1],
    startDate: new Date('2024-04-05'),
    endDate: new Date('2024-04-12'),
    budget: { min: 2000, max: 3500, currency: 'USD' },
    maxCompanions: 3,
    currentCompanions: [],
    organizer: mockUsers[2],
    description: 'Experience the magic of cherry blossom season in Tokyo! We\'ll explore traditional temples, try amazing street food, and experience the unique Japanese culture.',
    activities: ['Cherry blossom viewing', 'Sushi making class', 'Temple visits', 'Shibuya exploration'],
    status: 'open',
    isPublic: true
  },
  {
    id: '3',
    title: 'Machu Picchu Trek',
    destination: mockDestinations[3],
    startDate: new Date('2024-05-10'),
    endDate: new Date('2024-05-18'),
    budget: { min: 1800, max: 2800, currency: 'USD' },
    maxCompanions: 6,
    currentCompanions: [mockUsers[0], mockUsers[3]],
    organizer: mockUsers[1],
    description: 'The ultimate bucket list adventure! We\'ll hike the classic Inca Trail to reach the ancient citadel at sunrise. Physical fitness required.',
    activities: ['Inca Trail trek', 'Camping', 'Cultural visits', 'Photography'],
    status: 'open',
    isPublic: true
  }
];

// Mock Matches
export const mockMatches: Match[] = [
  {
    id: '1',
    user: mockUsers[1],
    compatibilityScore: 92,
    sharedInterests: ['Photography', 'Local Cuisine'],
    sharedDestinations: ['Bali', 'Tokyo'],
    matchedTrips: [mockTrips[0]],
    status: 'pending',
    matchedAt: new Date()
  },
  {
    id: '2',
    user: mockUsers[2],
    compatibilityScore: 87,
    sharedInterests: ['Beach', 'Wellness'],
    sharedDestinations: ['Bali', 'Santorini'],
    matchedTrips: [],
    status: 'connected',
    matchedAt: new Date(Date.now() - 86400000 * 3)
  },
  {
    id: '3',
    user: mockUsers[3],
    compatibilityScore: 78,
    sharedInterests: ['Budget Travel', 'Hiking'],
    sharedDestinations: ['Machu Picchu'],
    matchedTrips: [mockTrips[2]],
    status: 'accepted',
    matchedAt: new Date(Date.now() - 86400000 * 7)
  }
];

// Mock Conversations
export const mockConversations: Conversation[] = [
  {
    id: '1',
    type: 'direct',
    participants: [mockUsers[0], mockUsers[2]],
    lastMessage: {
      id: 'm1',
      senderId: mockUsers[2].id,
      content: 'That sounds amazing! I\'d love to join your Bali trip 🌴',
      timestamp: new Date(Date.now() - 3600000),
      type: 'text',
      status: 'read'
    },
    unreadCount: 0
  },
  {
    id: '2',
    type: 'group',
    participants: [mockUsers[0], mockUsers[1], mockUsers[3]],
    lastMessage: {
      id: 'm2',
      senderId: mockUsers[1].id,
      content: 'Just booked our flights! See you all in Peru 🎉',
      timestamp: new Date(Date.now() - 7200000),
      type: 'text',
      status: 'delivered'
    },
    unreadCount: 2,
    tripId: mockTrips[2].id,
    name: 'Machu Picchu Crew',
    avatar: mockDestinations[3].image
  }
];

// Mock Communities
export const mockCommunities: Community[] = [
  {
    id: '1',
    name: 'Solo Female Travelers',
    description: 'A supportive community for women traveling alone. Share tips, find companions, and stay safe!',
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=400',
    memberCount: 12500,
    category: 'women_only',
    isPrivate: false,
    createdAt: new Date('2022-01-01'),
    organizers: [mockUsers[0], mockUsers[2]]
  },
  {
    id: '2',
    name: 'Digital Nomads Hub',
    description: 'Connect with remote workers exploring the world. Coworking spots, visa tips, and more!',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
    memberCount: 8700,
    category: 'digital_nomads',
    isPrivate: false,
    createdAt: new Date('2022-06-15'),
    organizers: [mockUsers[1]]
  },
  {
    id: '3',
    name: 'Budget Backpackers',
    description: 'Travel more for less! Share budget tips, cheap flights, and affordable destinations.',
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=400',
    memberCount: 15300,
    category: 'budget',
    isPrivate: false,
    createdAt: new Date('2021-09-20'),
    organizers: [mockUsers[3]]
  }
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'match',
    title: 'New Match!',
    message: 'You matched with Alex Rivera - 92% compatibility!',
    timestamp: new Date(Date.now() - 1800000),
    isRead: false,
    relatedId: mockMatches[0].id
  },
  {
    id: '2',
    type: 'trip_update',
    title: 'Trip Update',
    message: 'Marcus joined your Machu Picchu trip!',
    timestamp: new Date(Date.now() - 86400000),
    isRead: true,
    relatedId: mockTrips[2].id
  },
  {
    id: '3',
    type: 'message',
    title: 'New Message',
    message: 'Emma sent you a message about Bali',
    timestamp: new Date(Date.now() - 3600000),
    isRead: false,
    relatedId: mockConversations[0].id
  }
];

// Current user (logged in)
export const currentUser = mockUsers[0];
