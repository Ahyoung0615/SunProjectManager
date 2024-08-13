import { BrowserRouter, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css';
import Login from './login/LoginComponent';
import LogoutComponent from './login/LogoutComponent';
function App() {
  return (
    <div>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/logout" element={<LogoutComponent />} />
        </Routes> 
      </div>
    </div>
  );
}

export default App;
