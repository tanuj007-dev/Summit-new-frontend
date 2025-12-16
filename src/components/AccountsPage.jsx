import React, { useEffect, useState } from "react";
import { FaPencilAlt, FaMapMarkerAlt } from "react-icons/fa";

import axios from "../axiosConfig";

const AccountsPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(
          "/getUserInfo.php",
          {
            withCredentials: true, // important to send cookies/session
          }
        );

        if (res.data.status === "success") {
          setUserInfo(res.data.data);
        } else {
          setMsg(res.data.message || "Failed to fetch user info.");
        }
      } catch (error) {
        console.error(error);
        setMsg("Something went wrong while fetching user info.");
      }
    };

    fetchUserInfo();
  }, []);

  if (msg) {
    return <p style={{ color: "red" }}>{msg}</p>;
  }

  if (!userInfo) {
    return <p>Loading your info...</p>;
  }

  return (
    <div className="">
      <div className="flex items-center">
        <div>
          <img src="/asset/images/user.png" alt="" className="w-22 mt-1" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-600">
            Hey, {userInfo.name}
          </h2>
          <p className="flex text-gray-500 text-sm">
            Email: {userInfo.email}, Phone: {userInfo.contact}{" "}
            <FaPencilAlt className="ml-3" />
          </p>
        </div>
      </div>
      <div className="border-t border-gray-300 mt-2 w-full" />
      <div className="py-5">
        <div className=" border border-gray-300 bg-gray-100 w-1/3 h-18 rounded-md flex flex-col items-center justify-center">
          <p className="flex items-center text-gray-500">
            <FaMapMarkerAlt className="text-gray-400" /> {userInfo.address}
          </p>
        </div>
        <div className="border border-gray-300 bg-gray-100 w-1/6 mt-5 rounded-md flex flex-col items-center justify-center">
          <p className="flex items-center text-gray-500 py-1 text-sm ">
            + ADD NEW ADDRESS
          </p>
        </div>
      </div>

      <div className="border-t border-gray-300 mt-2 w-full" />
    </div>
  );
};

export default AccountsPage;
