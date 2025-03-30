import React, { useState } from 'react';
import axios from 'axios';
import '../../src/App.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''

        
    });

    console.log()
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', formData);
            alert(response.data.message);
            console.log(response) // this is check
        } catch (error) {
            alert('Registration failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
            />
            
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
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
