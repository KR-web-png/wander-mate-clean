import { User, Match, MatchStatus } from '@/models';
import { apiService } from './api.service';

export interface MatchFilters {
  interests?: string[];
  travelStyles?: string[];
  destinations?: string[];
  minCompatibility?: number;
}

export const matchingService = {
  // Get all matches for current user
  async getMatches(): Promise<Match[]> {
    try {
      const response = await apiService.matches.getAll();
      return response.data || [];
    } catch (error) {
      console.error('Error fetching matches:', error);
      return [];
    }
  },

  // Get match by ID
  async getMatchById(matchId: string): Promise<Match | null> {
    try {
      const response = await apiService.matches.getById(matchId);
      return response.data || null;
    } catch (error) {
      console.error('Error fetching match:', error);
      return null;
    }
  },

  // Calculate compatibility between two users
  calculateCompatibility(user1: User, user2: User): number {
    let score = 0;
    
    // Shared interests (40% weight)
    const sharedInterests = user1.interests.filter(i => user2.interests.includes(i));
    score += (sharedInterests.length / Math.max(user1.interests.length, user2.interests.length)) * 40;
    
    // Same travel style (30% weight)
    if (user1.travelStyle === user2.travelStyle) {
      score += 30;
    } else {
      // Partial match for compatible styles
      const compatibleStyles: Record<string, string[]> = {
        adventure: ['cultural', 'solo'],
        relaxation: ['luxury', 'group'],
        cultural: ['adventure', 'budget'],
        budget: ['solo', 'group'],
        luxury: ['relaxation'],
        solo: ['adventure', 'budget'],
        group: ['relaxation', 'budget']
      };
      
      if (compatibleStyles[user1.travelStyle]?.includes(user2.travelStyle)) {
        score += 15;
      }
    }
    
    // Shared languages (20% weight)
    const sharedLanguages = user1.languages.filter(l => user2.languages.includes(l));
    if (sharedLanguages.length > 0) {
      score += Math.min(20, sharedLanguages.length * 10);
    }
    
    // Verification bonus (10% weight)
    if (user2.verificationStatus === 'fully_verified') {
      score += 10;
    } else if (user2.verificationStatus === 'id_verified') {
      score += 5;
    }
    
    return Math.round(Math.min(100, score));
  },

  // Find potential matches
  async findMatches(filters?: MatchFilters): Promise<Match[]> {
    try {
      const response = await apiService.matches.find(filters);
      return response.data || [];
    } catch (error) {
      console.error('Error finding matches:', error);
      return [];
    }
  },

  // Update match status
  async updateMatchStatus(matchId: string, status: MatchStatus): Promise<Match | null> {
    try {
      const response = await apiService.matches.updateStatus(matchId, status);
      return response.data || null;
    } catch (error) {
      console.error('Error updating match status:', error);
      return null;
    }
  },

  // Accept a match
  async acceptMatch(matchId: string): Promise<Match | null> {
    return this.updateMatchStatus(matchId, 'accepted');
  },

  // Decline a match
  async declineMatch(matchId: string): Promise<Match | null> {
    return this.updateMatchStatus(matchId, 'declined');
  }
};

