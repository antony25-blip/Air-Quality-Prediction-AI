const API_BASE_URL = 'http://localhost:5002';

class AirQualityAPI {
  async makePrediction(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Prediction failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async getHealthStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) {
        throw new Error('Health check failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }

  async getModelInfo() {
    try {
      const response = await fetch(`${API_BASE_URL}/model-info`);
      if (!response.ok) {
        throw new Error('Failed to get model info');
      }
      return await response.json();
    } catch (error) {
      console.error('Model info error:', error);
      throw error;
    }
  }

  async getFeatures() {
    try {
      const response = await fetch(`${API_BASE_URL}/features`);
      if (!response.ok) {
        throw new Error('Failed to get features');
      }
      return await response.json();
    } catch (error) {
      console.error('Features error:', error);
      throw error;
    }
  }
}

export default new AirQualityAPI();
