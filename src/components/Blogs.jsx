// import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "../axiosConfig";
import { HiArrowLongRight } from "react-icons/hi2";
const Blogs = () => {
  const navigate = useNavigate();
  // const [posts, setPosts] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [authors, setAuthors] = useState({});

  const staticBlogs = [
    {
      id: 1,
      title: "When to use triply ply pressure cookers?",
      excerpt:
        "Expert advice best use cases for triply ply pressure cookers.",
      image: "/asset/images/blogimg.png",
      date: "February 22, 2025",
      author: "Samar Verma  ",
    },
    {
      id: 2,
      title: "When to use triply ply pressure cookers?",
      excerpt:
        "Expert advice best use cases for triply ply pressure cookers.",
      image: "/asset/images/blogimg.png",
      date: "February 22, 2025",
      author: "Samar Verma  ",
    },
    {
      id: 3,
      title: "When to use triply ply pressure cookers?",
      excerpt:
        "Expert advice best use cases for triply ply pressure cookers.",
      image: "/asset/images/blogimg.png",
      date: "February 22, 2025",
      author: "Samar Verma  ",
    },
    {
      id: 4,
      title: "When to use triply ply pressure cookers?",
      excerpt:
        "Expert advice best use cases for triply ply pressure cookers.",
      image: "/asset/images/blogimg.png",
      date: "February 22, 2025",
      author: "Samar Verma  ",
    },
    {
      id: 5,
      title: "When to use triply ply pressure cookers?",
      excerpt:
        "Expert advice best use cases for triply ply pressure cookers.",
      image: "/asset/images/blogimg.png",
      date: "February 22, 2025",
      author: "Samar Verma  ",
    },
    
  ];

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await axios.get(
  //         `https://blogs.summithomeappliance.com/wp-json/wp/v2/posts?_embed&per_page=4&page=1`
  //       );
  //       setPosts(response.data);

  //       // Get all unique author IDs
  //       const authorIds = [...new Set(response.data.map((post) => post.author))];

  //       // Fetch author names
  //       const authorRequests = authorIds.map((id) =>
  //         axios.get(`https://blogs.summithomeappliance.com/wp-json/wp/v2/users/${id}`)
  //       );
  //       const authorResponses = await Promise.all(authorRequests);
  //       const authorMap = {};
  //       authorResponses.forEach((res) => {
  //         authorMap[res.data.id] = res.data.name;
  //       });
  //       setAuthors(authorMap);
  //     } catch {
  //       setPosts([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchPosts();
  // }, []);

  const bloglistener = (slug) => {
    navigate(`/blog/${slug}`);
  };

  const getFirst15Words = (htmlContent) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.slice(0,70) + "...";
  };

  return (
    <div className="allblog">
      <style>
        {`
        .allblog {
          max-width: 1665px;
          margin: 0 auto;
          padding: 40px 65px ;
          font-family: -Helvetica Now Display, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen;
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
          grid-template-columns: repeat(1, 1fr); /* Mobile */
          gap: 40px 30px;
        }

        @media (min-width: 768px) {
          .blog-grid {
            grid-template-columns: repeat(, 1fr); /* Tablet */
          }
        }

        @media (min-width: 1024px) {
          .blog-grid {
            grid-template-columns: repeat(5, 1fr); /* Desktop */
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
          height: 250px;
          object-fit: cover;
          border-radius: 30px;
        }

        .meta {
          font-size: 14px;
          color: #666;
          margin-top: 10px;
        }

        .blog-title {
          font-size: 16px;
          font-weight: 600;
          margin-top: 5px;
          color: #111;
          
        }

        .excerpt {
          font-size: 14px;
          color: #636365;
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

        .more-articles {
          margin-top: 40px;
          text-align: center;
        }

        .more-articles button {
          background: #f5f5f5;
          padding: 12px 30px;
          border-radius: 30px;
          font-size: 16px;
          cursor: pointer;
          border: none;
          transition: background 0.3s;
        }

        .more-articles button:hover {
          background: #ddd;
        }
        `}
      </style>

      <div className="blog-header">
        <h3 className="text-4xl font-semibold">Blogs</h3>
      </div>

      {/* {loading ? (
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
                  <div className="meta">{date} &nbsp;&nbsp; {authorName.substring(0,20)}...</div>
                  <div className="blog-title" dangerouslySetInnerHTML={{ __html: (post.title.length>50)?(post.title.rendered).substring(0,50)+"...":(post.title.rendered) }} />
                  <div className="excerpt">{getFirst15Words(post.content.rendered)}</div>
                  <div className="readmore">Read more →</div>
                </div>
              </div>
            );
          })}
        </div>
      )} */}

{/* static blog pictures */}
        <div className="blog-grid  ">
        {staticBlogs.map((post) => (
          <div
            key={post.id}
            className="blog-card"
            onClick={() => bloglistener(post.id)}
          >
            <img src={post.image} alt={post.title} />
            <div style={{ padding: "16px" }}>
              <div className="meta">
                {post.date} &nbsp;&nbsp; {post.author}
              </div>
              <div className="blog-title">{post.title}</div>
              <div className="excerpt">{post.excerpt}</div>
              <div className="readmore">Read more <HiArrowLongRight size={30} className=" items-center justify-center mt-1 " /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="more-articles">
  <button onClick={() => navigate("/all-blogs")}>
    View More Articles
  </button>
</div>

    </div>
  );
};

export default Blogs;
