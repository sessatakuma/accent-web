import React, { useState, forwardRef } from 'react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import isKana from 'utilities/isKana.jsx';

import Kana from 'components/Kana.jsx';
import 'components/Result.css';

const Result = forwardRef(({words, setWords}, ref) => {
    const [showCopyDescription, setShowCopyDescription] = useState(false); 
    const [theme, setTheme] = useState(0); 

    const resultRef = React.useRef(null);
    
    const copyResult = () => {
        const content = words.map(word => {
            const surface = word.surface;

            // 如果是純假名詞
            if (isKana(surface)) {
                return [...surface].map((char, i) => {
                    const accent = word.accent?.[i] ?? 0;
                    let mark = '';
                    if (accent === 1) mark = "<i>''''''''</i>";
                    else if (accent === 2) mark = "<i>*''''''''*</i>";
                    return `{${char}|${mark}}`;
                }).join('');
            }

            // 漢字詞：將 furigana 處理成 markdown
            const furigana = Array.isArray(word.furigana)
                ? word.furigana.map(f => {
                    if (f.accent === 1) return `<b>${f.text}</b>`;
                    if (f.accent === 2) return `<b>*${f.text}*</b>`;
                    return f.text;
                }).join('')
                : '';

            return `{${surface}|${furigana}}`;
        }).join('');

        navigator.clipboard.writeText(content).then(() => {
            setShowCopyDescription(true);
                setTimeout(() => {
                    setShowCopyDescription(false);
                }, 2000);
        }).catch(err => {
            console.error('コピー失敗', err);
        });
    };

    const downloadImage = () => {
        if (resultRef.current === null) return;

        toPng(resultRef.current)
            .then(dataUrl => {
                const link = document.createElement('a');
                link.download = 'accented-text.png';
                link.href = dataUrl;
                link.click();
            })
            .catch(err => {
                console.error('画像の生成に失敗しました', err);
            });
    };

    const downloadPDF = () => {
        if (resultRef.current === null) return;

        html2canvas(resultRef.current).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('accented-text.pdf');
        }).catch(err => {
            console.error('PDFの生成に失敗しました', err);
        });
    };
    
    const updateKana = (wordIndex, textIndex, newAccent) => {
        let newWords = [...words];
        newWords[wordIndex].accent[textIndex] = newAccent;
        setWords(newWords);
    }

    const updateFurigana = (wordIndex, textIndex, newFurigana, newAccent) => {
        let newWords = [...words];
        newWords[wordIndex].furigana[textIndex].text = newFurigana;
        newWords[wordIndex].furigana[textIndex].accent = +(newFurigana !== '\u00A0') * newAccent;
        setWords(newWords);
    }

    return (
        <section className='result-section' ref={ref}>
            <h3 className='result-description'>クリックしてアクセントを編集</h3>
            <p className='result-area' ref={resultRef}>
                {/* Display words according to surface and furigana */}
                {words.map((word, wordIndex) => 
                    <ruby key={`${wordIndex}-${word}`}>
                        {/* Kanji -> <span>, kana -> <Kana> (accent enabled) */}
                        {[...word.surface].map((char, charIndex) =>
                            word.furigana.text ? 
                                <span key={`${wordIndex}-${charIndex}`}>{char}</span> :
                                <Kana 
                                    key={`${wordIndex}-${charIndex}`} 
                                    text={char} 
                                    accent={word.accent[charIndex]}
                                    onUpdate={(ignore, newAccent) => 
                                        updateKana(wordIndex, charIndex, newAccent)}
                                    />
                                )}
                        {/* If there is furigana, display it in rt and make it editable */}
                        <rt>
                            {[...word.furigana].map((char, charIndex) => 
                                <Kana
                                    key={`${wordIndex}-${charIndex}`} 
                                    editable
                                    text={char.text} 
                                    accent={char.accent}
                                    onUpdate={(newFurigana, newAccent) => 
                                        updateFurigana(wordIndex, charIndex, newFurigana, newAccent)}
                                />
                            )}
                        </rt>
                    </ruby>
                )}
            </p>
            <button 
                className={`color-button ${theme && 'dark'}`} 
                onClick={() => setTheme(t => !t)}
            >
                <i className={'fa-solid fa-palette'}/>
            </button>
            <div className='result-buttons'>
                <button className='copy-button' onClick={copyResult}>
                    <i className="fa-solid fa-copy"/>
                </button>
                <span className='copy-description' style={{opacity: +showCopyDescription}}>
                    コピーしました！
                </span>
                <i className="fa-solid fa-download download"/>
                <div className='share-buttons'>
                    <button className='image-button'>
                        <i className="fa-solid fa-image" onClick={downloadImage}/>
                    </button>
                    <button className='pdf-button' onClick={downloadPDF}>
                        <i className="fa-solid fa-file-pdf"/>
                    </button>
                </div>
            </div>
        </section>
    )
})

export default Result;