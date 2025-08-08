import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, ScaleControl, FeatureGroup, useMap } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import * as turf from '@turf/turf';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
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
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [osmData, setOsmData] = useState(null);
  const featureGroupRef = useRef(null);
  const [handleDrawCreated, setHandleDrawCreated] = useState(null);

  function MapEvents() {
    const map = useMap();
    useEffect(() => {
      if (handleDrawCreated) {
        map.on('draw:created', handleDrawCreated);
        return () => {
          map.off('draw:created', handleDrawCreated);
        };
      }
    }, [map, handleDrawCreated]);
    return null;
  }

  useEffect(() => {
    setHandleDrawCreated(() => async (e) => {
    const layer = e.layer;
    const geoJSON = layer.toGeoJSON();
    
    try {
      setLoading(true);
      setError(null);
      
      // Convertir el polígono a formato compatible con la API
      const bounds = turf.bbox(geoJSON);
      
      // Llamar a la API de GeoMapia
      const response = await axios.post('https://geomapia.onrender.com/api/query', {
        bbox: bounds,
        filters: {
          // Aquí puedes agregar filtros específicos
          amenity: ['school', 'hospital', 'park']
        }
      });

      setOsmData(response.data);
      
      // Agregar marcadores basados en la respuesta
      const newMarkers = response.data.features.map(feature => ({
        position: [
          feature.geometry.coordinates[1],
          feature.geometry.coordinates[0]
        ],
        title: feature.properties.name || 'Sin nombre',
        description: `Tipo: ${feature.properties.amenity || 'No especificado'}`
      }));
      
      setMarkers(newMarkers);
    } catch (err) {
      setError(err.message);
      console.error('Error al obtener datos:', err);
    } finally {
      setLoading(false);
    }
    });
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <div style={{ position: 'relative', height: '100%', width: '100%' }}>
        {/* Panel de control */}
        <div style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 1000,
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '4px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        }}>
          <h3>GeoMapia OSM Explorer</h3>
          {loading && <div>Cargando datos...</div>}
          {error && <div style={{color: 'red'}}>{error}</div>}
          <div>
            <small>Dibuja un polígono en el mapa para consultar datos de OSM</small>
          </div>
          {osmData && (
            <div>
              <h4>Resultados encontrados: {markers.length}</h4>
            </div>
          )}
        </div>

        <MapContainer 
          center={[-33.45, -70.6667]} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FeatureGroup ref={featureGroupRef}>
            <EditControl
              position="topright"
              draw={{
                rectangle: true,
                polygon: true,
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false
              }}
              edit={{
                edit: true,
                remove: true
              }}
            />
          </FeatureGroup>
          
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
          <MapEvents />
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
