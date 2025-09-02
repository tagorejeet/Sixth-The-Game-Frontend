import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_BASE_URL = 'https://sixth-the-game-backend-1.onrender.com/api';
const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [dailyWord, setDailyWord] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameMessage, setGameMessage] = useState('');
  const [stats, setStats] = useState({ gamesPlayed: 0, gamesWon: 0, lastPlayed: null });
  const [keyStatuses, setKeyStatuses] = useState({});
  const { token } = useAuth();

  // Get today’s IST date
  const getISTDate = () => {
    const now = new Date();
    const offset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(now.getTime() + offset);
    return istDate.toISOString().split('T')[0];
  };

  // Fetch daily word
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

  // Fetch stats (with lastPlayed from DB)
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

  // Reset game state whenever user logs in
  useEffect(() => {
    if (!token) return;

    fetchDailyWord();
    fetchStats();
  }, [token, fetchDailyWord, fetchStats]);

  // Watch for stats update to apply daily lock
  useEffect(() => {
    if (!stats.lastPlayed) return;

    const today = getISTDate();
    const lastPlayedDate = new Date(stats.lastPlayed).toISOString().split('T')[0];

    if (lastPlayedDate === today) {
      setIsGameOver(true);
      setGameMessage("You've already played today. Come back tomorrow!");
    } else {
      // Reset state for a fresh game
      setGuesses(Array(6).fill(null));
      setCurrentRow(0);
      setIsGameOver(false);
      setGameMessage('');
      setKeyStatuses({});
      setCurrentGuess('');
    }
  }, [stats]);

  // Handle win
  const handleWin = async () => {
    setIsGameOver(true);
    setGameMessage(`You won! ✨`);
    try {
      await axios.post(`${API_BASE_URL}/stats/win`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchStats();
    } catch (error) { console.error("Failed to update win stats", error); }
  };

  // Handle loss
  const handleLoss = async () => {
    setIsGameOver(true);
    setGameMessage(`So close! The word was ${dailyWord}.`);
    try {
      await axios.post(`${API_BASE_URL}/stats/loss`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchStats();
    } catch (error) { console.error("Failed to update loss stats", error); }
  };

  // Submit guess
  const submitGuess = async () => {
    if (isGameOver || currentGuess.length !== 6) return;

    try {
      const { data } = await axios.post(`${API_BASE_URL}/game/validate`, 
        { word: currentGuess },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!data.isValid) {
        setGameMessage("Not in word list");
        setTimeout(() => setGameMessage(''), 2000);
        return;
      }
    } catch (error) {
      console.error("Error validating word", error);
      setGameMessage("Could not validate word");
      setTimeout(() => setGameMessage(''), 2000);
      return;
    }

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

  // Handle key presses
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
