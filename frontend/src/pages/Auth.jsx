import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        try {
            const res = await axios.post(`http://localhost:5000${endpoint}`, formData);
            login(res.data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
            <div style={{ 
                width: '100%', 
                maxWidth: '450px', 
                backgroundColor: '#1e1e1e', 
                padding: '40px', 
                borderRadius: '8px',
                border: '1px solid #333'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '24px' }}>
                    {isLogin ? 'Sign In' : 'Create Account'}
                </h2>
                <p style={{ textAlign: 'center', marginBottom: '24px', color: '#aaaaaa' }}>
                    to continue to YouTube
                </p>

                {error && <p style={{ color: '#ff4444', marginBottom: '16px', textAlign: 'center' }}>{error}</p>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {!isLogin && (
                        <input 
                            type="text" 
                            name="username" 
                            placeholder="Username" 
                            value={formData.username}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    )}
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />
                    <button type="submit" style={{ 
                        backgroundColor: '#3ea6ff', 
                        color: 'black', 
                        padding: '10px', 
                        borderRadius: '4px', 
                        fontWeight: 'bold',
                        marginTop: '8px'
                    }}>
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>

                <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#aaaaaa' }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ color: '#3ea6ff', fontWeight: '500' }}
                    >
                        {isLogin ? 'Create one' : 'Sign in instead'}
                    </button>
                </p>
            </div>
        </div>
    );
};

const inputStyle = {
    padding: '12px',
    backgroundColor: 'transparent',
    border: '1px solid #333',
    borderRadius: '4px',
    color: 'white',
    fontSize: '16px'
};

export default Auth;
