import React from 'react'
import "../App.css"
import { Link } from "react-router-dom";
import Limg from "../utils/images/LMC_img.png"
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
            <div className='landingMainContainer'>
                <div>
                    <h1><span style={{color:'#137fd2'}}>Connect</span> with your Loved Ones</h1>
                    <p>Your Space to Meet, Talk, and Feel Together</p>
                    <div role='button'>
                        <Link to={"/auth"}>Get Started</Link>
                    </div>
                </div>
                <div>
                    <img src={Limg} />
                </div>
            </div>
        </div>
    )
}
