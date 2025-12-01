# Technical Presentation: IREPORTER App

## Slide 1: Introduction
- **Presenter:** BLACKBOXAI
- **Topic:** Technical Overview of IREPORTER - A Corruption and Public Issue Reporting Platform
- **Date:** [Current Date]
- **Objective:** Provide a comprehensive technical breakdown of the IREPORTER application, covering architecture, technologies, features, and implementation details.

## Slide 2: Project Overview
- **IREPORTER** is a full-stack web application designed to empower citizens to report corruption and request government interventions for public issues.
- **Core Functionality:**
  - Users can create **Red-Flag Records** (corruption-related incidents)
  - Users can create **Intervention Records** (requests for government action, e.g., infrastructure repairs)
  - Geolocation support for precise incident reporting
  - Status tracking: Draft → Under Investigation → Rejected/Resolved
  - Admin dashboard for managing reports
  - Real-time notifications (SMS, Email, In-app)

## Slide 3: Tech Stack
### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + Radix UI Components
- **Routing:** React Router DOM
- **State Management:** React Query (@tanstack/react-query)
- **Maps:** Leaflet with React-Leaflet
- **Forms:** React Hook Form with Zod validation
- **Icons:** Lucide React
- **Notifications:** Sonner (toast notifications)

### Backend
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** MySQL with mysql2 driver
- **Authentication:** JSON Web Tokens (jsonwebtoken) + bcryptjs
- **File Upload:** Multer
- **Email Service:** Nodemailer
- **Development:** ts-node-dev

### Infrastructure
- **Database:** MySQL
- **Deployment:** [Not specified in code, but likely containerized with Docker]
- **Environment:** Development (localhost:3000 backend, localhost:3001 frontend)

