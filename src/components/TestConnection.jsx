import React, { useState, useEffect } from 'react';
import api from '../services/api';

const TestConnection = () => {
  const [status, setStatus] = useState('Verificando...');
  const [geodata, setGeodata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPoint, setNewPoint] = useState({ name: '', description: '', lat: '', lng: '' });

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const health = await api.healthCheck();
        setStatus(health.status);
        const data = await api.getGeoData();
        setGeodata(data);
      } catch (err) {
        setError('No se pudo conectar con el backend');
      } finally {
        setLoading(false);
      }
    };
    checkConnection();
  }, []);

  const handleAddPoint = async (e) => {
    e.preventDefault();
    try {
      await api.createPoint(newPoint.name, newPoint.description, newPoint.lat, newPoint.lng);
      setNewPoint({ name: '', description: '', lat: '', lng: '' });
      const data = await api.getGeoData();
      setGeodata(data);
    } catch (err) {
      setError('No se pudo agregar el punto');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deletePoint(id);
      const data = await api.getGeoData();
      setGeodata(data);
    } catch (err) {
      setError('No se pudo eliminar el punto');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Conexión al Backend</h2>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {status === 'healthy' && <p>Backend conectado: {status}</p>}
      <h3>Puntos Geoespaciales</h3>
      <ul>
        {geodata.map((point) => (
          <li key={point.id}>
            {point.name} ({point.geometry.coordinates.join(', ')})
            <button onClick={() => handleDelete(point.id)} style={{ marginLeft: '10px' }}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
      <h3>Agregar Punto</h3>
      <form onSubmit={handleAddPoint}>
        <input
          type="text"
          placeholder="Nombre"
          value={newPoint.name}
          onChange={(e) => setNewPoint({ ...newPoint, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={newPoint.description}
          onChange={(e) => setNewPoint({ ...newPoint, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Latitud"
          value={newPoint.lat}
          onChange={(e) => setNewPoint({ ...newPoint, lat: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Longitud"
          value={newPoint.lng}
          onChange={(e) => setNewPoint({ ...newPoint, lng: e.target.value })}
          required
        />
        <button type="submit">Agregar</button>
      </form>
    </div>
  );
};

export default TestConnection;
