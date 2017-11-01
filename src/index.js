import ReactDOM from 'react-dom';
import './index.css';
import Router from './router';
import registerServiceWorker from './registerServiceWorker';
// import 'bootstrap/dist/css/bootstrap.css'

// To change between dev and production, change these lines in the package.json file
// Development
//  "start": "PORT=3001 react-scripts start",
//  "proxy": "http://localhost:3000"
// Production
//  "start": "react-scripts start",
//  "proxy": "https://calm-coast-77310.herokuapp.com/"


ReactDOM.render(Router, document.getElementById('root'));
registerServiceWorker();
