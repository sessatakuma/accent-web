import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';

import Nav from 'components/Nav.jsx';
import Input from 'components/Input.jsx';
import Result from 'components/Result.jsx';
import ToTop from 'components/ToTop.jsx';
import useDebounce from 'utilities/useDebounce';


import 'components/Main.css';
import 'utilities/accentMarker.css';

export default function Main() {
    const [paragraph, setParagraph] = useState("");
    const [words, setWords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const debouncedParagraph = useDebounce(paragraph, 800);
    const resultRef = useRef(null);

    const handleRun = useCallback(async (text) => {
        if (!text || text.trim() === "") {
            setWords([]);
            return;
        }

        setIsLoading(true);

        /* MOCK DATA START */
        setTimeout(() => {
            const mockData = [
                { surface: "React", furigana: [], accent: [0,0,0,0,0] },
                { surface: "は", furigana: [], accent: [0] },
                { surface: "、", furigana: [], accent: [0] },
                { surface: "ユーザーインターフェース", furigana: [
                    {text: "ユ", accent: 0}, {text: "ー", accent: 0}, {text: "ザ", accent: 0}, {text: "ー", accent: 0},
                    {text: "イ", accent: 1}, {text: "ン", accent: 0}, {text: "タ", accent: 0}, {text: "ー", accent: 0},
                    {text: "フ", accent: 0}, {text: "ェ", accent: 0}, {text: "ー", accent: 0}, {text: "ス", accent: 0}
                ], accent: [0,0,0,1,0,0,0,0,0,0,0,0] },
                { surface: "を", furigana: [], accent: [0] },
                { surface: "構築", furigana: [{text: "コ", accent: 0}, {text: "ウ", accent: 0}, {text: "チ", accent: 1}, {text: "ク", accent: 0}], accent: [0,0,1,0] },
                { surface: "する", furigana: [], accent: [0,0] },
                { surface: "ため", furigana: [], accent: [0,1] },
                { surface: "の", furigana: [], accent: [0] },
                { surface: "JavaScript", furigana: [], accent: [0,0,0,0,0,0,0,0,0,0] },
                { surface: "ライブラリ", furigana: [{text: "ラ", accent: 1}, {text: "イ", accent: 0}, {text: "ブ", accent: 0}, {text: "ラ", accent: 0}, {text: "リ", accent: 0}], accent: [1,0,0,0,0] },
                { surface: "です", furigana: [], accent: [0,0] },
                { surface: "。", furigana: [], accent: [0] },
                { surface: "宣言的", furigana: [{text: "セ", accent: 0}, {text: "ン", accent: 0}, {text: "ゲ", accent: 0}, {text: "ン", accent: 3}, {text: "テ", accent: 0}, {text: "キ", accent: 0}], accent: [0,0,0,3,0,0] },
                { surface: "な", furigana: [], accent: [0] },
                { surface: "View", furigana: [], accent: [0,0,0,0] },
                { surface: "を", furigana: [], accent: [0] },
                { surface: "用いる", furigana: [{text: "モ", accent: 0}, {text: "チ", accent: 2}, {text: "イ", accent: 0}, {text: "ル", accent: 0}], accent: [0,2,0,0] },
                { surface: "こと", furigana: [], accent: [0,1] },
                { surface: "で", furigana: [], accent: [0] },
                { surface: "、", furigana: [], accent: [0] },
                { surface: "コード", furigana: [{text: "コ", accent: 1}, {text: "ー", accent: 0}, {text: "ド", accent: 0}], accent: [1,0,0] },
                { surface: "が", furigana: [], accent: [0] },
                { surface: "予測", furigana: [{text: "ヨ", accent: 0}, {text: "ソ", accent: 0}, {text: "ク", accent: 0}], accent: [0,0,0] },
                { surface: "し", furigana: [], accent: [0] },
                { surface: "やすく", furigana: [], accent: [0,0,0] },
                { surface: "なり", furigana: [], accent: [0,0] },
                { surface: "、", furigana: [], accent: [0] },
                { surface: "デバッグ", furigana: [{text: "デ", accent: 1}, {text: "バ", accent: 0}, {text: "ッ", accent: 0}, {text: "グ", accent: 0}], accent: [1,0,0,0] },
                { surface: "も", furigana: [], accent: [0] },
                { surface: "簡単", furigana: [{text: "カ", accent: 0}, {text: "ン", accent: 0}, {text: "タ", accent: 1}, {text: "ン", accent: 0}], accent: [0,0,1,0] },
                { surface: "に", furigana: [], accent: [0] },
                { surface: "なり", furigana: [], accent: [0,0] },
                { surface: "ます", furigana: [], accent: [0,0] },
                { surface: "。", furigana: [], accent: [0] }
            ];
            setWords(mockData);
            setIsLoading(false);
        }, 1000);
        /* MOCK DATA END */
    }, []);

    useEffect(() => {
        handleRun(debouncedParagraph);
    }, [debouncedParagraph, handleRun]);

    return (
        <div className="app-container">
            <Nav />
            
            <main className="main-content">
                <div className="two-col-layout">
                    <section className="input-panel">
                        <Input paragraph={paragraph} setParagraph={setParagraph} />
                    </section>
                    
                    <section className="result-panel">
                        <Result 
                            words={words} 
                            setWords={setWords} 
                            ref={resultRef} 
                            isLoading={isLoading}
                        />
                    </section>
                </div>
            </main>

            <ToTop />
        </div>
    );
}