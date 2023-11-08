import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

const WelcomePage = ({ onSessionStart }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [industries, setIndustries] = useState([]);
    const [orgSizes, setOrgSizes] = useState([]);
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [selectedOrgSize, setSelectedOrgSize] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const industriesResponse = await axios.get('https://back2.azurewebsites.net/get-industries');
                setIndustries(industriesResponse.data.industries);

                const orgSizesResponse = await axios.get('https://back2.azurewebsites.net/get-org-sizes');
                setOrgSizes(orgSizesResponse.data.orgSizes);
            } catch (error) {
                setError("Error fetching data. Please try again later.");
            }
        };

        fetchData();
    }, []);

    const handleIndustryChange = (e) => {
        setSelectedIndustry(e.target.value);
    };

    const handleOrgSizeChange = (e) => {
        setSelectedOrgSize(e.target.value);
    };

    const startSession = async () => {
        try {
            setLoading(true);
            setError(null);
            const sessionResponse = await axios.post('https://back2.azurewebsites.net/start-session');
            const sessionId = sessionResponse.data.sessionId;

            // Send the welcome responses to the backend
            await axios.post('https://back2.azurewebsites.net/submit-welcome-responses', {
                sessionId: sessionId,
                industry: selectedIndustry,
                orgSize: selectedOrgSize
            });

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
                {/* Logo and welcome title elements */}
                {/* ... other elements ... */}

                {/* Dropdown for selecting Industry */}
                <div className="input-group">
                    <label htmlFor="industry">Industry:</label>
                    <select name="industry" value={selectedIndustry} onChange={handleIndustryChange} required>
                        <option value="" disabled>Select your industry</option>
                        {industries.map(industry => (
                            <option key={industry} value={industry}>{industry}</option>
                        ))}
                    </select>
                </div>

                {/* Dropdown for selecting Organization Size */}
                <div className="input-group">
                    <label htmlFor="orgSize">Organization Size:</label>
                    <select name="orgSize" value={selectedOrgSize} onChange={handleOrgSizeChange} required>
                        <option value="" disabled>Select your organization size</option>
                        {orgSizes.map(size => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </div>

                <button 
                    className="start-button" 
                    onClick={startSession} 
                    disabled={loading || !selectedIndustry || !selectedOrgSize}>
                    {loading ? 'Starting...' : 'Start Assessment'}
                </button>
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
};

export default WelcomePage;
