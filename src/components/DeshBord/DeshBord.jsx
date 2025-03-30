import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { CgProfile } from "react-icons/cg";
import '../../components/Client_auth/C_Deshbord.css'; // Import the CSS file
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios'; // Import axios
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

function DeshBord() {

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [userData, setUserData] = useState({
    username: '',
    email: '',
    mobile: '',
    adress: '',
    skill: '',
    profilePhoto: '',
    city: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from local storage or API
    const data = JSON.parse(localStorage.getItem('userData'));
    if (data) {
      setUserData(data);
    } else {
      navigate('/'); // Redirect to login if no user data
    }
  }, [navigate]);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxW = 200;
          const maxH = 200;
          let w = img.width;
          let h = img.height;

          if (w > h) {
            if (w > maxW) {
              h *= maxW / w;
              w = maxW;
            }
          } else {
            if (h > maxH) {
              w *= maxH / h;
              h = maxH;
            }
          }

          canvas.width = w;
          canvas.height = h;
          ctx.drawImage(img, 0, 0, w, h);

          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setUserData({ ...userData, profilePhoto: compressedDataUrl });
          localStorage.setItem('userData', JSON.stringify({ ...userData, profilePhoto: compressedDataUrl }));
        };
      };
      reader.readAsDataURL(file);
    }
  };


  const handleRemovePhoto = () => {
    setUserData({ ...userData, profilePhoto: '' });
    localStorage.setItem('userData', JSON.stringify({ ...userData, profilePhoto: '' }));
  };

  const handleSaveChanges = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Exclude profilePhoto when sending data to the backend
      const { ...dataToSend } = userData;
      await axios.put('http://localhost:5000/api/auth/serviceupdateProfile', dataToSend);

      // Update local storage
      localStorage.setItem('userData', JSON.stringify(userData));
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error('Error updating profile:', error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem('userData');
    // Redirect to login page
    navigate('/');
  };


  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("http://localhost:4000/api/C_auth/get_request");
        setData(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);


  const containerStyle = {
    maxWidth: "800px",
    margin: "auto",
    padding: "20px",
  };

  const headingStyle = {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: "20px",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "center",
    fontSize: "16px",
  };

  const thTdStyle = {
    border: "1px solid #ddd",
    padding: "10px",
  };

  const headerStyle = {
    backgroundColor: "#333",
    color: "#fff",
  };

  const responsiveTable = {
    overflowX: "auto",
    display: "block",
  };



  // ---------------------------------------------------------


  const [requests, setRequests] = useState([]);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await axios.get("http://localhost:4000/api/get_requests");
        console.log("Fetched Data:", res.data); // Confirm data here
        setRequests(res.data); // Ensure full data is set
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    }
    fetchRequests();

    // Listen for real-time updates
    socket.on("requestUpdated", (data) => {
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === data.id ? { ...req, status: data.status } : req
        )
      );
    });

    return () => socket.off("requestUpdated");
  }, []);

  const handleAction = async (id, status) => {
    try {
      await axios.post("http://localhost:4000/api/update_request", { id, status });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };


  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          <img src="company-logo.png" alt="Logo" />
          <span>MyCompany</span>
        </div>
        <div className="hamburger-menu" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
        <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <li>
            <Link to="#" className="link" onClick={toggleMenu}>Home</Link>
          </li>
          <li>
            <Link to="#" className="link" onClick={toggleMenu}>About Us</Link>
          </li>
          <li>
            <Link to="#" className="link" onClick={toggleMenu}>Services</Link>
          </li>
          <li>
            <input type="text" placeholder="Search..." className="search-input" />
          </li>
        </ul>
        <div className="profile-icon" onClick={toggleProfile}>
          {userData.profilePhoto ? (
            <img src={userData.profilePhoto} alt="Profile" className="profile-icon-img" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
          ) : (
            <FontAwesomeIcon icon={faUser} style={{ fontSize: 30 }} />
          )}
        </div>
      </nav>

      <div className={`profile-panel ${isProfileOpen ? 'open' : ''}`}>
        <button id="close-btn" onClick={toggleProfile}>X</button>

        <div className="dashboard">
          <h1 id='profile_name'>Profile</h1>
          {userData ? (
            <div className="user-profile">
              <div className="profile-photo">
                <img src={userData.profilePhoto || 'default-profile.png'} alt="Profile" />
                {isEditing && (
                  <>
                    <label htmlFor="profile-photo-input" className="upload-icon">📷</label>
                    <input
                      type="file"
                      id="profile-photo-input"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      style={{ display: 'none' }}
                    />
                    <button className="remove-photo-btn" onClick={handleRemovePhoto}>
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </>
                )}
              </div>
              <div className="profile-details">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={userData.username}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={userData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <input
                  type="text"
                  name="mobile"
                  placeholder="Mobile Number"
                  value={userData.mobile}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <input
                  type="text"
                  name="adress"
                  placeholder="Address"
                  value={userData.adress}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <input
                  type="text"
                  name="skill"
                  placeholder="Skill"
                  value={userData.skill}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <input
                  type="text"
                  name="city"
                  placeholder="city"
                  value={userData.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              {isEditing ? (
                <button id="save-btn" onClick={handleSave}>Save</button>
              ) : (
                <button id="save-btn" onClick={handleSaveChanges}>Edit Profile</button>
              )}
              <button id="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>

      <h1>hello sneh patel</h1>


      <div style={containerStyle}>
        <h2 style={headingStyle}>Client Requests</h2>
        <div style={responsiveTable}>
          <table style={tableStyle}>
            <thead>
              <tr style={headerStyle}>
                <th style={thTdStyle}>#</th>
                <th style={thTdStyle}>Username</th>
                <th style={thTdStyle}>Email</th>
                <th style={thTdStyle}>Mobile</th>
                <th style={thTdStyle}>Address</th>
                <th style={thTdStyle}>Time</th>
                <th style={thTdStyle}>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="4" style={thTdStyle}>No data available</td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={index}>
                    <td style={thTdStyle}>{index + 1}</td>
                    <td style={thTdStyle}>{item.username || "N/A"}</td>
                    <td style={thTdStyle}>{item.email}</td>
                    <td style={thTdStyle}>{item.mobile || "N/A"}</td>
                    <td style={thTdStyle}>{item.address || "N/A"}</td>
                    <td style={thTdStyle}>{item.date || "N/A"}</td>
                    <td style={thTdStyle}>{item.time || "N/A"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

       
        <h1>hello sneh</h1>

    </div>


  );
}

export default DeshBord;
