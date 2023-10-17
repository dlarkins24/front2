import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart } from 'react-google-charts';
import './App.css';

const Phase2Scores = ({ sessionId }) => {
    const [scores, setScores] = useState([]);
    const [scoreDescriptions, setScoreDescriptions] = useState([]);
    const [relevantDescriptions, setRelevantDescriptions] = useState([]); // New state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchScores = async () => {
            setLoading(true);
            try {
                const responseScores = await axios.post('https://back2.azurewebsites.net/get-phase2-averages', { sessionId });
                setScores(responseScores.data.scores);

                const responseDescriptions = await axios.get('https://back2.azurewebsites.net/get-phase2-score-descriptions');
                setScoreDescriptions(responseDescriptions.data.descriptions);

                // After getting the scores and descriptions, find the relevant descriptions for each score.
                const relevantDescriptions = responseScores.data.scores.map(score => {
                    const relevantTheme = responseDescriptions.data.descriptions.find(desc => desc.theme === score.theme);
                    if (relevantTheme) {
                        const roundedScore = Math.round(score.averageScore);
                        const descriptionForScore = relevantTheme.scores.find(s => s.score === roundedScore);
                        return {
                            theme: score.theme,
                            description: descriptionForScore ? descriptionForScore.description : "No description available.",
                        };
                    }
                    return { theme: score.theme, description: "No description available." };
                });

                setRelevantDescriptions(relevantDescriptions);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Error fetching data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchScores();
    }, [sessionId]);

    const chartData = [
        ['Theme', 'Average Scores'],
        ...scores.map(score => [score.theme, score.averageScore]),
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
                        rootProps={{ 'data-testid': '1' }}
                    />
                    <div className="descriptions-section">
                        <h2>Relevant Descriptions</h2>
                        {relevantDescriptions.map((item, index) => (
                            <div key={index} className="description-item">
                                <h3>{item.theme}</h3>
                                <p>{item.description}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Phase2Scores;
