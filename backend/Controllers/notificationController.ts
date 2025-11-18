import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest, ApiResponse } from '../types';

const notificationController = {
  // Create a notification for a specific user (used by admin actions)
  createNotificationForUser: async (payload: {
    user_id: number;
    title: string;
    message: string;
    type?: string;
    related_entity_type?: string;
    related_entity_id?: number;
  }) => {
    const { user_id, title, message, type = 'info', related_entity_type = null, related_entity_id = null } = payload as any;
    const query = `
      INSERT INTO notifications (user_id, title, message, type, related_entity_type, related_entity_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await pool.execute(query, [user_id, title, message, type, related_entity_type, related_entity_id]);
  },

  // Get notifications for logged-in user
  getUserNotifications: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        const response: ApiResponse = { status: 401, error: 'Authentication required' };
        res.status(401).json(response);
        return;
      }

      const query = `SELECT id, title, message, type, is_read, related_entity_type, related_entity_id, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC`;
      const [results] = await pool.execute(query, [userId]) as any;

      res.status(200).json({ status: 200, data: results });
    } catch (err) {
      console.error('Error fetching notifications:', err);
      res.status(500).json({ status: 500, error: 'Failed to fetch notifications' });
    }
  },

  // Mark all notifications for the user as read
  markAllAsRead: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        const response: ApiResponse = { status: 401, error: 'Authentication required' };
        res.status(401).json(response);
        return;
      }

      const query = 'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0';
      await pool.execute(query, [userId]);

      res.status(200).json({ status: 200, data: [{ message: 'Marked notifications as read' }] });
    } catch (err) {
      console.error('Error marking notifications as read:', err);
      res.status(500).json({ status: 500, error: 'Failed to mark notifications as read' });
    }
  }
};

export default notificationController;
