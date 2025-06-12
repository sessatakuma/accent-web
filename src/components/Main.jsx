import React, { useState } from 'react';

import Kana from 'components/Kana.jsx';
import Furigana from 'components/Furigana.jsx';
import 'components/Main.css';
import 'utilities/accentMarker.css';

export default function MainPage(props) {
    // Using Intl.Segmenter to segment Japanese text into words
    const segmenter = new Intl.Segmenter('ja', { granularity: 'word' })

    // Initial paragraph and words state, the placeholder text is just for testing
    const [paragraph, setParagraph] = useState("今日は久しぶりに晴れて、とても気持ちのいい天気だった。");
    // The placeholder furigana is set to 'あ' for all words, this can be changed later
    const [words, setWords] = useState([...segmenter.segment(paragraph)].map(s => {return{surface: s.segment, furigana: 'あ'}}));
    
    // On input change, update the paragraph and segment it into words
    let updateResult = e => {
        setParagraph(e.target.innerText);
        setWords([...segmenter.segment(e.target.innerText)].map(s => {
            return{surface: s.segment, furigana: 'あ'}}
        ));
    }

    let handleKeyDown = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            e.target.blur(); // trigger onBlur and save
        }
    }

    return <>
        <main className='main'>
            <section
                contentEditable
                suppressContentEditableWarning
                className='input-area'
                onBlur={updateResult}
                onKeyDown={handleKeyDown}
                data-placeholder="テクスト入力..."
            >
                {paragraph}
            </section>
            <div className='result'>
                {/* Display words according to surface and furigana */}
                {words.map((word, index) => 
                    <ruby key={`${index}-${word}`}>
                        {/* If there is furigana, the word is a kanji, 
                            i.e. it shouldn't be able to be marked w/ an accent directly, 
                            so we just display the kanji in <span>.
                            Otherwise the word is pure kana, 
                            display it w/ <Kana> to enable accent marking */}
                        {[...word.surface].map((text, textIndex) =>
                            word.furigana ? 
                                <span key={`${index}-${textIndex}`}>{text}</span> :
                                <Kana key={`${index}-${textIndex}`} text={text}/>
                        )}
                        {/* If there is furigana, display it in rt and make it editable */}
                        <rt>
                            {word.furigana && 
                                <Furigana 
                                    text={word.furigana} 
                                    onUpdate={
                                        newFurigana => {
                                            let newWords = [...words];
                                            newWords[index].furigana = newFurigana;
                                            setWords(newWords);
                                        }
                                    }
                                />}
                        </rt>
                    </ruby>
                )}
            </div>
        </main>
    </>;
}