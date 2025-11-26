import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { User } from '../../models/User';
import { validateBody } from '../../middleware/validate';
import { adminLoginSchema } from '../../validations/authSchemas';

export const adminAuthRouter = Router();

const accessSecret: Secret = process.env.JWT_ACCESS_SECRET || 'access_secret';

adminAuthRouter.post('/login', validateBody(adminLoginSchema), async (req, res) => {
  const { email, password } = req.body;
  const admin = await User.findOne({ email, role: 'admin' });
  if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const options: SignOptions = {
    expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as any,
  };
  const token = jwt.sign({ userId: admin.id, role: 'admin' }, accessSecret, options);
  res.json({ user: { id: admin.id, email: admin.email }, accessToken: token });
});


