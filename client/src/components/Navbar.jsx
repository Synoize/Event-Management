import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import ConfirmLogout from "./ConfirmLogout";
import { assets } from "../assets/assets";
import EventCity from "./EventCity";
import { useEvents } from "../contexts/EventContext";

const Navbar = () => {
  const { user, isAuthenticated, confirmLogout, setConfirmLogout } = useAuth();
  const { eventCity } = useEvents();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cityModalOpen, setCityModalOpen] = useState(false);

  const navigate = useNavigate();

  // Check saved city → open modal OR redirect
  const openCityModal = () => {
    setMobileOpen(false);

    if (eventCity) {
      navigate(`/events/${eventCity}`);
    } else {
      navigate(`/events`);
      setCityModalOpen(true);
    }
  };

  // Common links for everyone
  const commonLinks = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events", modal: true },
    { name: "About Us", path: "/about-us" },
    { name: "Reviews", path: "/reviews" },
  ];

  // Role-based links
  const roleLinks = {
    participant: [{ name: "My Enrollments", path: "/my-enrollments" }],
    organizer: [
      { name: "My Events", path: "/organizer/events" },
      { name: "Create Event", path: "/organizer/create-event" },
      { name: "Payments", path: "/organizer/payments" },
    ],
    admin: [{ name: "Admin Dashboard", path: "/admin/dashboard" }],
  };

  // Render desktop + mobile links
  const renderLinks = (links) =>
    links.map((link) => (
      <div key={link.name}>
        {link.modal ? (
          <button
            onClick={openCityModal}
          >
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `hover:text-primary-orange transition-all duration-300 ${isActive ? "text-primary-orange font-semibold" : ""
                }`
              }
            >
              {link.name}
            </NavLink>
          </button>
        ) : (
          <NavLink
            to={link.path}
            className={({ isActive }) =>
              `hover:text-primary-orange transition-all duration-300 ${isActive ? "text-primary-orange font-semibold" : ""
              }`
            }
            onClick={() => setMobileOpen(false)}
          >
            {link.name}
          </NavLink>
        )}
      </div>
    ));

  return (
    <nav className="bg-white/20 backdrop-blur-lg border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={assets.logo} alt="PhantomCircle" className="h-12" />
            </Link>

            <div className="hidden sm:flex space-x-8 text-sm ml-12">
              {renderLinks(commonLinks)}
              {isAuthenticated && <hr className="hidden md:block bg-red-500 w-0.5 h-6" />}
              {isAuthenticated && renderLinks(roleLinks[user?.role] || [])}
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex justify-start items-center space-x-4 text-sm">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700 hidden md:block">{user?.name}</span>

                  <span
                    onClick={() => {
                      setMobileOpen(false);

                      const path =
                        user?.role === "participant"
                          ? "/profile"
                          : user?.role === "organizer"
                            ? "/organizer/profile"
                            : user?.role === "admin"
                              ? "/admin/profile"
                              : "/";

                      navigate(path);
                      scrollTo(0, 0);
                    }}
                  >
                    <img
                      src={assets.profile_icon}
                      alt={user?.name}
                      title={user?.role}
                      className="w-10 h-10 cursor-pointer rounded-full"
                    />
                  </span>
                </>

              ) : (
                <div className="hidden md:block">
                  <Link className="px-4 py-2" to="/login">
                    Login
                  </Link>
                  <Link
                    className="bg-primary-pink/90 hover:bg-primary-pink text-white px-4 py-2 rounded-md"
                    to="/register"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              className="sm:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <img src={assets.menu_close} alt="" />
              ) : (
                <img src={assets.menu_icon} alt="" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed sm:hidden top-20 right-0 w-64 h-[90vh] bg-white/80 backdrop-blur-2xl border-l px-6 py-6 space-y-3 flex flex-col justify-between">
          <div className="flex flex-col text-sm gap-6">
            {renderLinks(commonLinks)}
            {
              isAuthenticated && (
                <div className="flex flex-col gap-6 border-t pt-4 ">
                  {renderLinks(roleLinks[user?.role] || [])}
                </div>)
            }
          </div>

          <div>
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setConfirmLogout(true);
                  setMobileOpen(false);
                }}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Logout
              </button>
            ) : (
              <div className="grid grid-cols-2 border-t pt-4 text-sm">
                <Link
                  onClick={() => {
                    setMobileOpen(false);
                  }}
                  className="px-4 py-2" to="/login">
                  Login
                </Link>
                <Link
                  onClick={() => {
                    setMobileOpen(false);
                  }}
                  className="text-center bg-primary-pink/90 hover:bg-primary-pink text-white px-4 py-2 rounded-md"
                  to="/register"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {confirmLogout && <ConfirmLogout trigger={{ setConfirmLogout }} />}

      {/* City Selection Modal */}
      <EventCity isOpen={cityModalOpen} close={() => setCityModalOpen(false)} />
    </nav>
  );
};

export default Navbar;
