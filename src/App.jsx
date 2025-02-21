import { useState } from "react";
import "./App.css";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);

  const backendUrl = "https://bajaj-backend-qgwt.onrender.com/bfhl"; // Change if deployed

  // Handle JSON Input Change
  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
    setError(""); // Clear error on change
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedInput = JSON.parse(jsonInput);

      if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
        setError("Invalid JSON: `data` field must be an array.");
        return;
      }

      const response = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedInput),
      });

      const result = await response.json();
      setResponse(result);
    } catch (err) {
      setError("Invalid JSON format. Please check your input.");
    }
  };

  // Handle Multi-Select Dropdown
  const handleFilterChange = (e) => {
    const { value, checked } = e.target;
    setSelectedFilters((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  // Filter Response Data
  const filteredResponse = () => {
    if (!response) return null;
    const { numbers, alphabets, highest_alphabet } = response;
    let filteredData = {};

    if (selectedFilters.includes("Numbers")) filteredData.numbers = numbers;
    if (selectedFilters.includes("Alphabets")) filteredData.alphabets = alphabets;
    if (selectedFilters.includes("Highest Alphabet")) filteredData.highest_alphabet = highest_alphabet;

    return filteredData;
  };

  return (
    <div className="container">
      <h1>BFHL Data Processor</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder='Enter JSON (e.g., {"data":["A","1","B","2"]})'
          value={jsonInput}
          onChange={handleInputChange}
          rows="5"
        />
        <button type="submit">Submit</button>
      </form>

      {error && <p className="error">{error}</p>}

      {response && (
        <>
        <div className="uid">22BCS11283</div>
          <div className="filter-section">
            <label><input type="checkbox" value="Numbers" onChange={handleFilterChange} /> Numbers</label>
            <label><input type="checkbox" value="Alphabets" onChange={handleFilterChange} /> Alphabets</label>
            <label><input type="checkbox" value="Highest Alphabet" onChange={handleFilterChange} /> Highest Alphabet</label>
          </div>

          <div className="response-section">
            <h3>Response:</h3>
            <pre>{JSON.stringify(filteredResponse(), null, 2)}</pre>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
