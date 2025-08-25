import React, { useEffect } from 'react';
import GameBoard from '../components/GameBoard';
import Keyboard from '../components/Keyboard';
import { useGame } from '../context/GameContext';

const GamePage = () => {
    const { gameMessage, isGameOver, handleKeyPress } = useGame();

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (isGameOver) return;
            let key = event.key.toUpperCase();
            if (key === 'BACKSPACE' || key === 'ENTER' || /^[A-Z]$/.test(key)) {
                event.preventDefault();
                handleKeyPress(key);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isGameOver, handleKeyPress]);

    return (
        <div className="game-page">
            <div className="game-area">
                {gameMessage && (
                    <div className="game-message">
                        {gameMessage}
                    </div>
                )}
                <GameBoard />
            </div>
            <Keyboard />
        </div>
    );
};

export default GamePage;