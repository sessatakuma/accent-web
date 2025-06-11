import React, { useEffect, useRef, useState } from 'react';
import 'components/AccentText.css';

export default function AccentText({text = ''}) {
    const [type, setType] = useState(0);
    const typeName = ['none', 'flat', 'drop'];
    const changeType = () => {
        setType(prev => (prev + 1) % 3);
    };
    
    return (
        <span 
            className={type && `accent-${typeName[type]}`} 
            onClick={changeType} 
            style={{cursor: 'pointer'}}
        >
            {text}
        </span>
    );
}