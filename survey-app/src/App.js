import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './WelcomePage';
import Phase1Questions from './Phase1Questions';
import Phase1Scores from './Phase1Scores';

function App() {
    const [sessionId, setSessionId] = useState(null);

    const handleSessionStart = (id) => {
        setSessionId(id);
    };

    return (
        <Router>
            <Routes>
                <Route path="/welcome" element={<WelcomePage onSessionStart={handleSessionStart} />} />
                <Route path="/phase1-questions" element={sessionId ? <Phase1Questions sessionId={sessionId} /> : <Navigate to="/welcome" />} />
                <Route path="/Phase1Scores" element={sessionId ? <Phase1Scores sessionId={sessionId} /> : <Navigate to="/welcome" />} />
                {/* Default route */}
                <Route path="/" element={<Navigate to="/welcome" />} />
                <Route path="*" element={<Navigate to="/welcome" />} /> {/* Catch all route */}
            </Routes>
        </Router>
    );
}

export default App;
