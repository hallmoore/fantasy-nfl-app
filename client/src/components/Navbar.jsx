import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload(); 
  };

  const linkStyles = "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const activeLinkStyles = "bg-gray-900 text-white";

  return (
    <nav className="">
      <div className="max-w-7xl bg-blue-950 mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link to="/dashboard" className="text-white font-bold text-xl">
              FFL 🏈
            </Link>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-2">
            {token ? (
              // Links for logged-in users
              <>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${linkStyles} ${activeLinkStyles}` : linkStyles}>
                  My Leagues
                </NavLink>
                <NavLink to="/create-league" className={({ isActive }) => isActive ? `${linkStyles} ${activeLinkStyles}` : linkStyles}>
                  Create League
                </NavLink>
                <NavLink to="/join-league" className={({ isActive }) => isActive ? `${linkStyles} ${activeLinkStyles}` : linkStyles}>
                  Join League
                </NavLink>
                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Logout
                </button>
              </>
            ) : (
              // Links for logged-out users
              <>
                <NavLink to="/login" className={({ isActive }) => isActive ? `${linkStyles} ${activeLinkStyles}` : linkStyles}>
                  Login
                </NavLink>
                <NavLink to="/register" className={({ isActive }) => isActive ? `${linkStyles} ${activeLinkStyles}` : linkStyles}>
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
