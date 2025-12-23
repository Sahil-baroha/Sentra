// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import { LandingPage } from './pages/LandingPage.jsx'
import Authentication from './pages/authentication.jsx'
import { AuthProvider } from "./contexts/authContext.jsx";
import VideoMeet from './pages/VideoMeet.jsx';
function App() {

  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<LandingPage />}></Route>
            <Route path='/auth' element={<Authentication />}></Route>
            <Route path='/:url' element={<VideoMeet/>}></Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  )
}

export default App
