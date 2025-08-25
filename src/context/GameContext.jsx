import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_BASE_URL = 'http://localhost:5000/api';
const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [dailyWord, setDailyWord] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameMessage, setGameMessage] = useState('');
  const [stats, setStats] = useState({ gamesPlayed: 0, gamesWon: 0 });
  const [lastPlayedDate, setLastPlayedDate] = useState(localStorage.getItem('lastPlayedDate'));
  const [keyStatuses, setKeyStatuses] = useState({});
  const { token } = useAuth();

  const getISTDate = () => {
    const now = new Date();
    const offset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(now.getTime() + offset);
    return istDate.toISOString().split('T')[0];
  };

  const fetchDailyWord = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${API_BASE_URL}/game/daily-word`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDailyWord(data.word.toUpperCase());
    } catch (error) {
      console.error("Failed to fetch daily word", error);
      setGameMessage("Error: Could not load today's word.");
    }
  }, [token]);

  const fetchStats = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${API_BASE_URL}/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
  }, [token]);

  useEffect(() => {
    const today = getISTDate();
    if (lastPlayedDate === today) {
      setIsGameOver(true);
      setGameMessage("You've already played today. Come back tomorrow!");
    } else {
      setGuesses(Array(6).fill(null));
      setCurrentRow(0);
      setIsGameOver(false);
      setGameMessage('');
      setKeyStatuses({});
      setCurrentGuess('');
    }
    fetchDailyWord();
    fetchStats();
  }, [token, fetchDailyWord, fetchStats, lastPlayedDate]);

  const handleWin = async () => {
    setIsGameOver(true);
    setGameMessage(`You won! ✨`);
    localStorage.setItem('lastPlayedDate', getISTDate());
    setLastPlayedDate(getISTDate());
    try {
        await axios.post(`${API_BASE_URL}/stats/win`, {}, { headers: { Authorization: `Bearer ${token}` } });
        fetchStats();
    } catch (error) { console.error("Failed to update win stats", error); }
  };

  const handleLoss = async () => {
    setIsGameOver(true);
    setGameMessage(`So close! The word was ${dailyWord}.`);
    localStorage.setItem('lastPlayedDate', getISTDate());
    setLastPlayedDate(getISTDate());
    try {
        await axios.post(`${API_BASE_URL}/stats/loss`, {}, { headers: { Authorization: `Bearer ${token}` } });
        fetchStats();
    } catch (error) { console.error("Failed to update loss stats", error); }
  };

  const submitGuess = async () => {
    if (isGameOver || currentGuess.length !== 6) return;

    // --- New Validation Step ---
    try {
        const { data } = await axios.post(`${API_BASE_URL}/game/validate`, 
            { word: currentGuess },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!data.isValid) {
            setGameMessage("Not in word list");
            // Clear the message after a couple of seconds
            setTimeout(() => setGameMessage(''), 2000);
            return; // Stop the submission
        }
    } catch (error) {
        console.error("Error validating word", error);
        setGameMessage("Could not validate word");
        setTimeout(() => setGameMessage(''), 2000);
        return;
    }
    // --- End of Validation Step ---

    const newGuesses = [...guesses];
    newGuesses[currentRow] = currentGuess;
    setGuesses(newGuesses);

    const newKeyStatuses = { ...keyStatuses };
    const wordLetters = dailyWord.split('');
    currentGuess.split('').forEach((letter, index) => {
        if (wordLetters[index] === letter) newKeyStatuses[letter] = 'correct';
        else if (wordLetters.includes(letter) && newKeyStatuses[letter] !== 'correct') newKeyStatuses[letter] = 'present';
        else if (!wordLetters.includes(letter)) newKeyStatuses[letter] = 'absent';
    });
    setKeyStatuses(newKeyStatuses);
    
    if (currentGuess === dailyWord) handleWin();
    else if (currentRow === 5) handleLoss();
    else {
      setCurrentRow(currentRow + 1);
      setCurrentGuess('');
    }
  };

  const handleKeyPress = (key) => {
    if (isGameOver) return;
    if (key === 'ENTER') {
      if (currentGuess.length === 6) submitGuess();
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (currentGuess.length < 6 && /^[A-Z]$/.test(key)) {
      setCurrentGuess(currentGuess + key);
    }
  };

  return (
    <GameContext.Provider value={{ guesses, currentGuess, currentRow, isGameOver, gameMessage, stats, handleKeyPress, keyStatuses, dailyWord }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
