import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import TestConnection from './components/TestConnection';
import './index.css';

function LocationMarker({ onAddPoint }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onAddPoint(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Nuevo punto seleccionado</Popup>
    </Marker>
  );
}

function App() {
  const [points, setPoints] = useState([]);

  // Puedes llamar a la API aquí o pasar los puntos desde TestConnection

  // Función para agregar punto temporal (solo UI)
  const handleAddPoint = (latlng) => {
    alert(`Punto nuevo en: ${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`);
    // Aquí podrías abrir formulario para guardar punto real
  };

  return (
    <div className="App" style={{ fontFamily: 'Arial, sans-serif' }}>
      <header
        style={{
          backgroundColor: '#2c3e50',
          color: 'white',
          padding: '1rem',
          textAlign: 'center',
        }}
      >
        <h1>🗺️ GeoMapia</h1>
        <p>Plataforma de datos geoespaciales</p>
      </header>
      <main>
        <MapContainer center={[-33.45, -70.6667]} zoom={12} style={{ height: '400px', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker onAddPoint={handleAddPoint} />
          {points.map((p) => (
            <Marker key={p.id} position={[p.geometry.coordinates[1], p.geometry.coordinates[0]]}>
              <Popup>
                <b>{p.name}</b>
                <br />
                {p.description}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        <TestConnection />
      </main>
    </div>
  );
}

export default App;
