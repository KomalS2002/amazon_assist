import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential;
    console.log('Google ID Token:', idToken);

    const payload = {
      email: 'string',
      password: 'string',
      idToken: idToken,
      name: 'string'
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/auth', payload);
      console.log('Backend response:', response.data);

      // Assuming response.data contains the JWT token
      const token = response.data.token;
      localStorage.setItem('token', token);

      // Use the login context function to update authentication state
      login(response.data);

      // Navigate to the home page
      navigate('/home');
    } catch (error) {
      if (error.response) {
        console.error('Response error:', error.response.data);
      } else if (error.request) {
        console.error('Request error:', error.request);
      } else {
        console.error('Error', error.message);
      }
      console.error('Error config:', error.config);
    }
  };

  const onFailure = () => {
    console.log('Login Failed');
  };

  return (
    <div className='signup-container'>
      <div className='google-login-button'>
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onFailure}
        />
      </div>
    </div>
  );
}

export default SignUp;
