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

    // Fetch industries and orgSizes from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                // The URLs here are placeholders. You'll need to replace them with your actual endpoints
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
            const response = await axios.post('https://back2.azurewebsites.net/start-session');
            const sessionId = response.data.sessionId;
            onSessionStart(sessionId);

            // Assuming you want to send the industry and orgSize immediately after starting the session
            await axios.post('https://back2.azurewebsites.net/submit-welcome-responses', {
                sessionId: sessionId,
                industry: selectedIndustry,
                orgSize: selectedOrgSize
            });

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
                <p className="welcome-subheader">
                    Dive into our streamlined two-phase assessment. <br /><br />
                    Start with a succinct Quick-Check overview of your performance across key areas, 
                    then strategically Deep Dive into focus areas critical to your journey.
                </p>
                
                <div className="welcome-form-container"> {/* New container for centering form elements */}
                    <div className="input-group">
                        <label htmlFor="industry">Industry:</label>
                        <select name="industry" value={selectedIndustry} onChange={handleIndustryChange} required>
                            <option value="" disabled>Select your industry</option>
                            {industries.map((industry, index) => (
                                <option key={index} value={industry}>{industry}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label htmlFor="orgSize">Organization Size:</label>
                        <select name="orgSize" value={selectedOrgSize} onChange={handleOrgSizeChange} required>
                            <option value="" disabled>Select your organization size</option>
                            {orgSizes.map((size, index) => (
                                <option key={index} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
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