import { User } from '@/models';
import apiClient from '@/lib/api-client';

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

// Auth state cache
let authenticatedUser: User | null = null;

export const authService = {
  // Login with email/password
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔐 Attempting login for:', credentials.email);
      const response = await apiClient.post('/auth/login', credentials);
      console.log('📥 Login response:', response.data);
      
      if (response.data.success && response.data.token) {
        const { user, token } = response.data;
        
        // Store token and user info
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_id', user.id);
        authenticatedUser = user;
        
        console.log('✅ Login successful, token stored');
        return {
          success: true,
          user,
          token
        };
      }
      
      console.log('❌ Login failed - no token in response');
      return {
        success: false,
        error: response.data.error || 'Login failed'
      };
    } catch (error: any) {
      console.error('❌ Login error:', error);
      console.error('Error response:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.error || 'Connection error. Please try again.'
      };
    }
  },

  // Sign up new user
  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/signup', data);
      
      if (response.data.success && response.data.token) {
        const { user, token } = response.data;
        
        // Store token and user info
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_id', user.id);
        authenticatedUser = user;
        
        return {
          success: true,
          user,
          token
        };
      }
      
      return {
        success: false,
        error: response.data.error || 'Signup failed'
      };
    } catch (error: any) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Connection error. Please try again.'
      };
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of API call result
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

  // Get current user
  getCurrentUser(): User | null {
    return authenticatedUser;
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
      const response = await apiClient.get('/auth/me');
      
      if (response.data.success && response.data.user) {
        authenticatedUser = response.data.user;
        
        return {
          success: true,
          user: response.data.user,
          token
        };
      }
      
      return {
        success: false,
        error: 'Session expired'
      };
    } catch (error: any) {
      console.error('Session restore error:', error);
      
      // Clear invalid session
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      
      return {
        success: false,
        error: 'Session expired'
      };
    }
  }
};
