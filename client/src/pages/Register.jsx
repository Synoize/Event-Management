import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { assets } from '../assets/assets';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'participant',
    organizationName: '',
    officialId: '',
  });
  const [loading, setLoading] = useState(false);
  const { participantRegister, organizerRegister, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    if (formData.password.length < 6) {
      return;
    }

    setLoading(true);
    let result;

    if (formData.role === 'participant') {
      result = await participantRegister({
        name: formData.name,
        email: formData.email.toLowerCase(),
        password: formData.password,
      });
    } else if (formData.role === 'organizer') {
      result = await organizerRegister({
        name: formData.name,
        email: formData.email.toLowerCase(),
        password: formData.password,
        organizationName: formData.organizationName,
        officialId: formData.officialId,
      });
    }

    setLoading(false);

    if (result?.success) {
      if (formData.role === 'participant') {
        navigate('/');
      } else {
        navigate('/organizer/events');
      }
    }
  };

  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className='flex flex-col items-center'>
          <img src={assets.logo} alt="" className='h-14 md:h-20'/>
          <h2 className="mt-6 self-start text-xl md:text-4xl text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Register as
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-primary-pink/90 focus:border-primary-pink"
              >
                <option value="participant">Participant</option>
                <option value="organizer">Organizer</option>
              </select>
            </div>
            <div>
              <div>
                <label htmlFor="name" className="sr-only">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="rounded-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-pink/90 focus:border-primary-pink sm:text-sm"
                  placeholder="Full Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-y-0 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-pink/90 focus:border-primary-pink sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-pink/90 focus:border-primary-pink sm:text-sm"
                placeholder="Password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`rounded-none ${formData.role !== 'organizer' && 'rounded-b-md'} relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-pink/90 focus:border-primary-pink sm:text-sm`}
                placeholder="Confirm Password"
              />
            </div>
              {formData.role === 'organizer' && (
                <>
                  <div>
                    <label htmlFor="organizationName" className="sr-only">
                      Organization Name
                    </label>
                    <input
                      id="organizationName"
                      name="organizationName"
                      type="text"
                      required
                      value={formData.organizationName}
                      onChange={handleChange}
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-y-0 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-pink/90 focus:border-primary-pink sm:text-sm"
                      placeholder="Organization Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="officialId" className="sr-only">
                      Official ID
                    </label>
                    <input
                      id="officialId"
                      name="officialId"
                      type="text"
                      required
                      value={formData.officialId}
                      onChange={handleChange}
                      className="appearance-none rounded-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-pink/90 focus:border-primary-pink sm:text-sm"
                      placeholder="Official ID (Aadhar/PAN)"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full h-10 flex justify-center items-center border border-transparent text-sm font-medium rounded-md text-white bg-primary-pink/90 hover:bg-primary-pink disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-primary-pink"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
              ) : 'Register'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-pink/90 hover:text-primary-pink hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

