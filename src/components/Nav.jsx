import React from 'react';

import 'components/Nav.css';

export default function Nav() {
    return (
        <header className='nav'>
            <a className='nav-title' href='#main'>
                <img className='logo' src='images/logo.png' alt='Logo' />
                <span className='title'>せっさたくま</span>
            </a>
        </header>
    );
}
