import axios from "../axiosConfig";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState({});
    const navigate = useNavigate();

    // Helper function to get user ID
    const getUserId = async () => {
  try {
    const response = await axios.get("/api/me");
    return response.data?.id || response.data?.user_id;
  } catch (error) {
    console.log("User not logged in");
    return null;
  }
};


    // Fetch cart data - Updated to match API format
    const handleCart = async () => {
        try {
            const userId = await getUserId();
            if (!userId) {
                console.log("No user ID found");
                return;
            }

            const response = await axios.get(`/api/cart?user_id=${userId}`, {
                withCredentials: true
            });
            setCart(response.data);
        } catch (error) {
            console.log("Error in fetching Cart Details:", error);
        }
    };

    useEffect(() => {
        handleCart();
    }, []);

    // Add product to cart
    const handleAddToCart = async (product) => {
  const user_id = await getUserId();

  const product_id = product.product_id || product.id;
  const price = product.price || product.selling_price;

  const product_variant_id =
    product.variantId ||
    product.variant_id ||
    product.product_variant_id ||
    (product.variants?.length > 0 ? product.variants[0].id : null);

  if (!user_id) {
    toast.error("Please login to add products to cart");
    return;
  }

  if (!product_id || !price || !product_variant_id) {
    console.error("Cart Error:", { product });
    toast.error("Product information is incomplete");
    return;
  }

  try {
    const response = await axios.post(
      "/api/cart/add",
      {
        user_id: parseInt(user_id),
        product_id,
        product_variant_id,
        price: parseFloat(price),
        quantity: 1,
      },
      { withCredentials: true }
    );

    setCart(response.data.cart || response.data);
    toast.success("Product Added to Cart");
  } catch (error) {
    console.error("Add to cart error:", error.response?.data || error);
    toast.error(error.response?.data?.message || "Failed to add product");
  }
};


    // Update cart item quantity - Fixed to match API format
    const handleUpdateCart = async (itemId, quantity) => {
        try {
            const userId = await getUserId();
            if (!userId) {
                toast.error("Please login to update cart");
                return;
            }

            const response = await axios.post(
                `/api/cart/update/${itemId}`,
                {
                    user_id: parseInt(userId),
                    quantity: parseInt(quantity)
                },
                { withCredentials: true }
            );

            if (response.data.message) {
                toast.error(response.data.message);
            } else {
                setCart(response.data);
                toast.success("Product Quantity Updated");
            }
        } catch (error) {
            console.log("Error While Updating Cart:", error.response?.data || error);
            toast.error(error.response?.data?.message || "Failed to update cart");
        }
    };

    // Buy now function
    const handleBuyNow = async (product) => {
        const user_id = await getUserId();
        const product_id = product.product_id || product.id;
        const price = product.price || product.selling_price;
        const product_variant_id = product.variant_id || product.product_variant_id ||
            (product.variants?.length > 0 ? product.variants[0].id : null) ||
            product.id;

        if (!user_id) {
            toast.error("Please login to buy products");
            return;
        }

        if (!product_id || !price || !product_variant_id) {
            toast.error("Product information is incomplete");
            console.error("Missing required fields:", { user_id, product_id, price, product_variant_id, product });
            return;
        }

        const cartData = {
  user_id: parseInt(user_id),
  product_id: product_id,
  product_variant_id: product_variant_id, // ✅ MUST
  price: parseFloat(price),
  quantity: 1,
};


        try {
            const response = await axios.post(`/api/cart/add`, cartData, {
                withCredentials: true
            });
            setCart(response.data);
            toast.success("Product Added to cart");
            navigate("/checkout");
        } catch (error) {
            console.log("Error While Adding Product to Cart:", error.response?.data || error);
            toast.error(error.response?.data?.message || "Failed to add product to cart");
        }
    };

    // Remove item from cart - Fixed to match API format
    const handleRemoveFromCart = async (itemId) => {
        try {
            const userId = await getUserId();
            if (!userId) {
                toast.error("Please login to remove items");
                return;
            }

            const response = await axios.get(
                `/api/cart/remove/${itemId}?user_id=${userId}`,
                { withCredentials: true }
            );
            setCart(response.data);
            toast.error("Product Removed From Cart");
        } catch (error) {
            console.log("Error While Removing product from Cart:", error);
            toast.error("Failed to remove product");
        }
    };

    // Clear entire cart
    const handleClearCart = async () => {
        try {
            const response = await axios.get(`/api/cart/clear`, {
                withCredentials: true
            });
            setCart(response.data);

            if (response.data.status === "clear") {
                toast.error("Removed All Items From Cart");
            } else {
                toast.error("Empty Cart");
            }
        } catch (error) {
            console.log("Error While Clear Cart:", error);
            toast.error("Failed to clear cart");
        }
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
                totalItems: (cart?.cart?.items?.length > 0) ? cart.cart.items.length : 0,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}