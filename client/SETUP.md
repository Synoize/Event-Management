# Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn

## Installation Steps

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

## Backend Setup

Make sure your backend server is running on `http://localhost:5000` (or update `VITE_API_URL` accordingly).

## Features

- ✅ Authentication (Participant, Organizer, Admin)
- ✅ Event browsing and search
- ✅ Event creation and management (Organizer)
- ✅ Enrollment and payment (Razorpay integration)
- ✅ Admin dashboard
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Protected routes

## Common Issues

### CORS Errors
Make sure your backend has CORS configured to allow requests from `http://localhost:3000`

### API Connection Issues
- Check that `VITE_API_URL` is correct
- Ensure backend server is running
- Check browser console for detailed error messages

### Razorpay Payment Issues
- Make sure `VITE_RAZORPAY_KEY_ID` is set in `.env`
- Check Razorpay dashboard for test/live keys

