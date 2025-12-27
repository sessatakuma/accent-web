import React, { useState } from 'react';
import { Play, Loader2 } from 'lucide-react';
import axios from 'axios';

import 'components/Run.css';

export default function Run({ setWords, paragraph, resultRef, setIsLoading }) {
    const [status, setStatus] = useState("waiting"); // waiting, loading, error

    const handleRun = async () => {
        if (!paragraph) return;

        if (setIsLoading) setIsLoading(true);
        setStatus("loading");
        
        // Scroll to result on desktop/mobile if needed
        if (resultRef.current) {
             const offset = 100; // Offset for sticky headers etc
             const elementPosition = resultRef.current.getBoundingClientRect().top;
             const offsetPosition = elementPosition + window.pageYOffset - offset;
        
             window.scrollTo({
                 top: offsetPosition,
                 behavior: "smooth"
             });
        }

        // try {
        //     const response = await axios.post('/api/accent', {
        //         paragraph: paragraph
        //     });
        //     setWords(response.data);
        //     setStatus("waiting");
        // } catch (error) {
        //     console.error(error);
        //     setStatus("error");
        //     alert("エラーが発生しました。もう一度お試しください。");
        // } finally {
        //     if (setIsLoading) setIsLoading(false);
        //     setStatus("waiting");
        // }

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
                // Line break simulated by purely content flow or explicit check if needed, 
                // but standard wrapping should handle this long text.
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
            if (setIsLoading) setIsLoading(false);
            setStatus("waiting");
        }, 1000);
        /* MOCK DATA END */
    }

    return (
        <div className="run-container">
            <button 
                className={`run-button ${status === 'loading' ? 'loading' : ''}`}
                onClick={handleRun}
                disabled={status === 'loading' || !paragraph}
            >
                {status === 'loading' ? (
                    <Loader2 className="animate-spin icon" />
                ) : (
                    <Play className="icon fill-current" />
                )}
                <span>実行</span>
            </button>
        </div>
    );
}
