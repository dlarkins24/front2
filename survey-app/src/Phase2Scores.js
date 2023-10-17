import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart } from 'react-google-charts';
import './App.css';

const Phase2Scores = ({ sessionId }) => {
    const [scores, setScores] = useState([]);
    const [scoreDescriptions, setScoreDescriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                setLoading(true);
                const response = await axios.post('https://back2.azurewebsites.net/get-phase2-averages', { sessionId });
                console.log("Scores fetched:", response.data.scores);
                setScores(response.data.scores);
            } catch (error) {
                console.error("Error fetching scores:", error);
                setError("Error fetching average scores. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        const fetchScoreDescriptions = async () => {
            try {
                const response = await axios.get('https://back2.azurewebsites.net/get-phase2-score-descriptions');
                console.log("Score descriptions fetched:", response.data.descriptions);
                setScoreDescriptions(response.data.descriptions);
            } catch (error) {
                console.error("Error fetching score descriptions:", error);
            }
        };

        fetchScores();
        fetchScoreDescriptions();
    }, [sessionId]);

    // We've removed the handleBarClick and chartEvents since we no longer need to handle graph interactions.

    const chartData = [
        ['Theme', 'Average Scores'],
        ...scores.map(score => [score.theme, score.averageScore])
    ];

    return (
        <div className="App">
            <h1>Phase 2 Scores</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <>
                    <Chart 
                        width={'100%'}
                        height={'400px'}
                        chartType="ColumnChart"
                        loader={<div>Loading Chart</div>}
                        data={chartData}
                        options={{
                            title: 'Average Scores',
                            chartArea: { width: '50%' },
                            hAxis: {
                                title: 'Average Score',
                                minValue: 0,
                            },
                            vAxis: {
                                title: 'Theme',
                            },
                        }}
                        // Removed events property because it's not needed
                        rootProps={{ 'data-testid': '1' }}
                    />
                    {/* Adjusted the section below to display all descriptions */}
                    <div className="descriptions-section">
                        <h2>Descriptions</h2>
                        {scoreDescriptions.length > 0 ? (
                            scoreDescriptions.map((desc, index) => (
                                <div key={index} className="description-item">
                                    <h3>{desc.theme}</h3>
                                    {desc.scores.map((score, scoreIndex) => (
                                        <p key={scoreIndex}>{score.description}</p>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <p>No descriptions available.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Phase2Scores;
