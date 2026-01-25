import React from 'react';
import { createRoot } from 'react-dom/client';

import Main from 'components/Main.jsx';

import './index.css';

window.onload = function() {
    const container = document.getElementById('root');
    const root = createRoot(container);
    root.render(<Main/>);
};
