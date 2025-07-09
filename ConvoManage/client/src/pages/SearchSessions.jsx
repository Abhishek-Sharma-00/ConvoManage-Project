import { useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const SearchSessions = () => {
  const [filters, setFilters] = useState({
    title: "",
    speaker: "",
    dateFrom: "",
    dateTo: "",
    conferenceId: "",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    setLoading(true);
    setResults([]); // Clear previous results
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const res = await axios.get(
        `http://localhost:5000/api/sessions/search?${params.toString()}`
      );
      toast.success("Sessions fetched successfully");
      setResults(res.data);
    } catch (err) {
      toast.error("Failed to fetch sessions");
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container-two">
      <h2>Search Sessions</h2>
      <div className="inputs">
        <input
          type="text"
          name="title"
          placeholder="Session Title"
          value={filters.title}
          onChange={handleChange}
        />
        <input
          type="text"
          name="speaker"
          placeholder="Speaker Name"
          value={filters.speaker}
          onChange={handleChange}
        />
        <p>From</p>
        <input
          type="date"
          name="dateFrom"
          placeholder="From Date"
          onChange={handleChange}
        />
        <p>To</p>
        <input
          type="date"
          name="dateTo"
          placeholder="To Date"
          onChange={handleChange}
        />
        <input
          type="text"
          name="conferenceId"
          placeholder="Conference ID (optional)"
          onChange={handleChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <h3>Results:</h3>
      <ul>
        {results.map((s) => (
          <li key={s._id}>
            <strong>{s.title}</strong> - {s.speaker?.name || "No speaker"} <br />
            {new Date(s.startTime).toLocaleString()} to{" "}
            {new Date(s.endTime).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchSessions;
