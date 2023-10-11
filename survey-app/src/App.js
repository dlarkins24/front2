import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './WelcomePage';
import Phase1Questions from './Phase1Questions';
import Phase1Scores from './Phase1Scores';
import RegistrationPage from './RegistrationPage';
import Phase2Questions from './Phase2Questions';

function App() {
    // Initialize sessionId with a value from localStorage
    const [sessionId, setSessionId] = useState(() => localStorage.getItem('sessionId'));

    const handleSessionStart = (id) => {
        // Update state and localStorage when sessionId changes
        setSessionId(id);
        localStorage.setItem('sessionId', id);
    };

    return (
        <Router>
            <Routes>
                <Route path="/welcome" element={<WelcomePage onSessionStart={handleSessionStart} />} />
                <Route 
                    path="/Phase1Questions" 
                    element={sessionId ? <Phase1Questions sessionId={sessionId} /> : <Navigate to="/welcome" />} 
                />
                <Route 
                    path="/Phase1Scores" 
                    element={sessionId ? <Phase1Scores sessionId={sessionId} /> : <Navigate to="/Phase1Scores" />} 
                />
                <Route path="/RegistrationPage" element={sessionId ? <RegistrationPage sessionId={sessionId} /> : <Navigate to="/welcome" />} />
                <Route 
                    path="/Phase2Questions" 
                    element={sessionId ? <Phase2Questions sessionId={sessionId} /> : <Navigate to="/welcome" />} 
                />
                {/* Default route */}
                <Route path="/" element={<Navigate to="/welcome" />} />
                <Route path="*" element={<Navigate to="/welcome" />} /> {/* Catch all route */}
            </Routes>
        </Router>
    );
}

export default App;
