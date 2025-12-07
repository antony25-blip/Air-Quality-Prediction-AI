import { useState } from 'react';

function ErrorAlert({ message, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
      border: '1px solid #f87171',
      borderRadius: '12px',
      padding: '1rem',
      margin: '1rem 0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            !
          </div>
          <div>
            <h3 style={{
              margin: '0',
              fontSize: '1rem',
              fontWeight: 'bold',
              color: '#dc2626'
            }}>
              Error
            </h3>
            <p style={{
              margin: '0.25rem 0 0 0',
              fontSize: '0.875rem',
              color: '#991b1b'
            }}>
              {message}
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            color: '#dc2626',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: '4px',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default ErrorAlert;
