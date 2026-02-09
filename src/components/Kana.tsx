import { useState, KeyboardEvent, FocusEvent, MouseEvent } from 'react';

import { placeholder } from 'utilities/placeholder';

interface KanaProps {
    text: string;
    accent: number;
    onUpdate?: (text: string, accent: number) => void;
    editable?: boolean;
}

// an inline element marked w/ accent, changes type on click
export default function Kana({ text, accent, onUpdate, editable = false }: KanaProps) {
    // if editable, set firstClick to true
    // this is to block the first click from changing the accent type
    const [firstClick, setFirstClick] = useState(editable);
    const accentName = ['none', 'flat', 'drop'];

    const changeType = (e: MouseEvent<HTMLSpanElement>): void => {
        const target = e.target as HTMLSpanElement;
        // if it's the first click that will start an edit, don't change type
        onUpdate?.(target.innerText, (accent + 1 - (firstClick ? 1 : 0)) % 3);
        // it isn't the first click anymore till finish editing
        setFirstClick(false);
    };

    const finishEditing = (e: FocusEvent<HTMLSpanElement>): void => {
        if (!editable) return;
        const target = e.target as HTMLSpanElement;
        onUpdate?.(target.innerText, accent);
        // note that if the Kana isn't editable, firstClick will never be ture
        setFirstClick(true);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLSpanElement>): void => {
        const target = e.target as HTMLSpanElement;
        if (e.key === 'Backspace') {
            if (target.innerText.length <= 1) target.innerText = placeholder;
            // leave a placeholder space, this need to be handled here instead of Result.tsx, to prevent empty furigana causing weird mouse position
        }
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (target.innerText.length == 0) target.innerText = placeholder;
            target.blur(); // trigger onBlur and save
        }
    };

    return (
        // receive accent class only when type is non-zero
        <span
            className={`kana ${accent ? `accent-${accentName[accent]}` : ''} ${
                editable ? 'furigana' : ''
            }`}
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
