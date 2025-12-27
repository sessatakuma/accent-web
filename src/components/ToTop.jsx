import React, { useEffect, useState } from "react";
import { ArrowUp } from 'lucide-react';
import 'components/ToTop.css';

export default function ToTop() {
    const [hidden, setHidden] = useState(true);

    const handleScroll = () => {
        setHidden(window.scrollY === 0);
    }
    
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button 
            className={`to-top ${hidden ? 'hidden' : ''}`} 
            onClick={scrollToTop}
            aria-label="トップへ戻る"
        >
            <ArrowUp size={24} />
        </button>
    );
}
