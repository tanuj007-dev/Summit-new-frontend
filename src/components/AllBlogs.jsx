import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../axiosConfig";

const AllBlogs = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://blogs.summithomeappliance.com/wp-json/wp/v2/posts?_embed&per_page=100&page=1`
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
    <div className="min-h-screen bg-[#fcfcfc] font-sans">
      {/* Premium Page Header */}


      <div className="max-w-[1665px] mx-auto px-4 md:px-[60px] pb-24">

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-10 w-48 bg-gray-200 rounded-lg mb-4"></div>
              <p className="text-gray-400">Loading premium insights...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-[30px] gap-y-10">
            {posts.map((post) => {
              const imageUrl = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
              const date = new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });
              const authorName = authors[post.author] || "Unknown";

              return (
                <div
                  key={post.id}
                  className="group flex flex-col rounded-[20px] bg-white overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
                  onClick={() => bloglistener(post.slug)}
                >
                  {imageUrl && (
                    <div className="relative overflow-hidden rounded-[30px] mx-1 mt-1">
                      <img
                        src={imageUrl}
                        alt={post.title.rendered}
                        className="w-full h-[353px] object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="text-xs font-semibold tracking-wider text-gray-500 flex items-center gap-2">
                      <span>{date}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>

                    </div>

                    <h3
                      className="text-[18px] font-bold mt-3 text-gray-900 leading-snug group-hover:text-[#B91508] transition-colors duration-300 line-clamp-2 min-h-[54px]"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />

                    <p className="text-[14px] text-gray-600 my-4 line-clamp-3 leading-relaxed">
                      {getFirst15Words(post.content.rendered)}
                    </p>

                    <div className="mt-auto flex items-center text-[14px] font-bold text-gray-900 group-hover:text-[#B91508] transition-all duration-300">
                      <span className="relative">
                        Read Article
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#B91508] transition-all duration-300 group-hover:w-full"></span>
                      </span>
                      <svg className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBlogs;
