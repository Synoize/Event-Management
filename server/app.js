import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
import bodyParser from 'body-parser';

const { json } = bodyParser;

import { participantAuthRouter } from './routes/participant/auth.js';
import { participantUserRouter } from './routes/participant/users.js';
import { participantEventRouter } from './routes/participant/events.js';
import { participantEnrollmentRouter } from './routes/participant/enrollments.js';
import { organizerAuthRouter } from './routes/organizer/auth.js';
import { organizerProfileRouter } from './routes/organizer/profile.js';
import { organizerEventRouter } from './routes/organizer/events.js';
import { organizerPaymentRouter } from './routes/organizer/payments.js';
import { adminAuthRouter } from './routes/admin/auth.js';
import { adminUserRouter } from './routes/admin/users.js';
import { adminOrganizerRouter } from './routes/admin/organizers.js';
import { adminEventRouter } from './routes/admin/events.js';
import { adminTransactionRouter } from './routes/admin/transactions.js';
import { adminStatsRouter } from './routes/admin/stats.js';
import { razorpayWebhookRouter } from './routes/webhooks/razorpay.js';
import { errorHandler } from './middleware/errorHandler.js';

export const createApp = () => {
  const app = express();

  app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000', credentials: true }));
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(json());
  app.use(cookieParser());

  // test
  app.get('/', (req, res) => {
    res.send('server is running...');
  });

  // Participant routes
  app.use('/auth', participantAuthRouter);
  app.use('/users', participantUserRouter);
  app.use('/events', participantEventRouter);
  app.use('/enrollments', participantEnrollmentRouter);

  // Organizer routes
  app.use('/organizer/auth', organizerAuthRouter);
  app.use('/organizer/profile', organizerProfileRouter);
  app.use('/organizer/events', organizerEventRouter);
  app.use('/organizer/payments', organizerPaymentRouter);

  // Admin routes
  app.use('/admin/auth', adminAuthRouter);
  app.use('/admin/users', adminUserRouter);
  app.use('/admin/organizers', adminOrganizerRouter);
  app.use('/admin/events', adminEventRouter);
  app.use('/admin/transactions', adminTransactionRouter);
  app.use('/admin/stats', adminStatsRouter);

  // Webhooks
  app.use('/webhooks/razorpay', razorpayWebhookRouter);

  app.use(errorHandler);

  return app;
};
