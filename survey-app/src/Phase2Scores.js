import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
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

    const handleBarClick = (elements) => {
        if (elements.length > 0) {
            const { index } = elements[0];
            const selectedScore = scores[index];
            const relevantTheme = scoreDescriptions.find(desc => desc.theme === selectedScore.theme);

            let relevantDescription = null;
            if (relevantTheme) {
                relevantDescription = relevantTheme.scores.find(s => s.score === Math.round(selectedScore.averageScore));
            }
        
            setSelectedDescription(relevantDescription ? relevantDescription.description : "No description available.");
        }
    };

    const data = {
        labels: scores.map(score => score.theme),
        datasets: [
            {
                label: 'Average Scores',
                data: scores.map(score => score.averageScore),
                backgroundColor: '#8884d8'
            }
        ]
    };

    const options = {
        scales: {
            y: { beginAtZero: true }
        }
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
                    <Bar 
                        data={data} 
                        options={options}
                        getElementAtEvent={(elements) => handleBarClick(elements)}
                    />
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
