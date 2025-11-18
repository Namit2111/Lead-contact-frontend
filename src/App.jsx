import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Callback from './pages/Callback'
import Success from './pages/Success'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  )
}

export default App

