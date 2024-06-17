import './App.css';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import SignUp  from './pages/login/Signup';
import Home from './pages/home/Home';

function App() {
  return (
    <div className="App">
     <Router>
     <Routes>
        <Route exact path="/" element={SignUp} />
        <Route index element={<SignUp />} />
        <Route path = "home" element = {<Home />}/>
      </Routes>

</Router>
    </div>
  );
}

export default App;
