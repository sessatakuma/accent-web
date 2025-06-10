import React, { useEffect, useRef, useState } from 'react';
import getRect from 'utilities/getRect.jsx'

export default function EditableStr({ content = '', onSave }) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(content);
    const [tempValue, setTempValue] = useState(content);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const inputRef = useRef(null);
    const spanRef = useRef(null);

    const startEditing = () => {
        setWidth(getRect(spanRef).width);
        setHeight(getRect(spanRef).height);
        setTempValue(value);
        setEditing(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const finishEditing = () => {
        setValue(tempValue);
        setEditing(false);
        onSave?.(tempValue);
    };

    const cancelEditing = () => {
        setTempValue(value);
        setEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') finishEditing();
        if (e.key === 'Escape') cancelEditing();
    };

    return editing ? 
        <input
            ref={inputRef}
            type="text"
            value={tempValue}
            onChange={e => setTempValue(e.target.value)}
            onBlur={finishEditing}
            onKeyDown={handleKeyDown}
            style={{'--width': width + 'px', '--height': height + 'px'}}
        /> : 
        <span ref={spanRef} onClick={startEditing}>{value || '...'}</span>
    ;
}