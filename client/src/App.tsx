import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import UserPage from './pages/UserPage'
import AuthUserPage from './pages/AuthUserPage'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users/:id" element={<UserPage />} />
        <Route path="/authusers/:token" element={<AuthUserPage />} />
      </Routes>
    </Router>
  )
}

export default App
