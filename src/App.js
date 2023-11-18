import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React from "react"
import Login from './components/Login.js';
import MapContainer from './components/Map.js';
import Register from './components/Register.js';
import { AuthProvider } from './components/AuthContext.js';

class App extends React.Component {
  state = {
    name: ""
  }

  render() {
    return (
      <AuthProvider>
        <Router>
          <Routes>
          <Route path="/" element={<Navigate replace to="/map" />} />
            <Route path="/map" element={<MapContainer />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
      </AuthProvider>
    );
  }
}

export default App;