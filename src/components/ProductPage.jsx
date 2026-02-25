import React from "react";

const ProductPage = () => {
  const product = {
    title: "Outer Lid 3 Litre Induction Base Supreme Aluminium Pressure Cooker",
    price: "₹2,550.00",
    images: [
      "/images/p1.png",
      "/images/p2.png",
      "/images/p3.png",
      "/images/p4.png",
    ],
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-4">
        Home / Kitchen / Cookware / <span className="text-black">Cooker</span>
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left - Product Images */}
        <div className="flex flex-col gap-3">
          <img
            src={product.images[0]}
            alt="Main Product"
            className="w-full rounded-xl shadow"
          />

          {/* Small Thumbnails */}
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                className="w-20 h-20 rounded-md border cursor-pointer hover:scale-105 duration-200"
              />
            ))}
          </div>
        </div>

        {/* Right - Product Info */}
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold mb-3">{product.title}</h1>

          {/* Ratings */}
          <div className="flex items-center gap-1 mb-4">
            <span className="text-yellow-400 text-xl">★★★★★</span>
            <p className="text-sm text-gray-500">(124 reviews)</p>
          </div>

          {/* Price */}
          <p className="text-3xl font-bold mb-2">{product.price}</p>

          {/* Variants */}
          <div className="mt-6">
            <p className="font-semibold mb-2">Select Size:</p>
            <div className="flex gap-3">
              {["1L", "1.5L", "2L", "3L", "5L"].map((v) => (
                <button
                  key={v}
                  className="px-5 py-2 border rounded-lg hover:bg-black hover:text-white duration-300"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex gap-4">
            <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 duration-200">
              Add to Cart
            </button>
            <button className="border px-6 py-3 rounded-lg hover:bg-gray-100">
              Buy Now
            </button>
          </div>
        </div>

      </div>

      {/* Description Tabs */}
      <div className="mt-12">
        <div className="flex gap-6 border-b pb-2">
          <button className="font-semibold border-b-2 border-red-600 pb-2">Description</button>
          <button className="text-gray-500">Additional Info</button>
          <button className="text-gray-500">Reviews</button>
          <button className="text-gray-500">Returns & Exchange</button>
        </div>

        <ul className="mt-5 text-gray-700 leading-7">
          <li>• Aluminium Body, Toughened Glass Lid, Heats evenly</li>
          <li>• Strong & durable handle</li>
          <li>• Anti-bulging base</li>
          <li>• Compatible with induction & gas stove</li>
        </ul>
      </div>

      {/* You May Also Like */}
      <h2 className="text-2xl font-bold mt-12 mb-5">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {[1, 2, 3, 4, 5].map((p) => (
          <div
            key={p}
            className="p-4 bg-white shadow rounded-lg hover:shadow-lg duration-200"
          >
            <img src="/images/p1.png" className="rounded-lg mb-2" />
            <p className="font-semibold text-sm">Aluminium Cooker 3L</p>
            <p className="text-red-600 font-bold">₹2,550</p>
            <button className="mt-2 w-full bg-red-600 text-white py-1 rounded-md">
              View
            </button>
          </div>
        ))}
      </div>

      {/* Categories */}
      <h2 className="text-2xl font-bold mt-12 mb-5">Explore More Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {["Pressure Cooker", "Cookware", "Gas Stove", "Mixer Grinder"].map((c) => (
          <div key={c} className="text-center">
            <img
              src="/images/c1.png"
              className="rounded-xl w-full h-40 object-cover"
            />
            <p className="font-semibold mt-2">{c}</p>
          </div>
        ))}
      </div>

      {/* Blogs */}
      <h2 className="text-2xl font-bold mt-12 mb-5">Blogs</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((b) => (
          <div key={b} className="p-4 shadow rounded-xl bg-white">
            <img src="/images/blog.png" className="rounded-lg mb-3" />
            <p className="font-bold">When to use a pressure cooker?</p>
            <p className="text-sm text-gray-600 mt-2">
              Learn how to choose the right cooker for your home...
            </p>
            <button className="mt-3 text-red-600 font-semibold">
              Read More →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
