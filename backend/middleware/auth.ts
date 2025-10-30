import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import db from '../config/database';
import { AuthRequest, ApiResponse } from '../types';

export const auth = {
  // Verify token middleware
  verifyToken: (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      const response: ApiResponse = {
        status: 401,
        error: 'Access denied. No token provided.' // Changed from 'message' to 'error'
      };
      res.status(401).json(response);
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      req.user = decoded;
      next();
    } catch (err) {
      const response: ApiResponse = {
        status: 400,
        error: 'Invalid token.' // Changed from 'message' to 'error'
      };
      res.status(400).json(response);
    }
  },

  // Check if user is admin
  isAdmin: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        const response: ApiResponse = {
          status: 401,
          error: 'Authentication required.' // Changed from 'message' to 'error'
        };
        res.status(401).json(response);
        return;
      }

      const query = 'SELECT is_admin FROM users WHERE id = ?';
      // Fixed: Using async/await instead of callback
      const [results] = await db.execute(query, [userId]) as any[];

      if (results.length === 0 || !results[0].is_admin) {
        const response: ApiResponse = {
          status: 403,
          error: 'Access denied. Admin privileges required.' // Changed from 'message' to 'error'
        };
        res.status(403).json(response);
        return;
      }

      next();
    } catch (err) {
      const response: ApiResponse = {
        status: 500,
        error: 'Database error' // Changed from 'message' to 'error'
      };
      res.status(500).json(response);
    }
  },

  // Check if user owns the record
  checkRecordOwnership: (table: string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      try {
        const recordId = req.params.id;
        const userId = req.user?.id;

        if (!userId) {
          const response: ApiResponse = {
            status: 401,
            error: 'Authentication required.' // Changed from 'message' to 'error'
          };
          res.status(401).json(response);
          return;
        }

        const query = `SELECT user_id FROM ${table} WHERE id = ?`;
        // Fixed: Using async/await instead of callback
        const [results] = await db.execute(query, [recordId]) as any[];

        if (results.length === 0) {
          const response: ApiResponse = {
            status: 404,
            error: 'Record not found' // Changed from 'message' to 'error'
          };
          res.status(404).json(response);
          return;
        }

        if (results[0].user_id !== userId && !req.user?.isAdmin) {
          const response: ApiResponse = {
            status: 403,
            error: 'Access denied. You can only modify your own records.' // Changed from 'message' to 'error'
          };
          res.status(403).json(response);
          return;
        }

        next();
      } catch (err) {
        const response: ApiResponse = {
          status: 500,
          error: 'Database error' // Changed from 'message' to 'error'
        };
        res.status(500).json(response);
      }
    };
  }
};

export default auth;