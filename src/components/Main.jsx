import React, { useState, useRef, useEffect, useCallback } from 'react';

import Input from 'components/Input.jsx';
import Nav from 'components/Nav.jsx';
import Result from 'components/Result.jsx';
import { fetchFuriganaFromAPI } from 'utilities/callAPI.jsx';
import useDebounce from 'utilities/useDebounce';

import 'components/Main.css';
import 'utilities/accentMarker.css';

export default function Main() {
    const [paragraph, setParagraph] = useState('');
    const [words, setWords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const debouncedParagraph = useDebounce(paragraph, 800);
    const resultRef = useRef(null);

    const handleRun = useCallback(async text => {
        if (!text || text.trim() === '') {
            setWords([]);
            return;
        }

        setIsLoading(true);

        const result = await fetchFuriganaFromAPI(text);

        if (result.length > 0) {
            setWords(
                result.map(word => {
                    const isEmpty = word.furigana.length === 0;
                    return {
                        surface: word.surface,
                        furigana: [...word.accent].map(a => ({
                            text: a.furigana,
                            accent: a.accent_marking_type,
                        })),
                        accent: isEmpty ? [...word.accent].map(a => a.accent_marking_type) : 0, // 漢字本身沒音調
                    };
                }),
            );
        } else {
            alert('サーバーからの応答がありませんでした。');
            const segmenter = new Intl.Segmenter('ja', { granularity: 'word' });
            setWords(
                [...segmenter.segment(text)].map(s => ({
                    surface: s.segment,
                    furigana: [{ text: '', accent: 0 }],
                    accent: 0,
                })),
            );
        }

        setIsLoading(false);
    }, []);

    useEffect(() => {
        handleRun(debouncedParagraph);
    }, [debouncedParagraph, handleRun]);

    return (
        <div className='app-container'>
            <Nav />

            <main className='main-content'>
                <div className='two-col-layout'>
                    <section className='input-panel'>
                        <Input paragraph={paragraph} setParagraph={setParagraph} />
                    </section>

                    <section className='result-panel'>
                        <Result
                            words={words}
                            setWords={setWords}
                            ref={resultRef}
                            isLoading={isLoading}
                        />
                    </section>
                </div>
            </main>
        </div>
    );
}
