import React, { useState } from 'react';


import Kana from 'components/Kana.jsx';
import getRect from 'utilities/getRect.jsx';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'components/Main.css';
import 'utilities/accentMarker.css';
import 'utilities/colorPalette.css';

export default function MainPage(props) {
    // Using Intl.Segmenter to segment Japanese text into words
    const segmenter = new Intl.Segmenter('ja', { granularity: 'word' })

    // Initial paragraph and words state, the placeholder text is just for testing
    const [paragraph, setParagraph] = useState("");
    // The placeholder furigana is set to 'あ' for all words, this can be changed later
    const [words, setWords] = useState([...segmenter.segment("")].map(s => 
        {return{surface: s.segment, furigana: 'あ'}}
    ));
    const [showCopyDescription, setShowCopyDescription] = useState(false); 

    const resultRef = React.useRef(null);
    const resultSectionRef = React.useRef(null);

    const generateRandomParagraph = () => {
        const examples = [
            "今日は朝から猫がベランダで日向ぼっこしていたので、つい一緒にゴロゴロしてしまった。",
            "近所のパン屋さんで新作のメロンパンを買ったら、予想以上にサクサクで感動した。",
            "図書館で偶然見つけた本が面白すぎて、気づいたら3時間も経っていた。",
            "雨の中を歩いていたら、傘を持っていない猫と目が合って、思わず傘を貸したくなった。"
        ];
        const newText = examples[Math.floor(Math.random() * examples.length)];
        setParagraph(newText);
    };

    // On input change, update the paragraph and segment it into words
    let updateResult = e => {
        setWords([...segmenter.segment(paragraph)].map(s => {
            return{surface: s.segment, furigana: 'あ'}}
        ));
        setTimeout(() => {
            window.scrollTo({ top: getRect(resultSectionRef).top - getRect(resultSectionRef).height / 16, behavior: 'smooth' });
        }, 0);
    }

    let handleKeyDown = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            e.target.blur(); // trigger onBlur and save
        }
    }

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

    return <>
        <main className='main'>
            <header className='nav'>
                <span className='title'>せっさたくま</span>
                <div className='nav-buttons'>
                    <button>中</button>
                    <button><i class="fa-solid fa-moon"></i></button>
                </div>
            </header>
            <section className='input-section'>
                <h3 className='input-description'>アクセントをつけたい文章を入力</h3>
                <p
                    className='input-area'
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={() => {setParagraph(e.target.innerText.trim());}}
                    onKeyDown={handleKeyDown}
                    data-placeholder=""
                    >
                    {paragraph}
                </p>
                <button className='generate-button' onClick={generateRandomParagraph}>
                    <i class="fa fa-dice"></i>
                </button>
            </section>
            <button className='run-button' onClick={updateResult}>
                <i class="fa-solid fa-arrow-down"></i>
                </button>
            <section className='result-section' ref={resultSectionRef}>
                <h3 className='result-description'>クリックしてアクセントを編集</h3>
                <p className='result-area' ref={resultRef}>
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
        </main>
    </>;
}