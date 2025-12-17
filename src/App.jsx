import "./App.css";
import Header from "./components/Header";
  import CategoryMegaMenu from   './components/header/CategoryMegaMenu.jsx'
import Footer from "./components/Footer";
import DesktopFooter from "./components/DesktopFooter";
import HeroSlider from "./components/HeroSlider";
import Trend from "./components/Trends";
// import GasStoveSection from "./components/GasStoveSection";
import SmartCookerFinder from "./components/SmartCookerFinder";
import KitchenCategories from "./components/KitchenCategories";
import Gallery from "./components/Gallery";
import CookerFinder from "./components/CookerFinder";
import Discription from "./components/Discription";
import ThoughtfulPicks from "./components/ThoughtfulPicks";
// import ByPrice from "./components/ByPrice";
import ReelsSection from "./components/ReelsSection";
import SummitSelect from "./components/SummitSelect";
import SummitSection from "./components/SummitSection";
import Available from "./components/Available";
import Feedback from "./components/Feedback";
import MobileFeedback from "./components/MobileFeedback";
import Connectivity from "./components/Connectivity";
import Blogs from "./components/Blogs";
import DetailProduct from "./components/DetailProduct";
import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductPage from "./components/ProductPage";
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
 

const queryClient = new QueryClient();

function App() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasSyncedLocalCart, setHasSyncedLocalCart] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  const { pathname } = useLocation();
  console.log('isLoggedIn', isLoggedIn)
  const navigate = useNavigate();
  
  // Check if current route is admin panel
  const isAdminRoute = pathname.startsWith('/admin');
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // use "auto" if you want instant scroll
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
    axios
      .get(
        "/wishlistupload.php?action=get"
      )
      .then((res) => {
        if (Array.isArray(res.data)) {
          const productIds = res.data.map((item) => parseInt(item.product_id));
          setWishlist(productIds);
        } else {
          console.error("Unexpected wishlist format", res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load wishlist:", err);
      });
  }, []);


  const handlewishlist = async (productId) => {
    productId = parseInt(productId);
    const formData = new FormData();
    formData.append("product_id", productId);

    try {

      if (wishlist.includes(productId)) {

        const res = await axios.post(
          "/wishlistupload.php?action=remove",
          formData,
          { withCredentials: true }
        );
        console.log("Removed:", res.data);
        setWishlist(wishlist.filter((id) => id !== productId));
      } else {
        const res = await axios.post(
          "/wishlistupload.php?action=add",
          formData,
          { withCredentials: true }
        );
        if (res.data?.error) {
          toast.error('Log in to keep track of your favorite products!');
          return;
        }
        console.log("Added:", res.data);
        setWishlist([...wishlist, productId]);
        toast.success('Saved! You can view this in your wishlist anytime.')
      }
    } catch (error) {
      console.error("Wishlist update failed", error);
    }
  };

  useEffect(() => {
    axios
      .get(
        "/products.php"
      )
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error loading products:", err));
  }, []);
  useEffect(() => {
  }, [products]);

  useEffect(() => {
    axios.get(
      "/CheckLogin.php",
      {
        withCredentials: true,
      }
    )
      .then((response) => {
        setIsLoggedIn(response.data.loggedIn);
      })
      .catch((error) => {
        console.error("Error checking login status:", error);
      });

  }, []);

  useEffect(() => {
    if (isLoggedIn && !hasSyncedLocalCart) {
      const localCart = localStorage.getItem("cartItems");
      if (localCart) {
        const cartItemsFromLocal = JSON.parse(localCart);

        // Transfer each item to DB
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
            setHasSyncedLocalCart(true); // Prevent future syncs
            // Load updated cart from DB
            return axios.get(
              "/UpdateCart.php",
              {
                withCredentials: true,
              }
            );
          })
          .then((res) => {
            setCartItems(res.data);
          })
          .catch((err) => {
            console.error("Error syncing cart:", err);
          });
      } else {
        // Load cart directly from DB
        axios
          .get(
            "/UpdateCart.php",
            {
              withCredentials: true,
            }
          )
          .then((res) => setCartItems(res.data))
          .catch((err) => {
            console.error("Error loading cart from DB:", err);
            setCartItems([]);
          });
      }
    } else if (!isLoggedIn) {
      // Reset sync state and load local cart
      setHasSyncedLocalCart(false);
      const storedCart = localStorage.getItem("cartItems");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
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
    product = products.find(p => p.id == product.id);
    const id = product.id;
    const name = product.name;
    const price = parseFloat(product.price);
    const stock_qty = product.stock_qty;
    const images = product.images?.filter((img) => img.is_primary === "1");
    if (isLoggedIn) {
      try {
        const addResponse = await axios.post(
          "/UpdateCart.php",
          {
            product_id: id,
            quantity,
            name,
            price,
          },
          { withCredentials: true }
        );

        if (addResponse.data.success) {

        }

        const response = await axios.get("/UpdateCart.php", {
          withCredentials: true,
        });

        setCartItems(response.data);
      } catch (error) {
        console.error("Error updating cart in DB:", error);
      }
    } else {
      const existingIndex = cartItems.findIndex(
        (item) => item.id === id
      );
      let updatedCart = [...cartItems];

      if (existingIndex >= 0) {
        updatedCart[existingIndex].quantity += quantity;
        updatedCart[existingIndex].total =
          updatedCart[existingIndex].quantity * price;
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
      const res = await axios.get(
        "/logout.php",
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout error:", error);
    }
    
    setIsLoggedIn(false);
    navigate("/login");
    window.location.reload(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <CartProvider>
            {!isAdminRoute && <Header
              addcart={cartItems}
              isLoggedIn={isLoggedIn}
              handlelogout={handlelogout}
            />}
            {!isAdminRoute && <CategoryMegaMenu />} 
            <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSlider />
              
                <Trend
                  buyNowHandle={buyNowHandle}
                  user={products}
                  userId={isLoggedIn}
                  addToCart={addToCart}
                  handlewishlist={handlewishlist}
                  wishlist={wishlist}
                />
                {/* <GasStoveSection/> */}
                <KitchenCategories/>
                <SmartCookerFinder/>
                {/* <Gallery /> */}
                {/* <CookerFinder /> */}
                <Discription />
                <ThoughtfulPicks/>
                <ReelsSection/>
                <SummitSelect/>
                {/* <ByPrice
                  user={products}
                  addToCart={addToCart}
                  buyNowHandle={buyNowHandle}
                /> */}
                {/* <ReelSection /> */}
                {/* <SummitSection /> */}
                <Available />
                <MobileFeedback />
                <Feedback />
                <Connectivity />
                <Blogs />
                {/* <ProductPage/> */}
                
              </>
            }
          />

          {/* ----new product page-----  */}
          <Route path="/product" element={<Product></Product>} />
          <Route path="/product-details/:slug" element={<ProductDetails />} />
          <Route path="/category/:slug" element={<Category/>} />

          <Route
            path="/879/DetailProduct/:id"
            element={
              <>
                <DetailProduct
                  setaddcart={setCartItems}
                  user={products}
                  buyNowHandle={buyNowHandle}
                  addToCart={addToCart}
                  isLoggedIn={isLoggedIn}
                />
                {/* <Blogs /> */}
              </>
            }
          />

          <Route
            path="/cart"
            element={
              <Cart
                setaddcart={setCartItems}
                isLoggedIn={isLoggedIn}
                addcart={cartItems}
              />
            }
          />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} handlelogout={handlelogout} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/kitchena-appliances/:cat" element={<SubCategory addToCart={addToCart} />} />
          {/* <Route path="/products/:main/" element={<ProductGrid/>} /> */}
          <Route path="/products/:main/:subcat?/:series?/:seriesOption?/:productSize?" element={<ProductGrid
            buyNowHandle={buyNowHandle}
            isLoggedIn={isLoggedIn}
            addToCart={addToCart}
            handlewishlist={handlewishlist}
            wishlist={wishlist}
          />} />
          <Route path="/contact" element={<Contactus />} />
          {/* <Route path="/checkout" element={<Checkout />} /> */}
          <Route path="/accountsPage" element={<AccountsPage />} />
          <Route path="/myorders" element={<Orders />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
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
                user={products}
                handlewishlist={handlewishlist}
                wishlist={wishlist}
                setWishlist={setWishlist}
                buyNowHandle={buyNowHandle}
                userId={isLoggedIn}
                addToCart={addToCart}
              />
            }
          />
          <Route path="/admin/login" element={<AdminAuthProvider><AdminLogin /></AdminAuthProvider>} />
          <Route path="/admin" element={<AdminAuthProvider><ProtectedAdminRoute><Dashboard /></ProtectedAdminRoute></AdminAuthProvider>} />
          <Route path="/admin/products" element={<AdminAuthProvider><ProtectedAdminRoute><ProductsPage /></ProtectedAdminRoute></AdminAuthProvider>} />
          <Route path="/admin/product-details" element={<AdminAuthProvider><ProtectedAdminRoute><ProductDetailsPage /></ProtectedAdminRoute></AdminAuthProvider>} />
          <Route path="/admin/categories" element={<AdminAuthProvider><ProtectedAdminRoute><CategoriesPage /></ProtectedAdminRoute></AdminAuthProvider>} />
          <Route path="/admin/subcategories" element={<AdminAuthProvider><ProtectedAdminRoute><SubcategoriesPage /></ProtectedAdminRoute></AdminAuthProvider>} />
          <Route path="/admin/series" element={<AdminAuthProvider><ProtectedAdminRoute><SeriesPage /></ProtectedAdminRoute></AdminAuthProvider>} />
          <Route path="/admin/materials" element={<AdminAuthProvider><ProtectedAdminRoute><MaterialsPage /></ProtectedAdminRoute></AdminAuthProvider>} />
          <Route path="/admin/warranties" element={<AdminAuthProvider><ProtectedAdminRoute><WarrantiesPage /></ProtectedAdminRoute></AdminAuthProvider>} />
          <Route path="/admin/certifications" element={<AdminAuthProvider><ProtectedAdminRoute><CertificationsPage /></ProtectedAdminRoute></AdminAuthProvider>} />
        </Routes>
        {!isAdminRoute && (
          <>
            <Footer />
            <DesktopFooter />
          </>
        )}
          </CartProvider>
        </TooltipProvider>
      </DataProvider>
    </QueryClientProvider>
  );
}

export default App;
