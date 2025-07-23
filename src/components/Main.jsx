import React, { useState } from 'react';

import Input from 'components/Input.jsx';
import Result from 'components/Result.jsx';
import getRect from 'utilities/getRect.jsx';

import 'components/Main.css';
import 'utilities/accentMarker.css';
import 'utilities/colorPalette.css';

export default function MainPage(props) {
    // Using Intl.Segmenter to segment Japanese text into words
    const segmenter = new Intl.Segmenter('ja', { granularity: 'word' })
    // Initial paragraph and words state, the placeholder text is just for testing
    const [paragraph, setParagraph] = useState("");
    // The placeholder furigana is set to 'あ' for all words, this can be changed later
    const [words, setWords] = useState([...segmenter.segment("")].map(s => 
        {return{surface: s.segment, furigana: 'あ', accent: 0}}
    ));

    const resultRef = React.useRef(null);

    // On input change, update the paragraph and segment it into words
    let updateResult = e => {
        setWords([...segmenter.segment(paragraph)].map(s => {
        // TODO: add accent
            return{surface: s.segment, furigana: 'あ', accent: 0}}
        ));
        setTimeout(() => {
            window.scrollTo({ top: getRect(resultRef).top - getRect(resultRef).height / 16, behavior: 'smooth' });
        }, 0);
    }

    return (
        <main className='main'>
            <header className='nav'>
                <span className='title'>せっさたくま</span>
                <div className='nav-buttons'>
                    <button>中</button>
                    <button><i className="fa-solid fa-moon"></i></button>
                </div>
            </header>
            <Input paragraph={paragraph} setParagraph={setParagraph}/>
            <button className='run-button' onClick={updateResult}>
                <i className="fa-solid fa-arrow-down"></i>
            </button>
            <Result words={words} setWords={setWords} ref={resultRef}/>
        </main>
    );
}