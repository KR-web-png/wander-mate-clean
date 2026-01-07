import { User, Match, MatchStatus } from '@/models';
import { mockMatches, mockUsers, currentUser } from './mock.data';

export interface MatchFilters {
  interests?: string[];
  travelStyles?: string[];
  destinations?: string[];
  minCompatibility?: number;
}

export const matchingService = {
  // Get all matches for current user
  async getMatches(): Promise<Match[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockMatches;
  },

  // Get match by ID
  async getMatchById(matchId: string): Promise<Match | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockMatches.find(m => m.id === matchId) || null;
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
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let potentialUsers = mockUsers.filter(u => u.id !== currentUser.id);
    
    // Apply filters
    if (filters?.interests?.length) {
      potentialUsers = potentialUsers.filter(u => 
        u.interests.some(i => filters.interests!.includes(i))
      );
    }
    
    if (filters?.travelStyles?.length) {
      potentialUsers = potentialUsers.filter(u => 
        filters.travelStyles!.includes(u.travelStyle)
      );
    }
    
    if (filters?.minCompatibility) {
      potentialUsers = potentialUsers.filter(u => 
        this.calculateCompatibility(currentUser, u) >= filters.minCompatibility!
      );
    }
    
    // Generate matches
    const matches: Match[] = potentialUsers.map((user, index) => ({
      id: 'match_' + user.id,
      user,
      compatibilityScore: this.calculateCompatibility(currentUser, user),
      sharedInterests: currentUser.interests.filter(i => user.interests.includes(i)),
      sharedDestinations: [], // Would come from user preferences
      matchedTrips: [],
      status: 'pending' as MatchStatus,
      matchedAt: new Date()
    }));
    
    // Sort by compatibility
    return matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  },

  // Update match status
  async updateMatchStatus(matchId: string, status: MatchStatus): Promise<Match | null> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const match = mockMatches.find(m => m.id === matchId);
    if (match) {
      match.status = status;
      return match;
    }
    
    return null;
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
