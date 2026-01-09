import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css"; // Uses the same cool styling

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER" // Default role
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8084/auth/register", formData);
            alert("Registration Successful! Please Login.");
            navigate("/"); // Go back to login page
        } catch (err) {
            alert("Registration Failed: " + (err.response?.data || "Unknown Error"));
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Create Account</h2>
                <form onSubmit={handleRegister}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input type="text" name="name" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" name="email" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" name="password" onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label>I am a:</label>
                        {/* This is the Dropdown you wanted! */}
                        <select name="role" onChange={handleChange} className="role-select">
                            <option value="USER">Buyer (User)</option>
                            <option value="SELLER">Seller (Vendor)</option>
                        </select>
                    </div>

                    <button type="submit" className="auth-btn">Register</button>
                </form>
                <p className="switch-text">
                    Already have an account? <Link to="/">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;