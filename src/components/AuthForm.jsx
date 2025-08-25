import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthForm = ({ isLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const { login, signup } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(username, email, password);
            }
        } catch (err) {
            console.error(`Failed to ${isLogin ? 'log in' : 'sign up'}.`, err);
            console.log(err); // Added for debugging
            setError(err.response?.data?.message || `Failed to ${isLogin ? 'log in' : 'sign up'}.`);
        }
    };

    return (
        <div className="auth-form-container">
            <h2 className="auth-title">{isLogin ? 'Log In' : 'Sign Up'}</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="auth-form">
                {!isLogin && (
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="button submit-button">
                    {isLogin ? 'Log In' : 'Create Account'}
                </button>
            </form>
        </div>
    );
};

export default AuthForm;