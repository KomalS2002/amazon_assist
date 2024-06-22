import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from './pages/login/Signup';
import Home from './pages/home/Home';
import ImageSearch from './pages/image/ImageSearch';
import VideoSearch from './pages/video/VideoSearch';
import TextSearch from './pages/text/TextSearch';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  const { user } = useAuth();

  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<SignUp />} />
            <Route path="/" element={<SignUp />} />
            <Route path="/home" element={<PrivateRoute element={<Home />} />} />
            <Route path="/home/image" element={<PrivateRoute element={<ImageSearch />} />} />
            <Route path="/home/video" element={<PrivateRoute element={<VideoSearch />} />} />
            <Route path="/home/text" element={<PrivateRoute element={<TextSearch />} />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;
