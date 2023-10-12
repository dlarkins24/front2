import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart } from 'react-google-charts';

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
                // Updated to use the new endpoint for phase 2 averages
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
                // This is a placeholder endpoint and should be replaced with the actual one when available
                const response = await axios.get('https://back2.azurewebsites.net/get-phase2-score-descriptions');
                setScoreDescriptions(response.data.descriptions);
            } catch (error) {
                console.error("Error fetching score descriptions:", error);
            }
        };

        fetchScores();
        fetchScoreDescriptions();
    }, [sessionId]);

    const handleBarClick = (selectedTheme, score) => {
        const relevantDescription = scoreDescriptions.find(
            desc => desc.theme === selectedTheme && desc.score === Math.round(score)
        );
        setSelectedDescription(relevantDescription ? relevantDescription.description : "No description available.");
    };

    const chartEvents = [
        {
            eventName: 'select',
            callback: ({ chartWrapper }) => {
                const chart = chartWrapper.getChart();
                const selection = chart.getSelection();
                if (selection.length > 0) {
                    const [selectedItem] = selection;
                    const selectedTheme = chartWrapper.getDataTable().getValue(selectedItem.row, 0);
                    const score = chartWrapper.getDataTable().getValue(selectedItem.row, 1);
                    handleBarClick(selectedTheme, score);
                }
            },
        },
    ];

    const chartData = [
        ['Theme', 'Average Scores'],
        ...scores.map(score => [score.theme, score.averageScore])
    ];

    return (
        <div>
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
                        chartType="Bar"
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
                        events={chartEvents}
                        rootProps={{ 'data-testid': '1' }}
                    />
                    {selectedDescription && (
                        <div>
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