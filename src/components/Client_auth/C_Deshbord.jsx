
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg"; // Unused import can be removed
import '../../components/Client_auth/C_Deshbord.css'; // Import the CSS file
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios'; // Import axios
import "./../Client_auth/C_Deshbord.css"
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import image1 from './img.jpeg'; // Adjust path as needed
import image2 from './img.jpeg'; // Replace with actual image paths
import image3 from './img.jpeg'; // Replace with actual image paths
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Modal, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { Dropdown, DropdownButton, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';

function Navbar() {

  // places 

  // State to store data and the selected place
  const [data, setData] = useState([]);
  const [show, setShow] = useState(''); // To control Offcanvas visibility
  const [selectedPlace, setSelectedPlace] = useState('');

  const [electricianData, setElectricianData] = useState([]);
  const [plumberData, setPlumberData] = useState([]);
  const [selectedPlaceElectrician, setSelectedPlaceElectrician] = useState('');
  const [selectedPlacePlumber, setSelectedPlacePlumber] = useState('');
  const [providerId, setProviderId] = useState(null);



  // jay shri hari har 

  const [skill, setSkill] = useState("");
  const [city, setCity] = useState("");
  const [datap, setDatap] = useState([]);

  const skills = ["Electrician", "Plumber"];
  const cities = ["Ranip", "Visnagar", "AMD"];

  const handleSkillChange = (e) => {
    setSkill(e.target.value);
    setCity(""); // Reset city when skill changes
    setDatap([]); // Reset data
  };

  const handleCityChange = async (e) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);

    if (!skill) {
      alert("Please select a skill first!");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:4000/api/C_auth/getByPlace`, {
        params: { place: selectedCity },
      });
      const filteredData = response.data.filter((item) => item.skill === skill);
      setDatap(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // jay shri

  const handleShow = async (skill) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/C_auth/getBySkill`, {
        params: { skill },

      });

      if (skill === 'electrician') {
        setElectricianData(response.data); // Set electrician data
      } else if (skill === 'plumber') {
        setPlumberData(response.data); // Set plumber data
      } else if (skill === 'makeup artist') {
        setPlumberData(response.data);
      } else if (skill === 'gas serviceman') {
        setPlumberData(response.data);
      }

      setShow(skill); // Open the appropriate Offcanvas with skill-based data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function to show electricians or plumbers by place
  const handleShowByPlace = async (place, skill) => {
    try {
      let response;
      if (place === '') {
        // If no place is selected, fetch all data based on skill
        response = await axios.get(`http://localhost:4000/api/C_auth/getBySkill`, {
          params: { skill },
        });
      } else {
        // Fetch based on the selected place
        response = await axios.get(`http://localhost:4000/api/C_auth/getByPlace`, {
          params: { place },
        });
      }

      if (skill === 'electrician') {

        setElectricianData(response.data); // Set electrician data based on place
      } else if (skill === 'plumber') {
        setPlumberData(response.data); // Set plumber data based on place
        console.log(response.data)
      } else if (skill === 'makeup artist') {
        setPlumberData(response.data);
      } else if (skill === 'gas serviceman') {
        setPlumberData(response.data);
      }

      setShow(skill); // Keep the correct Offcanvas open
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Handle place change for electricians
  const handlePlaceChangeElectrician = (event) => {
    const place = event.target.value;
    setSelectedPlaceElectrician(place); // Update the selected place for electrician
    handleShowByPlace(place, 'electrician'); // Fetch data for electrician by place
  };

  // Handle place change for plumbers

  const handlePlaceChangePlumber = (event) => {
    // console.log(event.target.value)
    const place = event.target.value;
    setSelectedPlacePlumber(place); // Update the selected place for plumber

    handleShowByPlace(place, 'plumber'); // Fetch data for plumber by place
  };

  const handlePlaceChangemekupart = (event) => {
    const place = event.target.value;
    setSelectedPlacePlumber(place); // Update the selected place for plumber
    handleShowByPlace(place, 'makeup artist'); // Fetch data for mekup artist  by place
  };

  const handlePlaceChangegasservices = (event) => {
    const place = event.target.value;
    setSelectedPlacePlumber(place); // Update the selected place for gas serviceman

    if (place === '') {
      // If "Select a Place" is chosen, fetch all data
      handleShowByPlace('', 'gas serviceman');
    } else {
      // Fetch data for the selected place
      handleShowByPlace(place, 'gas serviceman');
    }
  };

  // jay harihar 

  const [skills1, setSkills] = useState(["Plumber", "Electrician"]); // Available skills
  const [cities1, setCities] = useState(["Ranip", "Thaltej"]); // Available cities (add more as needed)
  const [selectedSkill, setSelectedSkill] = useState("Electrician"); // Default skill
  const [selectedCity, setSelectedCity] = useState(""); // Default: no city selected
  const [data1, setData1] = useState([]); // Fetched data

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/C_auth/getByPlaceAndSkill", {
        params: {
          place: selectedCity || "", // Pass city (empty if none selected)
          skill: selectedSkill, // Pass selected skill
        },
      });
      setData1(response.data); // Set fetched data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedSkill, selectedCity]);

  // jay hari 


  const handleClose = () => setShow('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [userData, setUserData] = useState({
    username: '',
    email: '',
    mobile: '',
    adress: '',
    profilePhoto: '',
    Id: ''
  });

  // const data_id = Id
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
    const updatedUserData = { ...userData, profilePhoto: '' };
    setUserData(updatedUserData);
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
  };

  const handleSaveChanges = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Exclude profilePhoto when sending data to the backend
      const { ...dataToSend } = userData;
      await axios.put('http://localhost:4000/api/C_auth/updateProfile', dataToSend);

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

  ///   books the time sholt 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');

  const handleTimeChange = (e) => setSelectedTime(e.target.value);
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const bookingData = {
        username,
        email,
        mobile,
        address,
        date: selectedDate,
        time: selectedTime,
        providerId, // Include the provider's ID in the booking data

      };

      console.log('Booking data being sent:', bookingData);
      console.log('this is ', bookingData.providerId);

      // Send booking data to the backend
      const response = await axios.post('http://localhost:4000/api/C_auth/book-service', bookingData);
      console.log('Response from server:', response.data);

      alert('Booking saved successfully!');
      setIsModalOpen(false); // Close the modal on success

      // Clear form fields
      setUsername('');
      setEmail('');
      setMobile('');
      setAddress('');
      setSelectedDate(null);
      setSelectedTime('');
    } catch (error) {
      console.error('Error booking service:', error);
      alert('Failed to book the service. Please try again.');
    }
  };



  const handleContactClickp = async (electrician) => {
    // Validate input
    if (!selectedDate || !selectedTime || !selectedPlaceElectrician) {
      alert('Please select a place, date, and time before sending a request.');
      return;
    }
    // ------------------------------------------------------------------------------
  };

  const handleContactClick = () => {
    setIsModalOpen(true); // Assuming `setIsModalOpen` is already defined
  };





  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          <img src="company-logo.png" alt="Logo" />
          <span>HomeAdvisor</span>
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
            <img src={userData.profilePhoto} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
          ) : (
            <FontAwesomeIcon icon={faUser} style={{ fontSize: '30px' }} />
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
      {/* End nev bar  */}



      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100 carousel-image"
            src={'https://whichfranchise.co.za/wp-content/uploads/2015/03/Service-Providers-for-Franchisees-1-900x500.jpg'}
            alt="Third slide"
          />
          <Carousel.Caption>
            <h5>First slide label</h5>
            <p>Some representative placeholder content for the first slide.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100 carousel-image"
            src={'https://whichfranchise.co.za/wp-content/uploads/2015/03/Service-Providers-for-Franchisees-1-900x500.jpg'}
            alt="Third slide"
          />
          <Carousel.Caption>
            <h5>Second slide label</h5>
            <p>Some representative placeholder content for the second slide.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100 carousel-image"
            src={'https://whichfranchise.co.za/wp-content/uploads/2015/03/Service-Providers-for-Franchisees-1-900x500.jpg'}
            alt="Third slide"
          />
          <Carousel.Caption>
            <h5>Third slide label</h5>
            <p>Some representative placeholder content for the third slide.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <div id='back_blogs'>

        <section className="py-16 dark:bg-dark">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-l-4 border-primary pl-4 sm:pl-6 lg:pl-8 max-w-full md:max-w-3xl lg:max-w-5xl mx-auto">
              <h2 className="mb-4 text-center text-xl sm:text-2xl lg:text-3xl font-semibold text-dark dark:text-white" id="title">
                States Statistics
              </h2>
              <p className="text-center text-sm sm:text-base lg:text-lg font-medium text-body-color dark:text-dark-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
                ultrices lectus sem.
              </p>
            </div>
          </div>
        </section>

        <CardGroup>

          <Card>
            <Card.Img id='bords' variant="top" src={'https://whichfranchise.co.za/wp-content/uploads/2015/03/Service-Providers-for-Franchisees-1-900x500.jpg'} style={{ objectFit: 'cover' }} />
            <Card.Body>
              <Card.Title>Electrician</Card.Title>
              <Card.Text>
                This is a wider card with supporting text below as a natural lead-in
                to additional content. This content is a little bit longer.
              </Card.Text>
              <Button variant="primary" onClick={() => handleShow('electrician')}>
                Electrician
              </Button>
            </Card.Body>
          </Card>

          <Card>
            <Card.Img id='bords' variant="top" src={'https://whichfranchise.co.za/wp-content/uploads/2015/03/Service-Providers-for-Franchisees-1-900x500.jpg'} style={{ objectFit: 'cover' }} />
            <Card.Body>
              <Card.Title>plumber</Card.Title>
              <Card.Text>
                This card has supporting text below as a natural lead-in to
                additional content. Text below as a natural lead-in to
                additional content.
              </Card.Text>
              <Button variant="primary" onClick={() => handleShow('plumber')}>
                Plumber
              </Button>
            </Card.Body>
          </Card>

          <Card>
            <Card.Img id='bords' variant="top" src="https://whichfranchise.co.za/wp-content/uploads/2015/03/Service-Providers-for-Franchisees-1-900x500.jpg" style={{ objectFit: 'cover' }} />
            <Card.Body>
              <Card.Title>makeup artist</Card.Title>
              <Card.Text>
                This is a wider card with supporting text below as a natural lead-in
                to additional content. This card has even longer content than the
              </Card.Text>
              <Button variant="primary" onClick={() => handleShow('makeup artist')}>
                makeup artist
              </Button>
            </Card.Body>
          </Card>

          <Card>
            <Card.Img id='bords' variant="top" src="image4.jpg" style={{ objectFit: 'cover' }} />
            <Card.Body>
              <Card.Title>gas serviceman</Card.Title>
              <Card.Text>
                This is a wider card with supporting text below as a natural lead-in
                to additional content. This card has even longer content than the
              </Card.Text>
              <Button variant="primary" onClick={() => handleShow('gas serviceman')}>
                gas serviceman
              </Button>
            </Card.Body>
          </Card>
        </CardGroup>

        {/* Offcanvas for Electrician */}

        <Offcanvas show={show === 'electrician'} onHide={() => setShow('')} backdrop="static" placement="top" id="custom-offcanvas">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className="text-center w-100">Electrician</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="text-center mb-3">
              <div id="field">
                <select onChange={handlePlaceChangeElectrician} value={selectedPlaceElectrician}>
                  <option value="">Select a Place</option>
                  <option value="Ranip">Ranip</option>
                  <option value="Thaltej">Thaltej</option>
                  <option value="Maninagar">Maninagar</option>
                </select>
              </div>
            </div>
            {electricianData.length === 0 ? (
              <p className="text-center">No electricians found.</p>
            ) : (
              <Row className="g-4">
                {electricianData.map((item, index) => (
                  <Col key={index} xs={12} sm={6} md={4} lg={3}>
                    <Card className="shadow-sm" style={{ borderRadius: '10px' }}>
                      <Card.Img variant="top" src={'https://cdn.prod.website-files.com/644b4c3f43a3f61814fcd44a/645744cb13de786d324e5618_Best_IT_Service_Providers.jpeg'} style={{ height: '100px', width: '100px', objectFit: 'cover', borderRadius: '50%', margin: '0 auto' }} />
                      <Card.Body className="text-center" style={{ backgroundColor: '#f8f9fa' }}>
                        <Card.Title>{item.username}</Card.Title>
                        <Card.Text>Email: {item.email}</Card.Text>
                        <Card.Text>Mobile: {item.mobile}</Card.Text>
                        <Card.Text>Address: {item.adress}</Card.Text>
                        <Card.Text>Id: {item.Id}</Card.Text>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            handleContactClick();
                            setProviderId(item.Id); // Set the selected provider's ID
                            setIsModalOpen(true);  // Open the modal
                          }}
                        >
                          Contact
                        </Button>





                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Offcanvas.Body>
        </Offcanvas>

        {/* setSelectedname */}

        {/* Modal for Calendar and Time Slot */}
        <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Book a Service</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Select Date</Form.Label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  className="form-control"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Select Time</Form.Label>
                <InputGroup>
                  <FormControl
                    type="time"
                    value={selectedTime}
                    onChange={handleTimeChange}
                    required
                  />
                </InputGroup>
              </Form.Group>

               

              <Button variant="primary" type="submit">
                Confirm
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        <Offcanvas show={show === 'plumber'} onHide={() => setShow('')} backdrop="static" placement="top" id="custom-offcanvas">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className="text-center w-100">Plumber</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="text-center mb-3">
              <div id="field">
                <select onChange={handlePlaceChangePlumber} value={selectedPlacePlumber}>
                  <option value="">Select a Place</option>
                  <option value="Ranip">Ranip</option>
                  <option value="Thaltej">Thaltej</option>
                  <option value="Maninagar">Maninagar</option>
                </select>
              </div>
            </div>
            {plumberData.length === 0 ? (
              <p className="text-center">No plumbers found.</p>
            ) : (
              <Row className="g-4">
                {plumberData.map((item, index) => (
                  <Col key={index} xs={12} sm={6} md={4} lg={3}>
                    <Card className="shadow-sm" style={{ borderRadius: '10px' }}>
                      <Card.Img variant="top" src={'https://cdn.prod.website-files.com/644b4c3f43a3f61814fcd44a/645744cb13de786d324e5618_Best_IT_Service_Providers.jpeg'} style={{ height: '100px', width: '100px', objectFit: 'cover', borderRadius: '50%', margin: '0 auto' }} />
                      <Card.Body className="text-center" style={{ backgroundColor: '#f8f9fa' }}>
                        <Card.Title>{item.username}</Card.Title>
                        <Card.Text>Email: {item.email}</Card.Text>
                        <Card.Text>Mobile: {item.mobile}</Card.Text>
                        <Card.Text>Address: {item.adress}</Card.Text>
                        <Card.Text>Id: {item.Id}</Card.Text>

                        <Button variant="primary" size="sm" onClick={handleContactClick}>
                          Contact
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Offcanvas.Body>
        </Offcanvas>
        {/* {this is mecurp atist } */}

        <Offcanvas show={show === 'makeup artist'} onHide={() => setShow('')} backdrop="static" placement="top" id="custom-offcanvas">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className="text-center w-100">Plumber</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="text-center mb-3">
              <div id="field">
                <select onChange={handlePlaceChangemekupart} value={selectedPlacePlumber}>
                  <option value="">Select a Place</option>
                  <option value="Ranip">Ranip</option>
                  <option value="Thaltej">Thaltej</option>
                  <option value="Maninagar">Maninagar</option>
                </select>
              </div>
            </div>
            {plumberData.length === 0 ? (
              <p className="text-center">No plumbers found.</p>
            ) : (
              <Row className="g-4">
                {plumberData.map((item, index) => (
                  <Col key={index} xs={12} sm={6} md={4} lg={3}>
                    <Card className="shadow-sm" style={{ borderRadius: '10px' }}>
                      <Card.Img variant="top" src={'https://cdn.prod.website-files.com/644b4c3f43a3f61814fcd44a/645744cb13de786d324e5618_Best_IT_Service_Providers.jpeg'} style={{ height: '100px', width: '100px', objectFit: 'cover', borderRadius: '50%', margin: '0 auto' }} />
                      <Card.Body className="text-center" style={{ backgroundColor: '#f8f9fa' }}>
                        <Card.Title>{item.username}</Card.Title>
                        <Card.Text>Email: {item.email}</Card.Text>
                        <Card.Text>Mobile: {item.mobile}</Card.Text>
                        <Card.Text>Address: {item.adress}</Card.Text>
                        <Card.Text>Id: {item.Id}</Card.Text>

                        <Button variant="primary" size="sm" onClick={handleContactClick}>
                          Contact
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Offcanvas.Body>
        </Offcanvas>

        {/* Offcanvas for gas serviceman  handlePlaceChangegasservices */}


        <Offcanvas show={show === 'gas serviceman'} onHide={() => setShow('')} backdrop="static" placement="top" id="custom-offcanvas">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className="text-center w-100">Plumber</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="text-center mb-3">
              <div id="field">
                <select onChange={handlePlaceChangegasservices} value={selectedPlacePlumber}>
                  <option value="">Select a Place</option>
                  <option value="Ranip">Ranip</option>
                  <option value="Thaltej">Thaltej</option>
                  <option value="Maninagar">Maninagar</option>
                </select>

              </div>
            </div>
            {plumberData.length === 0 ? (
              <p className="text-center">No plumbers found.</p>
            ) : (
              <Row className="g-4">
                {plumberData.map((item, index) => (
                  <Col key={index} xs={12} sm={6} md={4} lg={3}>
                    <Card className="shadow-sm" style={{ borderRadius: '10px' }}>
                      <Card.Img variant="top" src={'https://cdn.prod.website-files.com/644b4c3f43a3f61814fcd44a/645744cb13de786d324e5618_Best_IT_Service_Providers.jpeg'} style={{ height: '100px', width: '100px', objectFit: 'cover', borderRadius: '50%', margin: '0 auto' }} />
                      <Card.Body className="text-center" style={{ backgroundColor: '#f8f9fa' }}>
                        <Card.Title>{item.username}</Card.Title>
                        <Card.Text>Email: {item.email}</Card.Text>
                        <Card.Text>Mobile: {item.mobile}</Card.Text>
                        <Card.Text>Address: {item.adress}</Card.Text>
                        <Card.Text>Id: {item.Id}</Card.Text>

                        <Button variant="primary" size="sm" onClick={handleContactClick}>
                          Contact
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Offcanvas.Body>
        </Offcanvas>


        <h1>hello sneh </h1>
      </div>





    </div>

  );
}


export default Navbar;


// AIzaSyCeYz1UiLVSps9NrHJPpOVmnSs1ZlRwmzo