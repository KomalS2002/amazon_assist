import React, { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './SignUp.css';

const SignUp=()=>{
  const onSuccess = (credentialResponse) => {
    const idToken = credentialResponse.credential;
    console.log('Google ID Token:', idToken);
    
    const payload = {
      email: 'string',
      password: 'string',
      idToken: idToken,
      name: 'string'
    };
    console.log(payload);
    // Send the payload to the backend
    axios.post('http://127.0.0.1:8000/auth', payload)
      .then((res) => {
        console.log('Backend response:', res.data);
      })
      .catch((error) => {
        if (error.response) {
          console.error('Response error:', error.response.data);
        } else if (error.request) {
          console.error('Request error:', error.request);
        } else {
          console.error('Error', error.message);
        }
        console.error('Error config:', error.config);
      });
  };


  return (
    <div className='.signup-container'>
     <GoogleLogin
     onSuccess={onSuccess}
    onError={() => {
    console.log('Login Failed');
  }}
/>;
    </div>
  )
}

export default SignUp;
