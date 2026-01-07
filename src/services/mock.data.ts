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
    name: 'Sigiriya',
    country: 'Dambulla',
    image: 'https://res.cloudinary.com/jerrick/image/upload/d_642250b563292b35f27461a7.png,f_jpg,fl_progressive,q_auto,w_1024/65564eabecaa89001dc39525.jpg',
    images: [
      'https://res.cloudinary.com/jerrick/image/upload/d_642250b563292b35f27461a7.png,f_jpg,fl_progressive,q_auto,w_1024/65564eabecaa89001dc39525.jpg',
      'https://d104tpg70nvstz.cloudfront.net/sites/2/2024/08/Sigiriya-Uncovered-Delving-into-the-History-Art-and-Legends-800x609-1.jpg',
      'https://chasinggambozinos.com/wp-content/uploads/climb-sigiriya-rock.jpg'
    ],
    address: 'Sigiriya Rock Fortress, Sigiriya 21120, Sri Lanka',
    description: 'Rising dramatically from the jungle, Sigiriya is an ancient rock fortress crowned with royal ruins, breathtaking views, and timeless frescoes - a true wonder of Sri Lanka.',
    coordinates: { latitude: 7.9570, longitude: 80.6520 },
    rating: 9.5,
    popularActivities: ['Rock Fortress', 'neighboring Pidurangala rock for sun rise view', 'Wild Life Safari', 'Visits to Dambulla Cave Temple'],
    bestTimeToVisit: 'April - October',
    averageCost: 'moderate',
    tags: ['Ancient', 'Culture', 'Wellness', 'Adventure']
  },
  {
    id: '2',
    name: 'Nine Arch bridge',
    country: 'Ella',
    image: 'https://www.orienthotelsl.com/wp-content/uploads/2023/01/Nine-Arch-Bridge-Ella-1200x630-1.jpg',
    images: [
      'https://www.orienthotelsl.com/wp-content/uploads/2023/01/Nine-Arch-Bridge-Ella-1200x630-1.jpg',
      'https://www.laurewanders.com/wp-content/uploads/2023/11/Nine-Arch-Bridge-Ella-00006.jpg',
      'https://www.greenholidaytravels.com/wp-content/uploads/2025/11/DSC03623-2-scaled-1-1024x768.webp'
    ],
    address: 'Nine Arch Bridge, Demodara Road, Ella 90090, Sri Lanka',
    description: 'Hidden among misty tea plantations, the Nine Arch Bridge is a stunning colonial-era masterpiece where trains glide through lush green hills.',
    coordinates: { latitude: 6.8731, longitude: 81.0416 },
    rating: 9.0,
    popularActivities: ['colonial architecture', 'hiking through scenic routes', 'exploring nearby waterfalls', 'taking iconic photos'],
    bestTimeToVisit: 'March - May, September - November',
    averageCost: 'expensive',
    tags: ['City', 'Culture', 'Food', 'Technology']
  },
  {
    id: '3',
    name: 'Galle Fort',
    country: 'Galle',
    image: 'https://do6raq9h04ex.cloudfront.net/sites/8/2021/07/galle-fort-1050x700-1.jpg',
    images: [
      'https://do6raq9h04ex.cloudfront.net/sites/8/2021/07/galle-fort-1050x700-1.jpg',
      'https://slrailwayforum.com/content/images/2023/04/Galle-Fort.jpg',
      'https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/16/cc/41.jpg'
    ],
    address: 'Church Street, Galle Fort, Galle 80000, Sri Lanka',
    description: 'A charming blend of history and coastal beauty, Galle Fort features cobbled streets, colonial architecture, and ocean views shaped by centuries of trade and culture.',
    coordinates: { latitude: 6.0305, longitude: 80.2170 },
    rating: 8.5,
    popularActivities: ['Sagrada Familia', 'Beach days', 'Tapas tours', 'La Rambla strolls'],
    bestTimeToVisit: 'May - June, September - October',
    averageCost: 'moderate',
    tags: ['Beach', 'Architecture', 'Nightlife', 'Food']
  },
  {
    id: '4',
    name: 'Mirissa Beach',
    country: 'Sri Lanka',
    image: 'https://bhlankatours.com/wp-content/uploads/2024/01/Mirissa-820x520-1.jpg',
    images: [
      'https://bhlankatours.com/wp-content/uploads/2024/01/Mirissa-820x520-1.jpg',
      'https://travelrebels.com/wp-content/uploads/2024/03/secret-beach-mirissa-1.jpg',
      'https://static.vecteezy.com/system/resources/previews/045/959/299/large_2x/beautiful-colorful-sunset-on-the-beach-mirissa-beach-sri-lanka-photo.jpg'
    ],
    address: 'Mirissa Beach, Matara 81740, Sri Lanka',
    description: 'With golden sands, turquoise waters, and epic sunsets, Mirissa Beach is the perfect tropical escape—famous for whale watching and laid-back vibes.',
    coordinates: { latitude: 5.9483, longitude: 80.4716},
    rating: 7.5,
    popularActivities: ['Whale watching', 'Surfing', 'Beach parties', 'Seafood dining'],
    bestTimeToVisit: 'May - September',
    averageCost: 'moderate',
    tags: ['Beach', 'Wildlife', 'Adventure', 'Relaxation']
  },
  {
    id: '5',
    name: 'Anuradhapura',
    country: 'Sri Lanka',
    image: 'https://d1bv4heaa2n05k.cloudfront.net/user-images/1533888386047/shutterstock-307224302_destinationMain_1533888398803.jpeg',
    images: [
      'https://d1bv4heaa2n05k.cloudfront.net/user-images/1533888386047/shutterstock-307224302_destinationMain_1533888398803.jpeg',
      'https://travelrebels.com/wp-content/uploads/2018/06/anuradhapura-sunset.jpg',
      'https://www.talesofceylon.com/wp-content/uploads/2020/04/Anuradhapura-Tale-800x520-1.jpg'
    ],
    address: 'Sacred City of Anuradhapura, Anuradhapura 50000, Sri Lanka',
    description: 'One of the world oldest living cities, Anuradhapura is a sacred land of ancient stupas, serene monasteries, and deep spiritual heritage.',
    coordinates: { latitude: 8.3114, longitude: 80.4037},
    rating: 4.85,
    popularActivities: ['Exploring ancient ruins', 'Visiting sacred temples', 'Cycling tours', 'Wildlife spotting in nearby parks'],
    bestTimeToVisit: 'April - November',
    averageCost: 'budget',
    tags: ['History', 'Culture', 'Spirituality', 'Nature']
  },
  {
    id: '6',
    name: 'Polonnaruwa',
    country: 'Sri Lanka',
    image: 'https://media-cdn.tripadvisor.com/media/photo-s/1a/a8/88/4e/polonnaruwa-famous-for.jpg',
    images: [
      'https://media-cdn.tripadvisor.com/media/photo-s/1a/a8/88/4e/polonnaruwa-famous-for.jpg',
      'https://www.onthegotours.com/repository/ThePolonnaruwaVatadage-857341721661428.jpg',
      'https://www.travellankaconnection.com/images/destinations/gallery_Polonnaruwa.jpg'
    ],
    address: 'Ancient City of Polonnaruwa, Polonnaruwa 51000, Sri Lanka',
    description: 'A beautifully preserved medieval capital, Polonnaruwa showcases majestic stone temples, royal palaces, and impressive ancient engineering.',
    coordinates: { latitude:7.9147 , longitude: 81.0000 },
    rating: 4.9,
    popularActivities: ['Exploring ancient ruins', 'Visiting temples and statues', 'Cycling tours', 'Wildlife spotting in nearby parks'],
    bestTimeToVisit: 'April - November',
    averageCost:'budget',
    tags: ['History', 'Culture', 'Adventure', 'Nature']
  }
];

