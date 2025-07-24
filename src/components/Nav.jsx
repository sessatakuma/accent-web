import React from "react";

import 'components/Nav.css';

export default function Nav() {
    return (
        <header className='nav'>
            <div className='nav-title'>
                <img className='logo' src='images/logo.png' alt='Logo' />
                <span className='title'>せっさたくま</span>
            </div>
            <div className='nav-buttons'>
                <button onClick={() => {console.log('中');}}>中</button>
                <button><i className="fa-solid fa-moon" /></button>
            </div>
        </header>
    );
}