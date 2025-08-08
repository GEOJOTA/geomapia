import React from 'react';
import TestConnection from './components/TestConnection';
import './index.css';

function App() {
  return (
    <div className="App" style={{ fontFamily: 'Arial, sans-serif' }}>
      <header style={{ 
        backgroundColor: '#2c3e50', 
        color: 'white', 
        padding: '1rem',
        textAlign: 'center'
      }}>
        <h1>🗺️ GeoMapia</h1>
        <p>Plataforma de datos geoespaciales</p>
      </header>
      <main>
        <TestConnection />
      </main>
    </div>
  );
}

export default App;
