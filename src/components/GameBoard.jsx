import React from 'react';
import { useGame } from '../context/GameContext';

const GameBoard = () => {
    const { guesses, currentGuess, currentRow, dailyWord } = useGame();

    const getTileClass = (letter, index, guess) => {
        if (!guess) return 'tile';
        if (dailyWord[index] === letter) return 'tile correct';
        if (dailyWord.includes(letter)) return 'tile present';
        return 'tile absent';
    };

    return (
        <div className="game-board">
            {guesses.map((guess, rowIndex) => (
                <div key={rowIndex} className="board-row game-row">
                    {Array.from({ length: 6 }).map((_, colIndex) => {
                        const letter = rowIndex === currentRow ? currentGuess[colIndex] : guess?.[colIndex];
                        const isSubmitted = guess !== null;
                        const tileClass = isSubmitted ? getTileClass(guess[colIndex], colIndex, guess) : 'tile';
                        const animationDelay = isSubmitted ? `${colIndex * 100}ms` : '0ms';

                        return (
                            <div
                                key={colIndex}
                                style={{ animationDelay }}
                                className={`${tileClass} ${isSubmitted ? 'flip' : ''} ${letter ? 'pop' : ''}`}
                            >
                                {letter}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default GameBoard;
