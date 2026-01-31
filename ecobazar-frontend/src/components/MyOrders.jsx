import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Professional.css";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:8084/orders/my-orders", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            // Sort by newest first
            setOrders(res.data.reverse());
        } catch (err) {
            console.error("Failed to fetch orders");
        }
    };

    return (
        <div className="pro-body">
            <div className="navbar">
                <div className="brand-logo" onClick={() => navigate("/shop")}>EcoBazar 🛒</div>
                <button className="btn-logout" onClick={() => navigate("/shop")}>← Back to Shop</button>
            </div>

            <div className="pro-container" style={{ maxWidth: "800px" }}>
                <h2 style={{ marginBottom: "20px", color: "#1f2937" }}>My Order History 📜</h2>

                {orders.length === 0 ? (
                    <div className="pro-card" style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
                        <h3>No orders yet.</h3>
                        <p>Make a sustainable choice today!</p>
                        <button className="btn-primary" onClick={() => navigate("/shop")} style={{ marginTop: "10px" }}>Go to Shop</button>
                    </div>
                ) : (
                    orders.map(order => (
                        <div key={order.id} className="pro-card" style={{ padding: "20px", marginBottom: "20px" }}>

                            {/* Header: ID, Date, Status */}
                            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "10px" }}>
                                <div>
                                    <strong style={{ fontSize: "1.1rem" }}>Order #{order.id}</strong>
                                    <span style={{ marginLeft: "10px", color: "#6b7280", fontSize: "0.9rem" }}>
                                        {new Date(order.orderDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <span className="badge badge-green">{order.status}</span>
                            </div>

                            {/* Items List */}
                            <div style={{ marginBottom: "15px" }}>
                                {order.items.map((item, idx) => (
                                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem", margin: "5px 0" }}>
                                        <span>{item.quantity}x {item.productName}</span>
                                        <span>${item.price}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Footer: Totals */}
                            <div style={{ background: "#f9fafb", padding: "10px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <span style={{ display: "block", fontSize: "0.8rem", color: "#6b7280" }}>Carbon Footprint</span>
                                    <strong style={{ color: "#059669" }}>{order.totalCarbon ? order.totalCarbon.toFixed(1) : "0.0"} kg CO2</strong>
                                </div>
                                <div>
                                    <span style={{ display: "block", fontSize: "0.8rem", color: "#6b7280" }}>Total Price</span>
                                    <strong style={{ fontSize: "1.2rem" }}>${order.totalPrice}</strong>
                                </div>
                            </div>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyOrders;