import React from 'react';
import ReactDOM from 'react-dom';
import './css/styles.css';
import './css/nes-core.min.css';
import App from './App';

const ws = new WebSocket('ws://localhost:3030/ws')

ReactDOM.render(
    <React.StrictMode>
        <App socket={ws} />
    </React.StrictMode>,
    document.getElementById('root')
);

