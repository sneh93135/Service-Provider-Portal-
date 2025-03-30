import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import '../../src/App.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();  // Initialize useNavigate

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // This is use of check the Email user is right 
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email: formData.email });
            alert(response.data.message);
            console.log(response.data);
            navigate('/DeshBord');  // Redirect to the dashboard after successful login
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            alert(errorMessage);
            console.log("Error:", error.response, error.response?.data, error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
