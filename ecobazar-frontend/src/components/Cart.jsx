import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Professional.css";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(savedCart);

        if (savedCart.length > 0) {
            fetchGreenSuggestions(savedCart[0].id);
        }
    }, []);

    const fetchGreenSuggestions = async (productId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:8084/orders/recommendations/${productId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setRecommendations(res.data);
        } catch (err) {
            console.log("No suggestions found.");
        }
    };

    const removeFromCart = (indexToRemove) => {
        const newCart = cartItems.filter((_, index) => index !== indexToRemove);
        setCartItems(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    const handleCheckout = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login to checkout!");
            navigate("/");
            return;
        }

        if (!window.confirm("Confirm Purchase?")) return;

        const orderPayload = cartItems.map(item => ({
            productId: item.id,
            productName: item.name,
            price: item.price,
            quantity: 1
        }));

        try {
            await axios.post("http://localhost:8084/orders/checkout", orderPayload, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            alert("Order Placed Successfully! 🌱");
            localStorage.removeItem("cart");
            setCartItems([]);
            navigate("/shop");
        } catch (err) {
            alert("Checkout failed.");
            console.error(err);
        }
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
    const totalCarbon = cartItems.reduce((sum, item) => sum + (item.carbonFootprint || 0), 0);

    return (
        <div className="pro-body">
            <div className="navbar">
                <div className="brand-logo" onClick={() => navigate("/shop")}>EcoBazar 🛒</div>
                {/* UPDATED BUTTON: Uses btn-secondary instead of btn-logout */}
                <button className="btn-secondary" onClick={() => navigate("/shop")}>
                    ← Continue Shopping
                </button>
            </div>

            <div className="pro-container" style={{ maxWidth: "1100px" }}>
                <h2 style={{ marginBottom: "20px", color: "#1f2937" }}>Your Smart Cart 🌿</h2>

                <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>

                    {/* Left: Cart Items */}
                    <div style={{ flex: 2 }}>
                        {cartItems.length === 0 ? (
                            <div className="pro-card" style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
                                <h3>Your cart is empty.</h3>
                                <p>Go add some eco-friendly products!</p>
                            </div>
                        ) : (
                            cartItems.map((item, index) => (
                                <div key={index} className="pro-card" style={{ display: "flex", padding: "15px", marginBottom: "15px", alignItems: "center" }}>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: "0 0 5px 0" }}>{item.name}</h4>
                                        <span className="badge badge-green">CO2: {item.carbonFootprint}kg</span>
                                    </div>
                                    <div style={{ fontWeight: "bold", marginRight: "20px", fontSize: "1.1rem" }}>${item.price}</div>
                                    <button
                                        onClick={() => removeFromCart(index)}
                                        style={{ background: "#ef4444", color: "white", border: "none", padding: "6px 12px", borderRadius: "8px", cursor: "pointer" }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))
                        )}

                        {/* Green Suggestions */}
                        {recommendations.length > 0 && (
                            <div style={{ marginTop: "30px", padding: "20px", background: "rgba(255, 255, 255, 0.9)", borderRadius: "16px", border: "2px solid #34d399" }}>
                                <h3 style={{ color: "#059669", marginTop: 0 }}>🌱 Greener Alternatives Found!</h3>
                                <div style={{ display: "flex", gap: "15px", marginTop: "15px", overflowX: "auto" }}>
                                    {recommendations.map(rec => (
                                        <div key={rec.id} className="pro-card" style={{ minWidth: "160px", padding: "15px", textAlign: "center", cursor: "pointer", border: "1px solid #a7f3d0" }} onClick={() => navigate(`/product/${rec.id}`)}>
                                            <div style={{ fontWeight: "bold" }}>{rec.name}</div>
                                            <div style={{ color: "#059669", fontWeight: "800", fontSize: "0.9rem" }}>Only {rec.carbonFootprint}kg CO2</div>
                                            <button className="btn-primary" style={{ marginTop: "10px", width: "100%", padding: "6px", fontSize: "0.8rem" }}>View</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Summary */}
                    <div style={{ flex: 1, minWidth: "300px" }}>
                        <div className="pro-card" style={{ padding: "30px", position: "sticky", top: "100px" }}>
                            <h3 style={{ marginTop: 0, borderBottom: "1px solid #f3f4f6", paddingBottom: "15px" }}>Order Summary</h3>
                            <div style={{ display: "flex", justifyContent: "space-between", margin: "15px 0", fontSize: "1.1rem" }}>
                                <span>Total Price:</span>
                                <strong>${totalPrice.toFixed(2)}</strong>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", margin: "15px 0", color: "#059669", fontSize: "1.1rem" }}>
                                <span>Total Impact:</span>
                                <strong>{totalCarbon.toFixed(1)} kg CO2</strong>
                            </div>
                            <button className="btn-primary" style={{ width: "100%", padding: "15px", marginTop: "20px" }} onClick={handleCheckout}>
                                Checkout Now 💳
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;