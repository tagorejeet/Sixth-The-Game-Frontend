import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    return (
        <div className="auth-page">
            <AuthForm isLogin={isLogin} />
            <p className="toggle-auth">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button onClick={() => setIsLogin(!isLogin)} className="toggle-auth-button">
                    {isLogin ? 'Sign Up' : 'Log In'}
                </button>
            </p>
        </div>
    );
};

export default AuthPage;
