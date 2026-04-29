import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import DesktopFooter from "./components/DesktopFooter";
import Loading from "./components/Loading";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy-load heavy or route-level components; catch load failures to avoid blank screen
const lazyWithFallback = (importFn, fallbackName = "Section") =>
  React.lazy(() =>
    importFn().catch((err) => {
      console.error(`Lazy load failed for ${fallbackName}:`, err);
      return { default: () => <div className="p-4 text-center text-gray-500">Unable to load {fallbackName}</div> };
    })
  );
const CategoryMegaMenu = lazyWithFallback(() => import('./components/header/CategoryMegaMenu.jsx'), "Menu");
const HeroSlider = lazyWithFallback(() => import('./components/HeroSlider'), "Hero");
const Trend = lazyWithFallback(() => import('./components/Trends'), "Trends");
const SmartCookerFinder = lazyWithFallback(() => import('./components/SmartCookerFinder'), "Smart Cooker Finder");
const KitchenCategories = lazyWithFallback(() => import('./components/KitchenCategories'), "Categories");
const Gallery = lazyWithFallback(() => import('./components/Gallery'), "Gallery");
const CookerFinder = lazyWithFallback(() => import('./components/CookerFinder'), "CookerFinder");
const Discription = lazyWithFallback(() => import('./components/Discription'), "Description");
const ThoughtfulPicks = lazyWithFallback(() => import('./components/ThoughtfulPicks'), "Thoughtful Picks");
const ReelsSection = lazyWithFallback(() => import('./components/ReelsSection'), "Reels");
const SummitSection = lazyWithFallback(() => import('./components/SummitSection'), "Summit");
const Available = lazyWithFallback(() => import('./components/Available'), "Available");
const Feedback = lazyWithFallback(() => import('./components/Feedback'), "Feedback");
const MobileFeedback = lazyWithFallback(() => import('./components/MobileFeedback'), "Feedback");
const No1Banner = lazyWithFallback(() => import('./components/No1Banner'), "Banner");
const Connectivity = lazyWithFallback(() => import('./components/Connectivity'), "Connectivity");
const Blogs = lazyWithFallback(() => import('./components/Blogs'), "Blogs");
const DetailProduct = lazyWithFallback(() => import('./components/DetailProduct'), "DetailProduct");
import { Route, Routes } from "react-router-dom";

import axios from "./axiosConfig.js";
import Cart from "./components/Cart";
import Login from "./components/Login";
import Register from "./components/Register";
import About from "./components/About";
import { Contactus } from "./components/Contactus";
import { Checkout } from "./components/Checkout";
import AccountsPage from "./components/AccountsPage";
import Orders from "./components/Orders";
import { Wishlist } from "./components/Wishlist";
import { useNavigate } from "react-router-dom";
import FeedbackProduct from "./components/FeedbackProduct";
import SubCategory from "./components/SubCategory";
import Blog from "./components/blog";
import ShippingPolicy from "./components/ShippingPolicy";
import RefundPolicy from "./components/RefundPolicy";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsConditions from "./components/TermsConditions";
import GrievanceRedressal from "./components/GrievanceRedressal";
import ProductGrid from "./components/ProductGrid";
import { useLocation } from "react-router-dom";
import TrackOrderPage from "./components/TrackOrderPage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CheckoutPage from "./components/CheckoutPage";
import AllBlogs from "./components/AllBlogs";
import ThankYouPage from "./components/thankyou";
import Product from "./components/product/product";
import ProductDetails from "./components/productdetails/ProductDetails";
import { CartProvider } from "./context/CartContext";
import Category from "./components/category/Category";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/Admin/layout/ui/tooltip";
import { Toaster } from "./components/Admin/layout/ui/toaster";
import { DataProvider } from "./context/DataContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import NotFound from "./components/NotFound";
import Dashboard from "./components/Admin/pages/Dashboard";
import ProductsPage from "./components/Admin/pages/ProductsPage";
import ProductDetailsPage from "./components/Admin/pages/ProductDetailsPage";
import CategoriesPage from "./components/Admin/pages/CategoriesPage";
import SubcategoriesPage from "./components/Admin/pages/SubcategoriesPage";
import SeriesPage from "./components/Admin/pages/SeriesPage";
import MaterialsPage from "./components/Admin/pages/MaterialsPage";
import WarrantiesPage from "./components/Admin/pages/WarrantiesPage";
import CertificationsPage from "./components/Admin/pages/CertificationsPage";
import ProtectedAdminRoute from "./components/Admin/ProtectedAdminRoute";
import AdminLogin from "./components/Admin/AdminLogin";
import BlogsPage from "./components/Admin/pages/BlogsPage";

