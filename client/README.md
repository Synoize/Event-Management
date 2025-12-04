# Event Management Frontend

A modern React frontend application for the Event Management System, built with Vite, React Router, Tailwind CSS, and Context API.

## Features

- **Authentication**: Participant, Organizer, and Admin login/registration
- **Event Management**: Browse, search, create, and manage events
- **Enrollments**: Enroll in events and manage enrollments
- **Role-based Access**: Protected routes for different user roles
- **Toast Notifications**: User-friendly notifications using Sonner
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Tech Stack

- **React 18**: UI library
- **Vite**: Build tool and dev server
- **React Router DOM**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API requests
- **Sonner**: Toast notification library
- **Context API**: State management for all backend APIs

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Layout.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/         # Context API providers
│   │   ├── AuthContext.jsx
│   │   ├── EventContext.jsx
│   │   ├── EnrollmentContext.jsx
│   │   ├── OrganizerContext.jsx
│   │   ├── AdminContext.jsx
│   │   └── UserContext.jsx
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── EventDetails.jsx
│   │   ├── MyEnrollments.jsx
│   │   ├── organizer/
│   │   └── admin/
│   ├── utils/            # Utility functions
│   │   └── api.js
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000
```

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Context API Usage

All backend APIs are accessible through Context providers:

### AuthContext
- `participantRegister(data)`
- `participantLogin(email, password)`
- `participantGoogleLogin(credential)`
- `organizerRegister(data)`
- `organizerLogin(email, password)`
- `adminLogin(email, password)`
- `logout()`

### EventContext
- `searchEvents(filters)`
- `getEventById(id)`
- `getEventsByCity(city)`
- `createEvent(eventData)` (Organizer)
- `updateEvent(id, eventData)` (Organizer)
- `deleteEvent(id)` (Organizer)
- `getMyEvents(page, limit)` (Organizer)
- `uploadEventImage(file)` (Organizer)

### EnrollmentContext
- `enrollInEvent(eventId)`
- `getMyEnrollments()`
- `verifyPayment(enrollmentId, paymentData)`

### OrganizerContext
- `getProfile()`
- `updateProfile(data)`
- `getPaymentHistory()`

### AdminContext
- `getStats()`
- `getUsers(page, limit)`
- `updateUserStatus(userId, data)`
- `getOrganizers(page, limit)`
- `verifyOrganizer(organizerId, status)`
- `getEvents(page, limit)`
- `updateEventStatus(eventId, status)`
- `getTransactions(page, limit)`

### UserContext
- `getProfile()`
- `updateProfile(data)`

## Routes

### Public Routes
- `/` - Home page (event listing)
- `/login` - Login page
- `/register` - Registration page
- `/events/:id` - Event details page

### Participant Routes (Protected)
- `/my-enrollments` - View enrolled events

### Organizer Routes (Protected)
- `/organizer/events` - Manage events
- `/organizer/create-event` - Create new event
- `/organizer/events/:id/edit` - Edit event

### Admin Routes (Protected)
- `/admin/dashboard` - Admin dashboard

## Environment Variables

- `VITE_API_URL`: Backend API URL (default: http://localhost:5000)

## Notes

- The frontend uses a proxy configuration in `vite.config.js` to forward `/api` requests to the backend
- Authentication tokens are stored in localStorage
- All API requests include authentication tokens automatically via axios interceptors
- Protected routes check authentication and role before rendering

