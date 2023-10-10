import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import WelcomePage from './WelcomePage';
import Phase1Questions from './Phase1Questions'; // Ensure you import this component

function App() {
    const [sessionId, setSessionId] = useState(null);

    const handleSessionStart = (id) => {
        setSessionId(id);
    };

    return (
        <Router>
            <Switch>
                <Route path="/welcome">
                    <WelcomePage onSessionStart={handleSessionStart} />
                </Route>
                <Route path="/phase1-questions">
                    {sessionId ? (
                        <Phase1Questions sessionId={sessionId} />
                    ) : (
                        <Redirect to="/welcome" />
                    )}
                </Route>
                {/* Default route */}
                <Route path="/">
                    <Redirect to="/welcome" />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
