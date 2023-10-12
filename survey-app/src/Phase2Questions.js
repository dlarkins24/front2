import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Phase2Questions = ({ sessionId }) => {
    console.log('Component render');

    const selectedThemes = JSON.parse(localStorage.getItem('selectedThemes'));
    const [allQuestions, setAllQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('useEffect running');

        const fetchQuestions = async () => {
            console.log('Fetching all questions');
            try {
                setLoading(true);
                const response = await axios.get('https://back2.azurewebsites.net/get-phase2-questions'); 
                console.log('Received response:', response.data);
                setAllQuestions(response.data.questions);
            } catch (error) {
                setError(error);
                console.error('Error fetching questions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    const questions = useMemo(() => {
        console.log('Filtering questions for themes:', selectedThemes);
        return allQuestions.filter(q => selectedThemes.includes(q.theme));
    }, [allQuestions, selectedThemes]);

    const handleChange = (questionId, value) => {
        console.log('Setting answer:', value, 'for question ID:', questionId);
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Submitting answers:', answers);

        try {
            setLoading(true);
            await axios.post('https://back2.azurewebsites.net/submit-phase2-answers', { sessionId, answers });
            navigate('/phase2scores');
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
                {questions.map((group) => (
                    <div key={group.theme}>
                        <h2>{group.theme}</h2>
                        {group.questions.map((question) => (
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
                    </div>
                ))}
                <button type="submit">Submit Responses</button>
            </form>
        </div>
    );
};

export default Phase2Questions;
