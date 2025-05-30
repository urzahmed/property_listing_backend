import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';

// Define a custom interface for authenticated requests
export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;

    // Log all headers for debugging
    // console.log('All headers:', req.headers);
    // console.log('Authorization header:', req.headers.authorization);
    // console.log('Authorization header type:', typeof req.headers.authorization);

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token extracted:', token);
      console.log('Token length:', token.length);
    } else {
      console.log('Authorization header format check failed');
      console.log('Header starts with Bearer?', req.headers.authorization?.startsWith('Bearer'));
    }

    if (!token) {
      console.log('No token found in request');
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    try {
      // Use the same secret as in the auth controller
      const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_key_123';
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('Decoded token:', decoded);

      // Get user from the token
      const user = await User.findById((decoded as any)._id).select('-password');
      console.log('User found:', user ? 'Yes' : 'No');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      (req as AuthenticatedRequest).user = user;
      next();
    } catch (error) {
      console.log('Token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }
  } catch (error) {
    console.log('Middleware error:', error);
    next(error);
  }
}; 