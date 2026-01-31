import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Professional.css";

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        try {
            // 1. Fetch fresh data from Backend
            const response = await axios.get("http://localhost:8084/users/profile", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            // 2. Update State
            setUser(response.data);

            // 3. CRITICAL: Update LocalStorage so it doesn't show old data next time
            localStorage.setItem("user", JSON.stringify(response.data));

        } catch (err) {
            console.error("Error fetching profile:", err);
            // Fallback to local data only if backend fails
            const savedUser = JSON.parse(localStorage.getItem("user"));
            if (savedUser) setUser(savedUser);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    // Helper to color the role badge
    const getRoleBadgeStyle = (role) => {
        if (role === "ADMIN") return { background: "#fee2e2", color: "#991b1b" }; // Red
        if (role === "SELLER") return { background: "#dbeafe", color: "#1e40af" }; // Blue
        return { background: "#d1fae5", color: "#065f46" }; // Green (User)
    };

    if (!user) return <div className="pro-container" style={{textAlign: "center", marginTop: "50px"}}>Loading Profile...</div>;

    return (
        <div className="pro-body">
            {/* NAVBAR */}
            <div className="navbar">
                <div className="brand-logo" onClick={() => navigate("/shop")}>EcoBazaar 🌿</div>
                <div className="nav-buttons">
                    <button className="btn-secondary" onClick={() => navigate("/shop")}>← Back to Shop</button>
                    <button className="btn-logout" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {/* PROFILE CARD */}
            <div className="pro-container" style={{ maxWidth: "550px", marginTop: "60px" }}>
                <div className="pro-card" style={{ padding: "40px", textAlign: "center" }}>

                    <h2 style={{ marginBottom: "25px", color: "#1f2937" }}>My Eco-Profile 🌍</h2>

                    {/* AVATAR */}
                    <div style={{
                        width: "100px", height: "100px", borderRadius: "50%",
                        background: "linear-gradient(135deg, #059669 0%, #34d399 100%)",
                        color: "white", margin: "0 auto 20px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "2.5rem", fontWeight: "bold",
                        boxShadow: "0 10px 20px rgba(5, 150, 105, 0.3)"
                    }}>
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>

                    <h3 style={{ margin: "10px 0", fontSize: "1.5rem" }}>{user.name}</h3>
                    <p style={{ color: "#6b7280", marginBottom: "10px" }}>{user.email}</p>

                    {/* DYNAMIC ROLE BADGE */}
                    <span className="badge" style={getRoleBadgeStyle(user.role)}>
                        {user.role}
                    </span>

                    <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "25px 0" }} />

                    {/* ECO-SCORE SECTION */}
                    <div style={{ background: "#f0fdf4", padding: "20px", borderRadius: "16px", border: "1px solid #bbf7d0", marginBottom: "25px" }}>
                        <h4 style={{ margin: 0, color: "#166534", textTransform: "uppercase", fontSize: "0.85rem" }}>🌱 Eco-Score</h4>
                        <h1 style={{ fontSize: "3.5rem", margin: "10px 0", color: "#059669", fontWeight: "800" }}>
                            {user.ecoScore || 0}
                        </h1>
                        <p style={{ fontSize: "0.9rem", color: "#15803d", margin: 0 }}>
                            Points earned from sustainable shopping
                        </p>
                    </div>

                    {/* --- SMART DASHBOARD LINKS --- */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

                        {/* 1. Show ADMIN Button if Admin */}
                        {user.role === "ADMIN" && (
                            <button
                                className="btn-primary"
                                style={{ background: "#dc2626", boxShadow: "0 4px 12px rgba(220, 38, 38, 0.3)" }}
                                onClick={() => navigate("/admin-dashboard")}
                            >
                                ⚡ Go to Admin Dashboard
                            </button>
                        )}

                        {/* 2. Show SELLER Button if Seller */}
                        {user.role === "SELLER" && (
                            <button
                                className="btn-primary"
                                style={{ background: "#2563eb", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)" }}
                                onClick={() => navigate("/seller-dashboard")}
                            >
                                📦 Go to Seller Dashboard
                            </button>
                        )}

                        {/* 3. History Button (For Everyone) */}
                        <button
                            className="btn-secondary"
                            onClick={() => navigate("/my-orders")}
                        >
                            📜 View Order History
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;