## Slide 4: Architecture Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React/TS)    │◄──►│   (Express/TS)  │◄──►│   (MySQL)       │
│                 │    │                 │    │                 │
│ - Components    │    │ - Controllers   │    │ - Users         │
│ - Pages         │    │ - Services      │    │ - Red Flags     │
│ - Services      │    │ - Middleware    │    │ - Interventions │
│ - Contexts      │    │ - Routes        │    │ - Notifications │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```
- **Frontend-Backend Communication:** RESTful API with CORS enabled
- **Authentication Flow:** JWT tokens stored in localStorage
- **File Handling:** Media uploads stored on server filesystem
- **Real-time Features:** Polling for notifications (no WebSockets implemented)

## Slide 5: Database Schema
### Tables Overview
1. **users**
   - id, first_name, last_name, email, password, phone, is_admin, timestamps
   - Default admin user: Mollyadmin@ireporter.com

2. **red_flags**
   - id, user_id, title, description, latitude, longitude, status, images (JSON), videos (JSON), timestamps
   - Status: draft, under-investigation, rejected, resolved

3. **interventions**
   - Similar structure to red_flags

4. **notifications**
   - id, user_id, title, message, type, is_read, related_entity_type/id, timestamps

### Key Relationships
- Red Flags & Interventions: FK to users (CASCADE delete)
- Notifications: FK to users (CASCADE delete)
- Indexes on user_id, status, and email for performance

## Slide 6: API Endpoints
### Authentication
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get user profile (protected)

### Red Flags
- `GET /api/v1/red-flags` - List all red flags (user's own)
- `GET /api/v1/red-flags/:id` - Get specific red flag
- `POST /api/v1/red-flags` - Create red flag (with media upload)
- `PUT /api/v1/red-flags/:id` - Update red flag (with media)
- `PATCH /api/v1/red-flags/:id/location` - Update location
- `PATCH /api/v1/red-flags/:id/comment` - Update comment
- `POST /api/v1/red-flags/:id/media` - Add media
- `DELETE /api/v1/red-flags/:id` - Delete red flag
- `PATCH /api/v1/red-flags/:id/status` - Admin: Update status

### Interventions
- Similar endpoints to Red Flags

### Notifications
- `GET /api/v1/notifications` - Get user notifications
- `PUT /api/v1/notifications/read` - Mark all as read

## Slide 7: Key Features Implementation
### User Features
- **CRUD Operations:** Full create, read, update, delete for reports
- **Geolocation:** Latitude/longitude coordinates with Leaflet map integration
- **Media Upload:** Images and videos stored as file paths in JSON arrays
- **Status Restrictions:** Users can only edit/delete reports in 'draft' status

### Admin Features
- **Status Management:** Change report status (Under Investigation, Rejected, Resolved)
- **Dashboard:** View and manage all reports
- **Access Control:** Admin-only routes protected by middleware

### Notification System
- **Types:** In-app notifications, Email, SMS (mentioned but SMS implementation not visible)
- **Triggers:** Status changes by admin
- **Storage:** Persistent in notifications table

## Slide 8: Authentication & Authorization
### JWT Implementation
- **Token Generation:** On login/signup, JWT created with user ID and admin status
- **Middleware:** `auth.verifyToken` validates JWT on protected routes
- **Ownership Check:** `auth.checkRecordOwnership` ensures users can only modify their own records
- **Admin Check:** `auth.isAdmin` restricts admin-only operations

### Security Features
- **Password Hashing:** bcryptjs for secure password storage
- **CORS:** Configured for localhost:3001 (frontend)
- **Input Validation:** (Assumed via frontend Zod schemas and backend checks)

## Slide 9: File Upload & Media Handling
### Multer Configuration
- **Limits:** Up to 2 media files per upload
- **Storage:** Local filesystem in 'uploads' directory
- **Serving:** Static file serving via Express at `/uploads` path
- **Database Storage:** File paths stored as JSON arrays in images/videos columns

### Supported Formats
- Images and Videos (specific formats not restricted in code)

## Slide 10: Notification System
### Implementation
- **Service Layer:** `notificationService.ts` handles notification creation
- **Email Service:** `emailService.ts` using Nodemailer
- **Database:** Notifications table for persistence
- **Frontend:** NotificationBell component with real-time updates via polling

### Notification Types
- Status change notifications
- Related to specific reports (red-flags/interventions)

## Slide 11: Frontend Architecture
### Component Structure
- **UI Components:** Radix UI primitives with custom styling
- **Pages:** Auth, Dashboard, RedFlags, Interventions, AdminDashboard, etc.
- **Contexts:** NotificationContext for state management
- **Services:** API calls abstracted in `api.ts`
- **Types:** TypeScript interfaces for type safety

### Key Libraries
- **React Query:** For server state management and caching
- **React Hook Form:** Efficient form handling
- **Leaflet:** Interactive maps for geolocation
- **Tailwind + Radix:** Modern, accessible UI components

## Slide 12: Backend Architecture
### MVC Pattern
- **Controllers:** Handle business logic (authController, redFlagsController, etc.)
- **Services:** External integrations (email, notifications)
- **Middleware:** Authentication, ownership checks, admin verification
- **Routes:** RESTful endpoint definitions
- **Utils:** Helper functions and email utilities

### Error Handling
- Global error middleware for 500 errors
- 404 handler for undefined routes
- Health check endpoint at `/health`

## Slide 13: Development & Deployment
### Development Setup
- **Frontend:** `npm run dev` (Vite dev server on port 3001)
- **Backend:** `npm run dev` (ts-node-dev on port 3000)
- **Database:** MySQL with init.sql for schema setup
- **Scripts:** `start.sh` likely for running both services

### Build Process
- **Frontend:** `vite build` for production bundle
- **Backend:** `tsc` for TypeScript compilation
- **Environment:** dotenv for configuration management

### Deployment Considerations
- **Containerization:** Not implemented but recommended (Docker)
- **Environment Variables:** Database credentials, JWT secret, email config
- **Static Assets:** File uploads need persistent storage in production
- **Scaling:** Stateless backend, database optimization needed for high load

## Slide 14: Challenges & Solutions
### Technical Challenges
- **File Upload Management:** Solved with Multer and local storage
- **Geolocation Handling:** Integrated Leaflet for map interactions
- **Status Workflow:** Enforced via middleware and database constraints
- **Real-time Notifications:** Implemented via polling (WebSockets could be future enhancement)

### Business Logic
- **Ownership Restrictions:** Middleware checks prevent unauthorized modifications
- **Admin Privileges:** Separate routes and checks for admin operations
- **Data Integrity:** Foreign keys and CASCADE deletes maintain consistency

## Slide 15: Future Enhancements
- **WebSockets:** For real-time notifications instead of polling
- **Cloud Storage:** AWS S3 or similar for media files
- **SMS Integration:** Complete SMS notification implementation
- **Advanced Analytics:** Dashboard with charts and reports
- **Mobile App:** React Native companion app
- **API Documentation:** Swagger/OpenAPI specs
- **Testing:** Unit and integration tests (Jest mentioned but not implemented)
- **CI/CD:** Automated deployment pipelines

## Slide 16: Conclusion
- **IREPORTER** demonstrates a robust full-stack application with modern technologies
- **Key Strengths:**
  - Comprehensive feature set for citizen reporting
  - Secure authentication and authorization
  - Scalable architecture with clear separation of concerns
  - Type-safe development with TypeScript
  - Responsive UI with accessibility considerations
- **Impact:** Empowers citizens to report issues and hold authorities accountable
- **Technical Excellence:** Well-structured codebase following best practices

## Slide 17: Q&A
- Questions and Discussion
- Thank you for your attention!

---

*Note: This presentation is generated based on the current codebase analysis. Some features mentioned in README may not be fully implemented (e.g., SMS notifications).*
