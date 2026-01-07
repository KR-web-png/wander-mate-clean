// User Model
export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  bio: string;
  location: string;
  interests: string[];
  travelStyle: TravelStyle;
  languages: string[];
  verificationStatus: VerificationStatus;
  joinedDate: Date;
  tripsCompleted: number;
  rating: number;
  emergencyContact?: EmergencyContact;
}

export type TravelStyle = 'adventure' | 'relaxation' | 'cultural' | 'budget' | 'luxury' | 'solo' | 'group';
export type VerificationStatus = 'unverified' | 'email_verified' | 'id_verified' | 'fully_verified';

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

// Destination Model
export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  images?: string[]; // Multiple images for detail view
  address?: string; // Physical address
  description: string;
  coordinates: Coordinates;
  rating: number;
  popularActivities: string[];
  bestTimeToVisit: string;
  averageCost: CostLevel;
  tags: string[];
}

export type CostLevel = 'budget' | 'moderate' | 'expensive' | 'luxury';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Trip Model
export interface Trip {
  id: string;
  title: string;
  destination: Destination;
  startDate: Date;
  endDate: Date;
  budget: BudgetRange;
  maxCompanions: number;
  currentCompanions: User[];
  organizer: User;
  description: string;
  activities: string[];
  status: TripStatus;
  isPublic: boolean;
  itinerary?: ItineraryItem[];
}

export type TripStatus = 'planning' | 'open' | 'full' | 'in_progress' | 'completed' | 'cancelled';

export interface BudgetRange {
  min: number;
  max: number;
  currency: string;
}

export interface ItineraryItem {
  id: string;
  day: number;
  time: string;
  title: string;
  description: string;
  location: string;
  coordinates?: Coordinates;
}

// Match Model
export interface Match {
  id: string;
  user: User;
  compatibilityScore: number;
  sharedInterests: string[];
  sharedDestinations: string[];
  matchedTrips: Trip[];
  status: MatchStatus;
  matchedAt: Date;
}

export type MatchStatus = 'pending' | 'accepted' | 'declined' | 'connected';

// Message Model
export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: MessageType;
  status: MessageStatus;
  attachments?: Attachment[];
}

export type MessageType = 'text' | 'image' | 'location' | 'trip_invite';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface Attachment {
  id: string;
  type: 'image' | 'document' | 'location';
  url: string;
  name?: string;
}

// Chat/Conversation Model
export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  tripId?: string;
  name?: string;
  avatar?: string;
}

// Payment Model
export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  type: PaymentType;
  tripId?: string;
  payerId: string;
  receiverId?: string;
  timestamp: Date;
  description: string;
  method: PaymentMethod;
}

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type PaymentType = 'trip_booking' | 'activity' | 'split_expense' | 'community_event';
export type PaymentMethod = 'card' | 'nfc' | 'wallet';

// Location Model
export interface LocationData {
  coordinates: Coordinates;
  address: string;
  city: string;
  country: string;
  timestamp: Date;
  accuracy: number;
}

// Community/Group Model
export interface Community {
  id: string;
  name: string;
  description: string;
  image: string;
  memberCount: number;
  category: CommunityCategory;
  isPrivate: boolean;
  createdAt: Date;
  organizers: User[];
}

export type CommunityCategory = 'adventure' | 'cultural' | 'solo_travelers' | 'budget' | 'luxury' | 'women_only' | 'seniors' | 'digital_nomads';

// Notification Model
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  relatedId?: string;
}

export type NotificationType = 'match' | 'message' | 'trip_update' | 'payment' | 'safety_alert' | 'community';
