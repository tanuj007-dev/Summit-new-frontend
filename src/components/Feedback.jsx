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
  <div className="bg-[#F5F5F7] rounded-2xl  p-6 flex flex-col justify-between h-[280px] md:h-[200px] border border-gray-100">
    {/* Star Ratings */}
    <div className="flex mb-3">
      {Array.from({ length: 5 }).map((_, i) =>
        i < item.rating ? (
          <FaStar key={i} className="text-[#E53935]" />
        ) : (
          <FaRegStar key={i} className="text-[#E53935]" />
        )
      )}
    </div>

    {/* Review Text */}
    <p className="text-gray-700 text-sm mb-6 leading-relaxed line-clamp-4">
      {item.review}
    </p>

    {/* User Info */}
    <div className="flex items-center mt-auto">
      <img
        src={item.image}
        alt={item.name}
        className="w-12 h-12 rounded-full object-cover mr-3"
      />
      <div>
        <p className="text-sm font-semibold">{item.name}</p>
        <p className="text-xs text-gray-500">{item.profession}</p>
      </div>
    </div>
  </div>
);

const Feedback = () => {
  return (
    <div className="py-12 bg-white">
      {/* Heading */}
      <div className="px-6 md:px-12 mb-8 text-start">
        <h2 className="text-3xl font-bold text-black">
          Hear It from Happy Kitchens
        </h2>
        <p className="text-gray-500 font-medium mt-2">
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
