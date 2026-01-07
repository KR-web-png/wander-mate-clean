import { Trip, Destination, TripStatus, BudgetRange, ItineraryItem } from '@/models';
import { apiService } from './api.service';

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
    try {
      const response = await apiService.trips.getAll(filters);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching trips:', error);
      return [];
    }
  },

  // Get trip by ID
  async getTripById(tripId: string): Promise<Trip | null> {
    try {
      const response = await apiService.trips.getById(tripId);
      return response.data || null;
    } catch (error) {
      console.error('Error fetching trip:', error);
      return null;
    }
  },

  // Get user's trips
  async getUserTrips(userId?: string): Promise<Trip[]> {
    try {
      const response = await apiService.trips.getAll({ userId });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching user trips:', error);
      return [];
    }
  },

  // Get all destinations
  async getDestinations(): Promise<Destination[]> {
    try {
      const response = await apiService.destinations.getAll();
      return response.data || [];
    } catch (error) {
      console.error('Error fetching destinations:', error);
      return [];
    }
  },

  // Get destination by ID
  async getDestinationById(destinationId: string): Promise<Destination | null> {
    try {
      const response = await apiService.destinations.getById(destinationId);
      return response.data || null;
    } catch (error) {
      console.error('Error fetching destination:', error);
      return null;
    }
  },

  // Search destinations
  async searchDestinations(query: string): Promise<Destination[]> {
    try {
      const response = await apiService.destinations.search(query);
      return response.data || [];
    } catch (error) {
      console.error('Error searching destinations:', error);
      return [];
    }
  },

  // Create a new trip
  async createTrip(data: CreateTripData): Promise<Trip> {
    try {
      const response = await apiService.trips.create(data);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || 'Failed to create trip');
    } catch (error: any) {
      console.error('Error creating trip:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to create trip');
    }
  },

  // Join a trip
  async joinTrip(tripId: string): Promise<Trip | null> {
    try {
      const response = await apiService.trips.join(tripId);
      return response.data || null;
    } catch (error: any) {
      console.error('Error joining trip:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to join trip');
    }
  },

  // Leave a trip
  async leaveTrip(tripId: string): Promise<Trip | null> {
    try {
      const response = await apiService.trips.leave(tripId);
      return response.data || null;
    } catch (error: any) {
      console.error('Error leaving trip:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to leave trip');
    }
  },

  // Add itinerary item
  async addItineraryItem(tripId: string, item: Omit<ItineraryItem, 'id'>): Promise<ItineraryItem> {
    try {
      // Note: Assuming API has this endpoint
      const response = await apiService.trips.update(tripId, { 
        itinerary: item 
      });
      return response.data;
    } catch (error: any) {
      console.error('Error adding itinerary item:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to add itinerary item');
    }
  },

  // Get popular destinations
  async getPopularDestinations(limit: number = 6): Promise<Destination[]> {
    try {
      const response = await apiService.destinations.getAll();
      const destinations = response.data || [];
      return destinations
        .sort((a: Destination, b: Destination) => (b.rating || 0) - (a.rating || 0))
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching popular destinations:', error);
      return [];
    }
  },

  // Get upcoming trips
  async getUpcomingTrips(limit: number = 5): Promise<Trip[]> {
    try {
      const response = await apiService.trips.getAll({ status: 'open' });
      const trips = response.data || [];
      const now = new Date();
      
      return trips
        .filter((t: Trip) => new Date(t.startDate) > now)
        .sort((a: Trip, b: Trip) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching upcoming trips:', error);
      return [];
    }
  }
};

