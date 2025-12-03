import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { AuthRequest, SignupData, LoginData, AuthResponse, User } from '../types';
import { sendError, sendSuccess, validateUserAuth } from '../utils/controllerHelpers';

/**
 * Helper: formats user object without password
 */
function formatUser(userData: any): Omit<User, 'password'> {
  return {
    id: userData.id,
    first_name: userData.first_name,
    last_name: userData.last_name,
    email: userData.email,
    phone: userData.phone || undefined,
    is_admin: userData.is_admin,
    created_at: userData.created_at,
    updated_at: userData.updated_at,
  };
}

/**
 * Helper: safely generate JWT token
 */
function generateToken(payload: object): string {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('JWT secret not set in environment variables');
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export const authController = {
  // 🟣 User signup
  signup: async (req: Request, res: Response): Promise<void> => {
    try {
      const { first_name, last_name, email, password, phone }: SignupData = req.body;

      // Validate required fields
      if (!first_name || !last_name || !email || !password) {
        return sendError(res, 400, 'First name, last name, email, and password are required');
      }

      // Check if user exists
      const [existingUsers]: any = await pool.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        return sendError(res, 400, 'User already exists with this email');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      const [result]: any = await pool.execute(
        'INSERT INTO users (first_name, last_name, email, password, phone) VALUES (?, ?, ?, ?, ?)',
        [first_name, last_name, email, hashedPassword, phone || null]
      );

      // Retrieve inserted user
      const [userResults]: any = await pool.execute(
        'SELECT id, first_name, last_name, email, phone, is_admin, created_at, updated_at FROM users WHERE id = ?',
        [result.insertId]
      );

      if (userResults.length === 0) {
        return sendError(res, 500, 'Failed to retrieve user after creation');
      }

      const user = formatUser(userResults[0]);

      // Generate JWT token
      const token = generateToken({ id: user.id, email: user.email });

      const authResponse: AuthResponse = { token, user };
      sendSuccess(res, 201, authResponse);

    } catch (error) {
      sendError(res, 500, 'Server error during signup', error);
    }
  },

  // 🟣 User login
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password }: LoginData = req.body;

      if (!email || !password) {
        return sendError(res, 400, 'Email and password are required');
      }

      const [results]: any = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (results.length === 0) {
        return sendError(res, 400, 'Invalid email or password');
      }

      const userData = results[0];
      const isPasswordValid = await bcrypt.compare(password, userData.password);

      if (!isPasswordValid) {
        return sendError(res, 400, 'Invalid email or password');
      }

      const user = formatUser(userData);

      const token = generateToken({ id: user.id, email: user.email, isAdmin: user.is_admin });

      const authResponse: AuthResponse = { token, user };
      sendSuccess(res, 200, authResponse);

    } catch (error) {
      sendError(res, 500, 'Server error during login', error);
    }
  },

  // 🟣 Get user profile
  getProfile: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      // Validate authentication
      const authCheck = validateUserAuth(userId);
      if (!authCheck.valid) {
        return sendError(res, 401, authCheck.error || 'Authentication required');
      }

      const [results]: any = await pool.execute(
        'SELECT id, first_name, last_name, email, phone, is_admin, created_at, updated_at FROM users WHERE id = ?',
        [userId]
      );

      if (results.length === 0) {
        return sendError(res, 404, 'User not found');
      }

      const user = formatUser(results[0]);
      sendSuccess(res, 200, user);

    } catch (error) {
      sendError(res, 500, 'Server error while fetching profile', error);
    }
  },

  // 🟣 Update user profile
  updateProfile: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { first_name, last_name, email, phone }: { first_name?: string; last_name?: string; email?: string; phone?: string } = req.body;

      // Validate authentication
      const authCheck = validateUserAuth(userId);
      if (!authCheck.valid) {
        return sendError(res, 401, authCheck.error || 'Authentication required');
      }

      // Validate input
      if (!first_name && !last_name && !email && phone === undefined) {
        return sendError(res, 400, 'At least one field must be provided for update');
      }

      // Check if email is already taken by another user
      if (email) {
        const [existingUsers]: any = await pool.execute(
          'SELECT id FROM users WHERE email = ? AND id != ?',
          [email, userId]
        );
        if (existingUsers.length > 0) {
          return sendError(res, 400, 'Email is already in use by another user');
        }
      }

      // Build update query dynamically
      const updates: string[] = [];
      const values: any[] = [];

      if (first_name) {
        updates.push('first_name = ?');
        values.push(first_name);
      }
      if (last_name) {
        updates.push('last_name = ?');
        values.push(last_name);
      }
      if (email) {
        updates.push('email = ?');
        values.push(email);
      }
      if (phone !== undefined) {
        updates.push('phone = ?');
        values.push(phone || null);
      }

      updates.push('updated_at = NOW()');
      values.push(userId);

      const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

      await pool.execute(query, values);

      // Fetch updated user
      const [results]: any = await pool.execute(
        'SELECT id, first_name, last_name, email, phone, is_admin, created_at, updated_at FROM users WHERE id = ?',
        [userId]
      );

      if (results.length === 0) {
        return sendError(res, 404, 'User not found after update');
      }

      const user = formatUser(results[0]);
      sendSuccess(res, 200, user);

    } catch (error) {
      sendError(res, 500, 'Server error while updating profile', error);
    }
  }
};

export default authController;
