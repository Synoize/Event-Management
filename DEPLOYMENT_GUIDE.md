# Event Management Project - Deployment & Setup Guide

## Project Status ✅

All server and client code has been fixed and tested:
- ✅ Server authentication fixed (JWT secrets read at runtime, not import-time)
- ✅ Server builds without errors (`npm run build`)
- ✅ Client builds successfully (`npm run build`)
- ✅ All critical pages and contexts implemented
- ✅ Auth flow tested and working
- ✅ API endpoints functional
- ✅ Error handling improved across all modules

---

## What Was Fixed

### Server Fixes
1. **JWT Secret Loading Issue** (`server/src/server.ts`)
   - Moved `dotenv.config()` before other imports so env vars are available at module load time
   - Prevents import-time secret caching with fallback values

2. **Auth Routes Fixed** (`server/src/routes/**/auth.ts`)
   - Moved JWT secret reads from import-time to sign-time
   - Now read `process.env.JWT_ACCESS_SECRET` at the moment of token generation
   - Ensures production env vars override dev defaults

3. **Organizer Routes Fixed** (`server/src/routes/organizer/events.ts`)
   - Changed GET `/organizer/events` to use `requireRole('organizer')` instead of `requireOrganizer`
   - Allows unverified organizers to list their own events (they can create events before verification)
   - Added pagination param sanitization (min 1, max 100)

4. **Socket.IO Error Handling** (`server/src/sockets/chat.ts`)
   - Added proper error events instead of silent disconnects
   - Emits `unauthorized` event with error details for debugging

### Client Fixes
1. **Register Page** (`client/src/pages/Register.jsx`)
   - Added password confirmation field
   - Added validation for password match and minimum length
   - Added loading state to submit button
   - Conditional organizer fields

2. **Login Page** (`client/src/pages/Login.jsx`)
   - Added loading state to submit button
   - Proper error handling with toast notifications

3. **All Key Pages** - Already implemented and working:
   - `EventDetails.jsx` - Full event display with free/paid enrollment
   - `MyEnrollments.jsx` - User enrollment list with filtering
   - `OrganizerEvents.jsx` - Organizer event management
   - `CreateEvent.jsx` - Event creation with image upload
   - `Events.jsx` - Event browsing with search/filter
   - `Home.jsx` - Landing page

---

## Environment Variables Required

### Server (.env)
```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/event_management

# JWT Secrets (use strong random values)
JWT_ACCESS_SECRET=your_strong_random_access_secret_at_least_32_chars
JWT_REFRESH_SECRET=your_strong_random_refresh_secret_at_least_32_chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay (for payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## Local Development Setup

### Prerequisites
- Node.js 16+ and npm/yarn
- MongoDB (local or Atlas)
- Cloudinary account (free tier available)
- Razorpay account (test keys)
- Google OAuth credentials

### Installation

```bash
# 1. Clone and install server dependencies
cd server
npm install
npm run build

# 2. Create .env with variables above
# Edit server/.env with your credentials

# 3. Start server in dev mode
npm run dev
# Server runs on http://localhost:5000

# 4. In another terminal, install client dependencies
cd ../client
npm install

# 5. Create .env with variables above
# Edit client/.env with API URL and Razorpay/Google keys

# 6. Start client dev server
npm run dev
# Client runs on http://localhost:5173
```

### Testing Auth Flow
```bash
# 1. Register as participant
- Go to http://localhost:5173/register
- Select "Participant", fill form, click Register
- Should redirect to home and show logged in

# 2. Test protected routes
- Click "My Enrollments" (protected participant route)
- Should work after login
- Should redirect to login if not authenticated

# 3. Test organizer login
- Go to /login, select Organizer role
- Use organizer credentials
- Should redirect to /organizer/events

# 4. Test event creation
- As organizer, click "Create Event" 
- Fill form and submit
- Should appear in /organizer/events list

# 5. Test event browsing
- Go to /events
- Browse and filter events
- Click event to see details and enroll button
```

---

## Deployment to Vercel (Server)

**Important:** Vercel Serverless Functions do NOT support persistent WebSocket connections. Socket.IO chat will not work on Vercel.

### Option A: Server-only on Vercel (No Sockets)
```bash
# 1. Create Vercel account at vercel.com

# 2. Install Vercel CLI
npm i -g vercel

# 3. Prepare for serverless
cd server
npm install serverless-http

# 4. Create api/index.js at repo root
# See VERCEL_SETUP.md for configuration

# 5. Deploy
vercel --prod

# 6. Set environment variables on Vercel dashboard
# - Add all .env variables under Settings > Environment Variables
```

### Option B: Deploy Server Separately (Recommended for Sockets)
If you need real-time chat, host the server on a platform that supports WebSockets:
- **Render** (render.com) - Free tier available
- **Railway** (railway.app) - $5/month
- **Fly.io** (fly.io) - Free tier available
- **DigitalOcean App Platform** - $12/month

**Quick Render Deployment:**
```bash
# 1. Push code to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Go to render.com, connect GitHub repo
# 3. Create new Web Service
# 4. Set build command: cd server && npm install && npm run build
# 5. Set start command: npm run start
# 6. Add environment variables
# 7. Deploy
```

---

## Deployment to Vercel (Client)

```bash
# 1. Push client to GitHub

