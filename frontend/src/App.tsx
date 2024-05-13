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
          <Route path="/tournaments/create" element={<TournamentCreation/>}/>
          <Route path="/tournaments/view/:id" element={<TournamentView/>}/>
          <Route path="/tournaments/register/:id" element={<TournamentRegister/>}/>
        </Routes>
      </Router>
      
    </div>
    
  )
}

export default App
