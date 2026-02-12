import { useState } from "react";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value) => {
    setSearch(value);

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:3000/api/stock/search?query=${value}`,
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item) => {
    setSelected(item);
    setSuggestions([]);
    setSearch(item.part);
  };

  const handleUpdate = async () => {
    try {
      await fetch("http://localhost:3000/api/stock/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selected),
      });

      alert("Stock Updated Successfully ✅");
    } catch (err) {
      alert("Update Failed ❌");
    }
  };

  return (
    <div className="container">
      <h2>Stock Management Panel</h2>

      <div className="search-wrapper">
        <input
          type="text"
          placeholder="🔍 Search Part / Item / Description / Sheet"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {loading && (
        <div className="loading">
          <p>🔄 Searching...</p>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((item, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleSelect(item)}
            >
              <strong>{item.part}</strong> - {item.item}
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="form">
          <div className="input-group">
            <label className="input-label">Part Number</label>
            <input value={selected.part} readOnly />
          </div>

          <div className="input-group">
            <label className="input-label">Item Name</label>
            <input value={selected.item} readOnly />
          </div>

          <div className="input-group">
            <label className="input-label">Description</label>
            <input value={selected.desc} readOnly />
          </div>

          <div className="input-group">
            <label className="input-label">Quantity 📦</label>
            <input
              type="number"
              className="editable-input"
              value={selected.qty}
              onChange={(e) =>
                setSelected({ ...selected, qty: e.target.value })
              }
              placeholder="Enter quantity"
            />
          </div>

          <div className="input-group">
            <label className="input-label">MRP (₹) 💰</label>
            <input
              type="number"
              className="editable-input"
              value={selected.mrp}
              onChange={(e) =>
                setSelected({ ...selected, mrp: e.target.value })
              }
              placeholder="Enter price"
            />
          </div>

          <button onClick={handleUpdate}>✓ Update Stock</button>
        </div>
      )}
    </div>
  );
}

export default App;