import React, { useState, useEffect } from "react";
import axios from "axios";

const FilterData = () => {
  const [skills, setSkills] = useState(["Plumber", "Electrician"]); // Available skills
  const [cities, setCities] = useState(["Ranip", "Thaltej"]); // Available cities (add more as needed)
  const [selectedSkill, setSelectedSkill] = useState("Electrician"); // Default skill
  const [selectedCity, setSelectedCity] = useState(""); // Default: no city selected
  const [data, setData] = useState([]); // Fetched data

  // Function to fetch data from the backend
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/C_auth/getByPlaceAndSkill", {
        params: {
          place: selectedCity || "", // Pass city (empty if none selected)
          skill: selectedSkill, // Pass selected skill
        },
      });
      setData(response.data); // Set fetched data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data whenever `selectedSkill` or `selectedCity` changes
  useEffect(() => {
    fetchData();
  }, [selectedSkill, selectedCity]);

  return (
    <div >
      <h1>Filter Service Providers</h1>
      
      {/* Skill Buttons */}
      {/* <div style={{ marginBottom: "20px" }}> */}
        {/* <h3>Select Skill:</h3> */}
        {skills.map((skill) => (
          <button key={skill} onClick={() => setSelectedSkill(skill)}>     
            {skill}
          </button>
        ))}
      {/* </div> */}

      {/* City Dropdown */}
      {/* <div style={{ marginBottom: "20px" }}> */}
        <h3>Select City:</h3>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
          }}
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      {/* </div> */}

      {/* Display Filtered Data */}
      <h3>Filtered Results:</h3>
      <table border="1" style={{ width: "100%", textAlign: "left", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Skill</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                <td>{item.username}</td>
                <td>{item.email}</td>
                <td>{item.mobile}</td>
                <td>{item.skill}</td>
                <td>{item.adress}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FilterData;
