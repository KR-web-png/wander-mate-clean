import { Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import db from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

// Signup
export const signup = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const { name, email, password } = req.body;

    // Check if user exists
    const [existingUsers]: any = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user - PostgreSQL will auto-generate UUID
    const [result]: any = await db.query(
      `INSERT INTO users (email, password_hash, name, verification_status, is_active) 
       VALUES ($1, $2, $3, 'unverified', TRUE)`,
      [email, passwordHash, name]
    );

    // Get created user by email (since ID is UUID)
    const [users]: any = await db.query(
      'SELECT id, email, name, avatar_url, verification_status, created_at FROM users WHERE email = $1',
      [email]
    );

    if (!users || users.length === 0) {
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve created user'
      });
    }

    const user = users[0];

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
    const jwtOptions: SignOptions = { expiresIn: '7d' };
    const token = jwt.sign({ userId: user.id.toString() }, jwtSecret, jwtOptions);

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatar_url,
        verificationStatus: user.verification_status
      },
      token
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      error: 'Signup failed'
    });
  }
};

// Login
export const login = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const { email, password } = req.body;

    // Get user
    const [users]: any = await db.query(
      'SELECT id, email, name, password_hash, avatar_url, verification_status, is_active FROM users WHERE email = $1',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        error: 'Account is inactive'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Update last login
    await db.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
    const jwtOptions: SignOptions = { expiresIn: '7d' };
    const token = jwt.sign({ userId: user.id.toString() }, jwtSecret, jwtOptions);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatar_url,
        verificationStatus: user.verification_status
      },
      token
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
};

// Logout
export const logout = async (req: AuthRequest, res: Response) => {
  // With JWT, logout is handled client-side by removing the token
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

// Get current user (me endpoint)
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }

    // Get user details
    const [users]: any = await db.query(
      'SELECT id, email, name, avatar_url, bio, location, travel_style, verification_status, joined_at, trips_completed, rating FROM users WHERE id = $1 AND is_active = TRUE',
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
      `SELECT l.name FROM languages l 
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
        avatar: user.avatar_url,
        bio: user.bio,
        location: user.location,
        travelStyle: user.travel_style,
        verificationStatus: user.verification_status,
        joinedDate: user.joined_at,
        tripsCompleted: user.trips_completed,
        rating: parseFloat(user.rating),
        interests: interests.map((i: any) => i.name),
        languages: languages.map((l: any) => l.name)
      }
    });
  } catch (error: any) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user information'
    });
  }
};
