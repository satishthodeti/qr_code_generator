import React from 'react';
import QRLinkGenerator from './components/QRLinkGenerator';
import './App.css';

const App = () => (
  <div className="align-center">
    <h1 className="animated-title">QR Code Generator App</h1>
    <QRLinkGenerator />
  </div>
);

export default App;
