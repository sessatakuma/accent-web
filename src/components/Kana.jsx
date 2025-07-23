import React, { useState } from 'react';

// an inline element marked w/ accent, changes type on click 
export default function Kana({ text, accent, onUpdate, editable = false}) {
    // if editable, set firstClick to true
    // this is to block the first click from changing the accent type
    const [firstClick, setFirstClick] = useState(editable);
    const accentName = ['none', 'flat', 'drop'];
    
    const changeType = () => {
        // if it's the first click that will start an edit, don't change type
        onUpdate?.(text, (accent + 1 - firstClick) % 3);
        // it isn't the first click anymore till finish editing
        setFirstClick(false);
    };

    const finishEditing = e => {
        onUpdate?.(e.target.innerText, accent)
        // note that if the Kana isn't editable, firstClick will never be ture
        if (!editable) return;
        setFirstClick(true);
    };

    const handleKeyDown = e => {
        if (e.key === 'Backspace') {
            if (e.target.innerText.length <= 1)
                e.target.innerText = '\u00A0'; // leave a placeholder space
        }
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (e.target.innerText.length == 0)
                e.target.innerText = '\u00A0'; 
            e.target.blur(); // trigger onBlur and save
        }
    };

    return (
        // receive accent class only when type is non-zero
        <span 
            className={`${accent && `accent-${accentName[accent]}`} ${editable && 'furigana'}`} 
            onClick={changeType}
            contentEditable={editable}
            suppressContentEditableWarning
            onBlur={finishEditing}
            onKeyDown={handleKeyDown}
        >
            {text}
        </span>
    );
}