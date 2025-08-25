import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const navigate = useNavigate(); // Initialize the navigate function
    const { stats } = useGame();
    const { user } = useAuth();
    
    return (
        <div className="center-div"> 
            <div className="dashboard">
                <h2 className="dashboard-welcome">Welcome, {user?.username || 'Player'}!</h2>
                <div className="stats-container">
                    <div className="stat-card">
                        <p className="stat-number">{stats.gamesPlayed}</p>
                        <p className="stat-label">Games Played</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-number">{stats.gamesWon}</p>
                        <p className="stat-label">Games Won</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/game')} // Navigate to the /game route
                    className="button play-button"
                >
                    Play Today's Word
                </button>
            </div>
        </div>
    );
};

export default Dashboard;