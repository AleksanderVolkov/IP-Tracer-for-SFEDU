import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.scss';

const wrapper = ReactDOM.createRoot(document.querySelector('.wrapper'));
wrapper.render(<App />);
