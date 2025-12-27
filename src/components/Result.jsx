import React, { useState, forwardRef } from 'react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'; 
import { Copy, Image as ImageIcon, FileText, Palette } from 'lucide-react';

import isKana from 'utilities/isKana.jsx';
import { placeholder } from 'utilities/placeholder.jsx';
import { splitKanaSyllables } from 'utilities/kanaUtils.jsx';

import Kana from 'components/Kana.jsx';
import SkeletonLoader from 'components/SkeletonLoader.jsx';
import 'components/Result.css';

const Result = forwardRef(({words, setWords, isLoading}, ref) => {
    const [showCopyDescription, setShowCopyDescription] = useState(false); 
    const [theme, setTheme] = useState(0); 

    const resultRef = React.useRef(null);
    
    const copyResult = () => {
        if (!words || words.length === 0) return;
        
        const content = words.map(word => {
            const surface = word.surface;
            if (isKana(surface)) {
                const furiganaArray = Array.isArray(word.furigana) ? word.furigana : [];
                return [...surface].map((char, i) => {
                    const accent = furiganaArray[i]?.accent ?? word.accent?.[i] ?? 0;
                    if (accent === 1) return `<i>${char}</i>`;
                    if (accent === 2) return `<b>${char}</b>`;
                    return char;
                }).join('');
            }
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
        if (resultRef.current === null || words.length === 0) return;
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
        if (resultRef.current === null || words.length === 0) return;
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
        if (newFurigana === placeholder) { 
            if (newWords[wordIndex].furigana.length === 1) { 
                newWords[wordIndex].furigana[textIndex].text = placeholder;
                newWords[wordIndex].furigana[textIndex].accent = 0;
            }
            else 
                newWords[wordIndex].furigana.splice(textIndex, 1);
        }
        else if (splitKanaSyllables(newFurigana).length === 1) { 
            newWords[wordIndex].furigana[textIndex].text = newFurigana;
            newWords[wordIndex].furigana[textIndex].accent = newAccent;
        }
        setWords(newWords);
    }

    // Determine content to show: Skeleton, Empty State, or Data
    let content;
    if (isLoading) {
        content = <SkeletonLoader lines={5} />;
    } else if (!words || words.length === 0) {
        content = (
            <div className="empty-state">
                <p>結果</p>
            </div>
        );
    } else {
        content = (
            <p className='result-area' ref={resultRef}>
                {words.map((word, wordIndex) => 
                    <ruby key={`${wordIndex}-${word}`}>
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
                        <rt>
                            {[...word.furigana].map((char, charIndex) => 
                                    <Kana
                                        key={`${wordIndex}-${charIndex}`} 
                                        editable
                                        text={isKana(word.surface) ? "" : char.text} 
                                        accent={isKana(word.surface) ? 0 :char.accent}
                                        onUpdate={(newFurigana, newAccent) => 
                                            updateFurigana(wordIndex, charIndex, newFurigana, newAccent)}
                                    />
                            )}
                        </rt>
                    </ruby>
                )}
            </p>
        );
    }

    const isEmpty = !words || words.length === 0;

    return (
        <div className={`result-container-inner ${theme ? 'dark-theme' : ''} ${isEmpty ? 'tone-down' : ''}`} ref={ref}>
            {showCopyDescription && (
                <div className="toast-notification">
                    HackMD形式でコピーしました！
                </div>
            )}

            <div className="result-content">
                {content}
            </div>

            {!isEmpty && (
                <div className="result-actions">
                    <button 
                        className={`action-button theme-toggle ${theme && 'active'}`} 
                        onClick={() => setTheme(t => !t)}
                        title="テーマ切り替え"
                    >
                        <Palette size={18} />
                    </button>
                    
                    <div className="export-group">
                        <button className='action-button' onClick={copyResult} title="HackMD形式でコピー (カスタムレンダリング用)">
                            <Copy size={18} />
                            <span>HackMD</span>
                        </button>
                        
                        <button className='action-button' onClick={downloadImage} title="画像として保存">
                                <ImageIcon size={18} />
                                <span>画像保存</span>
                        </button>
                        
                        <button className='action-button' onClick={downloadPDF} title="PDFとして保存">
                                <FileText size={18} />
                                <span>PDF保存</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
})

export default Result;
