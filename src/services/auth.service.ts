import { User } from '@/models';
import { apiService } from './api.service';

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

// In-memory cache for current user
let authenticatedUser: User | null = null;

export const authService = {
  // Login with email/password
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const data = await apiService.auth.login(credentials);
      
      if (data.success && data.token && data.user) {
        // Store token and user info
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_id', data.user.id);
        authenticatedUser = data.user;
        
        return {
          success: true,
          user: data.user,
          token: data.token
        };
      }
      
      return {
        success: false,
        error: data.error || 'Login failed'
      };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Login failed'
      };
    }
  },

  // Sign up new user
  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const responseData = await apiService.auth.signup(data);
      
      if (responseData.success && responseData.token && responseData.user) {
        // Store token and user info
        localStorage.setItem('auth_token', responseData.token);
        localStorage.setItem('user_id', responseData.user.id);
        authenticatedUser = responseData.user;
        
        return {
          success: true,
          user: responseData.user,
          token: responseData.token
        };
      }
      
      return {
        success: false,
        error: responseData.error || 'Signup failed'
      };
    } catch (error: any) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Signup failed'
      };
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await apiService.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authenticatedUser = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token;
  },

  // Get current user from memory or fetch from API
  getCurrentUser(): User | null {
    if (authenticatedUser) {
      return authenticatedUser;
    }
    
    // Try to get from localStorage as fallback
    const userId = localStorage.getItem('user_id');
    if (userId) {
      // Fetch user from API in background
      this.fetchCurrentUser().catch(console.error);
    }
    
    return null;
  },

  // Fetch current user from API
  async fetchCurrentUser(): Promise<User | null> {
    try {
      const data = await apiService.auth.getCurrentUser();
      if (data.success && data.user) {
        authenticatedUser = data.user;
        return data.user;
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      // Clear auth on error
      this.logout();
    }
    return null;
  },

  // Restore session
  async restoreSession(): Promise<AuthResponse> {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      return {
        success: false,
        error: 'No session found'
      };
    }
    
    try {
      const user = await this.fetchCurrentUser();
      if (user) {
        return {
          success: true,
          user,
          token
        };
      }
    } catch (error) {
      console.error('Session restore error:', error);
    }
    
    return {
      success: false,
      error: 'Session expired'
    };
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<User>): Promise<AuthResponse> {
    try {
      const data = await apiService.users.updateProfile(userId, updates);
      
      if (data.success && data.user) {
        authenticatedUser = data.user;
        return {
          success: true,
          user: data.user
        };
      }
      
      return {
        success: false,
        error: data.error || 'Update failed'
      };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Update failed'
      };
    }
  }
};

