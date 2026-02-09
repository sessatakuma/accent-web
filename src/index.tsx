import Main from 'components/Main';
import { createRoot } from 'react-dom/client';

import './index.css';

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<Main />);
}
