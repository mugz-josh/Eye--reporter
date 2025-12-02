# Technical Flow Walkthrough: IREPORTER App

## Overview
This document provides a detailed technical walkthrough of the IREPORTER application's key processes, from user authentication to report management and notifications.

## 1. User Registration Flow

### Frontend Process
```
User fills registration form → React Hook Form validation → API call to /api/v1/auth/signup
```

### Backend Process (`authController.signup`)
1. **Input Validation**: Check required fields (first_name, last_name, email, password)
2. **Duplicate Check**: Query `users` table for existing email
   ```sql
   SELECT id FROM users WHERE email = ?
   ```
3. **Password Hashing**: Use bcryptjs to hash password with salt rounds = 10
4. **Database Insertion**:
   ```sql
   INSERT INTO users (first_name, last_name, email, password, phone)
   VALUES (?, ?, ?, ?, ?)
   ```
5. **Token Generation**: Create JWT with user ID and email, expires in 24h
6. **Response**: Return JWT token and user data (excluding password)

### Security Features
- Password hashing prevents plaintext storage
- JWT tokens for stateless authentication
- Email uniqueness constraint

## 2. User Login Flow

### Frontend Process
```
User enters credentials → Form validation → API call to /api/v1/auth/login
```

### Backend Process (`authController.login`)
1. **Input Validation**: Check email and password presence
2. **User Lookup**: Query database for user by email
   ```sql
   SELECT * FROM users WHERE email = ?
   ```
3. **Password Verification**: Compare input password with stored hash using bcryptjs
4. **Token Generation**: Create JWT with user ID, email, and admin status
5. **Response**: Return token and formatted user data

### Authentication Storage
- JWT token stored in localStorage on frontend
- Token included in Authorization header for subsequent requests

## 3. Creating a Report (Red Flag/Intervention)

### Frontend Process
```
User fills form → Geolocation capture → File upload → API call to /api/v1/red-flags
```

### Backend Process (`redFlagsController.createRedFlag`)
1. **Authentication Check**: `auth.verifyToken` middleware validates JWT
2. **Input Validation**: Check required fields (title, description, lat, lng)
3. **File Processing**: Multer handles file uploads (up to 2 files)
   - Images and videos stored in `/uploads` directory
   - File paths stored as JSON arrays in database
4. **Database Insertion**:
   ```sql
   INSERT INTO red_flags (user_id, title, description, latitude, longitude, images, videos)
   VALUES (?, ?, ?, ?, ?, ?, ?)
   ```
5. **Response**: Return success with record ID

### File Upload Details
- **Multer Configuration**: Files stored on server filesystem
- **Path Storage**: Relative paths stored in JSON format
- **Serving**: Static file middleware serves files at `/uploads/*`

## 4. Authentication Middleware Flow

### Token Verification (`auth.verifyToken`)
1. **Header Extraction**: Get Bearer token from Authorization header
2. **JWT Verification**: Decode and verify token signature
3. **User Attachment**: Attach decoded user data to `req.user`
4. **Error Handling**: Return 401 for missing/invalid tokens

### Admin Check (`auth.isAdmin`)
1. **User ID Extraction**: Get user ID from `req.user`
2. **Database Query**: Check `is_admin` flag in users table
3. **Authorization**: Allow/deny based on admin status

### Ownership Check (`auth.checkRecordOwnership`)
1. **Record Lookup**: Query record's `user_id` from specified table
2. **Ownership Verification**: Compare with authenticated user's ID
3. **Admin Override**: Admins can access any record

## 5. Viewing Reports Flow

### User View (Own Reports)
```
GET /api/v1/red-flags → auth.verifyToken → redFlagsController.getAllRedFlags
```

### Admin View (All Reports)
```
GET /api/v1/red-flags → auth.verifyToken → redFlagsController.getAllRedFlags
```

### Backend Process
1. **Query Construction**:
   - **Users**: `WHERE user_id = ?` (own reports only)
   - **Admins**: No WHERE clause (all reports)
2. **Join Query**:
   ```sql
   SELECT rf.*, u.first_name, u.last_name, u.email
   FROM red_flags rf
   JOIN users u ON rf.user_id = u.id
   ORDER BY rf.created_at DESC
   ```
3. **Media Parsing**: JSON.parse() images and videos arrays
4. **Response**: Formatted report data with user information

## 6. Editing Reports Flow

### Frontend Process
```
User selects report → Checks status restrictions → Updates form → API call
```

