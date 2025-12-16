import axios from "axios";
import { createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const CartContext = createContext();

export function CartProvider({ children }) {

    const [cart, setCart] = useState({});
    const baseURL = import.meta.env.VITE_APP_API_BASE_URL;
    const navigate = useNavigate();



    const handleCart = () => {
        axios.get(`${baseURL}cart`, { withCredentials: true })
            .then((res) => { setCart(res.data) })
            .catch((e) => console.log("Error in fetching Cart Details : ", e));
    }

    useEffect(() => {
        handleCart();
    }, [])


    const handleAddToCart = (item) => {
        let cart = axios.post(`${baseURL}cart/add`, { product_variant_id: item, quantity: 1 }, { withCredentials: true })
            .then((res) => { setCart(res.data) })
            .catch((res) => console.log("Error While Adding Product to Cart ", res.data));
        toast.success("Product Added to cart");
    };


    const handleUpdateCart = (itemId,quantity) => { 
        let cart = axios.post(`${baseURL}cart/update/${itemId}`, { quantity: quantity }, { withCredentials: true })
            .then((res) => { (res.data.message)?toast.error(res.data.message):setCart(res.data) })
            .catch((res) => console.log("Error While Adding Product to Cart ", res.data));
        toast.success("Product Quantity Updated");
    };


    const handleBuyNow = (item) => {
        let cart = axios.post(`${baseURL}cart/add`, { product_variant_id: item, quantity: 1 }, { withCredentials: true })
            .then((res) => { setCart(res.data) })
            .catch((res) => console.log("Error While Adding Product to Cart ", res.data));
        toast.success("Product Added to cart");
        navigate("/checkout");
    };


    const handleRemoveFromCart = (itemId) => {
        axios.get(`${baseURL}cart/remove/${itemId}`, { withCredentials: true })
            .then((res) => { setCart(res.data) })
            .catch((err) => console.log("Error While Remiving product To Cart ", err));
        toast.error("Product Removed From Cart");
    };


    const handleClearCart = (itemId) => {
        axios.get(`${baseURL}cart/clear`, { withCredentials: true })
            .then((res) => {
                setCart(res.data);
                (res.data.status = "clear") ? toast.error("Removed All Items From Cart") : toast.error("Empty Cart")
            })
            .catch((err) => console.log("Error While Clear Cart", err));
        toast.error("Empty Cart");
    };





    return (
        <CartContext.Provider
            value={{
                cart,
                handleCart,
                handleAddToCart,
                handleBuyNow,
                handleUpdateCart,
                handleRemoveFromCart,
                handleClearCart,
                totalItems: (cart?.cart?.items?.length > 0) ? cart?.cart?.items?.length : 0,
            }}
        >
            {children}
        </CartContext.Provider>
    );

};
