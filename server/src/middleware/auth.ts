import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser, UserRole } from '../models/User';

export interface AuthPayload {
  userId: string;
  role: UserRole;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
    authPayload?: AuthPayload;
  }
}

const getAccessSecret = () => process.env.JWT_ACCESS_SECRET || 'access_secret';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, getAccessSecret()) as AuthPayload;
    const user = await User.findById(payload.userId);
    if (!user || user.isSuspended) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    req.authPayload = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireRole = (role: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

export const requireOrganizer = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'organizer') {
    return res.status(403).json({ message: 'Organizer only' });
  }
  if (req.user.verificationStatus !== 'verified') {
    return res.status(403).json({ message: 'Organizer not verified' });
  }
  next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' });
  }
  next();
};


