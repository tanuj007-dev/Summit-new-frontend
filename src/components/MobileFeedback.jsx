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
      "As someone who loves experimenting with recipes, this brand's grinder and cookware collection perfectly blend durability with style. It's now my kitchen essential!",
    rating: 4,
    image: "/asset/images/feedback/feed3.png",
  },
  {
    name: "Vikas Singh",
    profession: "Food Enthusiast",
    review:
      "As someone who loves experimenting with recipes, this brand's grinder and cookware collection perfectly blend durability with style. It's now my kitchen essential!",
    rating: 5,
    image: "/asset/images/feedback/feed2.png",
  },
  {
    name: "Sneha Gupta",
    profession: "Baker & YouTuber",
    review:
      "As someone who loves experimenting with recipes, this brand's grinder and cookware collection perfectly blend durability with style. It's now my kitchen essential!",
    rating: 4,
    image: "/asset/images/feedback/feed3.png",
  },
];

const MobileFeedbackCard = ({ item }) => (
  <div className="bg-[#F5F5F7] rounded-2xl p-4 py-6 flex flex-col justify-between h-[190px] border border-gray-100 md:hidden">
    {/* Star Ratings */}
    <div className="flex mb-3">
      {Array.from({ length: 5 }).map((_, i) =>
        i < item.rating ? (
          <FaStar key={i} className="text-[#E53935] text-sm" />
        ) : (
          <FaRegStar key={i} className="text-[#E53935] text-sm" />
        )
      )}
    </div>

    {/* Review Text */}
    <p className="text-gray-700 text-xs mb-4 leading-relaxed line-clamp-3">
      {item.review}
    </p>

    {/* User Info */}
    <div className="flex items-center">
      <img
        src={item.image}
        alt={item.name}
        className="w-10 h-10 rounded-full object-cover mr-3"
      />
      <div className="">
        <p className="text-xs font-semibold">{item.name}</p>
        <p className="text-xs text-gray-500">{item.profession}</p>
      </div>
    </div>
  </div>
);

const MobileFeedback = () => {
  return (
    <div className="py-8 bg-white">
      {/* Heading */}
      <div className="px-4 mb-6 md:hidden">
        <h2 className="text-xl text-center font-bold text-black">
          Hear It from Happy Kitchens
        </h2>
        <p className="text-gray-500 text-center text-sm font-medium mt-2">
          Real reviews from Amazon, Flipkart, and more — see why Indian cooks trust Summit every day.
        </p>
      </div>

      {/* Row 1 - Left to Right */}
      <Swiper
        modules={[Autoplay]}
        spaceBetween={16}
        slidesPerView={1.2}
        loop={true}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          reverseDirection: false,
        }}
        speed={6000}
      >
        {feedbackArray.map((item, i) => (
          <SwiperSlide key={i}>
            <MobileFeedbackCard item={item} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Row 2 - Right to Left */}
      <div className="mt-8">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={16}
          slidesPerView={1.2}
          loop={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            reverseDirection: true,
          }}
          speed={5000}
        >
          {feedbackArray.map((item, i) => (
            <SwiperSlide key={i}>
              <MobileFeedbackCard item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default MobileFeedback;
