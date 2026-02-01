import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { placeholder } from 'utilities/placeholder.jsx';
// an inline element marked w/ accent, changes type on click
export default function Kana({ text, accent, onUpdate, editable = false }) {
    // if editable, set firstClick to true
    // this is to block the first click from changing the accent type
    const [firstClick, setFirstClick] = useState(editable);
    const accentName = ['none', 'flat', 'drop'];

    const changeType = e => {
        // if it's the first click that will start an edit, don't change type
        onUpdate?.(e.target.innerText, (accent + 1 - firstClick) % 3);
        // it isn't the first click anymore till finish editing
        setFirstClick(false);
    };

    const finishEditing = e => {
        if (!editable) return;
        onUpdate?.(e.target.innerText, accent);
        // note that if the Kana isn't editable, firstClick will never be ture
        setFirstClick(true);
    };

    const handleKeyDown = e => {
        if (e.key === 'Backspace') {
            if (e.target.innerText.length <= 1) e.target.innerText = placeholder;
            // leave a placeholder space, this need to be handled here instead of Result.jsx, to prevent empty furigana causing weird mouse position
        }
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (e.target.innerText.length == 0) e.target.innerText = placeholder;
            e.target.blur(); // trigger onBlur and save
        }
    };

    return (
        // receive accent class only when type is non-zero
        <span
            className={`kana ${accent ? `accent-${accentName[accent]}` : ''} ${editable ? 'furigana' : ''}`}
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

Kana.propTypes = {
    text: PropTypes.string.isRequired,
    accent: PropTypes.number.isRequired,
    onUpdate: PropTypes.func,
    editable: PropTypes.bool,
};