# 2. Go to vercel.com dashboard

# 3. Click "New Project" and import your GitHub repo

# 4. Configure:
   - Root Directory: ./client
   - Build Command: npm run build
   - Output Directory: dist

# 5. Add Environment Variables:
   - VITE_API_URL=https://your-api-url.com
   - VITE_RAZORPAY_KEY_ID=your_key
   - VITE_GOOGLE_CLIENT_ID=your_client_id

# 6. Click Deploy
```

---

## Production Checklist

- [ ] Update `CLIENT_ORIGIN` in server .env to production client URL
- [ ] Set `NODE_ENV=production` in server .env
- [ ] Generate strong random values for JWT secrets (32+ chars)
- [ ] Set up MongoDB Atlas with IP whitelist
- [ ] Configure Cloudinary for image uploads
- [ ] Set up Razorpay payment gateway
- [ ] Test full auth flow in production
- [ ] Test event creation and enrollment
- [ ] Set up logging/monitoring (Sentry, LogRocket)
- [ ] Enable CORS only for production domain
- [ ] Test payment workflow with test keys
- [ ] Set up SSL certificates
- [ ] Configure rate limiting on API endpoints

---

## API Endpoints

### Auth (Participant)
- POST `/auth/register` - Register participant
- POST `/auth/login` - Login participant
- POST `/auth/google` - Google OAuth login

### Auth (Organizer)
- POST `/organizer/auth/register` - Register organizer
- POST `/organizer/auth/login` - Login organizer

### Organizer Routes (Require Auth)
- GET `/organizer/events?page=1&limit=10` - List my events
- POST `/organizer/events` - Create event
- PUT `/organizer/events/:id` - Edit event
- DELETE `/organizer/events/:id` - Delete event
- GET `/organizer/events/:id/attendees` - Get attendees
- POST `/organizer/events/upload-image` - Upload event image
- POST `/organizer/profile/update` - Update profile
- POST `/organizer/payments/:transactionId/refund` - Refund payment

### Participant Routes (Require Auth)
- GET `/events/search?q=...&category=...` - Search events
- GET `/events/city/:city` - Get events by city
- GET `/events/:id` - Get event details
- POST `/enrollments/:eventId` - Enroll in event
- GET `/enrollments` - Get my enrollments
- POST `/enrollments/:id/verify` - Verify payment
- GET `/users/me` - Get profile
- PUT `/users/update` - Update profile

### Admin Routes (Require Auth + Admin Role)
- GET `/admin/stats` - Dashboard statistics
- GET `/admin/users` - List users
- PATCH `/admin/users/:id/suspend` - Suspend user
- GET `/admin/organizers` - List organizers
- PATCH `/admin/organizers/:id/verify` - Verify organizer
- GET `/admin/events` - List all events
- DELETE `/admin/events/:id` - Delete event
- GET `/admin/transactions` - List transactions

---

## Troubleshooting

### "Invalid token" Error
- **Cause:** JWT secrets mismatch between token creation and verification
- **Fix:** Ensure `JWT_ACCESS_SECRET` is the same on both issuance and verification
- **Check:** Server logs should show `payload:` when token is verified

### "Unauthorized" on Protected Routes
- **Cause:** Token not sent in Authorization header or token expired
- **Fix:** Ensure `Authorization: Bearer <token>` header is present
- **Check:** Use browser DevTools to inspect request headers

### CORS Errors
- **Cause:** `CLIENT_ORIGIN` doesn't match client URL
- **Fix:** Update `CLIENT_ORIGIN` in `.env` to match your client domain
- **Example:** `CLIENT_ORIGIN=https://myapp.vercel.app`

### Database Connection Fails
- **Cause:** `MONGO_URI` is incorrect or MongoDB Atlas whitelist missing
- **Fix:** Verify connection string, add server IP to Atlas IP Whitelist
- **Check:** MongoDB Atlas > Network Access > IP Whitelist

### Image Upload Fails
- **Cause:** Cloudinary credentials invalid
- **Fix:** Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- **Check:** Test on Cloudinary dashboard

### Payment Gateway Issues
- **Cause:** Razorpay keys invalid or sandbox/production mismatch
- **Fix:** Use test keys for development, production keys for live
- **Check:** Verify Razorpay account is active and keys are correct

---

## Performance Tips

1. **Enable Caching**
   - Client: Cache event list for 5 minutes
   - Server: Add Redis for session cache

2. **Optimize Images**
   - Use Cloudinary transformations for thumbnails
   - Example: `url?w=300&h=200&c=fill`

3. **API Pagination**
   - Always paginate large lists
   - Default limit 10-20, max 100

4. **Database Indexes**
   - Ensure indexes on frequently queried fields
   - Add compound indexes for common filters

5. **Monitor & Log**
   - Set up error tracking (Sentry)
   - Monitor API response times
   - Alert on failed payments

---

## Support & Documentation

- **Server README:** `server/README.md`
- **Client README:** `client/README.md`
- **API Documentation:** `API.md` (create after deployment)
- **Database Schema:** See `server/src/models/`
- **GitHub Issues:** Report bugs and feature requests

---

**Last Updated:** December 2025
**Status:** ✅ Production Ready
