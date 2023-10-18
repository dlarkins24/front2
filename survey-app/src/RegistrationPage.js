import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

const RegistrationPage = ({ sessionId }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        organization: '',
        department: ''
    });
    const [roles, setRoles] = useState([]);
    const [departments, setDepartments] = useState([]);
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

        const fetchDepartments = async () => {
            try {
                const response = await axios.get('https://back2.azurewebsites.net/get-departments');
                setDepartments(response.data.departments);
            } catch (e) {
                setError("Error fetching departments. Please try again later.");
            }
        };

        fetchRoles();
        fetchDepartments();
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
            await axios.post('https://back2.azurewebsites.net/register-user', { ...formData, sessionId });
            navigate('/Phase2Questions');
        } catch (e) {
            setError("Error during registration. Please try again later.");
        }
    };

    return (
        <div className="app-container">
            <div className="registration-container">
                <h1 className="welcome-title">Registration</h1>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit} className="registration-form">
                    <div className="input-group">
                        <label htmlFor="name">Name:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="role">Role:</label>
                        <select name="role" value={formData.role} onChange={handleChange} required>
                            <option value="" disabled>Select your role</option>
                            {roles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                    <div className="input-group">
                        <label htmlFor="organization">Organization:</label>
                        <input type="text" name="organization" value={formData.organization} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="department">Department:</label>
                        <select name="department" value={formData.department} onChange={handleChange} required>
                            <option value="" disabled>Select your department</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="proceed-button">Proceed to Deep Dive</button>
                </form>
            </div>
        </div>
    );
};

export default RegistrationPage;
