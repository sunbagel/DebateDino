import { useState } from 'react'
import './styles/App.css'
import Home from './pages/Home'
import NavBar from './components/NavBar'

function App() {

  return (
    <div>
      <NavBar/>
      {/* maybe move this back into home */}
      <div className="container mx-auto flex items-center justify-center min-h-screen">
        <Home/>
      </div>
    </div>
    
  )
}

export default App
