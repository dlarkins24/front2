import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Phase1Questions = ({ sessionId }) => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://back2.azurewebsites.net/get-questions');
                // Flatten the questions array
                const flattenedQuestions = response.data.questions.flatMap(group => 
                    group.questions.map(question => ({
                        ...question,
                        theme: group.theme // keep the theme as part of each question
                    }))
                );
                setQuestions(flattenedQuestions);
            } catch (error) {
                setError("Error fetching questions. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const handleChange = (questionId, score, theme, phase) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: { score, theme, phase }
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await axios.post('https://back2.azurewebsites.net/submit-responses', {
                sessionId,
                responses: answers
            });
            navigate('/Phase1Scores');
        } catch (error) {
            setError("Error submitting answers. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <div className="questionnaire-container">
                <h1 className="welcome-title">Quick-Check Questions</h1>
                {questions.map(question => (
                    <div key={question.id} className="question">
                        <p>{question.text}</p>
                        <div className="radio-group">
                            {question.options.map(option => (
                                <label key={option.score} className="radio-option">
                                    <input
                                        type="radio"
                                        value={option.score}
                                        checked={answers[question.id]?.score === option.score}
                                        onChange={() => handleChange(question.id, option.score, question.theme, question.phase)}
                                    />
                                    {option.text}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
                <button className="submit-button" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Responses'}
                </button>
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
};

export default Phase1Questions;
