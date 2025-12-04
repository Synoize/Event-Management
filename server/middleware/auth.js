import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const getAccessSecret = () => process.env.JWT_ACCESS_SECRET || 'access_secret';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  
  try {
    const payload = jwt.verify(token, getAccessSecret());
    console.log("payload: ", payload);
    
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

export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

export const requireOrganizer = (req, res, next) => {
  if (!req.user || req.user.role !== 'organizer') {
    return res.status(403).json({ message: 'Organizer only' });
  }
  if (req.user.verificationStatus !== 'verified') {
    return res.status(403).json({ message: 'Organizer not verified' });
  }
  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' });
  }
  next();
};
