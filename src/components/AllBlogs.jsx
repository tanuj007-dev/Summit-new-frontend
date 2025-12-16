import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="allblog">
      <style>
        {`
        .allblog {
          max-width: 1665px;
          margin: 0 auto;
          padding: 40px 65px ;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen;
        }

        .blog-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .blog-header h1 {
          font-size: 36px;
          font-weight: bold;
          margin: 0;
        }

        .blog-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 40px 30px;
        }

        @media (min-width: 768px) {
          .blog-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .blog-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .blog-card {
          display: flex;
          flex-direction: column;
          border-radius: 20px;
          background: white;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.3s;
        //   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);

        
        }

        .blog-card:hover {
          transform: translateY(-5px);
        }

        .blog-card img {
          width: 100%;
          height: 353.2px;
            object-fit: cover;
            border-radius: 30px;
        }

        .meta {
          font-size: 14px;
          color: #666;
          margin-top: 10px;
        }

        .blog-title {
          font-size: 18px;
          font-weight: bold;
          margin-top: 10px;
          color: #111;
        }

        .excerpt {
          font-size: 14px;
          color: #666;
          margin: 10px 0;
        }

        .readmore {
          font-weight: 500;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 5px;
          color: #111;
        }
        `}
      </style>

      <div className="blog-header">
        <h1>All Blog Articles</h1>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : (
        <div className="blog-grid">
          {posts.map((post) => {
            const imageUrl = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
            const date = new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            const authorName = authors[post.author] || "Unknown";

            return (
              <div key={post.id} className="blog-card" onClick={() => bloglistener(post.slug)}>
                {imageUrl && <img src={imageUrl} alt={post.title.rendered} />}
                <div style={{ padding: "16px" }}>
                  <div className="meta">{date} &nbsp;&nbsp; {authorName}</div>
                  <div className="blog-title" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                  <div className="excerpt">{getFirst15Words(post.content.rendered)}</div>
                  <div className="readmore">Read more →</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllBlogs;
