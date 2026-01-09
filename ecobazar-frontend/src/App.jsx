import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register"; // <--- This MUST be here
import AdminDashboard from "./components/AdminDashboard";
import SellerDashboard from "./components/SellerDashboard";
import UserDashboard from "./components/UserDashboard";
function App() {
    return (
        <Router>
            <Routes>

                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                {/* URL: /  --> Show Login */}
                <Route path="/" element={<Login />} />

                {/* URL: /register --> Show Register (This was likely missing or wrong) */}
                <Route path="/register" element={<Register />} />

                {/* Dashboards */}
                <Route path="/admin-dashboard" element={<h1 style={{color:'white'}}>Admin Dashboard</h1>} />
                <Route path="/seller-dashboard" element={<SellerDashboard />} />
                <Route path="/user-dashboard" element={<UserDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;