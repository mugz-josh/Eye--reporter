import { Response } from 'express';
import db from '../config/database';
import { AuthRequest, CreateRecordData, UpdateLocationData, UpdateCommentData, UpdateStatusData, ApiResponse, RecordResponse, RedFlag } from '../types';

export const redFlagsController = {
  // Get all red-flags
  getAllRedFlags: (req: AuthRequest, res: Response): void => {
    const query = `
      SELECT rf.*, u.first_name, u.last_name, u.email 
      FROM red_flags rf 
      JOIN users u ON rf.user_id = u.id 
      ORDER BY rf.created_at DESC
    `;
    
    db.query(query, (err, results: any) => {
      if (err) {
        const response: ApiResponse = {
          status: 500,
          message: 'Database error'
        };
        res.status(500).json(response);
        return;
      }

      const response: ApiResponse<RedFlag> = {
        status: 200,
        data: results
      };

      res.status(200).json(response);
    });
  },

  // Get single red-flag
  getRedFlag: (req: AuthRequest, res: Response): void => {
    const { id } = req.params;
    
    const query = `
      SELECT rf.*, u.first_name, u.last_name, u.email 
      FROM red_flags rf 
      JOIN users u ON rf.user_id = u.id 
      WHERE rf.id = ?
    `;
    
    if (!id) {
      const response: ApiResponse = { status: 400, message: 'Missing id parameter' };
      res.status(400).json(response);
      return;
    }

    db.query(query, [id], (err, results: any) => {
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
          message: 'Red-flag record not found'
        };
        res.status(404).json(response);
        return;
      }

      const found: RedFlag = results[0] as RedFlag;
      const response: ApiResponse<RedFlag> = {
        status: 200,
        data: [found]
      };

      res.status(200).json(response);
    });
  },

  // Create red-flag
  createRedFlag: (req: AuthRequest, res: Response): void => {
    const { title, description, latitude, longitude }: CreateRecordData = req.body;
    const userId = req.user?.id;

    if (!userId) {
      const response: ApiResponse = {
        status: 401,
        message: 'Authentication required'
      };
      res.status(401).json(response);
      return;
    }

    const query = `
      INSERT INTO red_flags (user_id, title, description, latitude, longitude) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    db.query(query, [userId, title, description, latitude, longitude], (err, results: any) => {
      if (err) {
        const response: ApiResponse = {
          status: 500,
          message: 'Failed to create red-flag record'
        };
        res.status(500).json(response);
        return;
      }

      const recordResponse: RecordResponse = {
        id: results.insertId,
        message: 'Created red-flag record'
      };

      const response: ApiResponse<RecordResponse> = {
        status: 201,
        data: [recordResponse]
      };

      res.status(201).json(response);
    });
  },

  // Update red-flag location
  updateLocation: (req: AuthRequest, res: Response): void => {
    const { id } = req.params;
    const { latitude, longitude }: UpdateLocationData = req.body;

    // Check if record can be modified
    const checkQuery = 'SELECT status FROM red_flags WHERE id = ?';
    db.query(checkQuery, [id], (err, results: any[]) => {
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
          message: 'Red-flag record not found'
        };
        res.status(404).json(response);
        return;
      }

      const record = results[0];
      if (record.status !== 'draft') {
        const response: ApiResponse = {
          status: 403,
          message: 'Cannot modify record that is under investigation, rejected, or resolved'
        };
        res.status(403).json(response);
        return;
      }

      const updateQuery = 'UPDATE red_flags SET latitude = ?, longitude = ? WHERE id = ?';
      db.query(updateQuery, [latitude, longitude, id], (err, results: any) => {
        if (err) {
            const response: ApiResponse = {
              status: 500,
              message: 'Failed to update location'
            };
            res.status(500).json(response);
            return;
          }

        const recordResponse: RecordResponse = {
          id: parseInt(String(id), 10),
          message: 'Updated red-flag record\'s location'
        };

        const response: ApiResponse<RecordResponse> = {
          status: 200,
          data: [recordResponse]
        };

        res.status(200).json(response);
      });
    });
  },

  // Update red-flag comment/description
  updateComment: (req: AuthRequest, res: Response): void => {
    const { id } = req.params;
    const { description }: UpdateCommentData = req.body;

    // Check if record can be modified
    const checkQuery = 'SELECT status FROM red_flags WHERE id = ?';
    db.query(checkQuery, [id], (err, results: any[]) => {
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
          message: 'Red-flag record not found'
        };
        res.status(404).json(response);
        return;
      }

      const record = results[0];
      if (record.status !== 'draft') {
        const response: ApiResponse = {
          status: 403,
          message: 'Cannot modify record that is under investigation, rejected, or resolved'
        };
        res.status(403).json(response);
        return;
      }

      const updateQuery = 'UPDATE red_flags SET description = ? WHERE id = ?';
      db.query(updateQuery, [description, id], (err, results: any) => {
        if (err) {
            const response: ApiResponse = {
              status: 500,
              message: 'Failed to update comment'
            };
            res.status(500).json(response);
            return;
          }

        const recordResponse: RecordResponse = {
          id: parseInt(String(id), 10),
          message: 'Updated red-flag record\'s comment'
        };

        const response: ApiResponse<RecordResponse> = {
          status: 200,
          data: [recordResponse]
        };

        res.status(200).json(response);
      });
    });
  },

  // Delete red-flag
  deleteRedFlag: (req: AuthRequest, res: Response): void => {
    const { id } = req.params;

    // Check if record can be deleted
    const checkQuery = 'SELECT status FROM red_flags WHERE id = ?';
    db.query(checkQuery, [id], (err, results: any[]) => {
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
          message: 'Red-flag record not found'
        };
        res.status(404).json(response);
        return;
      }

      const record = results[0];
      if (record.status !== 'draft') {
        const response: ApiResponse = {
          status: 403,
          message: 'Cannot delete record that is under investigation, rejected, or resolved'
        };
        res.status(403).json(response);
        return;
      }

      const deleteQuery = 'DELETE FROM red_flags WHERE id = ?';
      db.query(deleteQuery, [id], (err, results: any) => {
        if (err) {
            const response: ApiResponse = {
              status: 500,
              message: 'Failed to delete red-flag record'
            };
            res.status(500).json(response);
            return;
          }

        const recordResponse: RecordResponse = {
          id: parseInt(String(id), 10),
          message: 'Red-flag record has been deleted'
        };

        const response: ApiResponse<RecordResponse> = {
          status: 200,
          data: [recordResponse]
        };

        res.status(200).json(response);
      });
    });
  },

  // Update red-flag status (Admin only)
  updateStatus: (req: AuthRequest, res: Response): void => {
    const { id } = req.params;
    const { status }: UpdateStatusData = req.body;

    const validStatuses = ['under-investigation', 'rejected', 'resolved'];
    if (!validStatuses.includes(status)) {
      const response: ApiResponse = {
        status: 400,
        message: 'Invalid status. Must be one of: under-investigation, rejected, resolved'
      };
      res.status(400).json(response);
      return;
    }

    const query = 'UPDATE red_flags SET status = ? WHERE id = ?';
    db.query(query, [status, id], (err, results: any) => {
      if (err) {
        const response: ApiResponse = {
          status: 500,
          message: 'Failed to update status'
        };
        res.status(500).json(response);
        return;
      }

      if (results.affectedRows === 0) {
        const response: ApiResponse = {
          status: 404,
          message: 'Red-flag record not found'
        };
        res.status(404).json(response);
        return;
      }

      const recordResponse: RecordResponse = {
        id: parseInt(String(id), 10),
        message: 'Updated red-flag record status'
      };

      const response: ApiResponse<RecordResponse> = {
        status: 200,
        data: [recordResponse]
      };

      res.status(200).json(response);
    });
  }
};

export default redFlagsController;