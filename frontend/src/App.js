import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from './pages/login/Signup';
import Home from './pages/home/Home';
import ImageSearch from './pages/image/ImageSearch';
import VideoSearch from './pages/video/VideoSearch';
import TextSearch from './pages/text/TextSearch';
import { AuthProvider, useAuth } from './context/AuthContext';

const App = () => {
  const { user } = useAuth();

  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={user ? <Navigate to="/home" /> : <SignUp />} />
            <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
            <Route path="/home/image" element={user ? <ImageSearch /> : <Navigate to="/" />} />
            <Route path="/home/video" element={user ? <VideoSearch /> : <Navigate to="/" />} />
            <Route path="/home/text" element={user ? <TextSearch /> : <Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;
