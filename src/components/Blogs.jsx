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
    
    <div className="allblog max-w-[1665px] mx-auto p-6 px-4 sm:px-16 font-sans">
      
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
                spaceBetween: 20,
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
                slidesPerView: 5,
                spaceBetween: 32,
              },
            }}
            className="blog-swiper"
          >
            {posts.map((post) => {
              const imageUrl = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
              const date = new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });
              const authorName = authors[post.author] || "Unknown";

              return (
                <SwiperSlide key={post.id}>
                  <div
                    className="blog-card flex flex-col bg-[#F2F2F3] rounded-2xl overflow-hidden cursor-pointer transition-transform duration-300 hover:translate-y-[-5px] h-[550px] min-h-[550px] max-h-[550px]"
                    onClick={() => bloglistener(post.slug)}
                  >
                    {imageUrl && (
                      <img 
                        src={imageUrl} 
                        alt={post.title.rendered} 
                        className="w-full h-48 object-cover flex-shrink-0"
                      />
                    )}
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="meta text-xs text-gray-600 flex-shrink-0">
                        {date} &nbsp;&nbsp; {authorName}
                      </div>
                      <div 
                        className="blog-title text-sm text-left font-semibold mt-2 text-gray-900 flex-grow overflow-hidden line-clamp-3" 
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }} 
                      />
                      <div className="excerpt leading-snug text-left text-[11px] sm:text-[13px] text-gray-600 flex-grow overflow-hidden line-clamp-4">
                        {getFirst15Words(post.content.rendered)}
                      </div>
                      <div className="readmore text-[11px] sm:text-sm font-medium flex items-center gap-1 text-gray-900 flex-shrink-0 mt-2">
                        Read more <HiArrowLongRight size={20} className="mt-1" />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Custom Progress Bar */}
          <div className="blog-progress-bar mt-6 px-8">
            <div className="relative">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="swiper-pagination-progressbar h-full bg-gray-400 transition-all duration-300 ease-out rounded-full" />
              </div>
            </div>
          </div>
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
