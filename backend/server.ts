import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import routes from './routes/routes';
import { ApiResponse } from './types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/v1', routes);

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 200,
    data: [{ message: 'iReporter API is running successfully' }]
  });
});

// Handle 404 routes
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    status: 404,
    error: 'Route not found'
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 500,
    error: 'Something went wrong!'
  });
});

app.listen(PORT, () => {
  console.log(`iReporter server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});