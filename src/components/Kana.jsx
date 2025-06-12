import React, { useState } from 'react';

// an inline element marked w/ accent, changes type on click 
export default function Kana({ text, onUpdate, editable = false}) {
    const [type, setType] = useState(0);
    // if editable, set firstClick to true
    // this is to block the first click from changing the type
    const [firstClick, setFirstClick] = useState(editable);
    const typeName = ['none', 'flat', 'drop'];
    
    const changeType = () => {
        // if it's the first click that will start an edit, don't change type
        setType(prev => (prev + 1 - firstClick) % 3);
        // it isn't the first click anymore till finish editing
        setFirstClick(false);
    };

    let finishEditing = e => {
        if (!editable) return;
        onUpdate?.(e.target.innerText)
        // note that if the Kana isn't editable, firstClick will never be ture
        setFirstClick(true);
    };

    let handleKeyDown = e => {
        if (e.key === 'Backspace') {
            if (e.target.innerText.length <= 1)
                e.target.innerText = '\u00A0'; // leave a placeholder space
        }
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (e.target.innerText.length == 0)
                e.target.innerText = '\u00A0'; 
            if (e.target.innerText === '\u00A0') 
                setType(0); // reset type if empty
            e.target.blur(); // trigger onBlur and save
        }
    };

    return (
        // receive accent class only when type is non-zero
        <span 
            className={`${type && `accent-${typeName[type]}`} ${editable && 'furigana'}`} 
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