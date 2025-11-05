import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import carrierApp from './carrierapp.jsx';
import reportWebVitals from './reportWebVitals';
import CarrierApp from './carrierapp.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CarrierApp />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
