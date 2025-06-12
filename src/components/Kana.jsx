import React, { useState } from 'react';

// an inline element marked w/ accent, changes type on click 
export default function Kana({text = ''}) {
    const [type, setType] = useState(0);
    const typeName = ['none', 'flat', 'drop'];
    const changeType = () => {
        setType(prev => (prev + 1) % 3);
    };
    
    return (
        // receive accent class only when type is non-zero
        <span 
            className={type && `accent-${typeName[type]}`} 
            onClick={changeType} 
        >
            {text}
        </span>
    );
}