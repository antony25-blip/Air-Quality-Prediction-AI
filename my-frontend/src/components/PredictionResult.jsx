import { useState, useEffect } from 'react';
import Loader from './Loader';
import ErrorAlert from './ErrorAlert';

function PredictionResult({ predictionData, onReset }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAQIColor = (category) => {
    const colors = {
      'Good': '#00e400',
      'Moderate': '#ffff00',
      'Unhealthy for Sensitive Groups': '#ff7e00',
      'Unhealthy': '#ff0000',
      'Very Unhealthy': '#8f3f97',
      'Hazardous': '#7e0023'
    };
    return colors[category] || '#666';
  };

  const getAQIDescription = (category) => {
    const descriptions = {
      'Good': 'Air quality is satisfactory, and air pollution poses little or no risk.',
      'Moderate': 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.',
      'Unhealthy for Sensitive Groups': 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
      'Unhealthy': 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.',
      'Very Unhealthy': 'Health alert: The risk of health effects is increased for everyone.',
      'Hazardous': 'Health warning of emergency conditions: everyone is more likely to be affected.'
    };
    return descriptions[category] || 'Unknown air quality category.';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return '#00e400';
    if (confidence >= 60) return '#ffff00';
    if (confidence >= 40) return '#ff7e00';
    return '#ff0000';
  };

  if (isLoading) {
    return <Loader message="Processing prediction..." />;
  }

  if (error) {
    return <ErrorAlert message={error} onClose={() => setError(null)} />;
  }

  if (!predictionData) {
    return null;
  }

  return (
    <div className="prediction-result">
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: '16px',
        padding: '2rem',
        margin: '2rem 0',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ color: '#718096', fontSize: '1.1rem' }}>
            Based on the environmental parameters provided
          </p>
        </div>

        {/* Main Prediction Card */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: `3px solid ${getAQIColor(predictionData.prediction)}`
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: getAQIColor(predictionData.prediction),
              marginBottom: '1rem',
              textShadow: '2px 2px 4px rgba(205, 0, 0, 0.1)'
            }}>
              {predictionData.prediction}
            </div>
            
            <div style={{
              fontSize: '1.2rem',
              color: '#4a5568',
              marginBottom: '1.5rem',
              lineHeight: '1.6'
            }}>
              {getAQIDescription(predictionData.prediction)}
            </div>

            {/* Confidence Score */}
            <div style={{
              display: 'inline-block',
              background: getConfidenceColor(predictionData.confidence),
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '25px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(201, 15, 15, 0.2)'
            }}>
              Confidence: {predictionData.confidence}%
            </div>
          </div>
        </div>

        {/* Detailed Probabilities */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#2d3748',
            textAlign: 'center'
          }}>
            Prediction Probabilities
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {Object.entries(predictionData.probabilities).map(([category, probability]) => (
              <div key={category} style={{
                background: 'white',
                borderRadius: '8px',
                padding: '1rem',
                boxShadow: '0 2px 4px rgba(2, 2, 218, 0.1)',
                border: category === predictionData.prediction ? 
                  `2px solid ${getAQIColor(category)}` : '1px solid #e2e8f0'
              }}>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  color: '#4a5568',
                  marginBottom: '0.5rem'
                }}>
                  {category}
                </div>
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: getAQIColor(category)
                }}>
                  {probability}%
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: '#e2e8f0',
                  borderRadius: '3px',
                  marginTop: '0.5rem',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${probability}%`,
                    height: '100%',
                    background: getAQIColor(category),
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Data Summary */}
        <div style={{
          background: '#f7fafc',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#2d3748'
          }}>
            Input Parameters
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '0.5rem',
            fontSize: '0.9rem'
          }}>
            {Object.entries(predictionData.input_data).map(([key, value]) => (
              <div key={key} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.25rem 0',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <span style={{ fontWeight: 'bold', color: '#4a5568' }}>
                  {key.toUpperCase()}:
                </span>
                <span style={{ color: '#2d3748' }}>
                  {typeof value === 'number' ? value.toFixed(2) : value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Timestamp */}
        <div style={{
          textAlign: 'center',
          color: '#718096',
          fontSize: '0.9rem',
          marginBottom: '2rem'
        }}>
          Prediction made on: {new Date(predictionData.timestamp).toLocaleString()}
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={onReset}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            Make Another Prediction
          </button>
        </div>
      </div>
    </div>
  );
}

export default PredictionResult;
