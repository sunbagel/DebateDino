import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './styles/App.css'
import Home from './pages/Home'
import NavBar from './components/NavBar'
import About from './pages/About';
import Tournaments from './pages/Tournaments/Tournaments';
import UserProfile from './pages/UserProfile';
import TournamentCreation from './pages/Tournaments/TournamentCreation';
import TournamentView from './pages/Tournaments/TournamentView';
import TournamentRegister from './pages/Tournaments/TournamentRegister';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import Registration from './pages/Registration';
import AuthRouter from './pages/AuthRouter';
import MyTournaments from './pages/Tournaments/MyTournaments/MyTournaments';

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

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            
            {/* Requires login to access.  */}
            <Route element={<AuthRouter/>}>
              {/* could have an index (default route) */}
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/tournaments/:userId" element={<MyTournaments/>} />
              <Route path="/tournaments/create" element={<TournamentCreation/>}/>
          <Route path="/tournaments/view/:id" element={<TournamentView/>}/>
          <Route path="/tournaments/register/:id" element={<TournamentRegister />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
      
      
    </div>
    
  )
}

export default App
