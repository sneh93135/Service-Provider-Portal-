import React, { useState } from 'react';
import './LoginSignup.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const LoginSignup = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleLoginClick = () => {
        setIsLogin(true);
    };

    const handleSignupClick = () => {
        setIsLogin(false);
    };

    // Get Location
    const getGeocodedAddress = async (lat, lng, setFieldValue) => {
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
            );
            if (response.data.display_name) {
                setFieldValue('adress', response.data.display_name);
            } else {
                setFieldValue('adress', 'Address not found');
            }
        } catch (error) {
            console.error('Error fetching the address', error);
            setFieldValue('adress', 'Error fetching address');
        }
    };

    const handleGetLocation = (setFieldValue) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                getGeocodedAddress(latitude, longitude, setFieldValue);
            }, (error) => {
                console.error('Error getting location', error);
                setFieldValue('adress', 'Unable to retrieve location');
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    // Validation Schema
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().min(5, 'Password should be at least 5 characters long').required('Password is required'),
        mobile: Yup.string()
            .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
            .required('Mobile number is required'),
        username: Yup.string().max(14, "Your name is too long")
            .matches(/^[A-Za-z\s]+$/, 'Username should not contain numbers')
            .required('Username is required'),
        skill: Yup.string().required('Skill is required'),
        city: Yup.string().required('City is required'),
        adress: Yup.string().required('Address is required'),
    });

    // Handle Form Submission
    const handleLoginSubmit = async (values) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email: values.email, password: values.password });
            alert(response.data.message);
            localStorage.setItem('userData', JSON.stringify(response.data.user));
            navigate('/DeshBord');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            alert(errorMessage);
        }
    };

    const handleSignupSubmit = async (values) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', values);
            alert(response.data.message);
            localStorage.setItem('userData', JSON.stringify(values));
            navigate('/DeshBord');
        } catch (error) {
            alert('Registration failed');
        }
    };

    return (
        <div>
            <div className="wrapper">
                <div className="title-text">
                    <div className={`login ${isLogin ? 'active' : ''}`}>Service Provider Login</div>
                    <button id='btn' onClick={() => navigate('/client')}>I'm Client</button>
                </div>

                <div className="form-container">
                    <div className="slide-controls">
                        <input type="radio" name="slide" id="login" checked={isLogin} onChange={handleLoginClick} />
                        <input type="radio" name="slide" id="signup" checked={!isLogin} onChange={handleSignupClick} />
                        <label htmlFor="login" className="slide login" onClick={handleLoginClick}>Login</label>
                        <label htmlFor="signup" className="slide signup" onClick={handleSignupClick}>Signup</label>
                        <div className="slider-tab"></div>
                    </div>

                    <div className="form-inner" style={{ marginLeft: isLogin ? '-50%' : '-50' }}>
                        {isLogin ? (
                            <Formik
                                initialValues={{ email: '', password: '' }}
                                validationSchema={Yup.object({
                                    email: Yup.string().email('Invalid email address').required('Email is required'),
                                    password: Yup.string().min(5, 'Password should be at least 5 characters long').required('Password is required'),
                                })}
                                onSubmit={handleLoginSubmit}
                            >
                                <Form className="login">
                                    <div className="field">
                                        <Field type="email" name="email" placeholder="Email" />
                                        <ErrorMessage name="email" component="div" className="error" />
                                    </div>
                                    <div className="field">
                                        <Field type="password" name="password" placeholder="Password" />
                                        <ErrorMessage name="password" component="div" className="error" />
                                    </div>
                                    <div className="field btn">
                                        <div className="btn-layer"></div>
                                        <input type="submit" value="Login" />
                                    </div>
                                    <div className="signup-link">Create an account <a href="#" onClick={handleSignupClick}>Signup now</a></div>
                                </Form>
                            </Formik>
                        ) : (
                            <Formik
                                initialValues={{ username: '', email: '', password: '', mobile: '', skill: '', adress: '', city: '' }}
                                validationSchema={validationSchema}
                                onSubmit={handleSignupSubmit}
                            >
                                {({ setFieldValue }) => (
                                    <Form className="signup">
                                        <div className="field">
                                            <Field type="text" name="username" placeholder="Username" />
                                            <ErrorMessage name="username" component="div" className="error" />
                                        </div>
                                        <div className="field">
                                            <Field type="email" name="email" placeholder="Email" />
                                            <ErrorMessage name="email" component="div" className="error" />
                                        </div>
                                        <div className="field">
                                            <Field type="password" name="password" placeholder="Password" />
                                            <ErrorMessage name="password" component="div" className="error" />
                                        </div>
                                        <div className="field">
                                            <Field type="text" name="mobile" placeholder="Mobile" />
                                            <ErrorMessage name="mobile" component="div" className="error" />
                                        </div>
                                        <div className="field">
                                            <h6 id='skil'>Skills</h6>
                                            <Field as="select" name="skill">
                                                <option value="">Select Skill</option>
                                                <option value="plumber">Plumber</option>
                                                <option value="electrician">Electrician</option>
                                                <option value="gas serviceman">Gas Serviceman</option>
                                                <option value="makeup artist">Makeup Artist</option>
                                            </Field>
                                            <ErrorMessage name="skill" component="div" className="error" />
                                        </div>
                                        <div className="field">
                                            <h6 id='city'>City</h6>
                                            <Field as="select" name="city">
                                                <option value="">Select Places</option>
                                                <option value="Ranip">Ranip</option>
                                                <option value="Thaltej">Thaltej</option>
                                                <option value="Maninagar">Maninagar</option>
                                                <option value="Vastrapur">Vastrapur</option>
                                            </Field>
                                            <ErrorMessage name="city" component="div" className="error" />
                                        </div>
                                        <button type="button" id="location_btn" onClick={() => handleGetLocation(setFieldValue)}>Get Location</button>
                                        <div className="field">
                                            <Field
                                                type="text"
                                                name="adress"
                                                placeholder="Address"
                                                readOnly
                                            />
                                            <ErrorMessage name="adress" component="div" className="error" />
                                        </div>
                                        <div className="field btn">
                                            <div className="btn-layer"></div>
                                            <input type="submit" value="Signup" />
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginSignup;
