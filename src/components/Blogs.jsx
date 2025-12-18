import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import { HiArrowLongRight } from "react-icons/hi2";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
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
    
    <div className="allblog max-w-[1665px] mx-auto p-10 sm:px-16 font-sans">
      
      {/* Heading */}
      <div className="blog-header text-center mb-10">
        <h3 className="text-2xl sm:text-4xl font-semibold">Blogs</h3>
      </div>

      {/* Blog posts from API */}
      {loading ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      ) : (
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            navigation={{
              nextEl: '.swiper-button-next-blog',
              prevEl: '.swiper-button-prev-blog',
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
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
                    className="blog-card flex flex-col bg-[#F2F2F3] rounded-2xl overflow-hidden cursor-pointer transition-transform duration-300 hover:translate-y-[-5px] h-[500px] min-h-[500px] max-h-[500px]"
                    onClick={() => bloglistener(post.slug)}
                  >
                    {imageUrl && (
                      <img 
                        src={imageUrl} 
                        alt={post.title.rendered} 
                        className="w-full h-70 object-cover rounded-2xl flex-shrink-0"
                      />
                    )}
                    <div className="p-4 flex flex-col flex-grow min-h-0">
                      <div className="meta text-xs text-gray-600 mt-2 flex-shrink-0">
                        {date} &nbsp;&nbsp; {authorName}
                      </div>
                      <div 
                        className="blog-title text-sm text-justify font-semibold mt-2 mb-2 text-gray-900 flex-grow min-h-0 overflow-hidden" 
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }} 
                      />
                      <div className="excerpt text-justify text-[14px] text-gray-600 flex-shrink-0 overflow-hidden">
                        {getFirst15Words(post.content.rendered)}
                      </div>
                      <div className="readmore text-sm font-medium flex items-center gap-1 text-gray-900 flex-shrink-0 mt-auto">
                        Read more <HiArrowLongRight size={30} className=" items-center justify-center mt-1 " />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Navigation Buttons */}
          <button
            className="swiper-button-prev-blog absolute left-[-10px] sm:left-[-2px] z-10 top-1/2 -translate-y-8/4 bg-white text-black p-2 sm:p-3 rounded-full shadow-md hover:bg-gray-100 "
          >
            <FaChevronLeft />
          </button>
          <button
            className="swiper-button-next-blog absolute right-[-10px] sm:right-[-2px] z-10 top-1/2 -translate-y-8/4 bg-white text-black p-2 sm:p-3 rounded-full shadow-md hover:bg-gray-100 "
          >
            <FaChevronRight />
          </button>
        </div>
      )}

      {/* More Articles Button */}
      <div className="more-articles mt-10 text-center">
        <button 
          onClick={() => navigate("/all-blogs")}
          className="bg-gray-200 px-8 py-3 rounded-full text-base font-medium cursor-pointer transition-colors duration-300 hover:bg-gray-200"
        >
          View More Articles
        </button>
      </div>
    </div>
  );
};

export default Blogs;
