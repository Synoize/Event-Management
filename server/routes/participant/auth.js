import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../../models/User.js';
import { validateBody } from '../../middleware/validate.js';
import { loginSchema, registerSchema } from '../../validations/authSchemas.js';

export const participantAuthRouter = Router();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signTokens = (userId) => {
  const accessSecret = process.env.JWT_ACCESS_SECRET || 'access_secret';
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
  const accessOptions = {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  };
  const refreshOptions = {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  };
  const accessToken = jwt.sign({ userId, role: 'participant' }, accessSecret, accessOptions);
  const refreshToken = jwt.sign({ userId, role: 'participant' }, refreshSecret, refreshOptions);
  return { accessToken, refreshToken };
};

participantAuthRouter.post('/register', validateBody(registerSchema), async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already registered' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    passwordHash,
    role: 'participant',
    isEmailVerified: false,
  });
  const tokens = signTokens(user.id);
  res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, ...tokens });
});

participantAuthRouter.post('/login', validateBody(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, role: 'participant' });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const tokens = signTokens(user.id);
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, ...tokens });
});

// Google OAuth login/register
participantAuthRouter.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ message: 'Invalid Google token' });
    }

    const { email, name, sub: googleId } = payload;

    if (!email) {
      return res.status(400).json({ message: 'Email not provided by Google' });
    }

    // Check if user exists
    let user = await User.findOne({ email, role: 'participant' });

    if (!user) {
      // Create new user with a random password (they'll use Google to login)
      const passwordHash = await bcrypt.hash(googleId + Date.now(), 10);
      user = await User.create({
        name: name || 'User',
        email,
        passwordHash,
        role: 'participant',
        isEmailVerified: true,
      });
    }

    const tokens = signTokens(user.id);
    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      ...tokens,
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(400).json({ message: 'Google authentication failed', error: error.message });
  }
});
