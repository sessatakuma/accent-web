import React, {useEffect} from "react";

import 'components/ToTop.css';

export default function ToTop() {
    const [hidden, setHidden] = React.useState(true);

    const handleScroll = () => {
        setHidden(window.scrollY == 0);
    }
    
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <button className={`to-top ${hidden ? 'hidden' : ''}`} onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }}>
            <i className="fa-solid fa-caret-up" />
        </button>
    );
}
    
