import React, { useState } from 'react';

import Input from 'components/Input.jsx';
import Result from 'components/Result.jsx';
import getRect from 'utilities/getRect.jsx';
import { fetchFuriganaFromAPI } from './callAPI.jsx';


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
    let updateResult = async (e) => {
        const apiResult = await fetchFuriganaFromAPI(paragraph);
        if (apiResult.length > 0) {
            setWords(apiResult.map(entry => ({
                surface: entry.surface,
                furigana: entry.furigana,
                accent: 0 
            })));
        } else {
            setWords([...segmenter.segment(paragraph)].map(s => ({
                surface: s.segment,
                furigana: '',
                accent: 0
            })));
        }

        setTimeout(() => {
            window.scrollTo({ top: getRect(resultRef).top - getRect(resultRef).height / 8, behavior: 'smooth' });
        }, 0);
    }

    return (
        <main className='main'>
            <header className='nav'>
                <div className='nav-title'>
                    <img className='logo' src='images/logo.png' alt='Logo' />
                    <span className='title'>せっさたくま</span>
                </div>
                <div className='nav-buttons'>
                    <button>中</button>
                    <button><i className="fa-solid fa-moon" /></button>
                </div>
            </header>
            <Input paragraph={paragraph} setParagraph={setParagraph} />
            <button className='run-button' onClick={updateResult}>
                <i className="fa-solid fa-arrow-down" />
                <i className="fa-solid fa-arrow-down" />
            </button>
            <Result words={words} setWords={setWords} ref={resultRef} />
        </main>
    );
}