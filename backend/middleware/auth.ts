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
        message: 'Access denied. No token provided.'
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
        message: 'Invalid token.'
      };
      res.status(400).json(response);
    }
  },

  // Check if user is admin
  isAdmin: (req: AuthRequest, res: Response, next: NextFunction): void => {
    const userId = req.user?.id;
    
    if (!userId) {
      const response: ApiResponse = {
        status: 401,
        message: 'Authentication required.'
      };
      res.status(401).json(response);
      return;
    }

    const query = 'SELECT is_admin FROM users WHERE id = ?';
    db.query(query, [userId], (err, results: any[]) => {
      if (err) {
        const response: ApiResponse = {
          status: 500,
          message: 'Database error'
        };
        res.status(500).json(response);
        return;
      }

      if (results.length === 0 || !results[0].is_admin) {
        const response: ApiResponse = {
          status: 403,
          message: 'Access denied. Admin privileges required.'
        };
        res.status(403).json(response);
        return;
      }

      next();
    });
  },

  // Check if user owns the record
  checkRecordOwnership: (table: string) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
      const recordId = req.params.id;
      const userId = req.user?.id;

      if (!userId) {
        const response: ApiResponse = {
          status: 401,
          message: 'Authentication required.'
        };
        res.status(401).json(response);
        return;
      }

      const query = `SELECT user_id FROM ${table} WHERE id = ?`;
      db.query(query, [recordId], (err, results: any[]) => {
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
            status: 404,
            message: 'Record not found'
          };
          res.status(404).json(response);
          return;
        }

        if (results[0].user_id !== userId && !req.user?.isAdmin) {
          const response: ApiResponse = {
            status: 403,
            message: 'Access denied. You can only modify your own records.'
          };
          res.status(403).json(response);
          return;
        }

        next();
      });
    };
  }
};

export default auth;