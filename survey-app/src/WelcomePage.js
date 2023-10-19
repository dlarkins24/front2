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
            onSessionStart(sessionId);
            navigate('/Phase1Questions');
        } catch (error) {
            console.error("Error starting session:", error);
            setError("There was an error starting the session. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <div className="welcome-container">
                <div className="logo-container">
                    <img 
                        src="https://www.moorhouseconsulting.com/wp-content/uploads/2022/04/FooterLogoNew.svg" 
                        alt="Moorhouse Consulting Logo" 
                        className="moorhouse-logo" 
                    />
                </div>
                <h1 className="welcome-title">Welcome to the Moorhouse Maturity Assessment</h1>

                {/* Subheader added below the main title */}
                <p className="welcome-subheader">
                    Dive into our streamlined two-phase assessment. <br /><br />
                    Start with a succinct Quick-Check overview of your performance across key areas, 
                    then strategically Deep Dive into focus areas critical to your journey.
                </p>


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
