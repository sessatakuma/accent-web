import React from 'react';
import { Dices } from 'lucide-react';
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

    return (
        <section className='input-section'>
            <textarea
                className='input-area'
                value={paragraph}
                onChange={(e) => setParagraph(e.target.value)}
                placeholder="文章を入力..."
            />
            <button className='generate-button' onClick={generateRandomParagraph} title="ランダムな文章を生成">
                <Dices size={20} />
            </button>
        </section>
    );
}

