import { useState } from 'react'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './styles/App.css'
import Home from './pages/Home'
import NavBar from './components/NavBar'
import About from './pages/About';
import Tournaments from './pages/Tournaments/Tournaments';
import UserProfile from './pages/UserProfile';
import CreateTournaments from './pages/Tournaments/CreateTournament';
import CreateTournamentForm from './pages/Tournaments/CreateTournamentForm';

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
          <Route path="/tournaments/create" element={<CreateTournaments/>}/>
          <Route path="/tournaments/create/form" element={<CreateTournamentForm/>}/>
        </Routes>
      </Router>
      
    </div>
    
  )
}

export default App
