import React, { useState } from 'react';

import Footer from 'components/Footer.jsx';
import Input from 'components/Input.jsx';
import Nav from 'components/Nav.jsx';
import Result from 'components/Result.jsx';
import Run from 'components/Run.jsx';
import ToTop from 'components/ToTop.jsx';

import 'components/Main.css';
import 'utilities/accentMarker.css';
import 'utilities/colorPalette.css';

export default function MainPage() {
    const [paragraph, setParagraph] = useState('');
    const [words, setWords] = useState([]);

    const resultRef = React.useRef(null);

    return (
        <>
            <Nav />
            <main className='main' id='main'>
                <Input paragraph={paragraph} setParagraph={setParagraph} />
                <Run setWords={setWords} paragraph={paragraph} resultRef={resultRef} />
                <Result words={words} setWords={setWords} ref={resultRef} />
            </main>
            <ToTop />
            <Footer />
        </>
    );
}
