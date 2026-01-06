-- Migration to add comment_type column to comments table
ALTER TABLE comments ADD COLUMN comment_type ENUM('user', 'admin', 'official') DEFAULT 'user' AFTER comment_text;
