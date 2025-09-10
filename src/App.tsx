import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import Account from './pages/Account'
import Questions from './pages/Questions'
import Login from './pages/Login'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/account" element={<Account />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App
