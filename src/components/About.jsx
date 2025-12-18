import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <main className="bg-white">
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-xl">
                <img
                  src="/asset/images/about.jpg"
                  alt="Summit Home Appliances in an Indian kitchen"
                  className="h-[320px] sm:h-[420px] lg:h-[520px] w-full object-cover"
                />
                <div className="absolute bottom-5 left-5 rounded-2xl bg-white/95 backdrop-blur px-5 py-4 shadow-lg">
                  <div className="text-xs text-gray-500">Trusted by</div>
                  <div className="mt-1 text-lg font-semibold text-gray-900">
                    1 Million+ Indian
                    <br />
                    Families
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="inline-flex items-center rounded-full border border-[#B91508]  bg-[#B91508]/10 px-5 py-2 text-sm font-semibold text-[#B91508]">
                Our Story
              </div>
              <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900">
                About Summit <span className="text-[#B91508]">Home</span>
                <br />
                Appliances
              </h1>
              <div className="mt-5 space-y-4 text-gray-600 leading-relaxed">
                <p>
                  For over two decades, Summit Home Appliances has been at the heart of Indian kitchens, crafting pressure cookers that blend
                  traditional cooking wisdom with modern engineering excellence.
                </p>
                <p>
                  Founded with a simple belief—that every family deserves safe, reliable, and beautifully designed kitchen appliances—we’ve
                  grown from a small workshop to a trusted name in homes across India.
                </p>
                <p>
                  Our commitment to quality isn’t just a promise; it’s embedded in every product we create. From sourcing fine materials to
                  implementing rigorous safety standards, we ensure that when you choose Summit, you’re choosing peace of mind.
                </p>
              </div>
              <div className="mt-7 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-[#B91508]/20 bg-white px-5 py-2 text-sm font-semibold text-[#B91508]">
                  Safety First
                </span>
                <span className="inline-flex items-center rounded-full border border-[#B91508]/20 bg-white px-5 py-2 text-sm font-semibold text-[#B91508]">
                  Premium Quality
                </span>
                <span className="inline-flex items-center rounded-full border border-[#B91508]/20 bg-white px-5 py-2 text-sm font-semibold text-[#B91508]">
                  Family Values
                </span>
                <span className="inline-flex items-center rounded-full border border-[#B91508]/20 bg-white px-5 py-2 text-sm font-semibold text-[#B91508]">
                  Innovation
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="h-1.5 bg-[#B91508]" />
              <div className="p-8 sm:p-9">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B91508]">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
                    <path d="M12 6c3.5 0 7 1.6 7 4.5S15.5 15 12 15s-7-1.6-7-4.5S8.5 6 12 6Z" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 15v7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 22h8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <h2 className="mt-6 text-2xl sm:text-3xl font-semibold text-gray-900">Our Mission</h2>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  To deliver safe, reliable, and affordable kitchen solutions that empower every Indian household to cook with confidence and joy.
                </p>

                <ul className="mt-6 space-y-2 text-sm text-gray-700">
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#B91508]" />
                    Prioritize safety in every design
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#B91508]" />
                    Make quality accessible to all
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#B91508]" />
                    Support sustainable practices
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="h-1.5 bg-[#B91508]/70" />
              <div className="p-8 sm:p-9">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B91508]">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
                    <path d="M12 5c5 0 9 2.8 9 6.2S17 17.4 12 17.4 3 14.6 3 11.2 7 5 12 5Z" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 17.4V21" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8.5 21h7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <h2 className="mt-6 text-2xl sm:text-3xl font-semibold text-gray-900">Our Vision</h2>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  To become the most trusted name in every Indian household, known for innovation, quality, and unwavering commitment to customer satisfaction.
                </p>

                <ul className="mt-6 space-y-2 text-sm text-gray-700">
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#B91508]" />
                    Be present in every Indian kitchen
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#B91508]" />
                    Lead in safety innovation
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#B91508]" />
                    Build lasting customer relationships
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center rounded-full bg-[#B91508]/10 px-4 py-2 text-sm border border-[#B91508] font-semibold text-[#B91508]">
              Why Summit
            </div>
            <h2 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900">
              Why Choose <span className="text-[#B91508]">Summit</span>?
            </h2>
            <p className="mt-3 max-w-2xl text-gray-600 leading-relaxed">
              Every Summit product is engineered with precision and care, bringing together the best of traditional craftsmanship and modern technology.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-3xl border shadow-2xl border-gray-200 bg-white p-7 hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B91508]/10">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
                  <path d="M12 21s-7-4-7-10V6l7-4 7 4v5c0 6-7 10-7 10Z" stroke="#B91508" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="mt-6 text-lg font-semibold text-gray-900">High-Grade Materials</div>
              <div className="mt-2 text-sm text-gray-600 leading-relaxed">
                Crafted from premium aluminum and stainless steel, ensuring even heat distribution and lasting durability.
              </div>
            </div>

            <div className="rounded-3xl border shadow-2xl border-gray-200 bg-white p-7 hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B91508]/10">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
                  <path d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4Z" stroke="#B91508" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 12l2 2 4-5" stroke="#B91508" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="mt-6 text-lg font-semibold text-gray-900">Advanced Safety Valves</div>
              <div className="mt-2 text-sm text-gray-600 leading-relaxed">
                Multiple safety mechanisms including pressure regulators and gasket release systems for worry-free cooking.
              </div>
            </div>

            <div className="rounded-3xl border shadow-2xl border-gray-200 bg-white p-7 hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B91508]/10">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
                  <path d="M7 14l5-5 5 5" stroke="#B91508" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 9v13" stroke="#B91508" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="mt-6 text-lg font-semibold text-gray-900">Ergonomic Handles</div>
              <div className="mt-2 text-sm text-gray-600 leading-relaxed">
                Heat-resistant, comfortable grip handles designed for safe handling even with full loads.
              </div>
            </div>

            <div className="rounded-3xl border shadow-2xl border-gray-200 bg-white p-7 hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B91508]/10">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
                  <path d="M12 6v6l4 2" stroke="#B91508" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 12a9 9 0 1 1-9-9 9 9 0 0 1 9 9Z" stroke="#B91508" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="mt-6 text-lg font-semibold text-gray-900">Long-Lasting Performance</div>
              <div className="mt-2 text-sm text-gray-600 leading-relaxed">
                Built to withstand years of daily use with consistent performance and minimal maintenance.
              </div>
            </div>

            <div className="rounded-3xl border shadow-2xl border-gray-200 bg-white p-7 hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B91508]/10">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
                  <path d="M4 20h16" stroke="#B91508" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 20V10a6 6 0 0 1 12 0v10" stroke="#B91508" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="mt-6 text-lg font-semibold text-gray-900">Indian Cooking Optimized</div>
              <div className="mt-2 text-sm text-gray-600 leading-relaxed">
                Designed specifically for Indian cooking styles—from dal to biryani, we've got you covered.
              </div>
            </div>

            <div className="rounded-3xl bg-[#B91508] p-7 shadow-md text-white flex flex-col justify-between">
              <div>
                <div className="text-xl sm:text-2xl font-semibold">Discover the Summit Difference</div>
                <div className="mt-2 text-sm text-white/85 leading-relaxed">
                  Experience the perfect blend of safety, style, and performance.
                </div>
              </div>
              <div className="mt-8">
                <Link to="/product" className="inline-flex items-center gap-2 text-sm font-semibold text-white underline underline-offset-4">
                  View All Products
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center rounded-full bg-[#B91508]/10 px-4 py-2 text-xs font-semibold text-[#B91508]">
                Quality Promise
              </div>
              <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900">
                Uncompromising <span className="text-[#B91508]">Quality &</span>
                <br />
                Safety
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                At Summit, quality isn't just a department—it's our culture. Every pressure cooker undergoes rigorous testing and inspection
                before reaching your kitchen. Our commitment to safety has earned us certifications from leading standards organizations.
              </p>

              <ul className="mt-7 space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#B91508]/10">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5">
                      <path d="M9 12l2 2 4-5" stroke="#B91508" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  100% pressure tested before dispatch
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#B91508]/10">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5">
                      <path d="M9 12l2 2 4-5" stroke="#B91508" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  Premium food-grade materials only
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#B91508]/10">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5">
                      <path d="M9 12l2 2 4-5" stroke="#B91508" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  Multi-point safety inspection
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#B91508]/10">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5">
                      <path d="M9 12l2 2 4-5" stroke="#B91508" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  Certified manufacturing facilities
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#B91508]/10">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5">
                      <path d="M9 12l2 2 4-5" stroke="#B91508" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  Customer satisfaction guarantee
                </li>
              </ul>

              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 text-center shadow-sm">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-[#B91508]/10">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                      <path d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4Z" stroke="#B91508" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9 12l2 2 4-5" stroke="#B91508" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-gray-800">ISO Certified</div>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 text-center shadow-sm">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-[#B91508]/10">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                      <path d="M12 3v18" stroke="#B91508" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M6 7h12" stroke="#B91508" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M6 17h12" stroke="#B91508" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-gray-800">BIS Standards</div>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 text-center shadow-sm">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-[#B91508]/10">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                      <path d="M12 21s-7-4-7-10V6l7-4 7 4v5c0 6-7 10-7 10Z" stroke="#B91508" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-gray-800">Quality Assured</div>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 text-center shadow-sm">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-[#B91508]/10">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                      <path d="M6 12l4 4 8-8" stroke="#B91508" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="#B91508" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-gray-800">Safety Tested</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-3xl shadow-xl">
                <img
                  src="/asset/images/pressurecooker.jpg"
                  alt="Summit pressure cooker quality and safety"
                  className="h-[360px] sm:h-[440px] lg:h-[520px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-black/35 backdrop-blur px-4 py-3 text-center">
                    <div className="text-2xl font-semibold text-white">50+</div>
                    <div className="text-[11px] text-white/80">Quality Checks</div>
                  </div>
                  <div className="rounded-2xl bg-black/35 backdrop-blur px-4 py-3 text-center">
                    <div className="text-2xl font-semibold text-white">99.9%</div>
                    <div className="text-[11px] text-white/80">Pass Rate</div>
                  </div>
                  <div className="rounded-2xl bg-black/35 backdrop-blur px-4 py-3 text-center">
                    <div className="text-2xl font-semibold text-white">0%</div>
                    <div className="text-[11px] text-white/80">Defect Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#B91508]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl sm:text-5xl font-semibold text-white leading-tight">
              Built for Your Kitchen.
              <br />
              Trusted for Your Family.
            </h2>
            <p className="mt-4 text-white/85 leading-relaxed max-w-2xl">
              Join millions of Indian families who trust Summit for their everyday cooking needs. Experience the perfect blend of tradition and innovation.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/product"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#B91508] shadow-lg transition hover:bg-white/95"
              >
                Explore Our Products
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-transparent px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:border-white/70"
              >
                Contact Us
              </Link>
            </div>

            <div className="mt-10 h-px w-full max-w-4xl bg-white/25" />

            <div className="mt-8 grid w-full max-w-4xl grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-semibold text-white">25+</div>
                <div className="text-xs text-white/80">Years</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-white">1M+</div>
                <div className="text-xs text-white/80">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-white">500+</div>
                <div className="text-xs text-white/80">Dealers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-white">50+</div>
                <div className="text-xs text-white/80">Products</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
