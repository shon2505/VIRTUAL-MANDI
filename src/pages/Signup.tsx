import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, ShieldCheck, UserCheck, Store } from 'lucide-react';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<'farmer' | 'buyer'>('farmer');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication - auto success
    const newId = `${role.charAt(0)}-${Date.now()}`;
    login({ id: newId, name: name, role: role });
    
    if (role === 'farmer') {
      navigate('/farmer/dashboard');
    } else {
      navigate('/marketplace');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img src="/favicon.jpg" alt="Virtual Mandi" className="w-16 h-16 rounded-2xl shadow-lg object-contain bg-white" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 font-heading">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Already registered?{' '}
          <button onClick={() => navigate('/login')} className="font-medium text-emerald-600 hover:text-emerald-500">
            Sign in to your account
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          
          <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-md flex justify-center items-center gap-2 transition-colors ${role === 'farmer' ? 'bg-white shadow text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setRole('farmer')}
            >
              <UserCheck size={16} /> Farmer
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-md flex justify-center items-center gap-2 transition-colors ${role === 'buyer' ? 'bg-white shadow text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setRole('buyer')}
            >
              <Store size={16} /> Buyer
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleSignup}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                {role === 'farmer' ? 'Full Name / Farm Name' : 'Company / Business Name'}
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-slate-300 rounded-md py-2 px-3 border"
                  placeholder={role === 'farmer' ? 'e.g. Ramesh Patil' : 'e.g. Metro Traders'}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                Phone Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 sm:text-sm">
                  +91
                </span>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2 border"
                  placeholder="9876543210"
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-slate-700">
                Location (District, State)
              </label>
              <div className="mt-1">
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-slate-300 rounded-md py-2 px-3 border"
                  placeholder="e.g. Nashik, Maharashtra"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-slate-300 rounded-md py-2 px-3 border"
                  placeholder="Create a strong password"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Register as {role === 'farmer' ? 'Farmer' : 'Bulk Buyer'}
              </button>
            </div>
          </form>
          
          <div className="mt-4 text-xs text-center text-slate-500">
            By registering, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
};
