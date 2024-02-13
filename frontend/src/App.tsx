import { useState } from 'react'
import './styles/App.css'
import Home from './pages/Home'
import NavBar from './components/NavBar'

function App() {

  return (
    <div>
      <NavBar/>
      
        <Home/>
      
    </div>
    
  )
}

export default App
