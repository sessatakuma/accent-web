import React from "react";
import 'components/Input.css';

export default function Input({paragraph, setParagraph}) {
    const handleKeyDown = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            e.target.blur(); // trigger onBlur and save
        }
    }

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
                <i className="fa fa-dice"></i>
            </button>
        </section>
    );
}