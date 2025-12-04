import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../models/User.js';
import { validateBody } from '../../middleware/validate.js';
import { loginSchema, organizerRegisterSchema } from '../../validations/authSchemas.js';

export const organizerAuthRouter = Router();

const signOrganizerTokens = (userId) => {
  const accessSecret = process.env.JWT_ACCESS_SECRET || 'access_secret';
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
  const accessOptions = {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  };
  const refreshOptions = {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  };
  const accessToken = jwt.sign({ userId, role: 'organizer' }, accessSecret, accessOptions);
  const refreshToken = jwt.sign({ userId, role: 'organizer' }, refreshSecret, refreshOptions);
  return { accessToken, refreshToken };
};

organizerAuthRouter.post(
  '/register',
  validateBody(organizerRegisterSchema),
  async (req, res) => {
    const { name, email, password, organizationName, officialId, kycDocuments } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: 'organizer',
      organizationName,
      officialId,
      kycDocuments,
      verificationStatus: 'pending',
    });
    const tokens = signOrganizerTokens(user.id);
    res
      .status(201)
      .json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, ...tokens });
  }
);

organizerAuthRouter.post('/login', validateBody(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, role: 'organizer' });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const tokens = signOrganizerTokens(user.id);
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, ...tokens });
});
