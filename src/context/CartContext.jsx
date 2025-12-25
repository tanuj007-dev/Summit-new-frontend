import axios from "../axiosConfig";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch cart data
    const handleCart = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("auth_token");
            
            if (!token) {
                console.log("No auth token found - cart not fetched");
                setLoading(false);
                return;
            }

            // Bearer token will be added automatically by axios interceptor
            const response = await axios.get("/api/cart", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                withCredentials: true
            });
            
            console.log("Cart API response:", response.data);
            
            // Extract cart from nested response structure
            let cartData = { cart: {} };
            
            if (response.data?.data?.cart) {
                // API returns { success: true, data: { cart: {...}, items: [...], total: ... } }
                // Merge items and total into cart object
                const cartObj = {
                    ...response.data.data.cart,
                    items: response.data.data.items || [],
                    total: response.data.data.total || 0,
                    item_count: response.data.data.item_count || 0
                };
                cartData = { cart: cartObj };
            } else if (response.data?.cart) {
                // If response is { cart: {...} }
                cartData = { cart: response.data.cart };
            } else if (response.data?.items) {
                // If response is directly the cart data
                cartData = { cart: response.data };
            }
            
            console.log("Setting cart state to:", cartData);
            setCart(cartData);
        } catch (error) {
            console.error("Error in fetching Cart Details:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleCart();
    }, []);

    // Add product to cart
    const handleAddToCart = async (product) => {
        // Check if user is logged in
        const token = localStorage.getItem("auth_token");
        if (!token) {
            toast.error("Please login to add products to cart");
            navigate("/login");
            return;
        }

        // Extract product_id from multiple possible fields
        const product_id = product?.product_id || 
                          product?.id || 
                          product?.productId ||
                          product?.sku ||
                          product?.variant_id;
        
        // Extract price from multiple possible fields
        const price = product?.price || 
                     product?.selling_price || 
                     product?.salePrice ||
                     product?.cost ||
                     product?.mrp;
        
        const quantity = 1;

        console.log("Adding to cart:", { product_id, price, product });

        if (!product_id) {
            console.error("Cart Error - Missing product_id:", { product });
            toast.error("Product ID not found");
            return;
        }

        if (!price) {
            console.error("Cart Error - Missing price:", { product });
            toast.error("Product price not available");
            return;
        }

        try {
            // Bearer token will be added automatically by axios interceptor
            const response = await axios.post(
                "/api/cart/add",
                {
                    product_id: String(product_id),
                    quantity,
                    price: parseFloat(price),
                },
                { 
                    withCredentials: true,
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("Add to cart response:", response.data);
            
            // Extract cart data from response structure
            let cartData = { cart: {} };
            if (response.data?.data?.cart) {
                // Merge items and total into cart object
                const cartObj = {
                    ...response.data.data.cart,
                    items: response.data.data.items || [],
                    total: response.data.data.total || 0,
                    item_count: response.data.data.item_count || 0
                };
                cartData = { cart: cartObj };
            } else if (response.data?.cart) {
                cartData = { cart: response.data.cart };
            } else if (response.data?.items) {
                cartData = { cart: response.data };
            }
            
            console.log("Setting cart to:", cartData);
            setCart(cartData);
            toast.success("Product Added to Cart");
            
            // Refresh cart to get latest data from server
            setTimeout(() => handleCart(), 500);
        } catch (error) {
            console.error("Add to cart error:", error.response?.data || error);
            toast.error(error.response?.data?.message || "Failed to add product");
        }
    };


    // Update cart item quantity
    const handleUpdateCart = async (itemId, quantity) => {
        try {
            const token = localStorage.getItem("auth_token");
            
            if (!token) {
                toast.error("Please login to update cart");
                return;
            }

            if (!itemId || !quantity || quantity < 1) {
                toast.error("Invalid quantity");
                return;
            }

            // Bearer token will be added automatically by axios interceptor
            const response = await axios.post(
                `/api/cart/update/${itemId}`,
                {
                    quantity: parseInt(quantity)
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    withCredentials: true
                }
            );

            console.log("Update cart response:", response.data);
            
            // Extract cart data from response structure
            let cartData = { cart: {} };
            if (response.data?.data?.cart) {
                // Merge items and total into cart object
                const cartObj = {
                    ...response.data.data.cart,
                    items: response.data.data.items || [],
                    total: response.data.data.total || 0,
                    item_count: response.data.data.item_count || 0
                };
                cartData = { cart: cartObj };
            } else if (response.data?.cart) {
                cartData = { cart: response.data.cart };
            } else if (response.data?.items) {
                cartData = { cart: response.data };
            }
            
            setCart(cartData);
            toast.success("Product Quantity Updated");
        } catch (error) {
            console.error("Error While Updating Cart:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Failed to update cart");
        }
    };

    // Buy now function
    const handleBuyNow = async (product) => {
        // Extract product_id from multiple possible fields
        const product_id = product?.product_id || 
                          product?.id || 
                          product?.productId ||
                          product?.sku ||
                          product?.variant_id;
        
        // Extract price from multiple possible fields
        const price = product?.price || 
                     product?.selling_price || 
                     product?.salePrice ||
                     product?.cost ||
                     product?.mrp;
        
        const quantity = 1;

        console.log("Buy now:", { product_id, price, product });

        if (!product_id || !price) {
            toast.error("Product information is incomplete");
            console.error("Missing required fields:", { product_id, price, product });
            return;
        }

        const cartData = {
            product_id: String(product_id),
            quantity,
            price: parseFloat(price),
        };

        try {
            // Bearer token will be added automatically by axios interceptor
            const response = await axios.post(`/api/cart/add`, cartData, {
                withCredentials: true
            });
            
            console.log("Buy now response:", response.data);
            
            // Extract cart data from response structure
            let updatedCart = { cart: {} };
            if (response.data?.data?.cart) {
                // Merge items and total into cart object
                const cartObj = {
                    ...response.data.data.cart,
                    items: response.data.data.items || [],
                    total: response.data.data.total || 0,
                    item_count: response.data.data.item_count || 0
                };
                updatedCart = { cart: cartObj };
            } else if (response.data?.cart) {
                updatedCart = { cart: response.data.cart };
            } else if (response.data?.items) {
                updatedCart = { cart: response.data };
            }
            
            setCart(updatedCart);
            toast.success("Product Added to cart");
            
            // Redirect to checkout
            navigate("/checkout");
        } catch (error) {
            console.log("Error While Adding Product to Cart:", error.response?.data || error);
            toast.error(error.response?.data?.message || "Failed to add product to cart");
        }
    };

    // Remove item from cart
    const handleRemoveFromCart = async (itemId) => {
        try {
            const token = localStorage.getItem("auth_token");
            
            if (!token) {
                toast.error("Please login to remove items");
                return;
            }

            // Bearer token will be added automatically by axios interceptor
            const response = await axios.get(
                `/api/cart/remove/${itemId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true
                }
            );
            
            console.log("Remove cart item response:", response.data);
            
            // Extract cart data from response structure
            let cartData = { cart: {} };
            if (response.data?.data?.cart) {
                // Merge items and total into cart object
                const cartObj = {
                    ...response.data.data.cart,
                    items: response.data.data.items || [],
                    total: response.data.data.total || 0,
                    item_count: response.data.data.item_count || 0
                };
                cartData = { cart: cartObj };
            } else if (response.data?.cart) {
                cartData = { cart: response.data.cart };
            } else if (response.data?.items) {
                cartData = { cart: response.data };
            }
            
            setCart(cartData);
            toast.success("Product Removed From Cart");
        } catch (error) {
            console.error("Error While Removing product from Cart:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Failed to remove product");
        }
    };

    // Clear entire cart
    const handleClearCart = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            
            if (!token) {
                toast.error("Please login to clear cart");
                return;
            }

            // Bearer token will be added automatically by axios interceptor
            const response = await axios.post(`/api/cart/clear`, {}, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            });
            
            console.log("Clear cart response:", response.data);
            
            // Extract cart data from response structure
            let cartData = { cart: {} };
            if (response.data?.data?.cart) {
                // Merge items and total into cart object
                const cartObj = {
                    ...response.data.data.cart,
                    items: response.data.data.items || [],
                    total: response.data.data.total || 0,
                    item_count: response.data.data.item_count || 0
                };
                cartData = { cart: cartObj };
            } else if (response.data?.cart) {
                cartData = { cart: response.data.cart };
            } else if (response.data?.items) {
                cartData = { cart: response.data };
            }
            
            setCart(cartData);
            toast.success("Removed All Items From Cart");
        } catch (error) {
            console.error("Error While Clearing Cart:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Failed to clear cart");
        }
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                handleCart,
                handleAddToCart,
                handleBuyNow,
                handleUpdateCart,
                handleRemoveFromCart,
                handleClearCart,
                totalItems: (cart?.cart?.items?.length > 0) ? cart.cart.items.length : 0,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}