### Backend Process (Update Location Example)
1. **Authentication**: `auth.verifyToken`
2. **Ownership**: `auth.checkRecordOwnership('red_flags')`
3. **Status Check**: Verify status is 'draft'
   ```sql
   SELECT user_id, status FROM red_flags WHERE id = ?
   ```
4. **Update Operation**:
   ```sql
   UPDATE red_flags SET latitude = ?, longitude = ? WHERE id = ?
   ```
5. **Restrictions**: Only 'draft' status reports can be modified

### Status-Based Restrictions
- **Draft**: Full CRUD operations allowed
- **Under Investigation/Rejected/Resolved**: Read-only access

## 7. Admin Status Update Flow

### Frontend Process
```
Admin selects report → Chooses new status → API call to /api/v1/red-flags/:id/status
```

### Backend Process (`redFlagsController.updateStatus`)
1. **Admin Verification**: `auth.isAdmin` middleware
2. **Status Validation**: Check valid status values
3. **Report Lookup**: Get current report data and user email
4. **Database Update**:
   ```sql
   UPDATE red_flags SET status = ? WHERE id = ?
   ```
5. **Notification Creation**:
   ```sql
   INSERT INTO notifications (user_id, title, message, type, related_entity_type, related_entity_id)
   VALUES (?, ?, ?, ?, ?, ?)
   ```
6. **Email Notification**: Send status change email via EmailService

### Notification Details
- **In-App**: Stored in notifications table
- **Email**: Sent using Nodemailer
- **SMS**: Mentioned in README but not implemented in code

## 8. Notification System Flow

### Polling-Based Updates
```
Frontend polls /api/v1/notifications → Updates UI → Marks as read
```

### Backend Process (`notificationController.getUserNotifications`)
1. **User Filtering**: Get notifications for authenticated user
2. **Unread Count**: Track notification state
3. **Mark as Read**: Bulk update operation

### Real-time Considerations
- Current implementation uses polling
- WebSocket integration could provide true real-time updates

## 9. File Upload and Media Management

### Upload Process
1. **Multer Handling**: Files processed on route with `upload.array('media', 2)`
2. **Type Separation**: Images vs Videos based on mimetype
3. **Path Generation**: Unique filenames stored in `/uploads`
4. **Database Storage**: File paths as JSON arrays

### Media Retrieval
1. **Static Serving**: Express serves files from `/uploads` directory
2. **Path Construction**: Frontend builds full URLs for display
3. **Security**: File access controlled through API authentication

## 10. Error Handling and Validation

### Global Error Middleware
```typescript
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 500,
    error: 'Something went wrong!'
  });
});
```

### Controller-Level Validation
- Input sanitization
- Database constraint checks
- Business rule enforcement
- Consistent error response format

## 11. Database Transaction Flow

### Connection Management
- MySQL2 promise-based queries
- Connection pooling via `pool.execute()`
- Parameterized queries prevent SQL injection

### Schema Relationships
- **Users**: Central entity with CASCADE deletes
- **Reports**: FK to users, status enum constraints
- **Notifications**: FK to users, related entity tracking

## 12. Frontend-Backend Integration

### API Service Layer
```typescript
// frontend/src/services/api.ts
const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: { Authorization: `Bearer ${token}` }
});
```

### State Management
- React Query for server state caching
- Context API for global state (notifications)
- Local storage for authentication persistence

## 13. Security Considerations

### Authentication Security
- JWT with expiration
- Password hashing with bcrypt
- Admin role-based access control

### Data Protection
- Input validation on both frontend and backend
- SQL injection prevention via parameterized queries
- CORS configuration for cross-origin requests

### File Security
- File type validation
- Path traversal protection
- Upload size limits

## 14. Performance Optimizations

### Database Indexes
```sql
CREATE INDEX idx_red_flags_user_id ON red_flags(user_id);
CREATE INDEX idx_red_flags_status ON red_flags(status);
```

### Query Optimization
- JOIN operations for related data
- Selective field retrieval
- Pagination support (not implemented but recommended)

## 15. Deployment Considerations

### Environment Configuration
- Environment variables for database credentials
- Separate configs for development/production
- JWT secret management

### Static Asset Handling
- File uploads need persistent storage in production
- CDN integration recommended for media files
- Database backups for user data

This walkthrough covers the core technical flows of the IREPORTER application, demonstrating how user interactions translate to database operations, API calls, and system responses while maintaining security, data integrity, and user experience.
