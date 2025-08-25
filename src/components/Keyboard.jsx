import React from 'react';
import { useGame } from '../context/GameContext';

const IconBackspace = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
      <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.12c.36.53.9.88 1.59.88h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3.7 13.3a.996.996 0 01-1.41 0L14 13.41l-2.89 2.89a.996.996 0 11-1.41-1.41L12.59 12 9.7 9.11a.996.996 0 111.41-1.41L14 10.59l2.89-2.89a.996.996 0 111.41 1.41L15.41 12l2.89 2.89c.38.38.38 1.03 0 1.41z"></path>
    </svg>
);

const Keyboard = () => {
    const { handleKeyPress, keyStatuses } = useGame();
    const keys = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
    ];

    const getKeyClass = (key) => {
        const status = keyStatuses[key] || '';
        return `keyboard-key ${status}`;
    };

    return (
        <div className="keyboard">
            {keys.map((row, rowIndex) => (
                <div key={rowIndex} className="keyboard-row">
                    {row.map(key => {
                        return (
                            <button
                                key={key}
                                onClick={() => handleKeyPress(key)}
                                className={getKeyClass(key)}
                            >
                                {key === 'BACKSPACE' ? <IconBackspace /> : key}
                            </button>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default Keyboard;