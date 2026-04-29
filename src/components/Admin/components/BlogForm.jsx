"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import ReactQuill from "react-quill-new";
import {
  ImageUp,
  Tag,
  FileText,
  Upload,
  X,
  ChevronDown,
  Layout,
  Settings,
  Globe,
  User,
  Save,
  Send,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { blogCategories, blogStatuses } from "../data";
import { API_ENDPOINTS } from "../lib/api";
import axiosInstance from "../../../axiosConfig";
import "react-quill-new/dist/quill.snow.css";

export default function BlogForm({ mode = "add", initialData, onSuccess, onCancel }) {
  const fileInputRef = useRef(null);
  const defaults = useMemo(
    () => ({
      title: "",
      slug: "",
      short_description: "",
      category: blogCategories[0],
      tags: [],
      image_url: "",
      banner_url: "",
      content: "",
      seo_title: "",
      seo_description: "",
      status: "Draft",
      reading_time: "5 min",
      category_id: 1,
      author_name: "",
      author_email: "",
      image_alt_text: "",
      image_caption: "",
      focus_keyword: "",
      meta_robots: "index, follow",
      allow_comments: true,
      is_popular: false,
      show_on_homepage: true,
      is_sticky: false,
    }),
    []
  );

  const data = { ...defaults, ...(initialData || {}) };
  const [title, setTitle] = useState(data.title);
  const [slug, setSlug] = useState(data.slug);
  const [isSlugTouched, setIsSlugTouched] = useState(Boolean(data.slug));
  const [shortDescription, setShortDescription] = useState(
    data.short_description || data.excerpt || ""
  );
  const [category, setCategory] = useState(data.category);
  const [categoryInput, setCategoryInput] = useState(data.category || "");
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [tags, setTags] = useState(Array.isArray(data.tags) ? data.tags : (data.keywords ? data.keywords.split(',').map(s => s.trim()) : []));
  const [tagInput, setTagInput] = useState("");
  const categoryInputRef = useRef(null);
  const [featuredImage, setFeaturedImage] = useState(data.image_url || "");
  const [bannerImage, setBannerImage] = useState(data.banner_url || "");
  const [content, setContent] = useState(data.content || "");
  const [seoTitle, setSeoTitle] = useState(data.seo_title || "");
  const [seoDescription, setSeoDescription] = useState(
    data.seo_description || ""
  );
  const [status, setStatus] = useState(data.status || "Draft");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Author field is now a text input
  const [authorName, setAuthorName] = useState(data.author_name || "");
  
  // Additional fields for API
  const [readingTime, setReadingTime] = useState(data.reading_time || "5 min");
  const [categoryId, setCategoryId] = useState(data.category_id || 1);
  const [imageAlt, setImageAlt] = useState(data.image_alt_text || "");
  const [imageCaption, setImageCaption] = useState(data.image_caption || "");
  const [focusKeyword, setFocusKeyword] = useState(data.focus_keyword || "");
  const [metaRobots, setMetaRobots] = useState(data.meta_robots || "index, follow");
  const [allowComments, setAllowComments] = useState(data.allow_comments !== false);
  const [isPopular, setIsPopular] = useState(data.is_popular || false);
  const [showOnHomepage, setShowOnHomepage] = useState(data.show_on_homepage !== false);
  const [isSticky, setIsSticky] = useState(data.is_sticky || false);

  const quillRef = useRef(null);
  const categorySuggestionsRef = useRef(null);

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("folder", "blogs");

        const response = await axiosInstance.post(API_ENDPOINTS.images.upload(), formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        const imageUrl = response.data.data?.url || response.data.url || response.data.path;

        if (imageUrl) {
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          quill.insertEmbed(range.index, "image", imageUrl);
        }
      } catch (err) {
        console.error("Quill image upload failed:", err);
      }
    };
  }, []);

  const getEmbedUrl = useCallback((url) => {
    if (!url || typeof url !== "string") return null;
    const trimmed = url.trim();
    const ytMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    const vimeoMatch = trimmed.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return null;
  }, []);

  const videoHandler = useCallback(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const url = window.prompt(
      "Paste a YouTube or Vimeo video URL:",
      "e.g., https://www.youtube.com/watch?v=... or https://vimeo.com/..."
    );
    if (!url || !url.trim()) return;
    const embedUrl = getEmbedUrl(url);
    if (!embedUrl) {
      alert("Please enter a valid YouTube or Vimeo URL.");
      return;
    }
    const range = quill.getSelection(true);
    quill.insertEmbed(range.index, "video", embedUrl);
    quill.setSelection(range.index + 1);
  }, [getEmbedUrl]);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image", "video"],
        [{ color: [] }, { background: [] }],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
        video: videoHandler,
      },
    },
  }), [imageHandler, videoHandler]);

  const formats = [
    "header", "bold", "italic", "underline", "strike", "list", "align",
    "blockquote", "code-block", "link", "image", "video", "color", "background",
  ];

  useEffect(() => {
    if (!isSlugTouched) {
      const nextSlug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(nextSlug);
    }
  }, [title, isSlugTouched]);

  const handleCategoryInputChange = (value) => {
    setCategoryInput(value);
    setCategory(value);
    setShowCategorySuggestions(value.length > 0);
  };

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setCategoryInput(selectedCategory);
    setShowCategorySuggestions(false);
  };

  const filteredCategories = blogCategories.filter((cat) =>
    cat.toLowerCase().includes(categoryInput.toLowerCase())
  );

  const addTag = (value) => {
    const cleaned = value.trim();
    if (!cleaned || tags.includes(cleaned)) return;
    setTags((prev) => [...prev, cleaned]);
    setTagInput("");
  };

  const handleTagKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(tagInput);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Max size is 10MB.");
      return;
    }

    try {
      setIsUploadingImage(true);
      
      const formData = new FormData();
      formData.append("image", file);
      formData.append("folder", "blogs");

      try {
        const response = await axiosInstance.post(API_ENDPOINTS.images.upload(), formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        const imageUrl = response.data.data?.url || response.data.url || response.data.path;
        if (imageUrl) {
          setFeaturedImage(imageUrl);
          setMessageType("success");
          setMessage("📸 Image uploaded successfully!");
          return;
        }
      } catch (uploadErr) {
        console.warn("Real upload failed, falling back to local preview:", uploadErr);
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedImage(reader.result);
        setMessageType("success");
        setMessage("📸 Local image preview set!");
      };
      reader.readAsDataURL(file);

    } catch (err) {
      console.error("Error handling image:", err);
      setMessageType("error");
      setMessage(`❌ Image handling failed: ${err.message}`);
    } finally {
      setIsUploadingImage(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file);
    }
  };

  const handleSave = async (nextStatus) => {
    try {
      setIsSubmitting(true);
      setMessage("");
      
      if (!title.trim()) {
        throw new Error("Blog title is required");
      }
      
      const payload = {
        title,
        slug,
        category_id: categoryId,
        author_name: authorName || "Admin",
        author_email: data.author_email || "",
        keywords: tags.join(", "),
        content,
        short_description: shortDescription,
        image_url: featuredImage,
        banner_url: bannerImage,
        reading_time: readingTime,
        image_alt_text: imageAlt,
        image_caption: imageCaption,
        status: nextStatus.toLowerCase(),
        is_popular: isPopular,
        show_on_homepage: showOnHomepage,
        is_sticky: isSticky,
        seo_title: seoTitle || title,
        seo_description: seoDescription || shortDescription,
        focus_keyword: focusKeyword,
        meta_robots: metaRobots,
        allow_comments: allowComments,
      };

      const isEdit = mode === "edit" && initialData?.id != null;
      const url = isEdit
        ? API_ENDPOINTS.blogs.update(initialData.id)
        : API_ENDPOINTS.blogs.create();
      
      const method = isEdit ? "put" : "post";

      const response = await axiosInstance[method](url, payload);

      setStatus(nextStatus);
      setMessageType("success");
      setMessage(
        isEdit
          ? "✅ Blog updated successfully!"
          : "🎉 Blog post created successfully!"
      );

      if (onSuccess) {
        setTimeout(() => onSuccess(response.data.data || response.data), 1500);
      }
      
    } catch (err) {
      console.error("Error saving blog:", err);
      setMessageType("error");
      setMessage(`❌ Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  return (
    <div className="space-y-8 bg-slate-50 p-4 md:p-8 rounded-[2rem] border border-slate-200 shadow-2xl max-w-7xl mx-auto overflow-hidden animate-in fade-in duration-500">
      {/* Header Panel */}
      <div className="rounded-3xl border border-white/50 bg-white/80 backdrop-blur-md p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 group-hover:bg-indigo-100 transition-colors duration-500"></div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black">
                {mode === "edit" ? "Edit Article" : "Drafting Mode"}
              </p>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              {mode === "edit" ? "Refine Your Content" : "Compose Your Story"}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {onCancel && (
               <button
               type="button"
               onClick={onCancel}
               className="rounded-2xl border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-600 transition-all hover:bg-white hover:border-slate-300 hover:shadow-md active:scale-95"
             >
               Discard
             </button>
            )}
            <button
              type="button"
              onClick={() => handleSave("Draft")}
              disabled={isSubmitting}
              className="group flex items-center gap-2 rounded-2xl border border-indigo-100 bg-indigo-50/50 px-6 py-3.5 text-sm font-bold text-indigo-600 transition-all hover:bg-indigo-50 hover:border-indigo-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              <Save className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              {isSubmitting ? "Saving..." : "Save Draft"}
            </button>
            <button
              type="button"
              onClick={() => handleSave("Published")}
              disabled={isSubmitting}
              className="group flex items-center gap-2 rounded-2xl bg-slate-900 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-900/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              {isSubmitting ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </div>

        {message && (
          <div className={`mt-6 flex items-center gap-3 rounded-2xl border px-6 py-4 text-sm font-bold animate-in slide-in-from-top-4 duration-300 ${
            messageType === "success"
              ? "border-emerald-200 bg-emerald-50/50 text-emerald-700 shadow-sm shadow-emerald-100"
              : "border-rose-200 bg-rose-50/50 text-rose-700 shadow-sm shadow-rose-100"
          }`}>
            {messageType === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            {message}
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Main Content Column */}
        <div className="space-y-8">
          <section className="rounded-[2rem] border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-4 border-b border-slate-100 bg-slate-50/30 px-8 py-6">
              <div className="rounded-xl bg-indigo-50 p-2.5">
                <FileText className="h-6 w-6 text-indigo-500" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Article Essentials</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Core content and metadata</p>
              </div>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="group">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">
                  Article Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-6 py-4.5 text-lg font-bold text-slate-900 shadow-inner-sm focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:outline-none transition-all placeholder:text-slate-300"
                  placeholder="Enter a compelling title..."
                />
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block px-1">Permalink Slug</label>
                  <div className="relative group">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-sm">/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(event) => {
                        setSlug(event.target.value);
                        setIsSlugTouched(true);
                      }}
                      className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 pl-10 pr-6 py-4 text-sm font-bold text-slate-600 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                      placeholder="url-friendly-slug"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block px-1">Reading Time</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={readingTime}
                      onChange={(event) => setReadingTime(event.target.value)}
                      className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-6 py-4 text-sm font-bold text-slate-600 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                      placeholder="e.g., 5 min"
                    />
                    <Globe className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block px-1">Short Introduction</label>
                <textarea
                  rows={3}
                  value={shortDescription}
                  onChange={(event) => setShortDescription(event.target.value)}
                  className="w-full resize-none rounded-2xl border border-slate-100 bg-slate-50/50 px-6 py-4 text-sm font-medium text-slate-600 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:outline-none transition-all placeholder:text-slate-300"
                  placeholder="Hook your readers with a brief summary (good for SEO and social)..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-1">
                  Rich Content Editor <span className="text-rose-500">*</span>
                </label>
                <div className="rich-text-editor overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-100 focus-within:border-indigo-500 focus-within:ring-8 focus-within:ring-indigo-500/5 transition-all duration-300">
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    formats={formats}
                    placeholder="Unleash your creativity here..."
                    className="min-h-[500px]"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Media Section */}
          <section className="rounded-[2rem] border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/30 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-rose-50 p-2.5">
                  <ImageUp className="h-6 w-6 text-rose-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Featured Media</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Hero image and visual details</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 space-y-8">
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => !isUploadingImage && fileInputRef.current?.click()}
                className={`group relative flex min-h-[450px] cursor-pointer flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed transition-all duration-500 ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-50/30"
                    : isUploadingImage 
                      ? "border-slate-200 bg-slate-50 cursor-wait"
                      : "border-slate-100 bg-slate-50/50 hover:border-indigo-400 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100/50"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files?.[0])}
                  disabled={isUploadingImage}
                />
                
                {isUploadingImage ? (
                  <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                    <div className="h-16 w-16 relative">
                      <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                    </div>
                    <p className="mt-6 text-xl font-black text-slate-900">Processing Media</p>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Almost there...</p>
                  </div>
                ) : featuredImage ? (
                  <div className="relative h-full w-full p-6 animate-in zoom-in-95 duration-500">
                    <div className="relative group overflow-hidden rounded-[2rem] shadow-2xl">
                      <img
                        src={featuredImage}
                        alt="Preview"
                        className="max-h-[500px] w-full object-contain bg-slate-900"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-slate-900/40 backdrop-blur-sm">
                        <div className="bg-white/90 backdrop-blur px-8 py-4 rounded-2xl font-black text-sm shadow-2xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                          <Upload className="h-4 w-4" />
                          Update Image
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFeaturedImage("");
                      }}
                      className="absolute right-12 top-12 rounded-2xl bg-rose-500/90 backdrop-blur p-4 text-white shadow-2xl hover:bg-rose-600 transition-all active:scale-90"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center p-12">
                    <div className="mb-8 rounded-[2rem] bg-indigo-50 p-8 group-hover:scale-110 group-hover:bg-indigo-100 transition-all duration-500 shadow-inner-sm">
                      <Upload className="h-12 w-12 text-indigo-500" />
                    </div>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">
                      <span className="text-indigo-500">Elevate your post</span> with a hero image
                    </p>
                    <p className="mt-3 text-sm font-bold text-slate-400 uppercase tracking-widest">
                      Drag & drop or click to explore
                    </p>
                    <div className="mt-8 flex gap-4">
                      <span className="px-4 py-2 rounded-xl border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white">WebP</span>
                      <span className="px-4 py-2 rounded-xl border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white">PNG</span>
                      <span className="px-4 py-2 rounded-xl border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white">JPG</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block px-1">Alt Text</label>
                  <input
                    type="text"
                    value={imageAlt}
                    onChange={(event) => setImageAlt(event.target.value)}
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-6 py-4 text-sm font-bold text-slate-600 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                    placeholder="Describe image for accessibility"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block px-1">Caption</label>
                  <input
                    type="text"
                    value={imageCaption}
                    onChange={(event) => setImageCaption(event.target.value)}
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-6 py-4 text-sm font-bold text-slate-600 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                    placeholder="Optional credit or context"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
          <section className="rounded-[2rem] border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 sticky top-24">
            <div className="flex items-center gap-4 border-b border-slate-100 bg-slate-50/30 px-8 py-6">
              <div className="rounded-xl bg-amber-50 p-2.5">
                <Settings className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Curation</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Author & Category</p>
              </div>
            </div>
            
            <div className="p-8 space-y-8">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block px-1">
                  Author Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={authorName}
                    onChange={(event) => setAuthorName(event.target.value)}
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-6 py-4 text-sm font-bold text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                    placeholder="Enter author name..."
                  />
                  <User className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block px-1">Main Category</label>
                <div className="relative" ref={categorySuggestionsRef}>
                  <input
                    ref={categoryInputRef}
                    type="text"
                    value={categoryInput}
                    onChange={(event) => handleCategoryInputChange(event.target.value)}
                    onFocus={() => categoryInput.length > 0 && setShowCategorySuggestions(true)}
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-6 py-4 text-sm font-bold text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                    placeholder="Select or type..."
                  />
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none" />
                  
                  {showCategorySuggestions && filteredCategories.length > 0 && (
                    <div className="absolute z-50 mt-3 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      {filteredCategories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleCategorySelect(cat)}
                          className="w-full text-left px-5 py-3.5 hover:bg-indigo-50 transition-colors text-sm font-bold text-slate-600 rounded-xl mb-1 last:mb-0"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block px-1">Keywords</label>
                <div className="flex flex-wrap gap-2 p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all">
                  {tags.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-[10px] font-black text-white px-3 py-1.5 shadow-lg shadow-slate-900/20"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => setTags((prev) => prev.filter((tag) => tag !== item))}
                        className="hover:text-rose-400 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    value={tagInput}
                    onChange={(event) => setTagInput(event.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="flex-1 bg-transparent py-1 text-sm font-bold text-slate-700 focus:outline-none placeholder:text-slate-300"
                    placeholder="Add keywords..."
                  />
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`h-6 w-11 rounded-full transition-all duration-300 relative border-2 ${isPopular ? 'bg-indigo-500 border-indigo-500' : 'bg-slate-200 border-slate-200'}`}>
                    <div className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${isPopular ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    <input type="checkbox" className="hidden" checked={isPopular} onChange={() => setIsPopular(!isPopular)} />
                  </div>
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Popular Post</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`h-6 w-11 rounded-full transition-all duration-300 relative border-2 ${showOnHomepage ? 'bg-indigo-500 border-indigo-500' : 'bg-slate-200 border-slate-200'}`}>
                    <div className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${showOnHomepage ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    <input type="checkbox" className="hidden" checked={showOnHomepage} onChange={() => setShowOnHomepage(!showOnHomepage)} />
                  </div>
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Home Showcase</span>
                </label>
              </div>
            </div>
          </section>

          {/* SEO Sidebar */}
          <section className="rounded-[2rem] border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-4 border-b border-slate-100 bg-slate-50/30 px-8 py-6">
              <div className="rounded-xl bg-emerald-50 p-2.5">
                <Globe className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Optimization</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Search Engine Presence</p>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block px-1">Meta Title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(event) => setSeoTitle(event.target.value)}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-6 py-4 text-sm font-bold text-slate-600 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                  placeholder="Focus keyword should be early"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block px-1">Meta Description</label>
                <textarea
                  rows={4}
                  value={seoDescription}
                  onChange={(event) => setSeoDescription(event.target.value)}
                  className="w-full resize-none rounded-2xl border border-slate-100 bg-slate-50/50 px-6 py-4 text-sm font-medium text-slate-600 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                  placeholder="Summarize for Google search results..."
                />
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <style>{`
        .rich-text-editor .ql-toolbar {
          border: none !important;
          background: #fdfdfd !important;
          border-bottom: 1px solid #f1f5f9 !important;
          padding: 20px 24px !important;
        }
        .rich-text-editor .ql-container {
          border: none !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 16px !important;
        }
        .rich-text-editor .ql-editor {
          min-height: 500px !important;
          padding: 32px !important;
          line-height: 1.8 !important;
          color: #1e293b !important;
          background: white !important;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #cbd5e1 !important;
          font-style: normal !important;
          font-weight: 500 !important;
          left: 32px !important;
        }
        .rich-text-editor .ql-stroke {
          stroke: #64748b !important;
          stroke-width: 2px !important;
        }
        .rich-text-editor .ql-picker {
          color: #64748b !important;
          font-weight: 700 !important;
        }
        .shadow-inner-sm {
          box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.02);
        }
      `}</style>
    </div>
  );
}
