import { useState } from 'react'
import { Route,Routes } from 'react-router-dom'
import RegisterPage from './components/Register'
import VerifyEmailPage from './components/Verifyemail'
import LoginPage from './components/Login'
import Dashboard from './components/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import RoomPage from './components/RoomPage'
import JoinRoomPage from './components/JoinRoom'

function App() {
  const [count, setCount] = useState(0)

  

  return (
    <>
      <Routes>
        <Route path="/" element={<PublicRoute><LoginPage/></PublicRoute>}/>
        <Route path="/register" element={<PublicRoute><RegisterPage/></PublicRoute>}/>
        <Route path="/verify/:token" element={<PublicRoute><VerifyEmailPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/room/:id" element={<ProtectedRoute><RoomPage /></ProtectedRoute>} />
        <Route path="/join/:inviteCode" element={<ProtectedRoute><JoinRoomPage /></ProtectedRoute>} />
      </Routes>
    </>
  )
}

export default App
