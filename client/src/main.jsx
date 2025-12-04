import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { EventProvider } from './contexts/EventContext.jsx'
import { EnrollmentProvider } from './contexts/EnrollmentContext.jsx'
import { OrganizerProvider } from './contexts/OrganizerContext.jsx'
import { AdminProvider } from './contexts/AdminContext.jsx'
import { UserProvider } from './contexts/UserContext.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <EventProvider>
      <EnrollmentProvider>
        <OrganizerProvider>
          <AdminProvider>
            <UserProvider>
              <App />
            </UserProvider>
          </AdminProvider>
        </OrganizerProvider>
      </EnrollmentProvider>
    </EventProvider>
  </AuthProvider>,
)

