import { Response } from 'express';
import pool from '../config/database';
import { 
  AuthRequest, 
  CreateRecordData, 
  UpdateLocationData, 
  UpdateCommentData, 
  UpdateStatusData, 
  RedFlagWithUser 
} from '../types';
import { ResultSetHeader } from 'mysql2';

export const redFlagsController = {
  // Get all red-flags (filtered by user unless admin)
  getAllRedFlags: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const isAdmin = req.user?.isAdmin;

      // Admin sees all reports, regular users see only their own
      const query = isAdmin 
        ? `
          SELECT rf.*, u.first_name, u.last_name, u.email 
          FROM red_flags rf 
          JOIN users u ON rf.user_id = u.id 
          ORDER BY rf.created_at DESC
        `
        : `
          SELECT rf.*, u.first_name, u.last_name, u.email 
          FROM red_flags rf 
          JOIN users u ON rf.user_id = u.id 
          WHERE rf.user_id = ?
          ORDER BY rf.created_at DESC
        `;
      
      const [results] = await pool.execute<RedFlagWithUser[]>(
        query, 
        isAdmin ? [] : [userId]
      );

      // Parse JSON fields for images and videos
      const redFlagsWithParsedMedia = results.map(redFlag => ({
        ...redFlag,
        images: redFlag.images ? JSON.parse(redFlag.images) : [],
        videos: redFlag.videos ? JSON.parse(redFlag.videos) : []
      }));

      res.status(200).json({
        status: 200,
        data: redFlagsWithParsedMedia
      });
    } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({
        status: 500,
        error: 'Database error'
      });
    }
  },

  // Get single red-flag
  getRedFlag: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          status: 400,
          error: 'ID parameter is required'
        });
        return;
      }
      
      const query = `
        SELECT rf.*, u.first_name, u.last_name, u.email 
        FROM red_flags rf 
        JOIN users u ON rf.user_id = u.id 
        WHERE rf.id = ?
      `;
      
      const [results] = await pool.execute<RedFlagWithUser[]>(query, [id]);

      if (results.length === 0) {
        res.status(404).json({
          status: 404,
          error: 'Red-flag record not found'
        });
        return;
      }

      const redFlag = results[0];
      // Parse JSON fields for images and videos
      const redFlagWithParsedMedia = {
        ...redFlag,
        images: redFlag?.images ? JSON.parse(redFlag.images) : [],
        videos: redFlag?.videos ? JSON.parse(redFlag.videos) : []
      };

      res.status(200).json({
        status: 200,
        data: [redFlagWithParsedMedia]
      });
    } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({
        status: 500,
        error: 'Database error'
      });
    }
  },

  // Create red-flag with optional media
  createRedFlag: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { title, description, latitude, longitude }: CreateRecordData = req.body;
      const userId = req.user?.id;
      const files = req.files as Express.Multer.File[];

      if (!userId) {
        res.status(401).json({
          status: 401,
          error: 'Authentication required'
        });
        return;
      }

      // Validate required fields - latitude and longitude are required in your schema
      if (!title || !description || latitude === undefined || longitude === undefined) {
        res.status(400).json({
          status: 400,
          error: 'Title, description, latitude, and longitude are required fields'
        });
        return;
      }

      // Separate images and videos
      const imageFiles = files?.filter(file => file.mimetype.startsWith('image/')) || [];
      const videoFiles = files?.filter(file => file.mimetype.startsWith('video/')) || [];

      const images = imageFiles.map(file => file.filename);
      const videos = videoFiles.map(file => file.filename);

      // Create red-flag record with media
      const query = `
        INSERT INTO red_flags (user_id, title, description, latitude, longitude, images, videos) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      const [result] = await pool.execute<ResultSetHeader>(query, [
        userId, 
        title, 
        description, 
        latitude, 
        longitude, 
        images.length > 0 ? JSON.stringify(images) : null,
        videos.length > 0 ? JSON.stringify(videos) : null
      ]);

      res.status(201).json({
        status: 201,
        data: [{
          id: result.insertId,
          message: 'Created red-flag record'
        }]
      });
    } catch (error) {
      console.error('Error creating red flag:', error);
      res.status(500).json({
        status: 500,
        error: 'Server error during red-flag creation'
      });
    }
  },

  // Add media to existing red-flag
  addMedia: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const files = req.files as Express.Multer.File[];

      if (!id) {
        res.status(400).json({
          status: 400,
          error: 'ID parameter is required'
        });
        return;
      }

      if (!files || files.length === 0) {
        res.status(400).json({
          status: 400,
          error: 'No files uploaded'
        });
        return;
      }

      // Check if red-flag exists and user owns it
      const checkQuery = 'SELECT user_id, status, images, videos FROM red_flags WHERE id = ?';
      const [checkResults] = await pool.execute<RedFlagWithUser[]>(checkQuery, [id]);

      if (checkResults.length === 0) {
        res.status(404).json({
          status: 404,
          error: 'Red-flag record not found'
        });
        return;
      }

      const redFlag = checkResults[0];
      
      // Check ownership
      if (redFlag?.user_id !== req.user?.id && !req.user?.isAdmin) {
        res.status(403).json({
          status: 403,
          error: 'Access denied. You can only modify your own records.'
        });
        return;
      }

      // Check if record can be modified
      if (redFlag?.status !== 'draft') {
        res.status(403).json({
          status: 403,
          error: 'Cannot modify record that is under investigation, rejected, or resolved'
        });
        return;
      }

      // Separate images and videos
      const imageFiles = files.filter(file => file.mimetype.startsWith('image/'));
      const videoFiles = files.filter(file => file.mimetype.startsWith('video/'));

      // Parse existing media
      const existingImages = redFlag.images ? JSON.parse(redFlag.images) : [];
      const existingVideos = redFlag.videos ? JSON.parse(redFlag.videos) : [];

      // Add new files
      const newImages = imageFiles.map(file => file.filename);
      const newVideos = videoFiles.map(file => file.filename);

      const updatedImages = [...existingImages, ...newImages];
      const updatedVideos = [...existingVideos, ...newVideos];

      // Update the record
      const updateQuery = 'UPDATE red_flags SET images = ?, videos = ? WHERE id = ?';
      await pool.execute(updateQuery, [
        updatedImages.length > 0 ? JSON.stringify(updatedImages) : null,
        updatedVideos.length > 0 ? JSON.stringify(updatedVideos) : null,
        id
      ]);

      res.status(200).json({
        status: 200,
        data: [{
          id: parseInt(id),
          message: `Added ${newImages.length} images and ${newVideos.length} videos to red-flag record`
        }]
      });
    } catch (error) {
      console.error('Error adding media:', error);
      res.status(500).json({
        status: 500,
        error: 'Server error during media upload'
      });
    }
  },

  // Update red-flag location
  updateLocation: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { latitude, longitude }: UpdateLocationData = req.body;

      if (!id) {
        res.status(400).json({
          status: 400,
          error: 'ID parameter is required'
        });
        return;
      }

      // Check if record can be modified
      const checkQuery = 'SELECT user_id, status FROM red_flags WHERE id = ?';
      const [checkResults] = await pool.execute<RedFlagWithUser[]>(checkQuery, [id]);

      if (checkResults.length === 0) {
        res.status(404).json({
          status: 404,
          error: 'Red-flag record not found'
        });
        return;
      }

      const record = checkResults[0];

      // Check ownership
      if (record?.user_id !== req.user?.id && !req.user?.isAdmin) {
        res.status(403).json({
          status: 403,
          error: 'Access denied. You can only modify your own records.'
        });
        return;
      }

      if (record?.status !== 'draft') {
        res.status(403).json({
          status: 403,
          error: 'Cannot modify record that is under investigation, rejected, or resolved'
        });
        return;
      }

      const updateQuery = 'UPDATE red_flags SET latitude = ?, longitude = ? WHERE id = ?';
      await pool.execute(updateQuery, [latitude, longitude, id]);

      res.status(200).json({
        status: 200,
        data: [{
          id: parseInt(id),
          message: 'Updated red-flag record\'s location'
        }]
      });
    } catch (error) {
      console.error('Error updating location:', error);
      res.status(500).json({
        status: 500,
        error: 'Failed to update location'
      });
    }
  },

  // Update red-flag comment/description
  updateComment: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { description }: UpdateCommentData = req.body;

      if (!id) {
        res.status(400).json({
          status: 400,
          error: 'ID parameter is required'
        });
        return;
      }

      // Check if record can be modified
      const checkQuery = 'SELECT user_id, status FROM red_flags WHERE id = ?';
      const [checkResults] = await pool.execute<RedFlagWithUser[]>(checkQuery, [id]);

      if (checkResults.length === 0) {
        res.status(404).json({
          status: 404,
          error: 'Red-flag record not found'
        });
        return;
      }

      const record = checkResults[0];

      // Check ownership
      if (record?.user_id !== req.user?.id && !req.user?.isAdmin) {
        res.status(403).json({
          status: 403,
          error: 'Access denied. You can only modify your own records.'
        });
        return;
      }

      if (record?.status !== 'draft') {
        res.status(403).json({
          status: 403,
          error: 'Cannot modify record that is under investigation, rejected, or resolved'
        });
        return;
      }

      const updateQuery = 'UPDATE red_flags SET description = ? WHERE id = ?';
      await pool.execute(updateQuery, [description, id]);

      res.status(200).json({
        status: 200,
        data: [{
          id: parseInt(id),
          message: 'Updated red-flag record\'s comment'
        }]
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      res.status(500).json({
        status: 500,
        error: 'Failed to update comment'
      });
    }
  },

  // Delete red-flag
  deleteRedFlag: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          status: 400,
          error: 'ID parameter is required'
        });
        return;
      }

      // Check if record can be deleted
      const checkQuery = 'SELECT user_id, status FROM red_flags WHERE id = ?';
      const [checkResults] = await pool.execute<RedFlagWithUser[]>(checkQuery, [id]);

      if (checkResults.length === 0) {
        res.status(404).json({
          status: 404,
          error: 'Red-flag record not found'
        });
        return;
      }

      const record = checkResults[0];

      // Check ownership
      if (record?.user_id !== req.user?.id && !req.user?.isAdmin) {
        res.status(403).json({
          status: 403,
          error: 'Access denied. You can only delete your own records.'
        });
        return;
      }

      if (record?.status !== 'draft') {
        res.status(403).json({
          status: 403,
          error: 'Cannot delete record that is under investigation, rejected, or resolved'
        });
        return;
      }

      const deleteQuery = 'DELETE FROM red_flags WHERE id = ?';
      await pool.execute(deleteQuery, [id]);

      res.status(200).json({
        status: 200,
        data: [{
          id: parseInt(id),
          message: 'Red-flag record has been deleted'
        }]
      });
    } catch (error) {
      console.error('Error deleting red flag:', error);
      res.status(500).json({
        status: 500,
        error: 'Failed to delete red-flag record'
      });
    }
  },

  // Update red-flag status (Admin only)
  updateStatus: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status }: UpdateStatusData = req.body;

      if (!id) {
        res.status(400).json({
          status: 400,
          error: 'ID parameter is required'
        });
        return;
      }



    


      

      const validStatuses = ['under-investigation', 'rejected', 'resolved'];
      if (!status || !validStatuses.includes(status)) {
        res.status(400).json({
          status: 400,
          error: 'Invalid status. Must be one of: under-investigation, rejected, resolved'
        });
        return;
      }

      const query = 'UPDATE red_flags SET status = ? WHERE id = ?';
      const [result] = await pool.execute<ResultSetHeader>(query, [status, id]);

      if (result.affectedRows === 0) {
        res.status(404).json({
          status: 404,
          error: 'Red-flag record not found'
        });
        return;
      }

      res.status(200).json({
        status: 200,
        data: [{
          id: parseInt(id),
          message: 'Updated red-flag record status'
        }]
      });
    } catch (error) {
      console.error('Error updating status:', error);
      res.status(500).json({
        status: 500,
        error: 'Failed to update status'
      });
    }
  },

  
  // 🚨 ADD THE NEW updateRedFlag FUNCTION HERE (AFTER updateStatus):
  updateRedFlag: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, description, latitude, longitude }: CreateRecordData = req.body;
      const files = req.files as Express.Multer.File[];

      if (!id) {
        res.status(400).json({
          status: 400,
          error: 'ID parameter is required'
        });
        return;
      }

      // Check if red-flag exists and user owns it
      const checkQuery = 'SELECT user_id, status, images, videos FROM red_flags WHERE id = ?';
      const [checkResults] = await pool.execute<RedFlagWithUser[]>(checkQuery, [id]);

      if (checkResults.length === 0) {
        res.status(404).json({
          status: 404,
          error: 'Red-flag record not found'
        });
        return;
      }

      const redFlag = checkResults[0];
      
      // Check ownership
      if (redFlag?.user_id !== req.user?.id && !req.user?.isAdmin) {
        res.status(403).json({
          status: 403,
          error: 'Access denied. You can only modify your own records.'
        });
        return;
      }

      // Check if record can be modified
      if (redFlag?.status !== 'draft') {
        res.status(403).json({
          status: 403,
          error: 'Cannot modify record that is under investigation, rejected, or resolved'
        });
        return;
      }

      // Handle file updates if new files are uploaded
      let updatedImages = redFlag.images ? JSON.parse(redFlag.images) : [];
      let updatedVideos = redFlag.videos ? JSON.parse(redFlag.videos) : [];

      if (files && files.length > 0) {
        // Replace existing media with new files
        const imageFiles = files.filter(file => file.mimetype.startsWith('image/'));
        const videoFiles = files.filter(file => file.mimetype.startsWith('video/'));

        updatedImages = imageFiles.map(file => file.filename);
        updatedVideos = videoFiles.map(file => file.filename);
      }

      // Update the record
      const updateQuery = `
        UPDATE red_flags 
        SET title = ?, description = ?, latitude = ?, longitude = ?, images = ?, videos = ? 
        WHERE id = ?
      `;
      
      await pool.execute(updateQuery, [
        title,
        description,
        latitude,
        longitude,
        updatedImages.length > 0 ? JSON.stringify(updatedImages) : null,
        updatedVideos.length > 0 ? JSON.stringify(updatedVideos) : null,
        id
      ]);

      res.status(200).json({
        status: 200,
        data: [{
          id: parseInt(id),
          message: 'Updated red-flag record'
        }]
      });
    } catch (error) {
      console.error('Error updating red flag:', error);
      res.status(500).json({
        status: 500,
        error: 'Server error during red-flag update'
      });
    }
  } // ← NO COMMA HERE (last function)
};

export default redFlagsController;