const API_URL = process.env.VITE_API_URL || 'https://geomapia-backend.vercel.app';

export const api = {
  async healthCheck() {
    try {
      const response = await fetch(`${API_URL}/api/health`);
      if (!response.ok) throw new Error('Health check failed');
      return await response.json();
    } catch (error) {
      console.error('Backend no disponible:', error);
      return { status: 'error', message: 'Backend offline' };
    }
  },

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
            coordinates: [parseFloat(lng), parseFloat(lat)]
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
