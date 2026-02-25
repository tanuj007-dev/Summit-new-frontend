import axios from "../../axiosConfig";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";

const ShowReview = ({ product_id }) => {
  const [reviews, setReviews] = useState([]);
  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `/ReviewsFetch.php`,
        {
          params: {
            product_id: product_id || undefined,
            // send only if available
          },
          withCredentials: true,
        }
      );

      if (response.data.status === "success") {
        setReviews(response.data.reviews);
        console.log(reviews);
      } else {
        setError(response.data.message || "Error fetching reviews.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load reviews.");
    }
  };
  useEffect(() => {
    fetchReviews();
  }, [product_id]);

  const counts = [0, 0, 0, 0, 0];
  const rate = reviews.map((item) => item.rating);
  const ratings = rate;
  ratings.forEach((star) => {
    if (star >= 1 && star <= 5) {
      counts[5 - star] += 1; // 5⭐ = index 0, 1⭐ = index 4
    }
  });
  reviews.forEach((item) => {
    console.log(item.rating);
  });

  const total = counts.reduce((a, b) => a + b, 0);
  return (
    <div className="space-y-3 w-full">
      {counts.map((count, index) => {
        const stars = 5 - index;
        const percent = total > 0 ? (count / total) * 100 : 0;

        return (
          <div
            key={stars}
            className="flex items-center space-x-4 text-sm w-full"
          >
            {/* Star row */}
            <div className="flex items-center space-x-1 w-[100px]">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < stars ? "text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>

            {/* Progress bar */}
            <div className="w-full h-3 bg-gray-200 rounded overflow-hidden">
              <div
                className="h-full bg-yellow-400 transition-all duration-300"
                style={{ width: `${percent}%` }}
              ></div>
            </div>

            {/* Count */}
            <div className="flex items-center space-x-1 w-[80px] justify-end">
              <FaArrowRight className="text-gray-500" />
              <span className="text-gray-700 font-medium">{count} people</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShowReview;
