import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, ScaleControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icon
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function App() {
  const [markers] = useState([
    {
      position: [-33.45, -70.6667],
      title: 'Santiago Centro',
      description: 'Capital de Chile'
    },
    {
      position: [-33.4205, -70.5825],
      title: 'Providencia',
      description: 'Comuna de Santiago'
    }
  ]);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer 
        center={[-33.45, -70.6667]} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}  // We'll add it in a different position
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.position}>
            <Popup>
              <div>
                <h3>{marker.title}</h3>
                <p>{marker.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        <ZoomControl position="topright" />
        <ScaleControl position="bottomright" />
      </MapContainer>
    </div>
  );
}

export default App;
