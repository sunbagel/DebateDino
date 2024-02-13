import { useState } from 'react'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './styles/App.css'
import Home from './pages/Home'
import NavBar from './components/NavBar'

function App() {

  return (
    <div>
      <Router>
        <NavBar/>

        <Routes>
          <Route path="/" element={<Home/>}/>
        </Routes>
      </Router>
      
    </div>
    
  )
}

export default App
