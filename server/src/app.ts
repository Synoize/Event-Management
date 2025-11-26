import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
import { json } from 'body-parser';
import { participantAuthRouter } from './routes/participant/auth';
import { participantUserRouter } from './routes/participant/users';
import { participantEventRouter } from './routes/participant/events';
import { participantEnrollmentRouter } from './routes/participant/enrollments';
import { organizerAuthRouter } from './routes/organizer/auth';
import { organizerProfileRouter } from './routes/organizer/profile';
import { organizerEventRouter } from './routes/organizer/events';
import { organizerPaymentRouter } from './routes/organizer/payments';
import { adminAuthRouter } from './routes/admin/auth';
import { adminUserRouter } from './routes/admin/users';
import { adminOrganizerRouter } from './routes/admin/organizers';
import { adminEventRouter } from './routes/admin/events';
import { adminTransactionRouter } from './routes/admin/transactions';
import { adminStatsRouter } from './routes/admin/stats';
import { razorpayWebhookRouter } from './routes/webhooks/razorpay';
import { errorHandler } from './middleware/errorHandler';

export const createApp = () => {
  const app = express();

  app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
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


