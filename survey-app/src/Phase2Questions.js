import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Phase2Questions = ({ sessionId }) => {
    const selectedThemes = JSON.parse(localStorage.getItem('selectedThemes'));
    const [allQuestions, setAllQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://back2.azurewebsites.net/get-phase2-questions');
                setAllQuestions(response.data.questions);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const questions = useMemo(() => {
        return allQuestions.filter(q => selectedThemes.includes(q.theme));
    }, [allQuestions, selectedThemes]);

    const handleChange = (questionId, score, theme, phase) => {
        setAnswers(prev => ({ ...prev, [questionId]: { score, theme, phase } }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            await axios.post('https://back2.azurewebsites.net/submit-phase2-responses', { sessionId, responses: answers });
            navigate('/Phase2Scores');
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="app-container">
            <div className="questionnaire-container">
                <h1 className="welcome-title">Phase 2 Deep Dive Questions</h1>
                <form onSubmit={handleSubmit} className="questionnaire-form">
                    {questions.map((group) => (
                        <div key={group.theme} className="theme-section">
                            <h2 className="theme-title">{group.theme}</h2>
                            {group.questions.map((question) => (
                                <div key={question.id} className="question">
                                    <p className="question-text">{question.text}</p>
                                    <div className="radio-group">
                                        {question.options.map((option) => (
                                            <label key={option.score} className="radio-option">
                                                <input
                                                    type="radio"
                                                    value={option.score}
                                                    checked={answers[question.id]?.score === option.score}
                                                    onChange={() => handleChange(question.id, option.score, group.theme, question.phase)}
                                                />
                                                {option.text}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                    <button type="submit" className="submit-button">Submit Responses</button>
                </form>
            </div>
        </div>
    );
};

export default Phase2Questions;
