import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import Link and useLocation
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { isAuthenticated, logout } = useAuth();
    const location = useLocation(); // Get the current URL path

    return (
        <header className="header">
            <div className="header-left">
                {/* Conditionally show the Dashboard link */}
                {isAuthenticated && location.pathname === '/game' && (
                    <Link to="/" className="button back-button">
                        Dashboard
                    </Link>
                )}
            </div>
            <div className="header-center">
                <h1 className="header-title">🆂🅸🆇🆃🅷</h1>
            </div>
            <div className="header-right">
                {isAuthenticated && (
                    <button 
                        onClick={logout}
                        className="button logout-button"
                    >
                        Log Out
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;