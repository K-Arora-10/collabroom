import { useState } from 'react'
import { Route,Routes } from 'react-router-dom'
import RegisterPage from './components/Register'
import VerifyEmailPage from './components/Verifyemail'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/verify/:token" element={<VerifyEmailPage />} />
      </Routes>
    </>
  )
}

export default App
