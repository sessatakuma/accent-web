import React from 'react';

import { ArrowDown } from 'lucide-react';
import PropTypes from 'prop-types';
import { fetchFuriganaFromAPI } from 'utilities/callAPI.jsx';
import getRect from 'utilities/getRect.jsx';

import 'components/Run.css';

export default function Run({ setWords, paragraph, resultRef }) {
    const [progress, setProgress] = React.useState(0);
    // Using Intl.Segmenter to segment Japanese text into words
    const segmenter = new Intl.Segmenter('ja', { granularity: 'word' });

    // On input change, update the paragraph and segment it into words
    const updateResult = async () => {
        if (progress > 0) return;
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
            setWords(
                newWords.map(word => {
                    const isEmpty = word.furigana.length == 0;
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
            setWords(
                [...segmenter.segment(paragraph)].map(s => ({
                    surface: s.segment,
                    furigana: [{ text: '', accent: 0 }],
                    accent: 0,
                })),
            );
        }

        setTimeout(() => {
            window.scrollTo({
                top: getRect(resultRef).top - getRect(resultRef).height / 8,
                behavior: 'smooth',
            });
            setProgress(0);
        }, 1000);

        console.log(newWords);
    };

    return (
        <button
            className={`run-button ${progress > 0 ? ' running' : ''}`}
            onClick={updateResult}
            style={{ '--progress': progress + '%' }}
        >
            <ArrowDown />
            <ArrowDown />
        </button>
    );
}

Run.propTypes = {
    setWords: PropTypes.func.isRequired,
    paragraph: PropTypes.string.isRequired,
    resultRef: PropTypes.object.isRequired,
};
