import { Trip, Destination, TripStatus, BudgetRange, ItineraryItem } from '@/models';
import { mockTrips, mockDestinations, currentUser } from './mock.data';

export interface TripFilters {
  destination?: string;
  startDate?: Date;
  endDate?: Date;
  budgetMin?: number;
  budgetMax?: number;
  activities?: string[];
  status?: TripStatus;
}

export interface CreateTripData {
  title: string;
  destinationId: string;
  startDate: Date;
  endDate: Date;
  budget: BudgetRange;
  maxCompanions: number;
  description: string;
  activities: string[];
  isPublic: boolean;
}

export const tripService = {
  // Get all trips
  async getTrips(filters?: TripFilters): Promise<Trip[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let trips = [...mockTrips];
    
    if (filters?.destination) {
      trips = trips.filter(t => 
        t.destination.name.toLowerCase().includes(filters.destination!.toLowerCase())
      );
    }
    
    if (filters?.status) {
      trips = trips.filter(t => t.status === filters.status);
    }
    
    if (filters?.budgetMax) {
      trips = trips.filter(t => t.budget.max <= filters.budgetMax!);
    }
    
    return trips;
  },

  // Get trip by ID
  async getTripById(tripId: string): Promise<Trip | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTrips.find(t => t.id === tripId) || null;
  },

  // Get user's trips
  async getUserTrips(userId?: string): Promise<Trip[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const uid = userId || currentUser.id;
    
    return mockTrips.filter(t => 
      t.organizer.id === uid || t.currentCompanions.some(c => c.id === uid)
    );
  },

  // Get all destinations
  async getDestinations(): Promise<Destination[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockDestinations;
  },

  // Get destination by ID
  async getDestinationById(destinationId: string): Promise<Destination | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockDestinations.find(d => d.id === destinationId) || null;
  },

  // Search destinations
  async searchDestinations(query: string): Promise<Destination[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const lowercaseQuery = query.toLowerCase();
    return mockDestinations.filter(d => 
      d.name.toLowerCase().includes(lowercaseQuery) ||
      d.country.toLowerCase().includes(lowercaseQuery) ||
      d.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  },

  // Create a new trip
  async createTrip(data: CreateTripData): Promise<Trip> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const destination = mockDestinations.find(d => d.id === data.destinationId);
    if (!destination) {
      throw new Error('Destination not found');
    }
    
    const newTrip: Trip = {
      id: 'trip_' + Date.now(),
      title: data.title,
      destination,
      startDate: data.startDate,
      endDate: data.endDate,
      budget: data.budget,
      maxCompanions: data.maxCompanions,
      currentCompanions: [],
      organizer: currentUser,
      description: data.description,
      activities: data.activities,
      status: 'open',
      isPublic: data.isPublic,
      itinerary: []
    };
    
    mockTrips.push(newTrip);
    return newTrip;
  },

  // Join a trip
  async joinTrip(tripId: string): Promise<Trip | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const trip = mockTrips.find(t => t.id === tripId);
    if (!trip) return null;
    
    if (trip.currentCompanions.length >= trip.maxCompanions) {
      throw new Error('Trip is full');
    }
    
    if (!trip.currentCompanions.some(c => c.id === currentUser.id)) {
      trip.currentCompanions.push(currentUser);
    }
    
    if (trip.currentCompanions.length >= trip.maxCompanions) {
      trip.status = 'full';
    }
    
    return trip;
  },

  // Leave a trip
  async leaveTrip(tripId: string): Promise<Trip | null> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const trip = mockTrips.find(t => t.id === tripId);
    if (!trip) return null;
    
    trip.currentCompanions = trip.currentCompanions.filter(c => c.id !== currentUser.id);
    
    if (trip.status === 'full') {
      trip.status = 'open';
    }
    
    return trip;
  },

  // Add itinerary item
  async addItineraryItem(tripId: string, item: Omit<ItineraryItem, 'id'>): Promise<ItineraryItem> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const trip = mockTrips.find(t => t.id === tripId);
    if (!trip) {
      throw new Error('Trip not found');
    }
    
    const newItem: ItineraryItem = {
      ...item,
      id: 'item_' + Date.now()
    };
    
    if (!trip.itinerary) {
      trip.itinerary = [];
    }
    
    trip.itinerary.push(newItem);
    return newItem;
  },

  // Get popular destinations
  async getPopularDestinations(limit: number = 6): Promise<Destination[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockDestinations
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  },

  // Get upcoming trips
  async getUpcomingTrips(limit: number = 5): Promise<Trip[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const now = new Date();
    
    return mockTrips
      .filter(t => t.startDate > now && t.status === 'open')
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
      .slice(0, limit);
  }
};
