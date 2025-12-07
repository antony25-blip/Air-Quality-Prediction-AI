import { useState } from "react";
import "../index.css";



function InputForm({ onSubmit }) {
  const [form, setForm] = useState({
    pm25: "",
    pm10: "",
    no: "",
    no2: "",
    nox: "",
    nh3: "",
    co: "",
    so2: "",
    o3: "",
    benzene: "",
    toluene: ""
  });

    const handleChange = (e) => {
        setForm({...form,[e.target.name]: e.target.value});
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    }

  return (
    <form onSubmit={handleSubmit} style={{ width: '90%' ,marginLeft: '5%'}}>
  <div className="overflow-x-auto">
  <table style={{
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: '0',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 10px 15px -3px rgba(12, 10, 10, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  fontSize: '14px',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)'
}}>
  <thead style={{
    background: 'linear-gradient(135deg,rgb(4, 44, 15) 0%,rgb(91, 113, 84) 100%)',
    color: 'white',
    fontSize: '0.875rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  }}>
    <tr>
      {Object.keys(form).map((key) => (
        <th
          key={key}
          style={{
            padding: '16px 12px',
            textAlign: 'left',
            borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
            position: 'relative'
          }}
        >
          {key}
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '12px',
            right: '12px',
            height: '2px',
            background: 'rgba(255, 255, 255, 0.3)'
          }} />
        </th>
      ))}
    </tr>
  </thead>
  <tbody>
    <tr style={{
      background: 'white',
      transition: 'all 0.2s ease-in-out'
    }}>
      {Object.keys(form).map((key) => (
        <td 
          key={key} 
          style={{
            padding: '12px',
            borderBottom: '1px solid #e2e8f0',
            background: 'rgba(248, 250, 252, 0.5)',
            position: 'relative'
          }}
        >
          <input
            type="number"
            step="any"
            name={key}
            value={form[key]}
            onChange={handleChange}
            style={{
              width: '80%',
              padding: '10px 12px',
              border: '1px solid #cbd5e0',
              borderRadius: '8px',
              fontSize: '14px',
              background: 'white',
              transition: 'all 0.2s ease-in-out',
              outline: 'none',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              e.target.style.background = '#f7fafc';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#cbd5e0';
              e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
              e.target.style.background = 'white';
            }}
            required
          />
        </td>
      ))}
    </tr>
  </tbody>
</table>
  </div>

  <div className="button-container">
      <button type="submit" className="predict-btn">
        Predict
      </button>
    </div>

</form>

  );
}
export default InputForm;

