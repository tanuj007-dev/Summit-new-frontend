import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import { HiArrowLongRight } from "react-icons/hi2";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaCalendar, FaTag } from "react-icons/fa";

const Blogs = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/blogs");
        const blogData = response.data.data || response.data || [];
        setPosts(blogData.slice(0, 10)); // Take first 10 for slider
      } catch (err) {
        console.error("Error fetching blogs for slider:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const bloglistener = (slug) => {
    navigate(`/blog/${slug}`);
  };

  return (

    <div className="allblog max-w-[1670px] mb-8 mx-auto p-6 px-3 sm:px-16 font-sans">

      {/* Heading */}
      <div className="blog-header py-2 sm:py-6 flex justify-between items-center mb-6">
        <h3 className="text-2xl sm:text-4xl font-semibold">Blogs</h3>
        <h3
          className="text-sm font-semibold cursor-pointer hover:text-gray-600 transition-colors"
          onClick={() => navigate("/all-blogs")}
        >
          View all
        </h3>
      </div>
      {/* Blog posts from API */}
      {loading ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      ) : (
        <div className="relative">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            loop={posts.length > 4}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              el: '.blog-progress-bar',
              type: 'progressbar',
            }}
            navigation={{
              nextEl: ".blog-next",
              prevEl: ".blog-prev",
            }}
            breakpoints={{
              0: {
                slidesPerView: 2,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 28,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 32,
              },
            }}
            className="blog-swiper"
          >
            {Array.isArray(posts) && posts.map((post) => {
              const imageUrl = post.image_url || "/asset/images/Others.png";
              const date = post.created_at ? new Date(post.created_at).toLocaleDateString("en-US", {
                month: "numeric",
                day: "numeric",
                year: "numeric"
              }) : "Recent";

              return (
                <SwiperSlide key={post.id}>
                  <div
                    className="blog-card bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] shadow-md h-[350px] sm:h-[450px] flex flex-col"
                    onClick={() => bloglistener(post.slug)}
                  >
                    <img
                      src={imageUrl}
                      alt={post.title}
                      className="w-full h-56 sm:h-72 object-cover"
                    />
                    <div className="p-1.5 sm:p-6 flex flex-col flex-grow">
                      <h3
                        className="  sm:text-lg font-bold text-gray-900   sm:mb-4 leading-tight line-clamp-3 overflow-hidden"
                      >
                        {post.title}
                      </h3>
                      <div className="flex flex-col gap-2 mb-5 text-xs sm:text-sm text-gray-600 mt-auto">
                        <div className="flex items-center gap-2">
                          <FaCalendar className="text-gray-400" size={14} />
                          <span>{date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Navigation Buttons - Desktop Only */}
          <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-4 -right-4 justify-between pointer-events-none z-10">
            <button
              className="blog-prev bg-white hover:bg-gray-100 text-[#941007] p-3 rounded-full shadow-lg transition pointer-events-auto border border-gray-100"
              aria-label="Previous"
            >
              <FaChevronLeft className="text-xl" />
            </button>
            <button
              className="blog-next bg-white hover:bg-gray-100 text-[#941007] p-3 rounded-full shadow-lg transition pointer-events-auto border border-gray-100"
              aria-label="Next"
            >
              <FaChevronRight className="text-xl" />
            </button>
          </div>

          {/* Custom Progress Bar */}
          {/* <div className="blog-progress-bar mt-6 px-8">
            <div className="relative">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="swiper-pagination-progressbar h-full bg-gray-400 transition-all duration-300 ease-out rounded-full" />
              </div>
            </div>
          </div> */}
        </div>
      )}

      {/* More Articles Button */}
      {/* <div className="more-articles mt-10 text-center">
        <button 
          onClick={() => navigate("/all-blogs")}
          className="bg-gray-200 px-8 py-3 rounded-full text-base font-medium cursor-pointer transition-colors duration-300 hover:bg-gray-200"
        >
          View More Articles
        </button>
      </div> */}
    </div>
  );
};

export default Blogs;
