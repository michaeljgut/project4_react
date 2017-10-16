import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Router from './router';
import registerServiceWorker from './registerServiceWorker';
// import 'bootstrap/dist/css/bootstrap.css'


ReactDOM.render(Router, document.getElementById('root'));
registerServiceWorker();
