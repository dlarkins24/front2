import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const WelcomePage = ({ onSessionStart }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const history = useHistory();

    const startSession = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axios.post('https://back2.azurewebsites.net/start-session');
            const sessionId = response.data.sessionId;
            
            // Notify the App component that the session has started
            onSessionStart(sessionId);

            // Redirect to the Phase 1 Questions page
            history.push('/phase1-questions');
        } catch (error) {
            console.error("Error starting session:", error);
            setError("There was an error starting the session. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Welcome to the Assessment</h1>
            <button onClick={startSession} disabled={loading}>
                {loading ? 'Starting...' : 'Start Assessment'}
            </button>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default WelcomePage;
