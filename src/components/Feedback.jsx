 import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { FaStar, FaRegStar } from "react-icons/fa";
import "swiper/css";
import "swiper/css/autoplay";

const feedbackArray = [
  {
    name: "Priya Sharma",
    profession: "Home Chef & Food Blogger",
    review:
      "I recently purchased a cookware combo set and a gas tandoor — both exceeded my expectations. The build is premium, and they look so good in my modern kitchen. Highly recommended!",
    rating: 4,
    image: "/asset/images/feedback/feed1.png",
  },
  {
    name: "Rajiv Malhotra",
    profession: "Culinary Instructor",
    review:
      "The gas stove and pressure cooker I bought are absolute game-changers. The heat distribution is perfect, and the safety features are spot on. Their customer service is also super responsive.",
    rating: 4,
    image: "/asset/images/feedback/feed2.png",
  },
  {
    name: "Anjali Mehta",
    profession: "Kitchen Lifestyle Influencer",
    review:
      "As someone who loves experimenting with recipes, this brand’s grinder and cookware collection perfectly blend durability with style. It’s now my kitchen essential!",
    rating: 4,
    image: "/asset/images/feedback/feed3.png",
  },
  {
    name: "Vikas Singh",
    profession: "Food Enthusiast",
    review:
      "As someone who loves experimenting with recipes, this brand’s grinder and cookware collection perfectly blend durability with style. It’s now my kitchen essential!",
    rating: 5,
    image: "/asset/images/feedback/feed2.png",
  },
  {
    name: "Sneha Gupta",
    profession: "Baker & YouTuber",
    review:
      "As someone who loves experimenting with recipes, this brand’s grinder and cookware collection perfectly blend durability with style. It’s now my kitchen essential!",
    rating: 4,
    image: "/asset/images/feedback/feed3.png",
  },
];

const FeedbackCard = ({ item }) => (
  <div className="bg-[#F5F5F7] rounded-2xl p-3 py-8 sm:p-4 md:p-6 flex flex-col justify-between h-[100px] sm:h-[180px] md:h-[200px] border border-gray-100">
    {/* Star Ratings */}
    <div className="flex mb-2 sm:mb-3">
      {Array.from({ length: 5 }).map((_, i) =>
        i < item.rating ? (
          <FaStar key={i} className="text-[#E53935] text-xs sm:text-sm md:text-base" />
        ) : (
          <FaRegStar key={i} className="text-[#E53935] text-xs sm:text-sm md:text-base" />
        )
      )}
    </div>

    {/* Review Text */}
    <p className="text-gray-700 text-sm sm:text-[6px] md:text-sm mb-3 sm:mb-4 md:mb-6 leading-relaxed line-clamp-3 sm:line-clamp-4">
      {item.review}
    </p>

    {/* User Info */}
    <div className="flex items-center mt-auto">
      <img
        src={item.image}
        alt={item.name}
        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover mr-2 sm:mr-3"
      />
      <div className="">
        <p className="text-[12px] sm:text-[6px] md:text-sm font-semibold">{item.name}</p>
        <p className="text-[10px] sm:text-xs md:text-xs text-gray-500">{item.profession}</p>
      </div>
    </div>
  </div>
);

const Feedback = () => {
  return (
    <div className="py-12 bg-white">
      {/* Heading */}
      <div className="px-2 md:px-12 mb-8 ">
        <h2 className="text-2xl sm:text-3xl text-center sm:text-start font-bold text-black">
          Hear It from Happy Kitchens
        </h2>
        <p className="text-gray-500 text-center sm:text-start text-justify px-4 text-sm sm:text-xl sm:px-0 font-medium mt-2">
          Real reviews from Amazon, Flipkart, and more — see why Indian cooks trust Summit every day.
        </p>
      </div>

      {/* Row 1 - Left to Right */}
      <Swiper
        modules={[Autoplay]}
        spaceBetween={24}
        slidesPerView={1.1}
        loop={true}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          reverseDirection: false,
        }}
        speed={6000}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {feedbackArray.map((item, i) => (
          <SwiperSlide key={i}>
            <FeedbackCard item={item} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Row 2 - Right to Left */}
      <div className="mt-10">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={24}
          slidesPerView={1.1}
          loop={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            reverseDirection: true,
          }}
          speed={5000}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {feedbackArray.map((item, i) => (
            <SwiperSlide key={i}>
              <FeedbackCard item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Feedback;
