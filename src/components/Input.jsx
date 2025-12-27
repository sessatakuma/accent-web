import React from 'react';
import { Dices, Clipboard } from 'lucide-react';
import 'components/Input.css';

export default function Input({paragraph, setParagraph}) {
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

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                setParagraph(text);
            }
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
        }
    };

    return (
        <section className='input-section'>
            <textarea
                className='input-area'
                value={paragraph}
                onChange={(e) => setParagraph(e.target.value)}
                placeholder="文章を入力..."
            />
            
            <div className='input-actions'>
                {!paragraph && (
                    <button className='paste-button' onClick={handlePaste} title="Paste from clipboard">
                        <Clipboard size={20} />
                    </button>
                )}

                <button className='generate-button' onClick={generateRandomParagraph} title="ランダムな文章を生成">
                    <Dices size={20} />
                </button>
            </div>
        </section>
    );
}

