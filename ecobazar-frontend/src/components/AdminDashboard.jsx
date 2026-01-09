import { useNavigate } from "react-router-dom";
import "./Auth.css"; // Reuse our cool CSS for styling

const AdminDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/");
    };

    return (
        <div className="auth-container"> {/* Reusing the background */}
            <div className="auth-box" style={{ width: "600px" }}>
                <h2 style={{ color: "#ff4d4d" }}>COMMAND CENTER (ADMIN)</h2>
                <p>Welcome, Supreme Administrator.</p>

                <div style={{ margin: "20px 0", textAlign: "left" }}>
                    <h3>System Status:</h3>
                    <ul>
                        <li>🟢 Backend: Online</li>
                        <li>🟢 Database: Connected</li>
                        <li>🟡 Products: 0 Detected</li>
                    </ul>
                </div>

                <button onClick={handleLogout} className="auth-btn" style={{ background: "red" }}>
                    Logout System
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;