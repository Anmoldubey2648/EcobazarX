import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css"; // This connects the styling

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        try {
            const response = await axios.post("http://localhost:8084/auth/login", {
                email: email,
                password: password
            });

            // LOGGING FOR DEBUGGING (Check your browser console!)
            console.log("Login Response:", response.data);

            const { token, role } = response.data;

            // --- THE NEW SECURITY CHECK ---
            // If the backend didn't send a token (or sent null), STOP HERE.
            if (!token || token === "null" || token === undefined) {
                throw new Error("Login failed: No token received");
            }

            // If we have a token, SAVE IT
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);

            // Redirect based on role
            if (role === "ADMIN") navigate("/admin-dashboard");
            else if (role === "SELLER") navigate("/seller-dashboard");
            else navigate("/user-dashboard");

        } catch (err) {
            console.error("Login Error:", err);
            // Show a specific error if the backend sent one, otherwise generic
            setError("Invalid Email or Password!");
        }
    };

    // NOTICE: We use 'className="auth-container"' here.
    // This is what triggers the background image!
    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Welcome Back  </h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="error-msg">{error}</p>}

                    <button type="submit" className="auth-btn">Login</button>
                </form>

                {/* This Link was missing in your screenshot! */}
                <p className="switch-text">
                    New to Ecobazar? <Link to="/register">Create an account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;