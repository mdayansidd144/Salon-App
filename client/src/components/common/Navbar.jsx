import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">✂️ Salon Pro</Link>
        <div className="space-x-4">
          <Link to="/book" className="text-gray-700 hover:text-blue-600">Book</Link>
          {isAuthenticated ? (
            <>
              <Link to="/admin" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
              <button onClick={logout} className="text-red-600 hover:text-red-700">Logout</button>
            </>
          ) : (
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;