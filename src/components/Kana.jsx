import React, { useState } from 'react';

// 拗音
function splitKanaWithYouon(text) {
  const smallKana = ['ゃ','ゅ','ょ','ぁ','ぃ','ぅ','ぇ','ぉ'];
  const chars = [...text];
  const result = [];

  for (let i = 0; i < chars.length; i++) {
    if (smallKana.includes(chars[i]) && result.length > 0) {
      result[result.length - 1] += chars[i];
    } else {
      result.push(chars[i]);
    }
  }
  return result;
}


// an inline element marked w/ accent, changes type on click 
function KanaChar({ char, index, editable, onChange }) {
    const [type, setType] = useState(0);
    // if editable, set firstClick to true
    // this is to block the first click from changing the type
    const [firstClick, setFirstClick] = useState(editable);

    const [text, setText] = useState(char || '\u00A0');

    const typeName = ['none', 'flat', 'drop'];
    
    const changeType = () => {
        // if it's the first click that will start an edit, don't change type
        setType(prev => (prev + 1 - firstClick) % 3);
        // it isn't the first click anymore till finish editing
        setFirstClick(false);
    };

    const finishEditing = () => {
        onChange(index, text === '\u00A0' ? '' : text);
        setFirstClick(true);
    };

    const handleKeyDown = e => {
        if (e.key === 'Backspace' && text.length <= 1) {
            setText('\u00A0');
        }
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            finishEditing();
        }
    };

    return (
        // receive accent class only when type is non-zero
        <span 
            className={`kana-char ${type && `accent-${typeName[type]}`}`}
            contentEditable={editable}
            suppressContentEditableWarning
            onClick={changeType}
            onInput={e => setText(e.currentTarget.innerText)}

            onBlur={finishEditing}
            onKeyDown={handleKeyDown}
        >
            {text}
        </span>
    );
}

export default function Kana({ text, editable = false, onUpdate }) {
    const kanaArray = splitKanaWithYouon(text);


    const handleCharUpdate = (index, newChar) => {
        const updated = [...kanaArray];
        updated[index] = newChar;
        onUpdate?.(updated.join(''));
    };

    return (
        <span className="kana-group">
            {kanaArray.map((char, i) => (
                <KanaChar
                    key={i}
                    char={char}
                    index={i}
                    editable={editable}
                    onChange={handleCharUpdate}
                />
            ))}
        </span>
    );
}