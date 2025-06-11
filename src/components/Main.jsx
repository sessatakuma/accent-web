import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import MainPage from 'components/MainPage.jsx';

export default function Main(props) {
    return <Router>
        <Route exact path="/" component={MainPage}/>
    </Router>
}