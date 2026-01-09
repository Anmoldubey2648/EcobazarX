import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css"; // Main background
import "./Shop.css"; // Card styles

const UserDashboard = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    // This runs AUTOMATICALLY when page loads
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/"); // Kick out if no token
            return;
        }

        try {
            // GET request with Token
            const response = await axios.get("http://localhost:8084/products/all", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setProducts(response.data); // Save data to state
        } catch (err) {
            alert("Failed to load products. " + err.message);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="auth-container" style={{ flexDirection: "column", justifyContent: "flex-start", overflowY: "auto" }}>

            {/* Header */}
            {/* Header with Glass Background for Visibility */}
            <div style={{
                textAlign: "center",
                marginTop: "20px",
                background: "rgba(108,108,108,0.7)",  /* <--- Dark transparent background */
                padding: "20px",
                borderRadius: "15px",
                width: "40%",        /* Controls how wide the box is */
                margin: "20px auto", /* Centers the box */
                backdropFilter: "blur(5px)", /* Blur effect */
                border: "1px solid rgba(0, 242, 255, 0.3)" /* Subtle Cyan Border */
            }}>
                <h1 style={{ color: "#66ff00", margin: "0" }}>ECOBAZAR MARKET</h1>
                <p style={{ color: "white", marginTop: "10px" }}>Sustainable Products for a Better Future</p>

                <button onClick={handleLogout} style={{
                    marginTop: "15px",
                    background: "#ff4d4d", /* Bright Red */
                    color: "white",
                    padding: "10px 25px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}>
                    LOGOUT
                </button>
            </div>

            {/* Product Grid */}
            <div className="product-grid">
                {products.length === 0 ? (
                    <h3>Loading Inventory... (or Shop is empty)</h3>
                ) : (
                    products.map((product) => (
                        <div key={product.id} className="product-card">
                            {/* Show image if exists, otherwise a placeholder color */}
                            {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="product-img" />
                            ) : (
                                <div className="product-img" style={{display:'flex', alignItems:'center', justifyContent:'center'}}>No Image</div>
                            )}

                            <h3>{product.name}</h3>
                            <p style={{ fontSize: "0.9rem", color: "#ccc" }}>{product.description}</p>
                            <div className="price-tag">${product.price}</div>
                            <button className="buy-btn">Buy Now</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UserDashboard;