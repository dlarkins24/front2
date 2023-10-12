import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart } from 'react-google-charts';
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

    const handleBarClick = (selectedTheme, score) => {
        console.log(`handleBarClick triggered with theme: ${selectedTheme} and score: ${score}`);
        console.log(`Type of selectedTheme: ${typeof selectedTheme}`);
        console.log(`Type of score: ${typeof score}`);
        console.log(`Rounded Score: ${Math.round(score)}`);
    
        const relevantTheme = scoreDescriptions.find(desc => desc.theme === selectedTheme);
        console.log("Found relevant theme:", relevantTheme);
        
        if (relevantTheme) {
            const isScoreAvailable = relevantTheme.scores.some(s => s.score === Math.round(score));
            console.log(`Is score available in descriptions: ${isScoreAvailable}`);
    
            let relevantDescription = null;
            if (isScoreAvailable) {
                relevantDescription = relevantTheme.scores.find(s => s.score === Math.round(score));
                console.log("Found relevant description object:", relevantDescription);
            }
        
            setSelectedDescription(relevantDescription ? relevantDescription.description : "No description available.");
        }
    };
    
    
    
    const chartEvents = [
        {
            eventName: 'select',
            callback: ({ chartWrapper }) => {
                console.log("Chart bar clicked (Event fired)!");
                const chart = chartWrapper.getChart();
                const selection = chart.getSelection();
                console.log("Selection:", selection);
                if (selection.length > 0) {
                    const [selectedItem] = selection;
                    const selectedTheme = chartWrapper.getDataTable().getValue(selectedItem.row, 0);
                    const score = chartWrapper.getDataTable().getValue(selectedItem.row, 1);
                    console.log(`Selected Theme: ${selectedTheme}, Score: ${score}`);
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
                        events={chartEvents}
                        rootProps={{ 'data-testid': '1' }}
                    />
                    <div className="description">
                        <h2>Description</h2>
                        <p>{selectedDescription || "Click a bar for more information."}</p>
                    </div>
                </>
            )}
        </div>
    );
    
};

export default Phase2Scores;