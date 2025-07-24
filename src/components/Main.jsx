import React, { useState } from 'react';

import Input from 'components/Input.jsx';
import Run from 'components/Run.jsx';
import Result from 'components/Result.jsx';

import 'components/Main.css';
import 'utilities/accentMarker.css';
import 'utilities/colorPalette.css';

export default function MainPage(props) {
    const [paragraph, setParagraph] = useState("");
    const [words, setWords] = useState([]);

    const resultRef = React.useRef(null);

    return (
        <main className='main'>
            <header className='nav'>
                <div className='nav-title'>
                    <img className='logo' src='images/logo.png' alt='Logo' />
                    <span className='title'>せっさたくま</span>
                </div>
                <div className='nav-buttons'>
                    <button onClick={() => {console.log(words);}}>中</button>
                    <button><i className="fa-solid fa-moon" /></button>
                </div>
            </header>
            <Input paragraph={paragraph} setParagraph={setParagraph} />
            <Run setWords={setWords} paragraph={paragraph} resultRef={resultRef}/>
            <Result words={words} setWords={setWords} ref={resultRef} />
        </main>
    );
}