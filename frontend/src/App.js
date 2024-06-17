import './App.css';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import SignUp  from './pages/login/Signup';
import Home from './pages/home/Home';
import ImageSearch from './pages/image/ImageSearch';
import VideoSearch from './pages/video/VideoSearch';
import TextSearch from './pages/text/TextSearch';
function App() {
  return (
    <div className="App">
     <Router>
     <Routes>
        <Route exact path="/" element={SignUp} />
        <Route index element={<SignUp />} />
        <Route path = "home" element = {<Home />}/>
        <Route path = "home/image" element = {<ImageSearch />}/>
        <Route path = "home/video" element = {<VideoSearch />}/>
        <Route path = "home/text" element = {<TextSearch />}/>
      </Routes>

</Router>
    </div>
  );
}

export default App;
