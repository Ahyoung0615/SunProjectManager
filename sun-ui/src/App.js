import { BrowserRouter, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css';
import Login from './commodule/LoginComponent';
import Home from './commodule/Home';
function App() {
  return (
    <div>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes> 
      </div>
    </div>
  );
}

export default App;
