import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { AuthRequest, SignupData, LoginData, AuthResponse, User } from '../types';

export const authController = {
  // 🟣 User signup
  signup: async (req: Request, res: Response): Promise<void> => {
    try {
      const { first_name, last_name, email, password, phone }: SignupData = req.body;

      if (!first_name || !last_name || !email || !password) {
        res.status(400).json({ 
          status: 400, 
          message: 'First name, last name, email, and password are required' 
        });
        return;
      }

      // Simple database calls - no complex types needed
      const [existingUsers]: any = await pool.execute(
        'SELECT id FROM users WHERE email = ?', 
        [email]
      );

      if (existingUsers.length > 0) {
        res.status(400).json({ 
          status: 400, 
          message: 'User already exists with this email' 
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const [result]: any = await pool.execute(
        'INSERT INTO users (first_name, last_name, email, password, phone) VALUES (?, ?, ?, ?, ?)',
        [first_name, last_name, email, hashedPassword, phone || null]
      );

      const [userResults]: any = await pool.execute(
        'SELECT id, first_name, last_name, email, phone, is_admin, created_at FROM users WHERE id = ?',
        [result.insertId]
      );

      if (userResults.length === 0) {
        res.status(500).json({ 
          status: 500, 
          message: 'Failed to retrieve user after creation' 
        });
        return;
      }

      const userData = userResults[0];
      const user: Omit<User, 'password'> = {
        id: userData.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        phone: userData.phone || undefined,
        is_admin: userData.is_admin,
        created_at: userData.created_at,
        updated_at: userData.updated_at
      };

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
      );

      const authResponse: AuthResponse = { token, user };
      res.status(201).json({ status: 201, data: [authResponse] });

    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ 
        status: 500, 
        message: 'Server error during signup' 
      });
    }
  },

  // 🟣 User login
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password }: LoginData = req.body;

      if (!email || !password) {
        res.status(400).json({ 
          status: 400, 
          message: 'Email and password are required' 
        });
        return;
      }

      const [results]: any = await pool.execute(
        'SELECT * FROM users WHERE email = ?', 
        [email]
      );

      if (results.length === 0) {
        res.status(400).json({ 
          status: 400, 
          message: 'Invalid email or password' 
        });
        return;
      }

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        res.status(400).json({ 
          status: 400, 
          message: 'Invalid email or password' 
        });
        return;
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, isAdmin: user.is_admin },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
      );

      const authResponse: AuthResponse = { 
        token, 
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone || undefined,
          is_admin: user.is_admin,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      };
      
      res.status(200).json({ status: 200, data: [authResponse] });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        status: 500, 
        message: 'Database error' 
      });
    }
  },

  // 🟣 Get user profile
  getProfile: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ 
          status: 401, 
          message: 'Unauthorized: No user found' 
        });
        return;
      }

      const [results]: any = await pool.execute(
        'SELECT id, first_name, last_name, email, phone, is_admin, created_at, updated_at FROM users WHERE id = ?',
        [userId]
      );

      if (results.length === 0) {
        res.status(404).json({ 
          status: 404, 
          message: 'User not found' 
        });
        return;
      }

      const userData = results[0];
      const user: Omit<User, 'password'> = {
        id: userData.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        phone: userData.phone || undefined,
        is_admin: userData.is_admin,
        created_at: userData.created_at,
        updated_at: userData.updated_at
      };

      res.status(200).json({ status: 200, data: [user] });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ 
        status: 500, 
        message: 'Server error while fetching profile' 
      });
    }
  }
};

export default authController;