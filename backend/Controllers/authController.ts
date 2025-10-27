import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database';
import { AuthRequest, SignupData, LoginData, ApiResponse, AuthResponse, User } from '../types';

export const authController = {
  // User signup
  signup: async (req: Request, res: Response): Promise<void> => {
    try {
      const { first_name, last_name, email, password, phone }: SignupData = req.body;

      // Check if user already exists
      const checkQuery = 'SELECT id FROM users WHERE email = ?';
      db.query(checkQuery, [email], async (err, results: any[]) => {
        if (err) {
          const response: ApiResponse = {
            status: 500,
            message: 'Database error'
          };
          res.status(500).json(response);
          return;
        }

        if (results.length > 0) {
          const response: ApiResponse = {
            status: 400,
            message: 'User already exists with this email'
          };
          res.status(400).json(response);
          return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const insertQuery = `
          INSERT INTO users (first_name, last_name, email, password, phone) 
          VALUES (?, ?, ?, ?, ?)
        `;
        
        db.query(insertQuery, [first_name, last_name, email, hashedPassword, phone], (err, results: any) => {
          if (err) {
            const response: ApiResponse = {
              status: 500,
              message: 'Failed to create user'
            };
            res.status(500).json(response);
            return;
          }

          // Get the created user (excluding password)
          const userQuery = 'SELECT id, first_name, last_name, email, phone, created_at FROM users WHERE id = ?';
          db.query(userQuery, [results.insertId], (err, userResults: any[]) => {
            if (err) {
              const response: ApiResponse = {
                status: 500,
                message: 'Failed to retrieve user'
              };
              res.status(500).json(response);
              return;
            }

            const user: Omit<User, 'password'> = userResults[0];
            const token = jwt.sign(
              { id: user.id, email: user.email },
              process.env.JWT_SECRET as string,
              { expiresIn: '24h' }
            );

            const authResponse: AuthResponse = {
              token,
              user
            };

            const response: ApiResponse<AuthResponse> = {
              status: 201,
              data: [authResponse]
            };

            res.status(201).json(response);
          });
        });
      });
    } catch (error) {
      const response: ApiResponse = {
        status: 500,
        message: 'Server error during signup'
      };
      res.status(500).json(response);
    }
  },

  // User login
  login: (req: Request, res: Response): void => {
    const { email, password }: LoginData = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results: any[]) => {
      if (err) {
        const response: ApiResponse = {
          status: 500,
          message: 'Database error'
        };
        res.status(500).json(response);
        return;
      }

      if (results.length === 0) {
        const response: ApiResponse = {
          status: 400,
          message: 'Invalid email or password'
        };
        res.status(400).json(response);
        return;
      }

      const user: User = results[0];

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        const response: ApiResponse = {
          status: 400,
          message: 'Invalid email or password'
        };
        res.status(400).json(response);
        return;
      }

      // Create token
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          isAdmin: user.is_admin 
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
      );

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user;

      const authResponse: AuthResponse = {
        token,
        user: userWithoutPassword
      };

      const response: ApiResponse<AuthResponse> = {
        status: 200,
        data: [authResponse]
      };

      res.status(200).json(response);
    });
  }
};

export default authController;