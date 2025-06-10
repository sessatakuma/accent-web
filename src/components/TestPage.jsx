import React, { useState } from 'react';

import EditableStr from 'components/EditableStr.jsx';
import 'components/TestPage.css';

export default function TestPage(props) {
    const [paragraph, setParagraph] = useState("今日は久しぶりに晴れて、とても気持ちのいい天気だった。");
    const segmenter = new Intl.Segmenter('ja', { granularity: 'word' });
    const [words, setWords] = useState([...segmenter.segment(paragraph)].map(s => {return{surface: s.segment, furigana: 'テスト'}}));
    
    let updateResult = p => {
        setParagraph(p);
        setWords([...segmenter.segment(p)].map(s => {return{surface: s.segment, furigana: 'テスト'}}));
    }

    return <>
        <main className='test'>
            <div className='input'>
                <EditableStr content={paragraph} onSave={updateResult}/> 
            </div>

            <div className='result'>
                {words.map((word, index) => 
                    <ruby key={`${index}-${word}`}>
                        <EditableStr content={word.surface}/> 
                        <rt><EditableStr content={word.furigana}/></rt>
                    </ruby>
                )}
            </div>
        </main>
    </>;
}