import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF9F8] flex items-center justify-center px-4">
      <div className="max-w-5xl w-full text-center">
        {/* 404 Image */}
        <div className="mb-8 ml-10">
          <img 
            src="/asset/images/404.png" 
            alt="404 Not Found" 
            className="mx-auto size-65 object-cover "
          />
        </div>

        

        {/* Error Message */}
        <h2 className="text-3xl font-semibold text-[#DD2B1C] mb-4">
          Oops! Page Not Found
        </h2>
        
        <p className="text-lg text-gray-600 mb-4 max-w-md leading-snug mx-auto">
         Uh-oh! It seems like the page you are looking for is currently unavailable. Navigate to our homepage to discover our latest products and exclusive offers.
        </p>

        {/* Action Buttons */}
        <div className="flex sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-[#DD2B1C] text-white px-6 py-3 rounded-lg border-2 hover:border-[#DD2B1C] hover:bg-[#FAF9F8] hover:text-[#DD2B1C] transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Home size={20} />
            Go to Home
          </Link>
          
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-[#FAF9F8] border-2 border-[#DD2B1C] text-[#DD2B1C] px-6 py-3 rounded-lg hover:bg-[#DD2B1C] hover:text-[#FAF9F8] transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-12 text-xs sm:text-sm text-gray-500">
          <p>If you believe this is an error, please contact our support team</p>
          <p className="mt  -2">
            <Link to="/contact" className="text-[#DD2B1C] hover:text-[#DD2B1C] underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
