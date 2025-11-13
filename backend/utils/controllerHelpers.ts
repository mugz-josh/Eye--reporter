/**
 * Backend Utility Functions - Eliminate repeated code patterns
 * Handles: Error responses, media processing, validation
 */

import { Response } from 'express';
import { ApiResponse } from '../types';

/**
 * Send standardized error response
 * REPLACES: res.status(500).json({ status: 500, error: '...' }) (repeated 8+ times)
 */
export function sendError(
  res: Response,
  statusCode: number,
  errorMessage: string,
  consoleError?: any
): void {
  if (consoleError) {
    console.error(errorMessage, consoleError);
  }
  const response: ApiResponse = {
    status: statusCode,
    error: errorMessage,
  };
  res.status(statusCode).json(response);
}

/**
 * Send standardized success response
 * REPLACES: res.status(200).json({ status: 200, data: [...] }) pattern
 */
export function sendSuccess(res: Response, statusCode: number, data: any): void {
  const response: ApiResponse = {
    status: statusCode,
    data: Array.isArray(data) ? data : [data],
  };
  res.status(statusCode).json(response);
}

/**
 * Process uploaded files - separate images and videos
 * REPLACES: The file filtering logic repeated in both controllers
 */
export function processMediaFiles(files: Express.Multer.File[]): {
  images: string[];
  videos: string[];
} {
  const imageFiles = files.filter((file) => file.mimetype.startsWith('image/'));
  const videoFiles = files.filter((file) => file.mimetype.startsWith('video/'));

  return {
    images: imageFiles.map((file) => file.filename),
    videos: videoFiles.map((file) => file.filename),
  };
}

/**
 * Parse JSON media strings from database
 * REPLACES: JSON.parse logic repeated 4+ times
 */
export function parseMedia(data: any[]): any[] {
  return data.map((item) => ({
    ...item,
    images: item.images ? JSON.parse(item.images) : [],
    videos: item.videos ? JSON.parse(item.videos) : [],
  }));
}

/**
 * Validate required fields for creating a record
 * REPLACES: if (!title || !description || ...) pattern repeated in both controllers
 */
export function validateCreateRecord(
  title?: string,
  description?: string,
  latitude?: number,
  longitude?: number
): { valid: boolean; error?: string } {
  if (!title || !description) {
    return {
      valid: false,
      error: 'Title and description are required fields',
    };
  }

  if (latitude === undefined || longitude === undefined) {
    return {
      valid: false,
      error: 'Latitude and longitude are required fields',
    };
  }

  return { valid: true };
}

/**
 * Validate user authentication
 * REPLACES: if (!userId) { res.status(401)... } pattern repeated 6+ times
 */
export function validateUserAuth(userId: string | number | undefined): { valid: boolean; error?: string } {
  if (!userId) {
    return {
      valid: false,
      error: 'Authentication required',
    };
  }
  return { valid: true };
}

/**
 * Build success response for single/multiple records
 * REPLACES: Manual response building
 */
export function buildRecordResponse(id: number, message: string): any {
  return {
    status: 201,
    data: [{ id, message }],
  };
}
