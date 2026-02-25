// CartSync.js
import { useEffect } from "react";
import axios from "../axiosConfig";

const CartSync = ({ isLoggedIn, cartItems, setCartItems }) => {
  useEffect(() => {
    if (isLoggedIn) {
      const localCart = localStorage.getItem("cartItems");

      if (localCart) {
        const parsedCart = JSON.parse(localCart);

        Promise.all(
          parsedCart.map((item) =>
            axios.post(
              "/UpdateCart.php",
              {
                product_id: item.product_id,
                quantity: item.quantity,
                product_name: item.product_name,
                product_price: item.product_price,
                image: item.image,
              },
              { withCredentials: true }
            )
          )
        )
          .then(() => {
            localStorage.removeItem("cartItems");
            return axios.get(
              "/UpdateCart.php",
              { withCredentials: true }
            );
          })
          .then((res) => {
            setCartItems(res.data);
          })
          .catch((err) => {
            console.error("Cart sync error:", err);
          });
      }
    }
  }, [isLoggedIn]);

  return null;
};

export default CartSync;
