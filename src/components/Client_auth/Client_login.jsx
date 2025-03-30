import React, { useState } from 'react';
import '../Authantication/LoginSignup.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Client_auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const loginValidationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().min(5, 'Password should be at least 5 characters long').required('Password is required'),
    });

    const signupValidationSchema = Yup.object({
        username: Yup.string()
            .max(14, 'Your name is too long')
            .matches(/^[A-Za-z\s]+$/, 'Username should only contain letters and spaces')
            .required('Username is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().min(5, 'Password should be at least 5 characters long').required('Password is required'),
        mobile: Yup.string()
            .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
            .required('Mobile number is required'),
        adress: Yup.string().required('Address is required'),
    });

    // Geolocation functionality
    const getGeocodedAddress = async (lat, lng) => {
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
            );
            if (response.data.display_name) {
                signupFormik.setFieldValue('adress', response.data.display_name); // Update only the address field
            } else {
                signupFormik.setFieldValue('adress', 'Address not found');
            }
        } catch (error) {
            console.error('Error fetching the address', error);
            signupFormik.setFieldValue('adress', 'Error fetching address');
        }
    };

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                getGeocodedAddress(latitude, longitude);
            }, (error) => {
                console.error('Error getting location', error);
                signupFormik.setFieldValue('adress', 'Unable to retrieve location');
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    const loginFormik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: loginValidationSchema,
        onSubmit: async (values) => {
            try {
                const response = await axios.post('http://localhost:4000/api/C_auth/clogin', { email: values.email });
                alert(response.data.message);

                // Save user data to localStorage
                localStorage.setItem('userData', JSON.stringify(response.data.user));

                // Redirect to client dashboard
                navigate('/client_dashboard');
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Login failed';
                alert(errorMessage);
            }
        },
    });

    const signupFormik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            mobile: '',
            adress: '', // Initialize with an empty address field
        },
        validationSchema: signupValidationSchema,
        onSubmit: async (values) => {
            try {
                const response = await axios.post('http://localhost:4000/api/C_auth/cregister', values);
    
                if (response.status === 200 && response.data.success) {
                    alert(response.data.message); // Show success message
                    localStorage.setItem('userData', JSON.stringify(values)); // Save user data if needed
                    navigate('/client_dashboard'); // Redirect to dashboard
                } else {
                    alert('Registration failed');
                }
            } catch (error) {
                console.error('Error during registration:', error);
                alert('Registration failed');
            }
        },
    });
    
        

    const handleLoginClick = () => setIsLogin(true);
    const handleSignupClick = () => setIsLogin(false);

    return (
        <div className="wrapper">
            <div className="title-text">
                <div className={isLogin ? 'active' : ''}>Client Login</div>
                <button id='btn' onClick={() => navigate('/')}>I'm a service provider</button>
            </div>

            <div className="form-container">
                <div className="slide-controls">
                    <input type="radio" name="slide" id="login" checked={isLogin} onChange={handleLoginClick} />
                    <input type="radio" name="slide" id="signup" checked={!isLogin} onChange={handleSignupClick} />
                    <label htmlFor="login" className="slide login" onClick={handleLoginClick}>Login</label>
                    <label htmlFor="signup" className="slide signup" onClick={handleSignupClick}>Signup</label>
                    <div className="slider-tab"></div>
                </div>

                <div className="form-inner" style={{ marginLeft: isLogin ? '-50%' : '-50%' }}>
                    {isLogin ? (
                        <form className="login" onSubmit={loginFormik.handleSubmit}>
                            <div className="field">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={loginFormik.values.email}
                                    onChange={loginFormik.handleChange}
                                    onBlur={loginFormik.handleBlur}
                                    required
                                />
                                {loginFormik.touched.email && loginFormik.errors.email && (
                                    <div className="error">{loginFormik.errors.email}</div>
                                )}
                            </div>
                            <div className="field">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={loginFormik.values.password}
                                    onChange={loginFormik.handleChange}
                                    onBlur={loginFormik.handleBlur}
                                    required
                                />
                                {loginFormik.touched.password && loginFormik.errors.password && (
                                    <div className="error">{loginFormik.errors.password}</div>
                                )}
                            </div>
                            <div className="field btn">
                                <div className="btn-layer"></div>
                                <input type="submit" value="Login" />
                            </div>
                            <div className="signup-link">Create an account <a href="#" onClick={handleSignupClick}>Signup now</a></div>
                        </form>
                    ) : (
                        <form className="signup" onSubmit={signupFormik.handleSubmit}>
                            <div className="field">
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={signupFormik.values.username}
                                    onChange={signupFormik.handleChange}
                                    onBlur={signupFormik.handleBlur}
                                    required
                                />
                                {signupFormik.touched.username && signupFormik.errors.username && (
                                    <div className="error">{signupFormik.errors.username}</div>
                                )}
                            </div>
                            <div className="field">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={signupFormik.values.email}
                                    onChange={signupFormik.handleChange}
                                    onBlur={signupFormik.handleBlur}
                                    required
                                />
                                {signupFormik.touched.email && signupFormik.errors.email && (
                                    <div className="error">{signupFormik.errors.email}</div>
                                )}
                            </div>
                            <div className="field">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={signupFormik.values.password}
                                    onChange={signupFormik.handleChange}
                                    onBlur={signupFormik.handleBlur}
                                    required
                                />
                                {signupFormik.touched.password && signupFormik.errors.password && (
                                    <div className="error">{signupFormik.errors.password}</div>
                                )}
                            </div>
                            <div className="field">
                                <input
                                    type="text"
                                    name="mobile"
                                    placeholder="Mobile"
                                    value={signupFormik.values.mobile}
                                    onChange={signupFormik.handleChange}
                                    onBlur={signupFormik.handleBlur}
                                    required
                                />
                                {signupFormik.touched.mobile && signupFormik.errors.mobile && (
                                    <div className="error">{signupFormik.errors.mobile}</div>
                                )}
                            </div>
                            <button type="button" id="location_btn" onClick={handleGetLocation}>Get Location</button>

                            <div className="field">
                                <input
                                    type="text"
                                    name="adress"
                                    placeholder="Address"
                                    value={signupFormik.values.adress || ''} // Ensure the value is never undefined
                                    readOnly
                                />
                                {signupFormik.touched.adress && signupFormik.errors.adress && (
                                    <div className="error">{signupFormik.errors.adress}</div>
                                )}
                            </div>


                            <div className="field btn">
                                <div className="btn-layer"></div>
                                <input type="submit" value="Signup" />
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Client_auth;
