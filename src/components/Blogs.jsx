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
        const response = await axios.get(
          `https://blogs.summithomeappliance.com/wp-json/wp/v2/posts?_embed&per_page=10&page=1`
        );
        setPosts(response.data);

        const authorIds = [...new Set(response.data.map((post) => post.author))];
        const authorRequests = authorIds.map((id) =>
          axios.get(`https://blogs.summithomeappliance.com/wp-json/wp/v2/users/${id}`)
        );
        const authorResponses = await Promise.all(authorRequests);
        const authorMap = {};
        authorResponses.forEach((res) => {
          authorMap[res.data.id] = res.data.name;
        });
        setAuthors(authorMap);
      } catch {
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

  const getFirst15Words = (htmlContent) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.split(" ").slice(0, 15).join(" ") + "...";
  };

  return (
    
    <div className="allblog max-w-[1665px] mx-auto p-6 px-3 sm:px-16 font-sans">
      
      {/* Heading */}
      <div className="blog-header flex justify-between items-center mb-6">
        <h3 className="text-2xl sm:text-4xl font-semibold">Blogs</h3>
        <h3 
          className="text-2xl sm:text-4xl font-semibold cursor-pointer hover:text-gray-600 transition-colors"
          onClick={() => navigate("/all-blogs")}
        >
          view all
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
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              el: '.blog-progress-bar',
              type: 'progressbar',
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
            {posts.map((post) => {
              const imageUrl = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
              const date = new Date(post.date).toLocaleDateString("en-US", {
                month: "numeric",
                day: "numeric", 
                year: "numeric"
              });
              const authorName = authors[post.author] || "Unknown";

              return (
                <SwiperSlide key={post.id}>
                  <div
                    className="blog-card bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] shadow-md h-[350px] sm:h-[450px] flex flex-col"
                    onClick={() => bloglistener(post.slug)}
                  >
                    {imageUrl && (
                      <img 
                        src={imageUrl} 
                        alt={post.title.rendered} 
                        className="w-full h-56 sm:h-72 object-cover"
                      />
                    )}
                    <div className="p-1.5 sm:p-6 flex flex-col flex-grow">
                      <h3 
                        className="  sm:text-lg font-bold text-gray-900   sm:mb-4 leading-tight line-clamp-3 overflow-hidden" 
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }} 
                      />
                     <div className="flex flex-col gap-2 text-xs sm:text-sm text-gray-600 mt-auto">
  <div className="flex items-center gap-2">
    <FaCalendar className="text-gray-400" size={14} />
    <span>{date}</span>
  </div>

  <div className="flex items-center gap-2">
    <FaTag className="text-gray-400" size={14} />
    <span>{authorName}</span>
  </div>
</div>

                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

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
