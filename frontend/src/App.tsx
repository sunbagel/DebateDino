
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './styles/App.css'
import Home from './pages/Home'
import NavBar from './components/NavBar'
import About from './pages/About';
import Tournaments from './pages/Tournaments/Tournaments';
import UserProfile from './pages/UserProfile';
import CreateTournaments from './pages/Tournaments/CreateTournament';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';

function App() {

  return (
    <div>
      <AuthProvider>
        <Router>
          <NavBar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/tournaments/create" element={<CreateTournaments />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </AuthProvider>
      
      
    </div>
    
  )
}

export default App
