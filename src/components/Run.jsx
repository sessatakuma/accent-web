import React from "react";

import getRect from 'utilities/getRect.jsx';
import { fetchFuriganaFromAPI } from 'utilities/callAPI.jsx';

import 'components/Run.css';

export default function Run ({setWords, paragraph, resultRef}) {
    const [progress, setProgress] = React.useState(0);
    // Using Intl.Segmenter to segment Japanese text into words
    const segmenter = new Intl.Segmenter('ja', { granularity: 'word' });

    const calcAccent = (newWords, wordIndex, charIndex, wordSurface, wordAccent) => {
        const monosyllabic = (wordSurface.length === 1);
        const prevAccent = wordIndex > 0 ? newWords[wordIndex - 1].accent : -1;
        const caseParticles = ['は', 'が', 'を', 'に', 'で', 'と', 'へ', 'から', 'まで', 'より'];
        const isParticle = (word) => caseParticles.includes(word);
        const afterParticle = wordIndex > 0 && isParticle(newWords[wordIndex - 1].surface);

        const isDrop = (charIndex + 1 === wordAccent);
        if (wordAccent === -1)
            return 0;
        if (wordAccent === 0) { 
            if (charIndex > 0)  // 0號音不是第一音節都是accent 1(高)
                return 1;
            if (monosyllabic)   // 單音節的0號音第一音節也是accent 1
                return 1;
            if (prevAccent === 0) { // 接續0號音
                if (afterParticle) // 除非在助詞後面
                    return 0; 
                return 1;
            } 
            return 0;
        }
        return isDrop ? 2 : 0;
    }

    // On input change, update the paragraph and segment it into words
    const updateResult = async (e) => {
        if (progress > 0) 
            return;
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 80) {
                    clearInterval(progressInterval);

                    return prev;
                }
                return prev + 1;
            });
        }, 1000);

        const newWords = await fetchFuriganaFromAPI(paragraph);

        clearInterval(progressInterval);
        setProgress(100);

        if (newWords.length > 0) {
            setWords(newWords.map((word, wordIndex) => {
                const isEmpty = (word.furigana.length == 0);
                return {
                    surface: word.surface,
                    furigana: [...word.furigana].map((f, i) => ({
                        text:  f,
                        accent: calcAccent(newWords, wordIndex, i, word.surface, word.accent)
                    })),
                    accent: isEmpty ? 
                        [...word.surface].map((c, i) => 
                            calcAccent(newWords, wordIndex, i, word.surface, word.accent)
                        ) : 
                        0 // 漢字本身沒音調
                }
            }));
        } else {
            setWords([...segmenter.segment(paragraph)].map(s => ({
                surface: s.segment,
                furigana: [{text: '', accent: 0}],
                accent: 0
            })));
        }
        
        setTimeout(() => {
            window.scrollTo({ top: getRect(resultRef).top - getRect(resultRef).height / 8, behavior: 'smooth' });
            setProgress(0);
        }, 1000);


        console.log(newWords);
    }

    return (
        <button 
            className={`run-button ${progress > 0 ? ' running' : ''}`}
            onClick={updateResult}
            style={{'--progress': progress + '%'}}
        >
            <i className="fa-solid fa-arrow-down" />
            <i className="fa-solid fa-arrow-down" />
        </button>
    );
}