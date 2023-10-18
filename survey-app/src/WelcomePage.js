import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

const WelcomePage = ({ onSessionStart }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const startSession = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axios.post('https://back2.azurewebsites.net/start-session');
            const sessionId = response.data.sessionId;
            
            // Notify the App component that the session has started
            onSessionStart(sessionId);

            // Redirect to the Phase 1 Questions page
            navigate('/Phase1Questions');
        } catch (error) {
            console.error("Error starting session:", error);
            setError("There was an error starting the session. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // In your WelcomePage component's return statement, you can include the logo at the top, bottom, or wherever suits your design best.
    return (
        <div className="app-container">
            <div className="welcome-container">
                {/* Logo added here at the top of the container */}
                <div className="logo-container">
                    <img 
                        src="https://www.moorhouseconsulting.com/wp-content/uploads/2022/04/FooterLogoNew.svg" 
                        alt="Moorhouse Consulting Logo" 
                        className="moorhouse-logo" 
                    />
                </div>

                <h1 className="welcome-title">Welcome to the Moorhouse Maturity Assessment</h1>
                <button 
                    className="start-button" 
                    onClick={startSession} 
                    disabled={loading}>
                    {loading ? 'Starting...' : 'Start Assessment'}
                </button>
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
};

export default WelcomePage;
