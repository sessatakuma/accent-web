import React from 'react';

import Main from 'components/Main.jsx';
import { createRoot } from 'react-dom/client';

import './index.css';

window.onload = function () {
    const container = document.getElementById('root');
    const root = createRoot(container);
    root.render(<Main />);
};
