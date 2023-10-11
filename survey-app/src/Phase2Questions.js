import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Phase2Questions = ({ sessionId}) => {
    const selectedThemes = JSON.parse(localStorage.getItem('selectedThemes'));
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                // Assuming you have an endpoint to fetch questions by themes
                const response = await axios.post('https://back2.azurewebsites.net/get-phase2-questions', { themes: selectedThemes });
                setQuestions(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [selectedThemes]);

    const handleChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            // Assuming you have an endpoint to submit answers
            await axios.post('https://back2.azurewebsites.net/submit-phase2-answers', { sessionId, answers });
            navigate('/phase2scores');  // Navigate to the next page
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h1>Phase 2 Questions</h1>
            <form onSubmit={handleSubmit}>
                {questions.map(question => (
                    <div key={question.id}>
                        <p>{question.text}</p>
                        {[1, 2, 3, 4, 5].map(score => (
                            <label key={score}>
                                <input
                                    type="radio"
                                    value={score}
                                    checked={answers[question.id] === score}
                                    onChange={() => handleChange(question.id, score)}
                                />
                                {score}
                            </label>
                        ))}
                    </div>
                ))}
                <button type="button" onClick={handleSubmit}>Submit Responses</button>
            </form>
        </div>
    );
};

export default Phase2Questions;
