import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const Blog = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Comment form state
  const [comment, setComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`https://blogs.summithomeappliance.com/wp-json/wp/v2/posts?slug=${slug}&_embed`);
        const data = await res.json();
        if (!res.ok || data.length === 0) throw new Error("Post not found");

        const sanitizedContent = data[0].content.rendered.replaceAll(
          "https://blogs.summithomeappliance.com/",
          "https://summithomeappliance.com/"
        );

        setPost({
          ...data[0],
          content: {
            ...data[0].content,
            rendered: sanitizedContent,
          },
        });

        const all = await fetch(`https://blogs.summithomeappliance.com/wp-json/wp/v2/posts?_embed`);
        const allData = await all.json();
        setAllPosts(allData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const getFeaturedImage = (post) =>
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";

  const getAuthor = (post) =>
    post._embedded?.author?.[0]?.name || "Unknown";

  const getCategory = (post) =>
    post._embedded?.["wp:term"]?.[0]?.[0]?.name || "Uncategorized";

  const handleCommentSubmit = async () => {
    if (!authorName || !authorEmail || !comment) return alert("Please fill all fields");

    try {
      const res = await fetch("https://blogs.summithomeappliance.com/wp-json/wp/v2/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post: post.id,
          author_name: authorName,
          author_email: authorEmail,
          content: comment,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        setCommentSubmitted(true);
        setComment("");
        setAuthorEmail("");
        setAuthorName("");
      } else {
        alert("Comment failed: " + result.message);
      }
    } catch (error) {
      alert("Failed to submit comment");
    }
  };

  return (
    <div className="blog-wrapper">
      <style>{`
        body {
          background-color: #f8f9fa;
        }

        .blog-wrapper {
          display: flex;
          gap: 30px;
          padding: 40px 20px;
          max-width: 1300px;
          margin: auto;
          background-color: #f8f9fa;
          overflow-x: hidden;
        }

        .left-sidebar {
          width: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          left: 20px;
          z-index: 1000;
        }

        .left-sidebar a {
          color: #444;
          font-size: 24px;
          text-decoration: none;
          transition: transform 0.2s ease;
        }

        .left-sidebar a:hover {
          transform: scale(1.2);
        }

        .blog-container {
          flex: 1;
          max-width: 750px;
          margin-left: 80px;
          overflow-wrap: break-word;
        }

        .blog-container * {
          max-width: 100% !important;
          box-sizing: border-box;
        }

        .blog-container h1 {
          font-size: 36px;
          color: #222;
          margin-bottom: 10px;
        }

        .blog-meta {
          font-size: 14px;
          color: #666;
          margin-bottom: 25px;
        }

        .blog-meta span {
          margin-right: 20px;
        }

        .blog-container img.featured {
          max-width: 100%;
          height: auto;
          margin: 20px 0;
          border-radius: 8px;
        }

        .blog-container p {
          font-size: 18px;
          line-height: 1.8;
          color: #444;
          margin-bottom: 20px;
        }

        .right-sidebar {
          width: 320px;
          position: sticky;
          top: 100px;
        }

        .right-sidebar h3 {
          font-size: 20px;
          margin-bottom: 15px;
          color: #111;
        }

        .enhanced-blog-card {
          display: block;
          margin-bottom: 30px;
          text-decoration: none;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: transform 0.2s ease;
        }

        .enhanced-blog-card:hover {
          transform: translateY(-3px);
        }

        .enhanced-blog-card img {
          width: 100%;
          height: 180px;
          object-fit: cover;
          display: block;
        }

        .enhanced-blog-card .info {
          padding: 12px 14px;
        }

        .enhanced-blog-card .info h4 {
          font-size: 16px;
          color: #111;
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .enhanced-blog-card .meta {
          font-size: 13px;
          color: #666;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .sidebar-links {
  margin-top: 40px;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.sidebar-links h3 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #111;
}

.sidebar-links ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.sidebar-links ul li {
  margin-bottom: 10px;
}

.sidebar-links ul li a {
  color: #007bff;
  text-decoration: none;
  font-size: 15px;
  transition: color 0.2s ease;
}

.sidebar-links ul li a:hover {
  color: #0056b3;
  text-decoration: underline;
}


        .comments-section {
          margin-top: 50px;
        }

        .comments-section h3 {
          font-size: 22px;
          margin-bottom: 20px;
        }

        .comments-section input,
        .comments-section textarea {
          width: 100%;
          padding: 12px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 6px;
          margin-bottom: 10px;
        }

        .comments-section button {
          padding: 10px 20px;
          font-size: 16px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .book-appointment-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #0f995f;
  color: white;
  padding: 14px 20px;
  font-size: 16px;
  border-radius: 30px;
  text-align: center;
  text-decoration: none;
  z-index: 999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: none;
  transition: background-color 0.3s ease;
}

.book-appointment-button:hover {
  background-color: #0c7e4d;
}

@media (max-width: 767px) {
  .book-appointment-button {
    display: block;
  }
}


        @media (max-width: 1024px) {
          .blog-wrapper {
            flex-direction: column;
          }

          .left-sidebar {
            position: static;
            flex-direction: row;
            justify-content: center;
            margin-bottom: 20px;
            transform: none;
          }

          .blog-container {
            margin-left: 0;
            max-width: 100%;
          }

          .right-sidebar {
            position: static;
            width: 100%;
          }
        }

         @media (max-width: 767px) {
         .left-sidebar{
         display: none;
         }
         }
      `}</style>

      {/* Floating Share Icons */}
      <div className="left-sidebar">
        Share
        <a href={`https://www.facebook.com/sharer/sharer.php?u=https://summithomeappliance.com/blog/${slug}`} target="_blank" rel="noopener noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="36" height="36" viewBox="0 0 48 48">
<path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path><path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"></path>
</svg>
        </a>
        <a href={`https://twitter.com/intent/tweet?url=https://summithomeappliance.com/blog/${slug}`} target="_blank" rel="noopener noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="36" height="36" viewBox="0 0 48 48">
<path d="M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z"></path>
</svg></a>
        <a href={`https://www.pinterest.com/pin/create/button/?url=https://summithomeappliance.com/blog/${slug}`} target="_blank" rel="noopener noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="36" height="36" viewBox="0 0 48 48">
<circle cx="24" cy="24" r="20" fill="#E60023"></circle><path fill="#FFF" d="M24.4439087,11.4161377c-8.6323242,0-13.2153931,5.7946167-13.2153931,12.1030884	c0,2.9338379,1.5615234,6.5853882,4.0599976,7.7484131c0.378418,0.1762085,0.581543,0.1000366,0.668457-0.2669067	c0.0668945-0.2784424,0.4038086-1.6369019,0.5553589-2.2684326c0.0484619-0.2015381,0.0246582-0.3746338-0.1384277-0.5731201	c-0.8269653-1.0030518-1.4884644-2.8461304-1.4884644-4.5645752c0-4.4115601,3.3399658-8.6799927,9.0299683-8.6799927	c4.9130859,0,8.3530884,3.3484497,8.3530884,8.1369019c0,5.4099731-2.7322998,9.1584473-6.2869263,9.1584473	c-1.9630737,0-3.4330444-1.6238403-2.9615479-3.6153564c0.5654297-2.3769531,1.6569214-4.9415283,1.6569214-6.6584473	c0-1.5354004-0.8230591-2.8169556-2.5299683-2.8169556c-2.006958,0-3.6184692,2.0753784-3.6184692,4.8569336	c0,1.7700195,0.5984497,2.9684448,0.5984497,2.9684448s-1.9822998,8.3815308-2.3453979,9.9415283	c-0.4019775,1.72229-0.2453003,4.1416016-0.0713501,5.7233887l0,0c0.4511108,0.1768799,0.9024048,0.3537598,1.3687744,0.4981079l0,0	c0.8168945-1.3278198,2.0349731-3.5056763,2.4864502-5.2422485c0.2438354-0.9361572,1.2468872-4.7546387,1.2468872-4.7546387	c0.6515503,1.2438965,2.5561523,2.296936,4.5831299,2.296936c6.0314941,0,10.378418-5.546936,10.378418-12.4400024	C36.7738647,16.3591919,31.3823242,11.4161377,24.4439087,11.4161377z"></path>
</svg></a>
      </div>

      {/* Blog Content */}
      <div className="blog-container">
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {post && (
          <>
            <h1>{post.title.rendered}</h1>
            <div className="blog-meta">
              <span>👤 {getAuthor(post)}</span>
              <span>📅 {new Date(post.date).toLocaleDateString()}</span>
              <span>🏷️ {getCategory(post)}</span>
            </div>
            {getFeaturedImage(post) && (
              <img
                src={getFeaturedImage(post)}
                alt="Featured"
                className="featured"
              />
            )}
            <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />

            {/* Comments */}
            <div className="comments-section">
              <h3>Leave a Comment</h3>
              {commentSubmitted && <p>✅ Comment submitted for review!</p>}
              <input
                type="text"
                placeholder="Your Name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Your Email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
              />
              <textarea
                placeholder="Write your comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button onClick={handleCommentSubmit} style={{ backgroundColor: 'rgb(221 43 28)' }}>
                Submit Comment
              </button>
            </div>
          </>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="right-sidebar">
        <h3>Other Blogs</h3>
        {allPosts
          .filter((p) => p.slug !== slug)
          .slice(0, 10)
          .map((item) => (
            <Link to={`/blog/${item.slug}`} key={item.id} className="enhanced-blog-card">
              <img src={getFeaturedImage(item)} alt={item.title.rendered} />
              <div className="info">
                <h4>{item.title.rendered.length > 60 ? item.title.rendered.slice(0, 60) + "..." : item.title.rendered}</h4>
                <div className="meta">
                  <span>📅 {new Date(item.date).toLocaleDateString()}</span>
                  <span>🏷️ {getCategory(item)}</span>
                </div>
              </div>
            </Link>
          ))}
          {/* Quick Service Links */}
          {/* <div className="sidebar-links">
            <h3>Explore Services</h3>
            <ul>
              <li><Link to="/ear-clinic-delhi/" >Ear</Link></li>
              <li><Link to="/nose-surgery-cost-delhi" >Nose</Link></li>
              <li><Link to="/throat-doctor-delhi/" >Throat</Link></li>
              <li><Link to="/endoscopy/" >Endoscopy</Link></li>
              <li><Link to="/hair-restoration/" >Aesthetics</Link></li>
              <li><Link to="/ent-surgery/" >ENT Surgery</Link></li>
            </ul>
          </div> */}

      </div>
      {/* Floating Book Appointment Button (Mobile Only) */}
      {/* <Link to="/book-an-appointment" className="book-appointment-button">
  Book Appointment
</Link> */}


    </div>
  );
};

export default Blog;
