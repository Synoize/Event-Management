import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventDetails from './pages/EventDetails';
import MyEnrollments from './pages/MyEnrollments';
import OrganizerEvents from './pages/organizer/OrganizerEvents';
import CreateEvent from './pages/organizer/CreateEvent';
import EditEvent from './pages/organizer/EditEvent';
import AdminDashboard from './pages/admin/AdminDashboard';
import Events from './pages/Events';
import Reviews from './pages/Reviews';
import AboutUs from './pages/AboutUs';
import Payments from './pages/organizer/Payments';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="*" element={<>Error Page</>} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<Events />}>
            <Route path=":city" element={<Events />} />
          </Route>
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path='/reviews' element={<Reviews />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute requiredRole={"participant"}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Participant Routes */}
          <Route
            path="/my-enrollments"
            element={
              <ProtectedRoute requiredRole="participant">
                <MyEnrollments />
              </ProtectedRoute>
            }
          />

          {/* Organizer Routes */}
          <Route path="/organizer">
            <Route
              path="profile"
              element={
                <ProtectedRoute requiredRole={"organizer"}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="events"
              element={
                <ProtectedRoute requiredRole="organizer">
                  <OrganizerEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="create-event"
              element={
                <ProtectedRoute requiredRole="organizer">
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="events/:id/edit"
              element={
                <ProtectedRoute requiredRole="organizer">
                  <EditEvent />
                </ProtectedRoute>
              }
            />
            <Route path="payments"
              element={
                <ProtectedRoute requiredRole="organizer">
                  <Payments />
                </ProtectedRoute>
              } />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<>Admin</>}>
            <Route
              path="profile"
              element={
                <ProtectedRoute requiredRole={"admin"}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Route>

        </Routes>
      </Layout>
      <Toaster position="top-right" richColors />
    </Router>
  );
}

export default App;

