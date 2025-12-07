import { useState } from "react";
import InputForm from "../components/InputForm";
import PredictionResult from "../components/PredictionResult";
import Loader from "../components/Loader";
import ErrorAlert from "../components/ErrorAlert";
import AirQualityAPI from "../services/api";

export default function Home() {
  const [predictionData, setPredictionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async (data) => {
    setIsLoading(true);
    setError(null);
    setPredictionData(null);

    try {
      console.log("Sending prediction request:", data);
      const result = await AirQualityAPI.makePrediction(data);
      console.log("Prediction result:", result);
      setPredictionData(result);
    } catch (err) {
      console.error("Prediction error:", err);
      setError(err.message || "Failed to make prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPredictionData(null);
    setError(null);
  };

  return (
    <div className="p-6">
      {/* Header Section with Background Image */}
      <div style={{
        backgroundImage: 'url(/src/pages/pexels-creative-vix-9754.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: '30px',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        {/* Overlay for better text readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%)',
          zIndex: 1
        }} />
        
        {/* Heading Content */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
          }}>
            Air Quality Prediction
          </h1>
          <p style={{
            fontSize: '1.2rem',
            opacity: 0.9,
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
          }}>
            Enter environmental parameters for accurate air quality analysis
          </p>
        </div>
      </div>

      {/* Form Section */}
      {!predictionData && <InputForm onSubmit={handlePredict} />}
      
      {/* Loading State */}
      {isLoading && <Loader message="Analyzing air quality data..." />}
      
      {/* Error State */}
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      
      {/* Prediction Results */}
      {predictionData && <PredictionResult predictionData={predictionData} onReset={handleReset} />}
    </div>
  );
}



