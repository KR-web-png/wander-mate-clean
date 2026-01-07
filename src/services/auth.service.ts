import { User } from '@/models';
import { supabase } from '@/lib/supabase';

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Login failed'
        };
      }

      if (data.user && data.session) {
        // Try to fetch user profile from database
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const user: User = {
          id: data.user.id,
          email: data.user.email || credentials.email,
          name: profile?.name || data.user.user_metadata?.name || 'User',
          avatar: profile?.avatar_url || '',
          bio: profile?.bio || '',
          location: profile?.location || '',
          interests: [],
          travelStyle: profile?.travel_style || 'adventure',
          languages: [],
          verificationStatus: profile?.verification_status || 'unverified',
          joinedDate: new Date(profile?.created_at || data.user.created_at),
          tripsCompleted: profile?.trips_completed || 0,
          rating: profile?.rating ? parseFloat(profile.rating) : 0,
        };

        authenticatedUser = user;
        localStorage.setItem('auth_token', data.session.access_token);
        localStorage.setItem('user_id', data.user.id);

        return {
          success: true,
          user,
          token: data.session.access_token
        };
      }

      return {
        success: false,
        error: 'Login failed'
      };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Login failed'
      };
    }
  },

  // Sign up new user
  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          }
        }
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Signup failed'
        };
      }

      if (authData.user) {
        // Supabase may not return a session immediately if email confirmation is required
        const user: User = {
          id: authData.user.id,
          email: data.email,
          name: data.name,
          avatar: '',
          bio: '',
          location: '',
          interests: [],
          travelStyle: 'adventure',
          languages: ['English'],
          verificationStatus: 'unverified',
          joinedDate: new Date(),
          tripsCompleted: 0,
          rating: 0,
        };

        authenticatedUser = user;
        
        if (authData.session) {
          localStorage.setItem('auth_token', authData.session.access_token);
          localStorage.setItem('user_id', authData.user.id);
          
          return {
            success: true,
            user,
            token: authData.session.access_token
          };
        } else {
          // Email confirmation required
          return {
            success: true,
            user,
            error: 'Please check your email to confirm your account'
          };
        }
      }

      return {
        success: false,
        error: 'Signup failed'
      };
    } catch (error: any) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: error.message || 'Signup failed'
      };
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
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
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        return null;
      }

      // Try to fetch user profile from database
      const { data: profile } = await supabase
        .from('users')
        .select(`
          *,
          user_interests(interest:interests(name)),
          user_languages(language:languages(name))
        `)
        .eq('id', authUser.id)
        .maybeSingle();

      const user: User = {
        id: authUser.id,
        email: authUser.email || '',
        name: profile?.name || authUser.user_metadata?.name || 'User',
        avatar: profile?.avatar_url || '',
        bio: profile?.bio || '',
        location: profile?.location || '',
        interests: profile?.user_interests?.map((ui: any) => ui.interest?.name).filter(Boolean) || [],
        travelStyle: profile?.travel_style || 'adventure',
        languages: profile?.user_languages?.map((ul: any) => ul.language?.name).filter(Boolean) || ['English'],
        verificationStatus: profile?.verification_status || 'unverified',
        joinedDate: new Date(profile?.created_at || authUser.created_at),
        tripsCompleted: profile?.trips_completed || 0,
        rating: profile?.rating ? parseFloat(profile.rating) : 0,
      };

      authenticatedUser = user;
      return user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },

  // Restore session
  async restoreSession(): Promise<AuthResponse> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return {
          success: false,
          error: 'No session found'
        };
      }

      const user = await this.fetchCurrentUser();
      if (user) {
        return {
          success: true,
          user,
          token: session.access_token
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
      const { data, error } = await supabase
        .from('users')
        .update({
          name: updates.name,
          bio: updates.bio,
          location: updates.location,
          travel_style: updates.travelStyle,
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message || 'Update failed'
        };
      }

      // Update interests if provided
      if (updates.interests && updates.interests.length > 0) {
        // Delete existing interests
        await supabase.from('user_interests').delete().eq('user_id', userId);
        
        // Get interest IDs
        const { data: interests } = await supabase
          .from('interests')
          .select('id, name')
          .in('name', updates.interests);

        if (interests) {
          const userInterests = interests.map(i => ({
            user_id: userId,
            interest_id: i.id
          }));
          await supabase.from('user_interests').insert(userInterests);
        }
      }

      // Update languages if provided
      if (updates.languages && updates.languages.length > 0) {
        await supabase.from('user_languages').delete().eq('user_id', userId);
        
        const { data: languages } = await supabase
          .from('languages')
          .select('id, name')
          .in('name', updates.languages);

        if (languages) {
          const userLanguages = languages.map(l => ({
            user_id: userId,
            language_id: l.id
          }));
          await supabase.from('user_languages').insert(userLanguages);
        }
      }

      // Fetch updated user
      const updatedUser = await this.fetchCurrentUser();
      
      return {
        success: true,
        user: updatedUser || undefined
      };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: error.message || 'Update failed'
      };
    }
  }
};

