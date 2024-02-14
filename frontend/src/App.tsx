import { useState } from 'react'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './styles/App.css'
import Home from './pages/Home'
import NavBar from './components/NavBar'
import About from './pages/About';
import Tournaments from './pages/Tournaments';
import UserProfile from './pages/UserProfile';

function App() {

  return (
    <div>
      <Router>
        <NavBar/>

        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/tournaments" element={<Tournaments/>}/>
          <Route path="/profile" element={<UserProfile/>}/>
        </Routes>
      </Router>
      
    </div>
    
  )
}

export default App
