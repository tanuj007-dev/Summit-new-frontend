import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import axios from "../../axiosConfig"; // <-- import axios

const ReviewTaken = ({ id, isLoggedIn }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [nickname, setNickname] = useState("");
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");

  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      alert("Please login first to submit a review.");
      return;
    }
    let newErrors = {};
    console.log(id);
    if (rating === 0) newErrors.rating = "Please select a star rating.";
    if (!nickname.trim()) newErrors.nickname = "Nickname is required.";
    if (!reason.trim()) newErrors.reason = "Reason is required.";
    if (!comment.trim()) newErrors.comment = "Comment is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const product_id = id; // Replace with actual product ID when dynamic

    const payload = {
      product_id,
      rating,
      nickname,
      reason,
      comment,
    };

    try {
      const response = await axios.post(
        "/feebacktake.php",
        JSON.stringify(payload),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200 && response.data.status === "success") {
        alert("Thanks for your feedback!");
        setRating(0);
        setNickname("");
        setReason("");
        setComment("");
      } else {
        alert(response.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to submit review.");
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div>
        {/* <p className="text-gray-800 font-normal">Submit A Review</p> */}
        <div className="flex items-center gap-4 text-gray-300">
          <p className="text-gray-400 text-base mt-2">Your Ratings:</p>
          <span className="flex group">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer ${
                  hover >= star || rating >= star
                    ? "text-[#EE9E13]"
                    : "text-gray-400"
                }`}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </span>
        </div>
        {errors.rating && (
          <p className="text-red-500 text-sm">{errors.rating}</p>
        )}
      </div>

      <div className=" flex gap-12 space-y-5">
        <div className="w-[50%]">
          <p className="text-gray-400 text-sm md:text-base mb-2">Nickname</p>
          <input
            type="text"
            className="rounded-md w-full bg-gray-200 h-10 p-2"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          {errors.nickname && (
            <p className="text-red-500 text-sm">{errors.nickname}</p>
          )}
        </div>

        <div className="w-[50%]">
          <p className="text-gray-400 text-sm md:text-base mb-2">
            Reason for your rating
          </p>
          <input
            type="text"
            className="rounded-md bg-gray-200 w-full h-10 p-2"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          {errors.reason && (
            <p className="text-red-500 text-sm">{errors.reason}</p>
          )}
        </div>
      </div>

      <div>
        <p className="text-gray-400 text-sm md:text-base mb-2">Comments</p>
        <textarea
          className="rounded-md bg-gray-200 w-full h-24 p-2"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        {errors.comment && (
          <p className="text-red-500 text-sm">{errors.comment}</p>
        )}
      </div>

      <div>
        <button
          className="bg-red-800 text-white text-sm p-2 rounded-md"
          onClick={handleSubmit}
        >
          Submit Your Review
        </button>
      </div>
    </div>
  );
};

export default ReviewTaken;
