import React, { useRef, useState } from 'react';
import getRect from 'utilities/getRect.jsx'

export default function Furigana({ text, onUpdate }) {
    const [type, setType] = useState(0);
    const [firstClick, setFirstClick] = useState(true);
    const typeName = ['none', 'flat', 'drop'];
    
    const changeType = () => {
        setType(prev => (prev + 1 - firstClick) % 3);
        setFirstClick(false);
    };

    let finishEditing = () => {
        // if the text is empty, remove the furigana
        if (text.trim() === '') {
            onUpdate(null);
        } else {
            setFirstClick(true);
            onUpdate(e.target.innerText)
        }
    };

    let handleKeyDown = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            e.target.blur(); // trigger onBlur and save
        }
    };

    return <>       
        <span 
            className={`${type && `accent-${typeName[type]}`} furigana`} 
            onClick={changeType}
            contentEditable
            suppressContentEditableWarning
            onBlur={finishEditing}
            onKeyDown={handleKeyDown}
        >
            {text}
        </span>
    </>;
}