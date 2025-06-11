import React, { useState } from 'react';

import EditableStr from 'components/EditableStr.jsx';
import AccentText from 'components/AccentText.jsx';
import 'components/MainPage.css';

export default function MainPage(props) {
    const [paragraph, setParagraph] = useState("今日は久しぶりに晴れて、とても気持ちのいい天気だった。");
    const segmenter = new Intl.Segmenter('ja', { granularity: 'word' });
    const [words, setWords] = useState([...segmenter.segment(paragraph)].map(s => {return{surface: s.segment, furigana: 'あ'}}));
    
    let updateResult = p => {
        setParagraph(p);
        setWords([...segmenter.segment(p)].map(s => {return{surface: s.segment, furigana: 'あ'}}));
    }

    return <>
        <main className='main'>
            <div className='input'>
                <EditableStr content={paragraph} placeholder={'テクスト入力...'} onSave={updateResult}/> 
            </div>

            <div className='result'>
                {words.map((word, index) => 
                    <ruby key={`${index}-${word}`}>
                        {[...word.surface].map((char, charIndex) =>
                            word.furigana ? 
                            <span key={`${index}-${charIndex}`}>{char}</span> :
                            <AccentText key={`${index}-${charIndex}`} text={char}/>
                        )}
                        <rt><EditableStr content={word.furigana} onSave={
                            f => {
                                let newWords = [...words];
                                newWords[index].furigana = f;
                                setWords(newWords);
                            }
                        }/></rt>
                    </ruby>
                )}
            </div>
        </main>
    </>;
}