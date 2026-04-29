import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from '../axiosConfig';

const WishlistContext = createContext();

export const WishlistProvider = ({ children, user }) => {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch wishlist from API on mount/user change
  useEffect(() => {
    if (user?.id) {
      fetchWishlist();
    } else {
      // Load from localStorage for guests
      const savedWishlist = localStorage.getItem('summit_wishlist');
      if (savedWishlist) {
        try {
          setWishlist(JSON.parse(savedWishlist));
        } catch (e) {
          setWishlist([]);
        }
      }
    }
  }, [user?.id]);

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/wishlist');
      
      let items = [];
      if (response.data?.data) {
        items = Array.isArray(response.data.data) ? response.data.data : [];
      } else if (response.data?.wishlist) {
        items = Array.isArray(response.data.wishlist) ? response.data.wishlist : [];
      } else if (Array.isArray(response.data)) {
        items = response.data;
      }
      
      setWishlist(items);
    } catch (error) {
      console.error("Failed to fetch wishlist from database", error?.response?.data || error);
      // Fallback to local storage if API fails
      const savedWishlist = localStorage.getItem('summit_wishlist');
      if (savedWishlist) {
        try {
          setWishlist(JSON.parse(savedWishlist));
        } catch (e) {
          setWishlist([]);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('summit_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const getProductId = (item) => {
    if (!item) return null;
    return item.id || item.product_id || item.sno || item.detail_id || item.sku;
  };

  const addToWishlist = async (product) => {
    if (!product) return;
    
    const productId = getProductId(product);
    if (!productId) {
      console.error("No valid ID found for product", product);
      return;
    }

    const isAlreadyIn = wishlist.some((item) => getProductId(item) === productId);
    
    if (user?.id) {
      try {
        if (isAlreadyIn) {
          await axios.post('/api/wishlist/remove', {
            user_id: user.id,
            product_id: productId
          });
          setWishlist((prev) => prev.filter((item) => getProductId(item) !== productId));
          toast.info(`${product.name || product.title || 'Product'} removed from wishlist.`);
        } else {
          await axios.post('/api/wishlist/add', {
            user_id: user.id,
            product_id: productId
          });
          setWishlist((prev) => [...prev, product]);
          toast.success(`${product.name || product.title || 'Product'} added to wishlist!`);
        }
      } catch (error) {
        console.error("Wishlist API error", error);
        toast.error("Failed to update wishlist on server");
      }
    } else {
      // Local fallback for guest
      if (isAlreadyIn) {
        setWishlist((prev) => prev.filter((item) => getProductId(item) !== productId));
        toast.info(`${product.name || product.title || 'Product'} removed from wishlist.`);
      } else {
        setWishlist((prev) => [...prev, product]);
        toast.success(`${product.name || product.title || 'Product'} added to wishlist!`);
      }
    }
  };

  const removeFromWishlist = async (id) => {
    if (user?.id) {
      try {
        await axios.post('/api/wishlist/remove', {
          user_id: user.id,
          product_id: id
        });
      } catch (error) {
        console.error("Wishlist remove error", error);
      }
    }
    setWishlist((prev) => prev.filter((item) => getProductId(item) !== id));
  };

  const isInWishlist = (id) => {
    if (!id) return false;
    return wishlist.some((item) => getProductId(item) === id);
  };

  const clearWishlist = async () => {
    if (user?.id) {
      try {
        await axios.post('/api/wishlist/clear', {
          user_id: user.id
        });
      } catch (error) {
        console.error("Wishlist clear error", error);
      }
    }
    setWishlist([]);
    localStorage.removeItem('summit_wishlist');
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