// Mock Trips
export const mockTrips: Trip[] = [
  {
    id: '1',
    title:'Sigiriya Cultural & Nature Escape',
    destination: mockDestinations[0],
    startDate: new Date('2024-07-10'),
    endDate: new Date('2024-07-20'),
    budget: { min: 800, max: 1400, currency: 'USD' },
    maxCompanions: 4,
    currentCompanions: [mockUsers[1]],
    organizer: mockUsers[0],
    description: 'Explore the rich culture and stunning landscapes of Sri Lanka! From ancient rock fortresses to lush rice terraces, this trip offers a perfect blend of adventure and relaxation.',
    activities: ['Rock Fortress visit', 'Rice Terrace hike', 'Wildlife Safari', 'Cultural tours'],
    status: 'open',
    isPublic: true,
    itinerary: [
      { id: '1', day: 1, time: '10:00', title: 'Arrival & Check-in', description: 'Settle into our villa in Sigiriya', location: 'Sigiriya' },
      { id: '2', day: 2, time: '06:00', title: 'Pidurangala Sunrise Hike', description: 'Early morning hike for panoramic sunrise views of Sigiriya Rock', location:'Pidurangala' },
      { id: '3', day: 3, time: '08:00', title: 'Sigiriya Rock Fortress', description: 'Explore the ancient UNESCO World Heritage Site', location: 'Sigiriya' }
    ]
  },
  {
    id: '2',
    title: 'Ella Scenic Nature & Heritage Trip',
    destination: mockDestinations[1],
    startDate: new Date('2024-04-05'),
    endDate: new Date('2024-04-12'),
    budget: { min: 600, max: 1200, currency: 'USD' },
    maxCompanions: 3,
    currentCompanions: [],
    organizer: mockUsers[2],
    description: 'Experience the cool-climate charm of Ella with scenic hikes, iconic railway views, waterfalls, and relaxed mountain-town vibes centered around the famous Nine Arch Bridge.',
    activities: ['Nine Arch Bridge visit','Scenic hiking trails','Waterfall exploration','Photography sessions','Train spotting'],
    status: 'open',
    isPublic: true
  },
  {
    id: '3',
    title: 'Galle Fort & Coastal Adventure',
    destination: mockDestinations[3],
    startDate: new Date('2024-06-15'),
    endDate: new Date('2024-06-22'),
    budget: { min: 700, max: 1300, currency: 'USD' },
    maxCompanions: 6,
    currentCompanions: [mockUsers[0], mockUsers[3]],
    organizer: mockUsers[1],
    description: 'Explore the historic Galle Fort and enjoy coastal adventures including beach visits, seafood dining, and water sports.',
    activities: ['Galle Fort tour', 'Beach visits', 'Seafood dining', 'Water sports'],
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
