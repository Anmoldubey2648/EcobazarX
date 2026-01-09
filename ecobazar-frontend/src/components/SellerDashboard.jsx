import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css"; // Reuse our cool background

const SellerDashboard = () => {
    const navigate = useNavigate();

    // State for the product form
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "General",
        imageUrl: ""
    });

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();

        // 1. GET THE TICKET (Token) from the pocket
        const token = localStorage.getItem("token");

        // Safety check: If no token, kick them out
        if (!token) {
            alert("Please login first!");
            navigate("/");
            return;
        }

        try {
            // 2. SEND THE TICKET in the Header
            await axios.post("http://localhost:8084/products/add", product, {
                headers: {
                    "Authorization": `Bearer ${token}` // <--- THE KEY PART
                }
            });

            alert("Product Added Successfully!");
            // Clear form
            setProduct({ name: "", description: "", price: "", category: "General", imageUrl: "" });

        } catch (err) {
            console.error(err);
            alert("Failed to add product. Are you sure you are a Seller?");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="auth-container">
            <div className="auth-box" style={{ width: "400px" }}>
                <h2 style={{ color: "#00f2ff" }}>SELLER DASHBOARD</h2>
                <p>Upload New Inventory</p>

                <form onSubmit={handleAddProduct}>
                    <div className="input-group">
                        <input type="text" name="name" placeholder="Product Name" value={product.name} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <input type="text" name="description" placeholder="Description" value={product.description} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <input type="number" name="price" placeholder="Price ($)" value={product.price} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <input type="text" name="category" placeholder="Category" value={product.category} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <input type="text" name="imageUrl" placeholder="Image URL (Optional)" value={product.imageUrl} onChange={handleChange} />
                    </div>

                    <button type="submit" className="auth-btn">ADD PRODUCT</button>
                </form>

                <button onClick={handleLogout} style={{ marginTop: "20px", background: "red", color: "white", border: "none", padding: "10px", cursor: "pointer", width: "100%" }}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default SellerDashboard;