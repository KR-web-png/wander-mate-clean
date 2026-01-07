import { Response } from 'express';
import db from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

// Get current user profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const [users]: any = await db.query(
      `SELECT id, email, name, avatar_url, bio, location, travel_style, 
              verification_status, joined_at, trips_completed, rating 
       FROM users WHERE id = $1`,
      [req.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const user = users[0];

    // Get user interests
    const [interests]: any = await db.query(
      `SELECT i.name FROM interests i
       INNER JOIN user_interests ui ON i.id = ui.interest_id
       WHERE ui.user_id = $1`,
      [req.userId]
    );

    // Get user languages
    const [languages]: any = await db.query(
      `SELECT l.code, l.name FROM languages l
       INNER JOIN user_languages ul ON l.id = ul.language_id
       WHERE ul.user_id = $1`,
      [req.userId]
    );

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`,
        bio: user.bio || 'No bio yet',
        location: user.location || 'Location not set',
        travelStyle: user.travel_style || 'adventure',
        verificationStatus: user.verification_status,
        joinedDate: user.joined_at,
        tripsCompleted: user.trips_completed || 0,
        rating: parseFloat(user.rating) || 0.0,
        interests: interests.map((i: any) => i.name),
        languages: languages.map((l: any) => l.code)
      }
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get profile'
    });
  }
};

// Update user profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, bio, location, travelStyle, interests, languages } = req.body;
    
    // Update basic info
    await db.query(
      `UPDATE users SET name = $1, bio = $2, location = $3, travel_style = $4 
       WHERE id = $5`,
      [name, bio, location, travelStyle, req.userId]
    );

    // Update interests if provided
    if (interests && Array.isArray(interests)) {
      // Delete existing
      await db.query('DELETE FROM user_interests WHERE user_id = $1', [req.userId]);
      
      // Insert new
      for (const interestName of interests) {
        const [interestRows]: any = await db.query(
          'SELECT id FROM interests WHERE name = $1',
          [interestName]
        );
        
        if (interestRows.length > 0) {
          await db.query(
            'INSERT INTO user_interests (user_id, interest_id) VALUES ($1, $2)',
            [req.userId, interestRows[0].id]
          );
        }
      }
    }

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
};

// Get user by ID
export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const [users]: any = await db.query(
      `SELECT id, email, name, avatar_url, bio, location, travel_style, 
              verification_status, joined_at, trips_completed, rating 
       FROM users WHERE id = $1`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const user = users[0];

    // Get user interests
    const [interests]: any = await db.query(
      `SELECT i.name FROM interests i
       INNER JOIN user_interests ui ON i.id = ui.interest_id
       WHERE ui.user_id = $1`,
      [userId]
    );

    // Get user languages
    const [languages]: any = await db.query(
      `SELECT l.code, l.name FROM languages l
       INNER JOIN user_languages ul ON l.id = ul.language_id
       WHERE ul.user_id = $1`,
      [userId]
    );

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`,
        bio: user.bio || 'No bio yet',
        location: user.location || 'Location not set',
        travelStyle: user.travel_style || 'adventure',
        verificationStatus: user.verification_status,
        joinedDate: user.joined_at,
        tripsCompleted: user.trips_completed || 0,
        rating: parseFloat(user.rating) || 0.0,
        interests: interests.map((i: any) => i.name),
        languages: languages.map((l: any) => l.code)
      }
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user'
    });
  }
};
