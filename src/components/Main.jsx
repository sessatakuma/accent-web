import React, { useState } from 'react';

import Nav from 'components/Nav.jsx';
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

    return <>
        <Nav/>
        <main className='main' id='main'>  
            <Input paragraph={paragraph} setParagraph={setParagraph} />
            <Run setWords={setWords} paragraph={paragraph} resultRef={resultRef}/>
            <Result words={words} setWords={setWords} ref={resultRef} />
        </main>
    </>;
}