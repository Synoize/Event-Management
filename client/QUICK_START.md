# Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
Create a `.env` file:
```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
```

### 3. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

## 📋 Features

### For Participants
- ✅ Browse and search events
- ✅ View event details
- ✅ Enroll in events (free and paid)
- ✅ View enrolled events
- ✅ Razorpay payment integration

### For Organizers
- ✅ Create and manage events
- ✅ Upload event images
- ✅ View event attendees
- ✅ Update event status (draft/published/cancelled)

### For Admins
- ✅ View dashboard statistics
- ✅ Manage users and organizers
- ✅ Manage events
- ✅ View transactions

## 🔧 Code Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   ├── contexts/        # Context API providers
│   ├── pages/          # Page components
│   ├── utils/          # Utility functions
│   └── types/          # TypeScript declarations
```

## 🎨 Key Components

- **AuthContext**: Handles all authentication
- **EventContext**: Manages event operations
- **EnrollmentContext**: Handles enrollments and payments
- **ProtectedRoute**: Route protection based on roles

## 💡 Usage Examples

### Using Context Hooks
```javascript
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../contexts/EventContext';

const MyComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { events, searchEvents, loading } = useEvents();
  
  // Use the hooks...
};
```

## 🐛 Troubleshooting

### API Connection Issues
- Check backend is running on port 5000
- Verify `VITE_API_URL` in `.env`
- Check browser console for errors

### Payment Issues
- Ensure Razorpay key is set in `.env`
- Check Razorpay dashboard for correct keys
- Verify payment webhook is configured

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 Notes

- All API calls are handled through Context providers
- Authentication tokens are automatically managed
- Protected routes check user roles
- Toast notifications provide user feedback

