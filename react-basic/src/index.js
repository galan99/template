import React from 'react';
import ReactDOM from 'react-dom';
import Router from './router'
import './assets/css/app.scss'

console.log(`Looks like we are in ${process.env.NODE_ENV} mode!`);
ReactDOM.render(<Router />, document.getElementById('root'));
