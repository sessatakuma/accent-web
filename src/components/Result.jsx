import React, { useState, forwardRef } from 'react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import Kana from 'components/Kana.jsx';
import 'components/Result.css';

const Result = forwardRef(({words, setWords}, ref) => {
    const [showCopyDescription, setShowCopyDescription] = useState(false); 
    
    const resultRef = React.useRef(null);
    
    const copyResult = () => {
        const isKana = str => /^[ぁ-んァ-ンー　]+$/.test(str); // 平假/片假/長音/空白

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
    
    return (
        <section className='result-section' ref={ref}>
                <h3 className='result-description'>クリックしてアクセントを編集</h3>
                <p className='result-area' ref={resultRef}>
                    {/* Display words according to surface and furigana */}
                    {words.map((word, index) => 
                        <ruby key={`${index}-${word}`}>
                            {/* Kanji -> <span>, kana -> <Kana> (accent enabled) */}
                            {[...word.surface].map((text, textIndex) =>
                                word.furigana ? 
                                    <span key={`${index}-${textIndex}`}>{text}</span> :
                                    <Kana key={`${index}-${textIndex}`} text={text} accent={word.accent}/>
                                    // TODO: add type={word.accent} if accent is implemented
                            )}
                            {/* If there is furigana, display it in rt and make it editable */}
                            <rt>
                                {word.furigana && 
                                    <Kana
                                        editable
                                        text={word.furigana} 
                                        // TODO: add type={word.accent} if accent is implemented
                                        accent={word.accent}
                                        onUpdate={
                                            (newFurigana, newAccent) => {
                                                let newWords = [...words];
                                                newWords[index].furigana = newFurigana;
                                                newWords[index].accent = newAccent;
                                                setWords(newWords);
                                            }
                                        }
                                    />}
                            </rt>
                        </ruby>
                    )}
                </p>
                <div className='result-buttons'>
                    <button className='copy-button' onClick={copyResult}>
                        <i className="fa-solid fa-copy"></i>
                    </button>
                    <span className='copy-description' style={{opacity: +showCopyDescription}}>コピーしました！</span>
                    <i className="fa-solid fa-download download"></i>
                    <div className='share-buttons'>
                        <button className='image-button'>
                            <i className="fa-solid fa-image" onClick={downloadImage}></i>
                        </button>
                        <button className='pdf-button' onClick={downloadPDF}>
                            <i className="fa-solid fa-file-pdf"></i>
                        </button>
                    </div>
                </div>
            </section>
    )
})

export default Result;