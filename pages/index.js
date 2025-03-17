import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://raw.githubusercontent.com/marchah/sea-ports/refs/heads/master/lib/ports.json";

export default function DataTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadData();
  }, [filters, page, pageSize]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/');
      const allData = Object.values(response.data);
      const filteredData = filters
        ? allData.filter((item) => item.name.toLowerCase().includes(filters.toLowerCase()))
        : allData;
      setTotalPages(Math.ceil(filteredData.length / pageSize));
      setData(filteredData.slice((page - 1) * pageSize, page * pageSize));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <input 
        type="text" 
        placeholder="Search by Name" 
        onChange={(e) => setFilters(e.target.value)}
        style={{ padding: "8px", marginBottom: "10px", width: "60%", borderRadius: "5px", border: "1px solid #ccc" }}
      />
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4", borderBottom: "2px solid #ddd" }}>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>UN/LOCODE</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Name</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Country</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Coordinates</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="4" style={{ padding: "10px" }}>Loading...</td></tr>
          ) : (
            data.map((item, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.unlocs ? item.unlocs[0] : "N/A"}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.name}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.country}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.coordinates ? item.coordinates.join(", ") : "N/A"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div style={{ marginTop: "15px" }}>
        <button 
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))} 
          disabled={page === 1}
          style={{ padding: "8px 12px", margin: "5px", borderRadius: "5px", border: "none", backgroundColor: "#007bff", color: "#fff", cursor: "pointer", opacity: page === 1 ? "0.5" : "1" }}
        >
          Prev
        </button>
        <button 
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} 
          disabled={page === totalPages}
          style={{ padding: "8px 12px", margin: "5px", borderRadius: "5px", border: "none", backgroundColor: "#007bff", color: "#fff", cursor: "pointer", opacity: page === totalPages ? "0.5" : "1" }}
        >
          Next
        </button>
      </div>
    </div>
  );
}