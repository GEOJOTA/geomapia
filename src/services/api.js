// API Service para conectar con el backend
const API_URL = process.env.REACT_APP_API_URL || process.env.VITE_API_URL || 'https://geomapia-backend.vercel.app';

export const api = {
  // Verificar estado del backend
  async healthCheck() {
    try {
      const response = await fetch(`${API_URL}/api/health`);
      return await response.json();
    } catch (error) {
      console.error('Backend no disponible:', error);
      return { status: 'error', message: 'Backend offline' };
    }
  },

  // Obtener todos los datos geoespaciales
  async getGeoData() {
    try {
      const response = await fetch(`${API_URL}/api/geodata`);
      if (!response.ok) throw new Error('Error cargando datos');
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo geodata:', error);
      throw error;
    }
  },

  // Crear nuevo punto
  async createPoint(name, description, lat, lng) {
    try {
      const response = await fetch(`${API_URL}/api/geodata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          geometry: {
            type: 'Point',
            coordinates: [lng, lat] // Lon, Lat en GeoJSON
          }
        })
      });
      
      if (!response.ok) throw new Error('Error creando punto');
      return await response.json();
    } catch (error) {
      console.error('Error creando punto:', error);
      throw error;
    }
  },

  // Eliminar punto
  async deletePoint(id) {
    try {
      const response = await fetch(`${API_URL}/api/geodata/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Error eliminando punto');
      return await response.json();
    } catch (error) {
      console.error('Error eliminando punto:', error);
      throw error;
    }
  }
};

export default api;
