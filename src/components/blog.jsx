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
  const [toc, setToc] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://blogs.summithomeappliance.com/wp-json/wp/v2/posts?slug=${slug}&_embed`);
        const data = await res.json();
        if (!res.ok || data.length === 0) throw new Error("Post not found");

        const sanitizedContent = data[0].content.rendered.replaceAll(
          "https://blogs.summithomeappliance.com/",
          "https://summithomeappliance.com/"
        );

        // Generate Table of Contents and inject IDs into content
        const parser = new DOMParser();
        const doc = parser.parseFromString(sanitizedContent, "text/html");
        const headings = Array.from(doc.querySelectorAll("h2, h3"));

        const tocEntries = headings.map((heading, index) => {
          const id = `heading-${index}`;
          heading.id = id;
          return {
            id,
            text: heading.textContent,
            level: heading.tagName.toLowerCase()
          };
        });

        setToc(tocEntries);

        setPost({
          ...data[0],
          content: {
            ...data[0].content,
            rendered: doc.body.innerHTML,
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

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky headers
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Blog Hero Banner */}


      <div className="max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-16 py-10">
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 text-left">

          {/* Left Sidebar: Table of Contents */}
          <aside className="lg:w-[300px] shrink-0 hidden lg:block">
            <div className="sticky top-24 space-y-8">
              {toc.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <span className="w-1 h-5 bg-[#B91508] rounded-full"></span>
                    Table of Contents
                  </h3>
                  <nav className="space-y-1 max-h-[60vh] overflow-y-auto scrollbar-hide">
                    {toc.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToHeading(item.id)}
                        className={`block text-left w-full py-2 px-3 rounded-lg text-[13px] leading-snug transition-all duration-200 hover:bg-red-50 hover:text-[#B91508] ${item.level === "h3"
                          ? "pl-6 text-gray-400 font-normal"
                          : "font-semibold text-gray-700"
                          }`}
                      >
                        {item.text}
                      </button>
                    ))}
                  </nav>
                </div>
              )}

              {/* Share & Meta */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Share this article</h3>
                <div className="flex gap-4">
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 rounded-full hover:bg-blue-50 transition-colors group">
                    <svg className="w-5 h-5 fill-gray-400 group-hover:fill-[#1877F2]" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                  </a>
                  <a href={`https://twitter.com/intent/tweet?url=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 rounded-full hover:bg-black transition-colors group">
                    <svg className="w-5 h-5 fill-gray-400 group-hover:fill-white" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Center Column: Blog Content */}
          <main className="flex-1 max-w-[850px] mx-auto min-w-0 w-full">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-[#B91508] rounded-full animate-spin"></div>
                <p className="text-gray-400 animate-pulse font-medium">Preparing your story...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-8 rounded-2xl text-center border border-red-100">
                <p className="text-xl font-bold mb-2">Oops! Something went wrong.</p>
                <p>{error}</p>
                <Link to="/blog" className="inline-block mt-4 text-[#B91508] font-bold hover:underline">Return to Blogs</Link>
              </div>
            ) : post && (
              <article className="animate-fade-in w-full overflow-hidden">
                <header className="mb-8 md:mb-10 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 mb-6">
                    <span className="px-3 py-1 bg-red-50 text-[#B91508] rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest">{getCategory(post)}</span>
                    <span className="text-gray-400 text-[12px] md:text-sm">{new Date(post.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-[48px] font-extrabold text-gray-900 mb-6 md:mb-8 leading-[1.2] md:leading-[1.15] tracking-tight break-words">
                    {post.title.rendered}
                  </h1>
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-[#B91508] to-red-400 p-[2px]">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[#B91508] font-bold text-base md:text-lg">
                        {getAuthor(post).charAt(0)}
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-xs md:text-sm font-bold text-gray-900 leading-none mb-1">{getAuthor(post)}</p>
                      <p className="text-[10px] md:text-xs text-gray-500">Summit Home Contributor</p>
                    </div>
                  </div>
                </header>

                {getFeaturedImage(post) && (
                  <div className="mb-10 rounded-2xl md:rounded-[2rem] overflow-hidden shadow-xl md:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] group">
                    <img
                      src={getFeaturedImage(post)}
                      alt="Featured"
                      className="w-full h-auto transition-transform duration-[2s] group-hover:scale-105"
                    />
                  </div>
                )}

                <div
                  className="
                    text-base md:text-lg leading-[1.8] md:leading-[1.85] text-[#333] font-sans
                    [&>p]:mb-6 md:[&>p]:mb-8 [&>p]:leading-relaxed
                    [&>h2]:text-2xl md:[&>h2]:text-3xl [&>h2]:font-extrabold [&>h2]:mt-10 md:[&>h2]:mt-16 [&>h2]:mb-4 md:[&>h2]:mb-8 [&>h2]:text-gray-900 [&>h2]:tracking-tight [&>h2]:scroll-mt-24
                    [&>h3]:text-xl md:[&>h3]:text-2xl [&>h3]:font-bold [&>h3]:mt-8 md:[&>h3]:mt-12 [&>h3]:mb-4 md:[&>h3]:mb-6 [&>h3]:text-gray-800 [&>h3]:tracking-tight [&>h3]:scroll-mt-24
                    [&>ul]:list-disc [&>ul]:ml-5 md:[&>ul]:ml-8 [&>ul]:mb-8 md:[&>ul]:mb-10 [&>ul]:space-y-3 md:[&>ul]:space-y-4
                    [&>ol]:list-decimal [&>ol]:ml-5 md:[&>ol]:ml-8 [&>ol]:mb-8 md:[&>ol]:mb-10 [&>ol]:space-y-3 md:[&>ol]:space-y-4
                    [&>li]:pl-2
                    [&>img]:rounded-2xl [&>img]:my-8 md:[&>img]:my-12 [&>img]:shadow-xl md:[&>img]:shadow-2xl [&>img]:mx-auto [&>img]:transition-all [&>img]:duration-500 hover:[&>img]:scale-[1.02]
                    [&>blockquote]:border-l-[4px] md:[&>blockquote]:border-l-[6px] [&>blockquote]:border-[#B91508] [&>blockquote]:pl-6 md:[&>blockquote]:pl-10 [&>blockquote]:italic [&>blockquote]:my-10 md:[&>blockquote]:my-14 [&>blockquote]:bg-gray-50 [&>blockquote]:py-8 md:[&>blockquote]:py-10 [&>blockquote]:pr-6 md:[&>blockquote]:pr-8 [&>blockquote]:text-xl md:[&>blockquote]:text-2xl [&>blockquote]:text-gray-900 [&>blockquote]:rounded-r-2xl md:[&>blockquote]:rounded-r-3xl [&>blockquote]:font-serif
                    [&>a]:text-[#B91508] [&>a]:font-bold [&>a]:underline hover:[&>a]:text-red-800
                  "
                  dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                />

                {/* Comment Section */}
                <section className="mt-24 pt-20 border-t border-gray-100">
                  <header className="mb-10">
                    <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">Share your thoughts</h3>
                    <p className="text-gray-500 mt-2">Your email address will not be published.</p>
                  </header>

                  {commentSubmitted && (
                    <div className="bg-green-50 text-green-700 p-8 rounded-[2rem] mb-10 flex items-center gap-4 border border-green-100 animate-fade-in shadow-sm">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-2xl">✨</span>
                      </div>
                      <div>
                        <p className="font-bold text-lg">Thank you for sharing!</p>
                        <p className="opacity-90">Your comment is waiting for approval by our editorial team.</p>
                      </div>
                    </div>
                  )}

                  <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleCommentSubmit(); }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Your Name</label>
                        <input
                          required
                          type="text"
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          className="w-full p-5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-red-50 outline-none transition-all placeholder:text-gray-300 focus:border-[#B91508]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
                        <input
                          required
                          type="email"
                          value={authorEmail}
                          onChange={(e) => setAuthorEmail(e.target.value)}
                          className="w-full p-5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-red-50 outline-none transition-all placeholder:text-gray-300 focus:border-[#B91508]"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Message</label>
                      <textarea
                        required
                        placeholder="Join the conversation..."
                        rows={6}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full p-5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-red-50 outline-none transition-all placeholder:text-gray-300 focus:border-[#B91508] resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="group w-full md:w-auto px-12 py-5 bg-[#B91508] text-white font-extrabold rounded-full hover:bg-black transition-all shadow-xl hover:shadow-2xl active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden"
                    >
                      <span className="relative z-10">Post Comment</span>
                      <svg className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                  </form>
                </section>
              </article>
            )}
          </main>

          {/* Right Sidebar: Recommended Reading */}
          <aside className="lg:w-[350px] shrink-0">
            <div className="sticky top-24 space-y-10">
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Read Next</h3>
                  <Link to="/blog" className="text-xs font-bold text-[#B91508] hover:underline uppercase tracking-widest">All Blogs</Link>
                </div>
                <div className="space-y-6">
                  {allPosts
                    .filter((p) => p.slug !== slug)
                    .slice(0, 5)
                    .map((item) => (
                      <Link
                        to={`/blog/${item.slug}`}
                        key={item.id}
                        className="group flex gap-4 items-center bg-transparent transition-all duration-300"
                      >
                        <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden shadow-sm">
                          <img
                            src={getFeaturedImage(item)}
                            alt={item.title.rendered}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[14px] font-extrabold text-gray-900 leading-tight group-hover:text-[#B91508] transition-colors line-clamp-3">
                            {item.title.rendered}
                          </h4>
                          <p className="text-[11px] font-bold text-gray-400 mt-2 uppercase tracking-tight">{getCategory(item)}</p>
                        </div>
                      </Link>
                    ))}
                </div>
              </section>

              {/* Newsletter or CTA Card placeholder */}
              <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/20 rounded-full blur-3xl"></div>
                <h3 className="text-white text-2xl font-black leading-tight mb-4 relative z-10">Upgrade Your Home Experience</h3>
                <p className="text-gray-400 text-sm mb-6 relative z-10 leading-relaxed">Discover our latest innovations in home appliances.</p>
                <Link to="/" className="inline-flex py-3 px-8 bg-[#B91508] text-white text-[13px] font-black rounded-full hover:bg-white hover:text-black transition-all duration-300 relative z-10 shadow-lg">Explore Shop</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Blog;
