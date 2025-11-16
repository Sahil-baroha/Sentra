import React from 'react'
import "../App.css"
export const LandingPage = () => {
    return (

        <div className="landingPageContainer">
            <nav>
                <div className='navHeader'>
                    <h2>Sentra</h2>
                </div>
                <div className='navList'>
                    <p>Join as Guest</p>
                    <p>Register</p>
                    <button>Login</button>
                </div>
            </nav>
        </div>
    )
}
