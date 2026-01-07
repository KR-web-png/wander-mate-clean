import { User } from '@/models';
import { mockUsers, currentUser } from './mock.data';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  token?: string;
}

// Simulated auth state
let isAuthenticated = false;
let authenticatedUser: User | null = null;

export const authService = {
  // Login with email/password
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    const user = mockUsers.find(u => u.email === credentials.email);
    
    if (user && credentials.password.length >= 6) {
      isAuthenticated = true;
      authenticatedUser = user;
      
      // Store in localStorage for persistence
      localStorage.setItem('auth_token', 'mock_token_' + user.id);
      localStorage.setItem('user_id', user.id);
      
      return {
        success: true,
        user,
        token: 'mock_token_' + user.id
      };
    }
    
    // For demo, allow any valid email format
    if (credentials.email.includes('@') && credentials.password.length >= 6) {
      isAuthenticated = true;
      authenticatedUser = currentUser;
      
      localStorage.setItem('auth_token', 'mock_token_demo');
      localStorage.setItem('user_id', currentUser.id);
      
      return {
        success: true,
        user: currentUser,
        token: 'mock_token_demo'
      };
    }
    
    return {
      success: false,
      error: 'Invalid email or password'
    };
  },

  // Sign up new user
  async signup(data: SignupData): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Check if email already exists
    if (mockUsers.some(u => u.email === data.email)) {
      return {
        success: false,
        error: 'Email already registered'
      };
    }
    
    // Create new user (mock)
    const newUser: User = {
      id: 'new_' + Date.now(),
      email: data.email,
      name: data.name,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      bio: '',
      location: '',
      interests: [],
      travelStyle: 'adventure',
      languages: ['English'],
      verificationStatus: 'email_verified',
      joinedDate: new Date(),
      tripsCompleted: 0,
      rating: 0
    };
    
    isAuthenticated = true;
    authenticatedUser = newUser;
    
    localStorage.setItem('auth_token', 'mock_token_' + newUser.id);
    localStorage.setItem('user_id', newUser.id);
    
    return {
      success: true,
      user: newUser,
      token: 'mock_token_' + newUser.id
    };
  },

  // Logout
  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    isAuthenticated = false;
    authenticatedUser = null;
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token || isAuthenticated;
  },

  // Get current user
  getCurrentUser(): User | null {
    if (authenticatedUser) return authenticatedUser;
    
    const userId = localStorage.getItem('user_id');
    if (userId) {
      const user = mockUsers.find(u => u.id === userId);
      if (user) {
        authenticatedUser = user;
        return user;
      }
      // Return default user for demo
      return currentUser;
    }
    
    return null;
  },

  // Restore session
  async restoreSession(): Promise<AuthResponse> {
    const token = localStorage.getItem('auth_token');
    const userId = localStorage.getItem('user_id');
    
    if (token && userId) {
      const user = mockUsers.find(u => u.id === userId) || currentUser;
      isAuthenticated = true;
      authenticatedUser = user;
      
      return {
        success: true,
        user,
        token
      };
    }
    
    return {
      success: false,
      error: 'No session found'
    };
  },

  // Update user profile
  async updateProfile(updates: Partial<User>): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (!authenticatedUser) {
      return {
        success: false,
        error: 'Not authenticated'
      };
    }

    // Update the authenticated user
    authenticatedUser = {
      ...authenticatedUser,
      ...updates
    };

    // Also update in mock data if it exists there
    const userIndex = mockUsers.findIndex(u => u.id === authenticatedUser!.id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = authenticatedUser;
    }

    return {
      success: true,
      user: authenticatedUser
    };
  }
};
