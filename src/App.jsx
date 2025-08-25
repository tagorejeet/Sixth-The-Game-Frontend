import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; // Import routing components
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import Header from './components/Header';
import AuthPage from './pages/AuthPage';
import GamePage from './pages/GamePage';
import Dashboard from './components/Dashboard';
import RulesPopup from './components/RulesPopup';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Main />
        </AuthProvider>
    );
}

const Main = () => {
    const { isAuthenticated, loading } = useAuth();
    const [showRules, setShowRules] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            const hasSeenRules = sessionStorage.getItem('hasSeenRules');
            if (!hasSeenRules) {
                setShowRules(true);
                sessionStorage.setItem('hasSeenRules', 'true');
            }
        }
    }, [isAuthenticated]);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-text">Loading...</div>
            </div>
        );
    }

    const handleCloseRules = () => {
        setShowRules(false);
    };

    return (
        <div className="app-container">
            <Header />
            <main className="container">
                {!isAuthenticated ? (
                    <AuthPage />
                ) : (
                    <GameProvider>
                        {showRules && <RulesPopup onClose={handleCloseRules} />}
                        {/* Use Routes to define the pages */}
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/game" element={<GamePage />} />
                        </Routes>
                    </GameProvider>
                )}
            </main>
        </div>
    );
}

export default App;
