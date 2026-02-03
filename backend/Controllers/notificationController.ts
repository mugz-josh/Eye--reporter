import { Response } from "express";
import pool from "../config/database";
import { AuthRequest, ApiResponse } from "../types";

export const notificationController = {
  createNotificationForUser: async (payload: {
    user_id: number;
    title: string;
    message: string;
    type?: string;
    related_entity_type?: string;
    related_entity_id?: number;
  }) => {
    const { user_id, title, message, type = "info", related_entity_type = null, related_entity_id = null } = payload;
    const query = `
      INSERT INTO notifications (user_id, title, message, type, related_entity_type, related_entity_id)
      VALUES ($1, $2, $3, $4, $5, $6)`;
    await pool.query(query, [user_id, title, message, type, related_entity_type, related_entity_id]);
  },

  getUserNotifications: async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        const response: ApiResponse = {
          status: 401,
          error: "Authentication required",
        };
        res.status(401).json(response);
        return;
      }

      const query = `SELECT id, title, message, type, is_read, related_entity_type, related_entity_id, created_at FROM notifications WHERE user_id = $1 ORDER BY created_at DESC`;
      const result = await pool.query(query, [userId]);

      res.status(200).json({ status: 200, data: result.rows });
    } catch (err) {
      console.error("Error fetching notifications:", err);
      res.status(500).json({ status: 500, error: "Failed to fetch notifications" });
    }
  },

  markAllAsRead: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        const response: ApiResponse = {
          status: 401,
          error: "Authentication required",
        };
        res.status(401).json(response);
        return;
      }

      const query = "UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false";
      await pool.query(query, [userId]);

      res.status(200).json({
        status: 200,
        data: [{ message: "Marked notifications as read" }],
      });
    } catch (err) {
      console.error("Error marking notifications as read:", err);
      res.status(500).json({ status: 500, error: "Failed to mark notifications as read" });
    }
  },

  deleteNotification: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const notificationIdParam = req.params.id;

      if (!userId) {
        const response: ApiResponse = {
          status: 401,
          error: "Authentication required",
        };
        res.status(401).json(response);
        return;
      }

      if (!notificationIdParam) {
        const response: ApiResponse = {
          status: 400,
          error: "Notification ID required",
        };
        res.status(400).json(response);
        return;
      }

      const notificationId = parseInt(notificationIdParam);
      if (isNaN(notificationId)) {
        const response: ApiResponse = {
          status: 400,
          error: "Invalid notification ID",
        };
        res.status(400).json(response);
        return;
      }

      const query = "DELETE FROM notifications WHERE id = $1 AND user_id = $2";
      const result = await pool.query(query, [notificationId, userId]);

      if (result.rowCount === 0) {
        res.status(404).json({ status: 404, error: "Notification not found" });
        return;
      }
      res.status(200).json({
        status: 200,
        data: [{ message: "Notification deleted successfully" }],
      });
    } catch (err) {
      console.error("Error deleting notification:", err);
      res.status(500).json({ status: 500, error: "Failed to delete notification" });
    }
  },

  deleteOldNotifications: async (daysOld: number = 30): Promise<void> => {
    try {
      const query = "DELETE FROM notifications WHERE created_at < NOW() - INTERVAL '$1 days'";
      const result = await pool.query(query, [daysOld]);
      console.log(`Deleted ${result.rowCount} notifications older than ${daysOld} days`);
    } catch (err) {
      console.error("Error deleting old notifications:", err);
    }
  },
};

export default notificationController;
              