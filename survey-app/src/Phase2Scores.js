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

    const getDescriptionForScore = (theme, score) => {
        const relevantThemeDescriptions = scoreDescriptions.find(desc => desc.theme === theme);
        if (relevantThemeDescriptions) {
            const roundedScore = Math.round(score);
            const descriptionObj = relevantThemeDescriptions.scores.find(s => s.score === roundedScore);
            return descriptionObj ? descriptionObj.description : "No description available.";
        }
        return "Description not found.";
    };

    const chartData = [
        ['Theme', 'Average Scores'],
        ...scores.map(score => [score.theme, score.averageScore])
    ];

    const descriptionsList = scores.map(score => {
        return (
            <div key={score.theme} className="score-description">
                {/* Include the score next to the theme title */}
                <h3 className="score-theme">{`${score.theme} - Score: ${score.averageScore.toFixed(2)}`} </h3> {/* toFixed is used to format the score, keeping two decimal places */}
                <p className="score-text">{getDescriptionForScore(score.theme, score.averageScore)}</p>
            </div>
        );
    });

    return (
        <div className="app-container">
            <div className="score-container"> {/* Reusing the score-container */}
                <h1 className="welcome-title">Deep Dive Scores</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <>
                        {/* Chart Component */}
                        <div className="chart-container">
                            <Chart 
                                width={'100%'}
                                height={'400px'}
                                chartType="ColumnChart"
                                loader={<div>Loading Chart</div>}
                                data={chartData}
                                options={{
                                    title: 'Average Scores by Theme', // You can also remove this if you don't want a title on the chart itself
                                    chartArea: { width: '50%' },
                                    hAxis: {
                                        title: '', // Remove the title for the horizontal axis
                                        minValue: 0,
                                    },
                                    vAxis: {
                                        title: '', // Remove the title for the vertical axis
                                    },
                                    legend: { position: 'none' },
                                    colors: ['#00ab8e'],
                                }}
                                rootProps={{ 'data-testid': '1' }}
                            />
                        </div>
                        {/* New Title for Recommendations Section */}
                        <h2 className="recommendations-title">Recommendations to improve score</h2> {/* <-- New title element */}
                        {/* Descriptions right below the chart */}
                        <div className="descriptions-section">
                            {descriptionsList}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
    
                            }
export default Phase2Scores;
