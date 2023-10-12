import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import './App.css';

const Phase2Scores = ({ sessionId }) => {
    const [scores, setScores] = useState([]);
    const [scoreDescriptions, setScoreDescriptions] = useState([]);
    const [selectedDescription, setSelectedDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                setLoading(true);
                const response = await axios.post('https://back2.azurewebsites.net/get-phase2-averages', { sessionId });
                setScores(response.data.scores);
            } catch (error) {
                setError("Error fetching average scores. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        const fetchScoreDescriptions = async () => {
            try {
                const response = await axios.get('https://back2.azurewebsites.net/get-phase2-score-descriptions');
                setScoreDescriptions(response.data.descriptions);
            } catch (error) {
                console.error("Error fetching score descriptions:", error);
            }
        };

        fetchScores();
        fetchScoreDescriptions();
    }, [sessionId]);

    const handleBarClick = (data) => {
        const relevantTheme = scoreDescriptions.find(desc => desc.theme === data.payload.theme);
    
        let relevantDescription = null;
        if (relevantTheme) {
            relevantDescription = relevantTheme.scores.find(s => s.score === Math.round(data.payload.averageScore));
        }
    
        setSelectedDescription(relevantDescription ? relevantDescription.description : "No description available.");
    };    
    
    return (
        <div className="App">
            <h1>Phase 2 Scores</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <>
                    <BarChart
                        width={500}
                        height={300}
                        data={scores}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="theme" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                            dataKey="averageScore"
                            fill="#8884d8"
                            onClick={(data) => handleBarClick(data)}
                        />
                    </BarChart>
                    {selectedDescription && (
                        <div className="description">
                            <h2>Description</h2>
                            <p>{selectedDescription}</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Phase2Scores;
