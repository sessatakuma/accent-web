import React, { useState } from 'react';

import Kana from 'components/Kana.jsx';
import 'components/Main.css';
import 'utilities/accentMarker.css';


const isKana = str => /^[ぁ-んァ-ンー。、.　]+$/.test(str); // 平假/片假/長音/空白

export default function MainPage(props) {
    // Using Intl.Segmenter to segment Japanese text into words
    const segmenter = new Intl.Segmenter('ja', { granularity: 'word' })

    // Initial paragraph and words state, the placeholder text is just for testing
    const [paragraph, setParagraph] = useState("入力してください...");
    // The placeholder furigana is set to 'あ' for all words, this can be changed later
    const [words, setWords] = useState(
    [...segmenter.segment(paragraph)].map(s => ({
        surface: s.segment,
        furigana: s.segment === '入力' ? 'にゅうりょく' : ''
    }))
    );

    
    async function fetchFuriganaFromAPI(text) {
        try {
            const response = await fetch('https://fastapi-wd1i.onrender.com/api/MarkAccent/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });

            const data = await response.json();

            if (response.ok && data.status === 200 && Array.isArray(data.result)) {
                return data.result.map(entry => {
                    const surface = entry.surface;
                    const furigana = entry.furigana;

                    return {
                        surface,
                        furigana: isKana(surface) ? '' : furigana // just save kanji
                    };
                });
            } else {
                console.error('API format error:', data);
                return [];
            }
        } catch (error) {
            console.error('API error:', error);
            return [];
        }
    }

    
    
    // On input change, update the paragraph and segment it into words
    let updateResult = async (e) => {
        const newText = e.target.innerText;
        setParagraph(newText);

        setWords([]);

        const result = await fetchFuriganaFromAPI(newText);
        
        // fallback: 如果 API 沒回傳東西，就用 segmenter 自行分詞
        if (result.length === 0) {
            const fallback = [...segmenter.segment(newText)].map(s => ({
                surface: s.segment,
                furigana: ''
            }));
            setWords(fallback);
        } else {
            setWords(result);
        }
    };


    let handleKeyDown = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            e.target.blur(); // trigger onBlur and save
        }
    }

    const copyResult = () => {

        const content = words.map(word => {
            const surface = word.surface;
            const furigana = word.furigana;

            // no kanji
            if (isKana(surface)) {
                return surface;
            }

            // kanji
            return `{${surface}|${furigana}}`;
        }).join('');

        navigator.clipboard.writeText(content).then(() => {
            alert('コピー成功！');
        }).catch(err => {
            console.error('コピー失敗', err);
        });
    };


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
                        {/* Kanji -> <span>, kana -> <Kana> (accent enabled) */}
                        {[...word.surface].map((text, textIndex) =>
                            word.furigana ? 
                                <span key={`${index}-${textIndex}`}>{text}</span> :
                                <Kana key={`${index}-${textIndex}`} text={text}/>
                        )}
                        {/* If there is furigana, display it in rt and make it editable */}
                        <rt>
                            {word.furigana && 
                                <Kana
                                    editable
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
            
            <button className='copy-button' onClick={copyResult}>
                コピー
            </button>
        </main>
    </>;
}