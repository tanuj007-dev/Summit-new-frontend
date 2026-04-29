import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { FaRegCheckCircle } from "react-icons/fa";
import aboutHeroImage from "./assets/WhatsApp Image 2026-04-15 at 3.37.30 PM (1).jpeg";
import uspSectionImage from "./assets/WhatsApp Image 2026-04-16 at 4.46.35 PM.jpeg";
import whySummitCard1 from "./assets/pressure-cooker.png";
import whySummitCard2 from "./assets/small-appliance.png";
import whySummitCard3 from "./assets/management.png";
import whySummitCard4 from "./assets/achievement.png";
import whySummitCard5 from "./assets/best-customer-experience.png";
import whySummitCard6 from "./assets/epidemiology.png";

function SummitFlipCard({ frontSrc, frontAlt, title, children }) {
  const backSurface = "bg-[#941007] text-white/90";

  return (
    <div className="group perspective-[1000px]">
      <div
        className="relative min-h-[260px] w-full rounded-2xl shadow-[0_12px_40px_-10px_rgba(148,16,7,0.35),0_4px_16px_-4px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-700 [transform-style:preserve-3d] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:min-h-[280px] lg:min-h-[300px] group-hover:[transform:rotateY(180deg)] hover:shadow-[0_22px_56px_-12px_rgba(148,16,7,0.48),0_10px_24px_-6px_rgba(0,0,0,0.12)] motion-reduce:group-hover:[transform:none]"
      >
        <div className="absolute inset-0 overflow-hidden rounded-2xl bg-white backface-hidden [transform:translateZ(0.1px)]">
          <div className="pointer-events-none absolute inset-0 z-1 flex items-center justify-center px-3 pb-32 pt-3 sm:px-4 sm:pb-36 sm:pt-5">
            <div className="rounded-2xl bg-white/92 p-3 backdrop-blur-[2px] sm:p-4">
              <img
                src={frontSrc}
                alt={frontAlt}
                className="h-28 w-28 rounded-xl object-contain object-center"
                loading="lazy"
              />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 z-2 p-2.5 sm:p-3">
            <div className="rounded-xl bg-[#941007] px-3.5 py-3 shadow-sm sm:px-4 sm:py-3.5">
              <p className="text-base font-semibold leading-snug tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:text-[1.05rem]">
                {title}
              </p>
              <p className="mt-1.5 text-[10px] font-semibold text-white/95 sm:text-[11px]">
                Read more
              </p>
            </div>
          </div>
        </div>
        <div
          className={`absolute inset-0 overflow-y-auto overscroll-contain rounded-2xl p-4 sm:p-5 text-[13px] leading-snug [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [backface-visibility:hidden] [transform:rotateY(180deg)_translateZ(0.1px)] sm:text-sm sm:leading-relaxed ${backSurface}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

const HISTORY_MILESTONES = [
  {
    year: "1975",
    title: "Seed sown in Bangalore",
    body: "Mr. Hemraj Jain begins his journey in the world of steel utensils, managing a small shop in Bangalore.",
  },
  {
    year: "1986",
    title: "Setting roots in Vijayawada",
    body: "Recognizing the potential of Vijayawada as a key junction for trade in Southern India, Mr. Jain—with the impetus of the next generation—relocated once again. He established Ashok Steel House as a local shop, laying the foundation for future growth. The shop gains recognition for retailing Salem steel utensils, earning the trust of the local market.",
  },
  {
    year: "1990",
    title: "Expansion into branded appliances",
    body: "Leveraging their collective strength, the sons venture into retailing branded appliances, expanding their reach across Andhra Pradesh.",
  },
  {
    year: "1993",
    title: "Diversification and wholesale ventures",
    body: "With a growing portfolio, Ashok Steel House starts wholesaling in different parts of Andhra Pradesh, introducing a wide range of products from various brands.",
  },
  {
    year: "1995",
    title: "Founding of Summit",
    body: 'Inspired by the aspiration for excellence and fueled by the collective effort of the family, the business undergoes a rebranding, culminating in the birth of "Summit." The Summit Water Filter is launched, marking the beginning of the brand\'s journey towards quality and innovation.',
  },
  {
    year: "2000",
    title: "Introduction of non-stick cookware",
    body: "Responding to market demands, Summit introduces non-stick cookware, catering to the evolving needs of its customers.",
  },
  {
    year: "2002",
    title: "Introduction of pressure cookers",
    body: "Expanding its product line, Summit introduces pressure cookers, leveraging its reputation for quality established with the water filter.",
  },
  {
    year: "2005",
    title: "Continuous product enhancement",
    body: "Summit continuously adds products demanded by customers while discontinuing those with weaker demands, ensuring a streamlined and relevant product portfolio.",
  },
  {
    year: "2009",
    title: "Modernizing kitchens",
    body: "Summit taps into the burgeoning market demand by launching its own line of electric rice cookers, catering to the evolving needs of modern kitchens and households.",
  },
  {
    year: "2015",
    title: "Innovating excellence",
    body: "The third generation establishes Vardhman Industries, setting up a manufacturing facility in Delhi dedicated to enhancing product quality and fostering innovation in kitchen products. Additionally, their introduction brings an organized approach to business operations, marking a significant leap forward for the brand.",
  },
  {
    year: "2016",
    title: "Continuous improvement",
    body: "Every year, Summit strives to enhance its product range, focusing on maintaining superior quality and exceeding customer expectations.",
  },
  {
    year: "2017",
    title: "National expansion",
    body: "Summit begins aggressively expanding its business across India, strategically exploring online marketplaces and offline markets district by district and city by city. It is listed on all leading e-commerce platforms, ensuring accessibility and convenience for customers nationwide.",
  },
  {
    year: "2024",
    title: "Expanding innovation",
    body: "Summit begins setting up a manufacturing facility to produce electric rice cookers and further innovate in electrical small appliances, reinforcing its commitment to quality and innovation.",
  },
  {
    year: "Global",
    title: "Global aspirations",
    body: "With a solid foundation of quality products and customer satisfaction, Summit sets its sights on international markets, expressing openness to export its high-quality products worldwide—so that excellence knows no boundaries.",
    isEnd: true,
  },
];

const About = () => {
  const reduceMotion = useReducedMotion();

  const storyEase = [0.22, 1, 0.36, 1];
  const storyItem = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0, transition: { duration: 0 } } }
    : {
        hidden: { opacity: 0, y: 22 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.52, ease: storyEase },
        },
      };
  const storyContainer = reduceMotion
    ? { hidden: {}, show: { transition: { staggerChildren: 0, delayChildren: 0 } } }
    : { hidden: {}, show: { transition: { staggerChildren: 0.11, delayChildren: 0.06 } } };

  return (
    <main className="bg-white  " >
      <section className="relative overflow-hidden bg-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_0%_0%,rgba(148,16,7,0.14),transparent_55%),radial-gradient(ellipse_65%_50%_at_100%_100%,rgba(148,16,7,0.12),transparent_52%)]"
        />
        <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 py-14 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6">
              <div className="relative w-full overflow-hidden rounded-3xl shadow-xl">
                <img
                  src={aboutHeroImage}
                  alt="Woman in traditional attire cooking with a Summit stainless steel pressure cooker in a bright home kitchen"
                  className="mx-auto block h-auto w-[94%] max-w-[94%] object-cover sm:w-[92%] sm:max-w-[92%]"
                />
                <div className="absolute left-3 top-3 z-10 ml-2 sm:ml-8 max-w-[min(16.5rem,calc(100%-1.5rem))] rounded-xl bg-white/95 px-3.5 py-3 shadow-lg backdrop-blur sm:left-5 sm:max-w-none sm:rounded-2xl sm:px-5 sm:py-4 sm:bottom-5 sm:top-auto">
                  <div className="text-[11px] text-gray-500 sm:text-xs">Trusted by</div>
                  <div className="mt-1 text-sm font-semibold leading-snug text-gray-900 sm:mt-1.5 sm:text-base lg:text-lg">
                    10 Million+ Indian
                    <br />
                    Families
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="inline-flex items-center rounded-full border border-[#941007]  bg-[#941007]/10 px-5 py-2 text-sm font-semibold text-[#941007]">
              About Us – Summit | Crown of Excellence
              </div>
              <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900">
              Who <span className="text-[#941007]">we</span> are?
              </h1>
              <div className="mt-5 space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Summit means the highest point or the topmost level attainable. Our team intends to achieve what our name means, that is,
                  the crown of excellence. Our work experience of over 30 years has imbibed in us the sense of customer requirements and the
                  knowledge of pioneering raw materials that can make customers&apos; experiences rich. We provide an unmatched product range
                  to fulfil the requirements of every type of customer.
                </p>
                <p>
                  Good quality of the kitchen and home appliances means they ensure safety, class, reliability, durability, convenience,
                  money-saving and ease of doing work. For achieving this our products go through rigorous quality testing, hence satisfying
                  the minimum requirements of various Indian quality standards.
                </p>
                <p className="font-medium text-gray-800">
                  We are not just selling Cookware or appliances — we are simplifying everyday life for millions of Indian homes.
                </p>
              </div>
              <div className="mt-6 flex w-full min-w-0 max-w-full flex-col gap-2.5 sm:mt-7 sm:flex-row sm:flex-wrap sm:gap-2">
                <span className="inline-flex min-h-11 w-full max-w-full shrink-0 items-center justify-center rounded-full border border-[#941007]/20 bg-white px-4 py-2.5 text-center text-xs font-semibold leading-snug text-[#941007] sm:min-h-0 sm:w-auto sm:max-w-none sm:justify-start sm:px-5 sm:py-2 sm:text-left sm:text-sm sm:leading-normal">
                  Over 30+ Years of Experience
                </span>
                <span className="inline-flex min-h-11 w-full max-w-full shrink-0 items-center justify-center rounded-full border border-[#941007]/20 bg-white px-4 py-2.5 text-center text-xs font-semibold leading-snug text-[#941007] sm:min-h-0 sm:w-auto sm:max-w-none sm:justify-start sm:px-5 sm:py-2 sm:text-left sm:text-sm sm:leading-normal">
                  Premium Quality
                </span>
                <span className="inline-flex min-h-11 w-full max-w-full shrink-0 items-center justify-center rounded-full border border-[#941007]/20 bg-white px-4 py-2.5 text-center text-xs font-semibold leading-snug text-[#941007] sm:min-h-0 sm:w-auto sm:max-w-none sm:justify-start sm:px-5 sm:py-2 sm:text-left sm:text-sm sm:leading-normal">
                  Unmatched Product Range
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-[#FBFAF9]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 py-14 sm:py-16">
          <motion.div
            className="relative mx-auto max-w-4xl"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15, margin: "0px 0px -8% 0px" }}
            variants={storyContainer}
          >
            <motion.div variants={storyItem}>
              <p className="inline-flex w-fit items-center rounded-full border border-[#941007] bg-[#941007]/10 px-4 py-1.5 text-xs font-bold text-[#941007] sm:px-5 sm:py-2 sm:text-sm">
                Our journey
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:mt-3 sm:text-4xl lg:text-[2.5rem]">
                History &amp; <span className="text-[#941007]">Origin</span>
              </h2>
              <p className="mt-4 max-w-2xl text-base text-gray-600 leading-relaxed sm:text-lg">
                From a single steel-utensil shop in Bangalore to a nationwide kitchen brand—retail, wholesale, manufacturing, and global
                ambition across three generations.
              </p>
            </motion.div>

            <div className="relative mt-10 sm:mt-14">
              <div
                aria-hidden
                className="pointer-events-none absolute left-[calc(0.75rem-0.5px)] top-2 bottom-6 w-px bg-gradient-to-b from-[#941007] via-[#941007]/35 to-[#941007]/10 sm:left-[calc(0.875rem-0.5px)]"
              />

              <div className="flex flex-col gap-9 sm:gap-11">
                {HISTORY_MILESTONES.map((m) => (
                  <motion.div key={`${m.year}-${m.title}`} variants={storyItem} className="relative flex gap-4 sm:gap-5">
                    <div className="relative z-[1] flex w-6 shrink-0 flex-col items-center pt-1 sm:w-7">
                      <span
                        className={
                          m.isEnd
                            ? "h-3.5 w-3.5 rounded-full border-2 border-[#941007] bg-[#941007] shadow-[0_0_0_4px_#FBFAF9] ring-2 ring-[#941007]/25 sm:h-4 sm:w-4"
                            : "h-3.5 w-3.5 rounded-full border-2 border-[#941007] bg-[#FBFAF9] shadow-[0_0_0_4px_#FBFAF9] ring-1 ring-[#941007]/20 sm:h-4 sm:w-4"
                        }
                      />
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="text-xs font-bold tabular-nums tracking-wide text-[#941007] sm:text-sm">{m.year}</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900 sm:text-base">{m.title}</p>
                      <p className="mt-2 text-sm text-gray-600 leading-relaxed sm:text-base">{m.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="h-1.5 bg-[#941007]" />
              <div className="p-8 sm:p-9">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#941007]">
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
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#941007]" />
                    Prioritize safety in every design
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#941007]" />
                    Make quality accessible to all
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#941007]" />
                    Support sustainable practices
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="h-1.5 bg-[#941007]/70" />
              <div className="p-8 sm:p-9">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#941007]">
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
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#941007]" />
                    Be present in every Indian kitchen
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#941007]" />
                    Lead in safety innovation
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#941007]" />
                    Build lasting customer relationships
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section> */}

     
    <section className="bg-[#FBFAF9]">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 py-14 sm:py-16">

        {/* Header */}
        <div className="flex w-full min-w-0 max-w-full flex-col items-center px-1 text-center sm:px-0">
          <div className="inline-flex max-w-full items-center justify-center rounded-full border border-[#941007] bg-[#941007]/10 px-3 py-1.5 text-center text-xs font-semibold leading-snug text-[#941007] sm:px-4 sm:py-2 sm:text-sm">
            Why Choose Summit?
          </div>

          <h2 className="mt-4 max-w-[min(100%,34rem)] text-balance text-3xl font-semibold leading-[1.12] tracking-tight text-gray-900 sm:mt-5 sm:max-w-5xl sm:text-4xl sm:leading-tight lg:max-w-4xl lg:text-5xl">
            What Makes Summit the Right Choice for Your Kitchen?
          </h2>

          <p className="mt-3 w-full max-w-2xl text-pretty text-sm leading-relaxed text-gray-600 sm:text-base">
            More Than Products — A Promise of Excellence
          </p>

          <p className="mt-2 w-full max-w-4xl text-pretty text-sm leading-relaxed text-gray-600 sm:mt-3 sm:text-base">
            We combine quality, variety, and trust to create products that make everyday cooking better and easier.
          </p>
        </div>

        {/* Cards — flip: full image front, details on hover (back) */}
        <div className="mt-10 grid grid-cols-1 items-start gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          <SummitFlipCard
            frontSrc={whySummitCard1}
            frontAlt="Line art icon of a pressure cooker on a flame with steam"
            title="Pressure Cooker Expertise"
          >
            <h3 className="text-base font-semibold text-white">Pressure Cooker Expertise</h3>
            <div className="mt-2 space-y-2 text-sm leading-relaxed">
              <p>
                We offer one of the <strong className="font-semibold text-white">widest ranges in India</strong>:
              </p>
              <ul className="space-y-1.5">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" aria-hidden />
                  <span>Aluminium, Stainless Steel, Hard Anodised, and Triply</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" aria-hidden />
                  <span>
                    Outer Lid: <strong className="font-semibold text-white">1L to 24L</strong>
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" aria-hidden />
                  <span>
                    Inner Lid: <strong className="font-semibold text-white">1L to 22L</strong>
                  </span>
                </li>
              </ul>
              <p>
                This ensures that{" "}
                <strong className="font-semibold text-white">
                  every type of customer—from small families to commercial users—finds exactly what they need.
                </strong>
              </p>
            </div>
          </SummitFlipCard>

          <SummitFlipCard
            frontSrc={whySummitCard2}
            frontAlt="Line art icon of small kitchen appliances and a home"
            title="Complete Kitchen Range"
          >
            <h3 className="text-base font-semibold text-white">Complete Kitchen Range</h3>
            <div className="mt-2 space-y-2 text-sm leading-relaxed">
              <ul className="space-y-1.5">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" aria-hidden />
                  <span>Heavy-duty Mixer Grinders</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" aria-hidden />
                  <span>
                    Gas Stoves (Stainless Steel to Glass Top, 2 to 4 Burner, Regular to Premium)
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" aria-hidden />
                  <span>Cookware (Triply, Hard Anodised, Non-stick Aluminium)</span>
                </li>
              </ul>
              <p className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
                <span className="text-sm leading-none" aria-hidden>
                  👉
                </span>
                <span>
                  <strong className="font-semibold text-white">One brand. Every kitchen need.</strong>
                </span>
              </p>
            </div>
          </SummitFlipCard>

          <SummitFlipCard
            frontSrc={whySummitCard3}
            frontAlt="Line art icon of people with a gear, representing team and management"
            title="Our Team"
          >
            <h3 className="text-base font-semibold text-white">Our Team</h3>
            <div className="mt-2 space-y-2 text-sm leading-relaxed">
              <p>
                Summit is not just a company — it is a{" "}
                <strong className="font-semibold text-white">three-generation legacy</strong> built on experience, trust, and evolution.
              </p>
              <ul className="space-y-1.5">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" aria-hidden />
                  <span>
                    <strong className="font-semibold text-white">First Generation:</strong> Built the retail foundation and direct customer
                    understanding
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" aria-hidden />
                  <span>
                    <strong className="font-semibold text-white">Second Generation:</strong> Expanded into wholesale and distribution,
                    mastering the trade
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" aria-hidden />
                  <span>
                    <strong className="font-semibold text-white">Third Generation:</strong> Entered manufacturing, bringing innovation and
                    control over quality
                  </span>
                </li>
              </ul>
              <p>
                Together, this unique combination allows us to understand the business{" "}
                <strong className="font-semibold text-white">from the ground level to the final product</strong>.
              </p>
            </div>
          </SummitFlipCard>

          <SummitFlipCard
            frontSrc={whySummitCard4}
            frontAlt="Line art achievement icon representing quality and standards"
            title="Quality &amp; Standards"
          >
            <h3 className="text-base font-semibold text-white">Quality &amp; Standards</h3>
            <div className="mt-2 space-y-2 text-sm leading-relaxed">
              <p className="font-medium text-white">Quality is the backbone of Summit.</p>
              <ul className="space-y-1.5">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" aria-hidden />
                  <span>
                    All our products go through <strong className="font-semibold text-white">rigorous testing processes</strong>
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" aria-hidden />
                  <span>
                    We use <strong className="font-semibold text-white">high-grade raw materials</strong> that meet Indian standards
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" aria-hidden />
                  <span>
                    Many of our products are <strong className="font-semibold text-white">ISI certified</strong>, ensuring safety and
                    reliability
                  </span>
                </li>
              </ul>
              <div className="mt-2 border-t border-white/25 pt-2">
                <p className="font-medium text-white">Every product is designed to deliver:</p>
                <ul className="mt-1.5 space-y-1">
                  {["Safety", "Durability", "Consistent Performance", "Long-term Value"].map((label) => (
                    <li key={label} className="flex items-center gap-1.5 text-white/90">
                      <FaRegCheckCircle className="h-3.5 w-3.5 shrink-0 text-white" aria-hidden />
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SummitFlipCard>

          <SummitFlipCard
            frontSrc={whySummitCard5}
            frontAlt="Line art icon representing excellent customer experience"
            title="Customer-Centric Approach"
          >
            <h3 className="text-base font-semibold text-white">Customer-Centric Approach</h3>
            <div className="mt-2 space-y-2 text-sm leading-relaxed">
              <p className="font-medium text-white">Our customers are at the heart of everything we do.</p>
              <p>
                We actively listen, learn, and improve based on real feedback. Whether it is enhancing safety features, improving durability,
                or expanding our range —{" "}
                <strong className="font-semibold text-white">every improvement comes from customer needs.</strong>
              </p>
              <p>This is why dealers trust us, and customers come back to us.</p>
            </div>
          </SummitFlipCard>

          <SummitFlipCard
            frontSrc={whySummitCard6}
            frontAlt="Line art icon of people with a globe representing community and togetherness"
            title="Community &amp; Responsibility"
          >
            <h3 className="text-base font-semibold text-white sm:text-lg">Community &amp; Responsibility</h3>
            <p className="mt-2 text-sm text-white/90 leading-snug">As a responsible brand, we believe in:</p>
            <ul className="mt-2 space-y-1.5 text-sm text-white/90 leading-snug">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" aria-hidden />
                <span>Supporting local manufacturing</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" aria-hidden />
                <span>Creating employment opportunities</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" aria-hidden />
                <span>
                  Moving towards <strong className="font-semibold text-white">in-house production</strong> (reducing dependency on imports)
                </span>
              </li>
            </ul>
            <p className="mt-3 text-sm text-white/90 leading-snug">
              Our goal is to contribute to a stronger, self-reliant India while delivering world-class products.
            </p>
            <div className="mt-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white underline underline-offset-4 transition-all duration-300 group-hover:gap-3"
              >
                View All Products →
              </Link>
            </div>
          </SummitFlipCard>
        </div>
      </div>
    </section>

      <section className="relative overflow-hidden bg-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_0%_0%,rgba(148,16,7,0.14),transparent_55%),radial-gradient(ellipse_65%_50%_at_100%_100%,rgba(148,16,7,0.12),transparent_52%)]"
        />
        <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 py-14 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center rounded-full bg-[#941007]/10 px-4 py-2 text-xs font-semibold text-[#941007]">
              Core Values
              </div>
              <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900">
              Our Unique Strength <span className="text-[#941007]">(USP) &</span>
                <br />
                Philosophy
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
              What makes Summit truly stand out is our <span className="text-[#941007]">unmatched product range and deep understanding of Indian cooking needs.</span>
              </p>

              <p className="mt-7 text-sm font-medium text-gray-900">
                Our brand stands on a few non-negotiable principles:
              </p>
              <ul className="mt-4 space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#941007]/10">
                    <FaRegCheckCircle size={23} className="text-[#941007]" />
                  </span>
                  <span>
                    <em className="font-semibold text-gray-900">Quality First:</em> We never compromise on materials or performance
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#941007]/10">
                    <FaRegCheckCircle size={23} className="text-[#941007]" />
                  </span>
                  <span>
                    <em className="font-semibold text-gray-900">Customer Satisfaction:</em> Every product is designed keeping
                    real users in mind
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#941007]/10">
                    <FaRegCheckCircle size={23} className="text-[#941007]" />
                  </span>
                  <span>
                    <em className="font-semibold not-italic text-gray-900">Continuous Improvement:</em> We constantly refine and upgrade
                    our products
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#941007]/10">
                    <FaRegCheckCircle size={23} className="text-[#941007]" />
                  </span>
                  <span>
                    <em className="font-semibold text-gray-900">Trust &amp; Reliability:</em> Our products are built to perform
                    daily, without fail
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#941007]/10">
                    <FaRegCheckCircle size={23} className="text-[#941007]" />
                  </span>
                  <span>
                    <em className="font-semibold text-gray-900">Value for Money:</em> Premium quality at the right price
                  </span>
                </li>
              </ul>
              <p className="mt-7 text-sm text-gray-700 leading-relaxed">
                We believe that a kitchen appliance is not just a product —{" "}
                <em className="text-[#941007]">it is a daily companion in every household.</em>
              </p>

              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 text-center shadow-sm">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-[#941007]/10">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                      <path d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4Z" stroke="#941007" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9 12l2 2 4-5" stroke="#941007" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-gray-800">ISO Certified</div>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 text-center shadow-sm">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-[#941007]/10">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                      <path d="M12 3v18" stroke="#941007" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M6 7h12" stroke="#941007" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M6 17h12" stroke="#941007" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-gray-800">BIS Standards</div>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 text-center shadow-sm">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-[#941007]/10">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                      <path d="M12 21s-7-4-7-10V6l7-4 7 4v5c0 6-7 10-7 10Z" stroke="#941007" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-gray-800">Quality Assured</div>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 text-center shadow-sm">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-[#941007]/10">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                      <path d="M6 12l4 4 8-8" stroke="#941007" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="#941007" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-gray-800">Safety Tested</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:col-span-6 lg:justify-end">
              <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl shadow-xl lg:max-w-none">
                <img
                  src={uspSectionImage}
                  alt="Summit pressure cooker manufacturing floor with workers at assembly and quality testing stations"
                  className="h-[280px] w-full object-cover object-center sm:h-[340px] lg:h-[440px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent" />
                {/* <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-3">
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
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#941007]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 py-14 sm:py-16">
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
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#941007] shadow-lg transition hover:bg-white/95"
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
                <div className="text-2xl font-semibold text-white">30+</div>
                <div className="text-sm text-white/80">Years</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-white">10M+</div>
                <div className="text-sm text-white/80">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-white">5000+</div>
                <div className="text-sm text-white/80">Dealers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-white">500+</div>
                <div className="text-sm text-white/80">Products</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
