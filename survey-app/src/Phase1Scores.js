import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';  // Import the Bar component

const Phase1Scores = ({ sessionId }) => {
    const [scores, setScores] = useState([]);
    const [selectedThemes, setSelectedThemes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchScores = async () => {
            try {
                setLoading(true);
                const response = await axios.post('https://back2.azurewebsites.net/get-averages', { sessionId });
                setScores(response.data.scores);
            } catch (error) {
                setError("Error fetching average scores. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchScores();
    }, [sessionId]);

    const handleThemeSelection = (theme, isSelected) => {
        setSelectedThemes(prevThemes => 
            isSelected 
            ? [...prevThemes, theme] 
            : prevThemes.filter(t => t !== theme)
        );
    };

    const beginDeepDive = () => {
        navigate('/stage4');
    };

    const chartData = {
        labels: scores.map(score => score.theme),
        datasets: [
            {
                label: 'Average Scores',
                data: scores.map(score => score.averageScore),
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
            }
        ]
    };

    return (
        <div>
            <h1>Stage 3: Review and Select Themes</h1>
            <p>Here are the average scores for each theme from Phase 1:</p>
            <Bar data={chartData} />  {/* Display the Bar chart */}
            {scores.map(({ theme, averageScore }) => (
                <div key={theme}>
                    <h2>{theme}: {averageScore}</h2>
                    <label>
                        <input 
                            type="checkbox" 
                            checked={selectedThemes.includes(theme)}
                            onChange={(e) => handleThemeSelection(theme, e.target.checked)}
                        />
                        Select for Phase 2
                    </label>
                </div>
            ))}
            <button onClick={beginDeepDive} disabled={selectedThemes.length === 0 || loading}>
                Begin Deep Dive
            </button>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default Phase1Scores;
