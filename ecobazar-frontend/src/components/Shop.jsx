import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Professional.css";

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterEco, setFilterEco] = useState(false);

    // UI State
    const [cartCount, setCartCount] = useState(0);
    const [sortOption, setSortOption] = useState("default");

    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
        updateCartCount();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8084/products/all", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setProducts(response.data);
        } catch (err) {
            console.error("Error fetching shop items:", err);
        }
    };

    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartCount(cart.length);
    };

    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        setCartCount(cart.length);
        alert(`${product.name} added to cart! 🛒`);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    // --- SMART SEARCH LOGIC ---
    const getProcessedProducts = () => {
        const term = searchTerm.toLowerCase();

        // 1. Filter first
        let result = products.filter(product => {
            // Check Name OR Category
            const nameMatch = product.name.toLowerCase().includes(term);
            const categoryMatch = product.category && product.category.toLowerCase().includes(term);

            const matchesSearch = nameMatch || categoryMatch;
            const matchesEco = filterEco ? (product.ecoRating === 'A' || product.ecoRating === 'B') : true;

            return matchesSearch && matchesEco;
        });

        // 2. Then Sort
        if (sortOption === "priceLow") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOption === "priceHigh") {
            result.sort((a, b) => b.price - a.price);
        } else if (sortOption === "co2Low") {
            result.sort((a, b) => (a.carbonFootprint || 0) - (b.carbonFootprint || 0));
        }

        return result;
    };

    const filteredProducts = getProcessedProducts();

    return (
        <div className="pro-body">
            {/* NAVBAR */}
            <div className="navbar">
                <div className="brand-logo" onClick={() => navigate("/shop")}>EcoBazar 🌿</div>

                <div className="nav-buttons">
                    {/* ✅ ADDED: Profile Button */}
                    <button className="btn-profile" onClick={() => navigate("/profile")} style={{ marginRight: "10px" }}>
                        👤 Profile
                    </button>

                    <button className="btn-profile" onClick={() => navigate("/my-orders")} style={{ marginRight: "10px" }}>
                        📜 History
                    </button>

                    <button className="btn-cart" onClick={() => navigate("/cart")} style={{ marginRight: "10px" }}>
                        🛒 Cart {cartCount > 0 && <span style={{background: "#c0392b", color: "white", borderRadius: "50%", padding: "2px 6px", fontSize: "0.8rem", marginLeft: "5px"}}>{cartCount}</span>}
                    </button>

                    <button className="btn-logout" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {/* SEARCH BAR CONTAINER */}
            <div className="pro-container" style={{ marginTop: "20px", marginBottom: "20px", display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap", background: "rgba(255,255,255,0.8)", padding: "15px", borderRadius: "12px" }}>

                <input
                    type="text"
                    placeholder="🔍 Search by Name or Category (e.g. Soap)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #ddd", outline: "none", minWidth: "200px" }}
                />

                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", userSelect: "none", background: "#e8f8f5", padding: "10px 15px", borderRadius: "8px", border: "1px solid #a7f3d0" }}>
                    <input type="checkbox" checked={filterEco} onChange={(e) => setFilterEco(e.target.checked)} style={{ width: "18px", height: "18px", accentColor: "#059669" }} />
                    <span style={{ fontSize: "0.95rem", color: "#065f46", fontWeight: "600" }}>🌱 Eco Only</span>
                </label>

                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="custom-select"
                    style={{
                        padding: "12px 16px",
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                        outline: "none",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                    }}
                >
                    <option value="default">✨ Sort By: Featured</option>
                    <option value="priceLow">💰 Price: Low to High</option>
                    <option value="priceHigh">💎 Price: High to Low</option>
                    <option value="co2Low">🌿 CO2: Lowest First</option>
                </select>
            </div>

            {/* PRODUCT GRID */}
            <div className="pro-container" style={{ marginTop: "0" }}>
                {filteredProducts.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "50px", color: "#6b7280" }}>
                        <h3>No products found. 🍃</h3>
                        <p>Try searching for "Soap" or "Electronics".</p>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "30px" }}>
                        {filteredProducts.map(product => (
                            <div key={product.id} className="pro-card" style={{ padding: "0", overflow: "hidden", position: "relative" }}>

                                <div style={{
                                    position: "absolute", top: "15px", right: "15px", zIndex: 10,
                                    background: product.ecoRating === 'A' ? '#059669' : product.ecoRating === 'B' ? '#f59e0b' : '#ef4444',
                                    color: "white", padding: "4px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "bold",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                                }}>
                                    {product.ecoRating === 'A' ? '🌿 Best Choice' : product.ecoRating === 'B' ? '⚠️ Good' : '🏭 High CO2'}
                                </div>

                                <div
                                    onClick={() => navigate(`/product/${product.id}`)}
                                    style={{ height: "200px", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderBottom: "1px solid #f3f4f6" }}
                                >
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "20px" }} />
                                    ) : <span style={{ color: "#aaa" }}>No Image</span>}
                                </div>

                                <div style={{ padding: "20px" }}>
                                    <h3 onClick={() => navigate(`/product/${product.id}`)} style={{ margin: "0 0 5px 0", fontSize: "1.1rem", color: "#1f2937", cursor: "pointer" }} className="hover-underline">
                                        {product.name}
                                    </h3>

                                    <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>
                                        {product.category || "General"}
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                                        <span style={{ fontSize: "1.25rem", fontWeight: "800", color: "#059669" }}>${product.price}</span>
                                        <div style={{ textAlign: "right", fontSize: "0.85rem", color: "#6b7280" }}>
                                            <div>CO2: <b>{product.carbonFootprint} kg</b></div>
                                        </div>
                                    </div>

                                    <button className="btn-primary" onClick={() => addToCart(product)} style={{ width: "100%", borderRadius: "8px", padding: "10px" }}>
                                        Add to Cart 🛒
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shop;