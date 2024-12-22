"use client";
import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      Cookies.remove("auth_token");
      Cookies.remove("status");
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white border-b-2 border-gray-200 shadow-lg">
      <div className="px-6 py-4  flex flex-row justify-between items-center  ">
        <div className="w-full text-md">ระบบประมูลศาลเจ้าขอนแก่น</div>

        <div className="w-full text-start">
          <ul className="flex flex-row justify-end gap-4 pr-8">
            <li className="flex flex-row gap-1 items-center">
              {" "}
              <FaSignOutAlt size={15} className="text-gray-600" />{" "}
              <p className="text-sm text-gray-700" onClick={handleLogout}>
                ออกจากระบบ
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
