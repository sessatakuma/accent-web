import React, { useState, forwardRef } from 'react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import isKana from 'utilities/isKana.jsx';
import { placeholder } from 'utilities/placeholder.jsx';
import { splitKanaSyllables } from 'utilities/kanaUtils.jsx';

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
                const furiganaArray = Array.isArray(word.furigana) ? word.furigana : [];
                return [...surface].map((char, i) => {
                    const accent = furiganaArray[i]?.accent ?? word.accent?.[i] ?? 0;

                    if (accent === 1) return `<i>${char}</i>`;
                    if (accent === 2) return `<b>${char}</b>`;
                    return char;
                }).join('');
            }

            // 漢字詞：將 furigana 處理成 markdown
            const furigana = Array.isArray(word.furigana)
                ? word.furigana.map(f => {
                    if (f.accent === 1) return `<i>${f.text}</i>`;
                    if (f.accent === 2) return `<b>${f.text}</b>`;
                    return f.text;
                }).join('')
                : '';

            return `{${surface}|${furigana}}`;

        }).join('').replace(/<\/b><b>/g, '').replace(/<\/i><i>/g, '');



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
                if (newFurigana === placeholder) { // 被刪空
            if (newWords[wordIndex].furigana.length === 1) { //　要刪光了就放placeholder
                newWords[wordIndex].furigana[textIndex].text = placeholder;
                newWords[wordIndex].furigana[textIndex].accent = 0;
            }
            else // 不然刪掉
                newWords[wordIndex].furigana.splice(textIndex, 1);
        }
        else if (splitKanaSyllables(newFurigana).length === 1) { // 音節長度還是1就直接更新
            newWords[wordIndex].furigana[textIndex].text = newFurigana;
            newWords[wordIndex].furigana[textIndex].accent = newAccent;
        }
        else { // 變長就把原本的刪掉把新的拆開丟進furigana
            // newWords[wordIndex].furigana.splice(textIndex, 0, 
            //     ...splitKanaSyllables(newFurigana).map(char => ({
            //         text: char,
            //         accent: 0
            //     })));
        }
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
                                        text={/^[\u3040-\u309Fー]+$/.test(word.surface) ? "" : char.text} 
                                        accent={/^[\u3040-\u309Fー]+$/.test(word.surface) ? 0 :char.accent}
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