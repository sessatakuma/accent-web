import React, { useState, useRef } from 'react';

import Nav from 'components/Nav.jsx';
import Input from 'components/Input.jsx';
import Run from 'components/Run.jsx';
import Result from 'components/Result.jsx';
import ToTop from 'components/ToTop.jsx';
import Footer from 'components/Footer.jsx';

import 'components/Main.css';
import 'utilities/accentMarker.css';

export default function Main() {
    const [paragraph, setParagraph] = useState("");
    const [words, setWords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const resultRef = useRef(null);

    return (
        <div className="app-container">
            <Nav />
            
            <main className="main-content">
                <div className="two-col-layout">
                    <section className="input-panel">
                        <Input paragraph={paragraph} setParagraph={setParagraph} />
                        <Run 
                            setWords={setWords} 
                            paragraph={paragraph} 
                            resultRef={resultRef}
                            setIsLoading={setIsLoading} 
                        />
                    </section>
                    
                    <section className="result-panel">
                        <Result 
                            words={words} 
                            setWords={setWords} 
                            ref={resultRef} 
                            isLoading={isLoading}
                        />
                    </section>
                </div>
            </main>

            <ToTop />
            <Footer />
        </div>
    );
}