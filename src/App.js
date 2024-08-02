import React, { useState } from 'react';
import './styles.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleJsonInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      // Validate JSON input
      const parsedData = JSON.parse(jsonInput);

      // Make API call
      const res = await fetch('http://127.0.0.1:8000/bfhl/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: parsedData.data }),
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      // console.log(data);

      // Set response and available dropdown options
      setResponse(data);
      setDropdownOptions(['Alphabets', 'Numbers', 'Highest alphabet']);
      setError(null);
    } catch (e) {
      setError('Invalid JSON input or server error');
      setResponse(null);
    }
  };

  const handleDropdownChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    
    // Filter response data based on selected dropdown options
    const filteredData = {};
    if (selectedOptions.includes('Alphabets') && response?.alphabets) {
      filteredData.Alphabets = response.alphabets;
    }
    if (selectedOptions.includes('Numbers') && response?.numbers) {
      filteredData.Numbers = response.numbers;
    }
    if (selectedOptions.includes('Highest alphabet') && response?.highest_alphabet) {
      filteredData['Highest alphabet'] = response.highest_alphabet;
    }

    setResponse(filteredData);
  };

  return (
    <div className="App">
      <h1>RA2111047010138</h1>
      <textarea
        rows="4"
        cols="50"
        placeholder='Enter JSON Data: {"data": ["A", "C", "z"]}'
        value={jsonInput}
        onChange={handleJsonInputChange}
      />
      <button onClick={handleSubmit}>Submit</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {response && (
        <>
          <select multiple={true} onChange={handleDropdownChange}>
            {dropdownOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <div>
            {Object.keys(response).map(key => (
              <div key={key}>
                <strong>{key}:</strong> {Array.isArray(response[key]) ? response[key].join(', ') : response[key]}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
