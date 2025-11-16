// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import {Route,BrowserRouter as Router , Routes} from 'react-router-dom'
import './App.css'
import { LandingPage } from './pages/LandingPage'
function App() {

  return (
    <>
      <Router>

        {/* <Routes path='/home' element=''> </Routes> */}
        <Routes> 
          <Route path='/' element={<LandingPage/>}></Route>
        </Routes>

      </Router>
    </>
  )
}

export default App
