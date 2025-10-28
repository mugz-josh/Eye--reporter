import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { ApiResponse } from './types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', routes);

// Health check route
app.get('/health', (req: Request, res: Response) => {
  const response: ApiResponse = {
    status: 200,
    data: [{ message: 'iReporter API is running successfully' }]
  };
  res.status(200).json(response);
});

// Handle 404 routes
app.use('*', (req: Request, res: Response) => {
  const response: ApiResponse = {
    status: 404,
    message: 'Route not found'
  };
  res.status(404).json(response);
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const response: ApiResponse = {
    status: 500,
    message: 'Something went wrong!'
  };
  res.status(500).json(response);
});

app.listen(PORT, () => {
  console.log(`iReporter server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});