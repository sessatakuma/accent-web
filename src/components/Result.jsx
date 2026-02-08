import React, { useState, useEffect, forwardRef } from 'react';

import Kana from 'components/Kana.jsx';
import SkeletonLoader from 'components/SkeletonLoader.jsx';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { Copy, Image as ImageIcon, FileText, ArrowDownToLine, CodeXml, Moon } from 'lucide-react';
import PropTypes from 'prop-types';
import isKana from 'utilities/isKana.jsx';
import { splitKanaSyllables } from 'utilities/kanaUtils.jsx';
import { placeholder } from 'utilities/placeholder.jsx';

import 'components/Result.css';

const Result = forwardRef(({ words, setWords, isLoading }, ref) => {
    const [copyFeedback, setCopyFeedback] = useState(null);
    const [isDarkResult, setIsDarkResult] = useState(false);

    const resultRef = React.useRef(null);

    const copyResult = () => {
        if (!words || words.length === 0) return;

        const content = words
            .map(word => {
                const surface = word.surface;
                if (isKana(surface)) {
                    const furiganaArray = Array.isArray(word.furigana) ? word.furigana : [];
                    return [...surface]
                        .map((char, i) => {
                            const accent = furiganaArray[i]?.accent ?? word.accent?.[i] ?? 0;
                            if (accent === 1) return `<i>${char}</i>`;
                            if (accent === 2) return `<b>${char}</b>`;
                            return char;
                        })
                        .join('');
                }
                const furigana = Array.isArray(word.furigana)
                    ? word.furigana
                          .map(f => {
                              if (f.accent === 1) return `<i>${f.text}</i>`;
                              if (f.accent === 2) return `<b>${f.text}</b>`;
                              return f.text;
                          })
                          .join('')
                    : '';
                return `{${surface}|${furigana}}`;
            })
            .join('')
            .replace(/<\/b><b>/g, '')
            .replace(/<\/i><i>/g, '');

        navigator.clipboard
            .writeText(content)
            .then(() => {
                setCopyFeedback('HackMD形式でコピーしました！');
                setTimeout(() => {
                    setCopyFeedback(null);
                }, 2000);
            })
            .catch(err => {
                console.error('コピー失敗', err);
            });
    };

    const downloadImage = () => {
        if (resultRef.current === null || words.length === 0) return;

        const bgColor = isDarkResult ? '#1F2937' : '#FFFFFF';

        toPng(resultRef.current, { backgroundColor: bgColor, pixelRatio: 2 })
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

        const bgColor = isDarkResult ? '#1F2937' : '#FFFFFF';
        const element = resultRef.current;
        const padding = 40; // Total padding (20px each side)
        const width = element.offsetWidth + padding;
        const height = element.offsetHeight + padding;

        toPng(element, {
            backgroundColor: bgColor,
            pixelRatio: 2,
            width: width,
            height: height,
            style: {
                padding: '20px', // 20px padding around content
                boxSizing: 'border-box',
            },
        })
            .then(imgData => {
                const orientation = width > height ? 'landscape' : 'portrait';
                const pdf = new jsPDF({
                    orientation: orientation,
                    unit: 'px',
                    format: [width, height],
                });
                pdf.addImage(imgData, 'PNG', 0, 0, width, height);
                pdf.save('accented-text.pdf');
            })
            .catch(err => {
                console.error('PDFの生成に失敗しました', err);
            });
    };

    const updateKana = (wordIndex, textIndex, newAccent) => {
        let newWords = [...words];
        newWords[wordIndex].accent[textIndex] = newAccent;
        setWords(newWords);
    };

    const updateFurigana = (wordIndex, textIndex, newFurigana, newAccent) => {
        let newWords = [...words];
        if (newFurigana === placeholder) {
            if (newWords[wordIndex].furigana.length === 1) {
                newWords[wordIndex].furigana[textIndex].text = placeholder;
                newWords[wordIndex].furigana[textIndex].accent = 0;
            } else newWords[wordIndex].furigana.splice(textIndex, 1);
        } else if (splitKanaSyllables(newFurigana).length === 1) {
            newWords[wordIndex].furigana[textIndex].text = newFurigana;
            newWords[wordIndex].furigana[textIndex].accent = newAccent;
        }
        setWords(newWords);
    };

    // Determine content to show: Skeleton, Empty State, or Data
    let content;
    if (isLoading) {
        content = <SkeletonLoader lines={5} />;
    } else if (!words || words.length === 0) {
        content = (
            <div className='empty-state'>
                <p>結果</p>
            </div>
        );
    } else {
        content = (
            <p className='result-area' ref={resultRef}>
                {words.map((word, wordIndex) => (
                    <ruby key={`${wordIndex}-${word}`}>
                        {[...word.surface].map((char, charIndex) =>
                            !Array.isArray(word.accent) ? (
                                <span key={`${wordIndex}-${charIndex}`}>{char}</span>
                            ) : (
                                <Kana
                                    key={`${wordIndex}-${charIndex}`}
                                    text={char}
                                    accent={word.accent[charIndex]}
                                    onUpdate={(ignore, newAccent) =>
                                        updateKana(wordIndex, charIndex, newAccent)
                                    }
                                />
                            ),
                        )}
                        <rt>
                            {[...word.furigana].map((char, charIndex) => (
                                <Kana
                                    key={`${wordIndex}-${charIndex}`}
                                    editable
                                    text={isKana(word.surface) ? '' : char.text}
                                    accent={isKana(word.surface) ? 0 : char.accent}
                                    onUpdate={(newFurigana, newAccent) =>
                                        updateFurigana(wordIndex, charIndex, newFurigana, newAccent)
                                    }
                                />
                            ))}
                        </rt>
                    </ruby>
                ))}
            </p>
        );
    }

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isEmpty = !words || words.length === 0;

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = event => {
            if (isMenuOpen && !event.target.closest('.save-menu-container')) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);

    const copyPlainText = () => {
        if (!words || words.length === 0) return;

        const content = words
            .map(word => {
                const surface = word.surface;

                // Logic to determine accent nucleus index
                let accentIndex = 0;
                // Check furigana or surface accent for drop (2) or kick (1) if simple pattern
                // Note: Data structure uses 1 for 'KERNEL/KICK'? 2 for 'DROP'?
                // In Result.jsx map: accent===1 -> <i> (High?), accent===2 -> <b> (Drop?)
                // If the goal is standard numeric notation (0 for Heiban, N for drop at Nth mora):
                // We need to find the mora index of the drop.
                // If array has '2' at index i, then accent nucleus is i+1?

                let dropIndex = -1;

                if (Array.isArray(word.furigana) && word.furigana.length > 0) {
                    // Furigana-based word
                    dropIndex = word.furigana.findIndex(f => f.accent === 2);
                    if (dropIndex !== -1) {
                        accentIndex = dropIndex + 1;
                    }

                    let reading = word.furigana.map(f => f.text).join('');

                    // If surface equals reading (Kana word), output: Surface (Accent)
                    if (surface === reading) {
                        return `${surface}（${accentIndex}）`;
                    }
                    // Mixed word: Surface (Reading | Accent)
                    return `${surface}（${reading}｜${accentIndex}）`;
                } else {
                    // Kana/Surface only word
                    // Check word.accent array
                    if (word.accent) {
                        const foundDrop = word.accent.findIndex(a => a === 2);
                        if (foundDrop !== -1) accentIndex = foundDrop + 1;
                    }
                    return `${surface}（${accentIndex}）`;
                }
            })
            .join('');

        navigator.clipboard.writeText(content).then(() => {
            setCopyFeedback('コピーしました！');
            setTimeout(() => {
                setCopyFeedback(null);
            }, 2000);
        });
    };

    return (
        <div
            className={`result-container-inner ${isDarkResult ? 'dark-result' : ''} ${
                isEmpty ? 'tone-down' : ''
            }`}
            ref={ref}
        >
            <div className='result-content'>{content}</div>

            {!isEmpty && (
                <div className='result-actions'>
                    <div className='action-group-left'>
                        {copyFeedback && <div className='toast-notification'>{copyFeedback}</div>}
                        <button
                            className='action-button'
                            onClick={copyPlainText}
                            title='テキスト形式でコピー'
                        >
                            <Copy size={18} />
                        </button>
                        <button
                            className='action-button'
                            onClick={copyResult}
                            title='HackMD形式でコピー (カスタムレンダリング用)'
                        >
                            <CodeXml size={18} />
                        </button>
                    </div>

                    <div className='save-menu-container'>
                        <button
                            className={`action-button save-menu-trigger ${
                                isMenuOpen ? 'active' : ''
                            }`}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            title='保存オプション'
                        >
                            <ArrowDownToLine size={18} />
                        </button>

                        {isMenuOpen && (
                            <div className='save-menu-dropdown'>
                                <div className='theme-switch-container'>
                                    <Moon size={16} className='theme-switch-label' />
                                    <label className='switch'>
                                        <input
                                            type='checkbox'
                                            checked={isDarkResult}
                                            onChange={() => setIsDarkResult(prev => !prev)}
                                        />
                                        <span className='slider'></span>
                                    </label>
                                </div>
                                <div className='menu-divider'></div>
                                <button
                                    className='menu-item'
                                    onClick={() => {
                                        downloadImage();
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    <ImageIcon size={16} />
                                    <span>画像</span>
                                </button>
                                <button
                                    className='menu-item'
                                    onClick={() => {
                                        downloadPDF();
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    <FileText size={16} />
                                    <span>PDF</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
});

Result.displayName = 'Result';

Result.propTypes = {
    words: PropTypes.array,
    setWords: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};

export default Result;
