import React from 'react';
import TestConnection from './components/TestConnection';
// import tus otros componentes...

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
        {/* Componente de prueba - mantén esto hasta que tengas tu mapa principal */}
        <TestConnection />
        
        {/* Aquí irán tus otros componentes */}
        {/* <MapComponent /> */}
        {/* <Dashboard /> */}
      </main>
    </div>
  );
}

export default App;
