import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
                setQuestions(response.data.questions);
            } catch (error) {
                setError("Error fetching questions. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const handleChange = (questionId, score) => {
        setAnswers({
            ...answers,
            [questionId]: score
        });
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await axios.post('https://back2.azurewebsites.net/submit-responses', {
                sessionId,
                responses: answers
            });
            navigate('/stage3');
        } catch (error) {
            setError("Error submitting answers. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Phase 1 Questions</h1>
            {questions.map(group => (
                <div key={group.theme}>
                    <h2>{group.theme}</h2>
                    {group.questions.map(question => (
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
            <button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Responses'}
            </button>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default Phase1Questions;