const queryClient = new QueryClient();

function App() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const setCartItemsSafe = (value) => setCartItems(Array.isArray(value) ? value : []);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasSyncedLocalCart, setHasSyncedLocalCart] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isAdminRoute = pathname.startsWith('/admin');
  const isCartRoute = pathname === '/cart' || pathname.startsWith('/cart/');

  const isNotFoundRoute = () => {
    const p = pathname ?? '';
    if (!p) return false;
    const validRoutes = [
      '/', '/about', '/contact', '/cart', '/login', '/register',
      '/accountsPage', '/myorders', '/wishlist', '/checkout', '/thankyou',
      '/trackShipment', '/shipping-policy', '/refund-policy', '/privacy-policy',
      '/terms-conditions', '/grievance-redressal', '/blogs', '/all-blogs', '/product', '/category',
      '/products', '/kitchena-appliances', '/admin', '/product-details', '/blog'
    ];

    const isValidRoute = validRoutes.some(route =>
      p === route || p.startsWith(route + '/') || p.startsWith(route + '?')
    );

    return !isValidRoute && !p.startsWith('/admin');
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  const buyNowHandle = async (product) => {
    await addToCart(
      {
        id: product.id,
        product_name: product.name,
        product_price: product.price,
      },
      1
    );
    if (isLoggedIn) {
      navigate('/checkout')
    } else {
      navigate("/login?redirectTo=" + encodeURIComponent('/checkout'));
    }
  }

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const productsResponse = await axios.get("products.php");
        const data = productsResponse?.data;
        setProducts(Array.isArray(data) ? data : []);

        try {
          const response = await axios.get("api/me", {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          });
          setIsLoggedIn(true);
          setUser(response.data?.user || response.data);
        } catch (error) {
          setIsLoggedIn(false);
          setUser(null);
        }

        const wishlistResponse = await axios.get("wishlistupload.php?action=get");
        if (Array.isArray(wishlistResponse.data)) {
          const productIds = wishlistResponse.data.map((item) => parseInt(item.product_id));
          setWishlist(productIds);
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handlewishlist = async (productId) => {
    productId = parseInt(productId);
    const formData = new FormData();
    formData.append("product_id", productId);

    try {
      if (wishlist.includes(productId)) {
        await axios.post("/wishlistupload.php?action=remove", formData, { withCredentials: true });
        setWishlist(wishlist.filter((id) => id !== productId));
      } else {
        const res = await axios.post("/wishlistupload.php?action=add", formData, { withCredentials: true });
        if (res.data?.error) {
          toast.error('Log in to keep track of your favorite products!');
          return;
        }
        setWishlist([...wishlist, productId]);
        toast.success('Saved! You can view this in your wishlist anytime.')
      }
    } catch (error) {
      console.error("Wishlist update failed", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn && !hasSyncedLocalCart) {
      const localCart = localStorage.getItem("cartItems");
      if (localCart) {
        let cartItemsFromLocal = [];
        try {
          const parsed = JSON.parse(localCart);
          cartItemsFromLocal = Array.isArray(parsed) ? parsed : [];
        } catch {
          cartItemsFromLocal = [];
        }

        if (cartItemsFromLocal.length === 0) {
          setHasSyncedLocalCart(true);
          axios.get("/UpdateCart.php", { withCredentials: true })
            .then((res) => setCartItemsSafe(res?.data))
            .catch(() => setCartItems([]));
        } else {
          Promise.all(
            cartItemsFromLocal.map((item) =>
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
              setHasSyncedLocalCart(true);
              return axios.get("/UpdateCart.php", { withCredentials: true });
            })
            .then((res) => {
              setCartItemsSafe(res?.data);
            })
            .catch((err) => {
              console.error("Error syncing cart:", err);
            });
        }
      } else {
        axios
          .get("/UpdateCart.php", { withCredentials: true })
          .then((res) => setCartItemsSafe(res?.data))
          .catch((err) => {
            console.error("Error loading cart from DB:", err);
            setCartItems([]);
          });
      }
    } else if (!isLoggedIn) {
      setHasSyncedLocalCart(false);
      const storedCart = localStorage.getItem("cartItems");
      if (storedCart) {
        try {
          const parsed = JSON.parse(storedCart);
          setCartItemsSafe(parsed);
        } catch {
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoggedIn]);

  const addToCart = async (product, quantity = 1) => {
    if (!product) return;
    const found = products.find(p => p.id == product.id);
    if (!found) return;
    product = found;
    const id = product.id;
    const name = product.name;
    const price = parseFloat(product.price);
    const stock_qty = product.stock_qty;
    const images = product.images?.filter((img) => img.is_primary === "1");

    if (isLoggedIn) {
      try {
        await axios.post(
          "/UpdateCart.php",
          {
            product_id: id,
            quantity,
            name,
            price,
          },
          { withCredentials: true }
        );
        const response = await axios.get("/UpdateCart.php", { withCredentials: true });
        setCartItemsSafe(response?.data);
      } catch (error) {
        console.error("Error updating cart in DB:", error);
      }
    } else {
      const existingIndex = cartItems.findIndex((item) => item.id === id);
      let updatedCart = [...cartItems];
      if (existingIndex >= 0) {
        updatedCart[existingIndex].quantity += quantity;
        updatedCart[existingIndex].total = updatedCart[existingIndex].quantity * price;
      } else {
        updatedCart.push({
          user_id: null,
          id,
          name,
          price,
          quantity,
          total: price * quantity,
          stock_qty,
          images,
        });
      }
      setCartItems(updatedCart);
    }
  };

  const handlelogout = async () => {
    localStorage.removeItem("userToken");
    try {
      await axios.get("/logout.php", { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
    setIsLoggedIn(false);
    navigate("/login");
    window.location.reload(true);
  };

  if (isLoading) {
    return <Loading fullScreen={true} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <WishlistProvider user={user}>
          <TooltipProvider>
            <CartProvider>
              <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
              <Toaster />
              <ErrorBoundary>
                {!isAdminRoute && !isNotFoundRoute() && !isCartRoute && (
                  <Header
                    addcart={cartItems}
                    isLoggedIn={isLoggedIn}
                    handlelogout={handlelogout}
                  />
                )}
                {!isAdminRoute && !isNotFoundRoute() && pathname === '/' && (
                  <React.Suspense fallback={null}>
                    <CategoryMegaMenu />
                  </React.Suspense>
                )}
                <React.Suspense fallback={<Loading />}>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <>
                          <React.Suspense fallback={null}>
                            <HeroSlider />
                          </React.Suspense>
                          <React.Suspense fallback={null}>
                            <Trend
                              buyNowHandle={buyNowHandle}
                              user={products}
                              userId={isLoggedIn}
                              addToCart={addToCart}
                              handlewishlist={handlewishlist}
                              wishlist={wishlist}
                            />
                          </React.Suspense>
                          <React.Suspense fallback={null}>
                            <KitchenCategories />
                          </React.Suspense>
                          <React.Suspense fallback={null}>
                            <SmartCookerFinder />
                          </React.Suspense>
                          <React.Suspense fallback={null}>
                            <Discription />
                          </React.Suspense>
                          <React.Suspense fallback={null}>
                            <ThoughtfulPicks />
                          </React.Suspense>
                          <React.Suspense fallback={null}>
                            <ReelsSection />
                          </React.Suspense>
                          <React.Suspense fallback={null}>
                            <Available />
                          </React.Suspense>
                          <React.Suspense fallback={null}>
                            <MobileFeedback />
                          </React.Suspense>
                          <React.Suspense fallback={null}>
                            <Feedback />
                          </React.Suspense>
                          <React.Suspense fallback={null}>
                            <No1Banner />
                          </React.Suspense>
                          <React.Suspense fallback={null}>
                            <Connectivity />
                          </React.Suspense>
                          <React.Suspense fallback={null}>
                            <Blogs />
                          </React.Suspense>
                        </>
                      }
                    />
                    <Route path="/product/:product_id" element={<ProductDetails user={user} />} />
                    <Route path="/product-details/:product_id" element={<ProductDetails user={user} />} />
                    <Route path="/category/:slug" element={<Category />} />
                    <Route
                      path="/879/DetailProduct/:id"
                      element={
                        <DetailProduct
                          setaddcart={setCartItems}
                          user={products}
                          buyNowHandle={buyNowHandle}
                          addToCart={addToCart}
                          isLoggedIn={isLoggedIn}
                        />
                      }
                    />
                    <Route
                      path="/cart"
                      element={
                        <Cart
                          setaddcart={setCartItems}
                          isLoggedIn={isLoggedIn}
                          addcart={cartItems}
                          handlelogout={handlelogout}
                        />
                      }
                    />
                    <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} handlelogout={handlelogout} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/kitchena-appliances/:cat" element={<SubCategory addToCart={addToCart} />} />
                    <Route path="/products/:main/:subcat?/:series?/:seriesOption?/:productSize?" element={<ProductGrid
                      isLoggedIn={isLoggedIn}
                      handlewishlist={handlewishlist}
                      wishlist={wishlist}
                    />} />
                    <Route path="/contact" element={<Contactus />} />
                    <Route path="/accountsPage" element={<AccountsPage />} />
                    <Route path="/myorders" element={<Orders />} />
                    <Route path="/shipping-policy" element={<ShippingPolicy />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-conditions" element={<TermsConditions />} />
                    <Route path="/grievance-redressal" element={<GrievanceRedressal />} />
                    <Route path="/blogs" element={<Blogs />} />
                    <Route path="/blog/:slug" element={<Blog />} />
                    <Route path="/trackShipment" element={<TrackOrderPage />} />
                    <Route path="/checkout" element={<CheckoutPage
                      setCartItems={setCartItems}
                      isLoggedIn={isLoggedIn}
                      cartItems={cartItems} />} />
                    <Route path="/all-blogs" element={<AllBlogs />} />
                    <Route path="/thankyou" element={<ThankYouPage />} />
                    <Route
                      path="/wishlist"
                      element={
                        <Wishlist
                          buyNowHandle={buyNowHandle}
                        />
                      }
                    />
                    <Route path="/admin/login" element={<AdminAuthProvider><AdminLogin /></AdminAuthProvider>} />
                    <Route path="/admin" element={<DataProvider><AdminAuthProvider><ProtectedAdminRoute><Dashboard /></ProtectedAdminRoute></AdminAuthProvider></DataProvider>} />
                    <Route path="/admin/products" element={<DataProvider><AdminAuthProvider><ProtectedAdminRoute><ProductsPage /></ProtectedAdminRoute></AdminAuthProvider></DataProvider>} />
                    <Route path="/admin/product-details" element={<DataProvider><AdminAuthProvider><ProtectedAdminRoute><ProductDetailsPage /></ProtectedAdminRoute></AdminAuthProvider></DataProvider>} />
                    <Route path="/admin/categories" element={<DataProvider><AdminAuthProvider><ProtectedAdminRoute><CategoriesPage /></ProtectedAdminRoute></AdminAuthProvider></DataProvider>} />
                    <Route path="/admin/subcategories" element={<DataProvider><AdminAuthProvider><ProtectedAdminRoute><SubcategoriesPage /></ProtectedAdminRoute></AdminAuthProvider></DataProvider>} />
                    <Route path="/admin/series" element={<DataProvider><AdminAuthProvider><ProtectedAdminRoute><SeriesPage /></ProtectedAdminRoute></AdminAuthProvider></DataProvider>} />
                    <Route path="/admin/materials" element={<DataProvider><AdminAuthProvider><ProtectedAdminRoute><MaterialsPage /></ProtectedAdminRoute></AdminAuthProvider></DataProvider>} />
                    <Route path="/admin/warranties" element={<DataProvider><AdminAuthProvider><ProtectedAdminRoute><WarrantiesPage /></ProtectedAdminRoute></AdminAuthProvider></DataProvider>} />
                    <Route path="/admin/certifications" element={<DataProvider><AdminAuthProvider><ProtectedAdminRoute><CertificationsPage /></ProtectedAdminRoute></AdminAuthProvider></DataProvider>} />
                    <Route path="/admin/blogs" element={<DataProvider><AdminAuthProvider><ProtectedAdminRoute><BlogsPage /></ProtectedAdminRoute></AdminAuthProvider></DataProvider>} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </React.Suspense>
                {!isAdminRoute && !isNotFoundRoute() && !isCartRoute && (
                  <>
                    <Footer />
                    <DesktopFooter />
                  </>
                )}
              </ErrorBoundary>
            </CartProvider>
          </TooltipProvider>
        </WishlistProvider>
      </DataProvider>
    </QueryClientProvider>
  );
}

export default App;
