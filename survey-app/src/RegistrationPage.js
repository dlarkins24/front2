import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegistrationPage = ({ sessionId }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: ''
    });
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('https://back2.azurewebsites.net/get-roles');
                setRoles(response.data.roles);
            } catch (e) {
                setError("Error fetching roles. Please try again later.");
            }
        };
        fetchRoles();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send registration data to the server
            await axios.post('https://back2.azurewebsites.net/register-user', { ...formData, sessionId });
            navigate('/Phase2Questions');
        } catch (e) {
            setError("Error during registration. Please try again later.");
        }
    };

    return (
        <div>
            <h1>Stage 4: Registration</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="role">Role:</label>
                    <select name="role" value={formData.role} onChange={handleChange} required>
                        <option value="" disabled>Select your role</option>
                        {roles.map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>
                <button type="submit">Proceed to Phase 2</button>
            </form>
        </div>
    );
};

export default RegistrationPage;
