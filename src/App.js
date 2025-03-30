import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import DeshBord from './components/DeshBord/DeshBord';
import LoginSignup from './components/Authantication/Logins';
import Client_auth from './components/Client_auth/Client_login';
import OffcanvasExample from './components/Client_auth/C_Deshbord';
import FilterData from './components/Client_auth/demo';
 
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginSignup />} />
                 <Route path="/DeshBord" element={<DeshBord />} />
                 <Route path="/client" element={<Client_auth />} />
                 <Route path="/client_dashboard" element={<OffcanvasExample />} />
                 <Route path="/demo" element={<FilterData />} />


            </Routes>
        </Router>
    );
}

export default App;