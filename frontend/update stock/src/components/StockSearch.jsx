import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/api/boschStock";

function StockSearch() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}?search=${search}&page=${page}&limit=20`
      );

      const result = await res.json();

      setData(result.boschStock || []);
      setTotalPages(result.totalPages || 1);
      setTotal(result.total || 0);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Live search with debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 400); // 400ms delay

    return () => clearTimeout(delayDebounce);
  }, [search, page]);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>Bosch Stock Search</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search partno, description, sheet..."
          value={search}
          onChange={(e) => {
            setPage(1); // reset page on typing
            setSearch(e.target.value);
          }}
          style={{
            padding: "8px",
            width: "300px",
          }}
        />
      </div>

      <p>Total Records: {total}</p>

      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p style={{ color: "red", fontWeight: "bold" }}>
          No Data Found
        </p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Part No</th>
              <th>Item Name</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>MRP</th>
              <th>Sheet</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item._id}>
                <td>{(page - 1) * 20 + index + 1}</td>
                <td>{item.partno}</td>
                <td>{item.itemName}</td>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>{item.mrp}</td>
                <td>{item.sheetName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: "20px" }}>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          style={{ marginRight: "10px" }}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          style={{ marginLeft: "10px" }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default StockSearch;
