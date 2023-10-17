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

    // This function helps to find the description based on the score
    const getDescriptionForScore = (theme, score) => {
        const relevantThemeDescriptions = scoreDescriptions.find(desc => desc.theme === theme);
        if (relevantThemeDescriptions) {
            const roundedScore = Math.round(score);
            const descriptionObj = relevantThemeDescriptions.scores.find(s => s.score === roundedScore);
            return descriptionObj ? descriptionObj.description : "No description available.";
        }
        return "Description not found.";
    };

    // Preparing data for the Chart and descriptions
    const chartData = [
        ['Theme', 'Average Scores'],
        ...scores.map(score => [score.theme, score.averageScore])
    ];

    const descriptionsList = scores.map(score => {
        return (
            <div key={score.theme}>
                <h3>{score.theme}</h3>
                <p>{getDescriptionForScore(score.theme, score.averageScore)}</p>
            </div>
        );
    });

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
                        // Removed events since interaction is not needed
                        rootProps={{ 'data-testid': '1' }}
                    />
                    <div className="descriptions-section">
                        {descriptionsList}
                    </div>
                </>
            )}
        </div>
    );
};

export default Phase2Scores;
