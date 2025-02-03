"use client";
import React from "react";
import { CiCircleList } from "react-icons/ci";
import HeaderProfile from "./HeaderProfile";

type HeaderProps = {
  toggleNavbar: () => void;
};

const Header: React.FC<HeaderProps> = ({ toggleNavbar }) => {

  return (
    <div className="bg-white border-b-2 border-gray-200 shadow-lg">
      <div className="px-4 lg:px-6 py-4  flex flex-row gap-2 justify-between items-center  ">
        <div className="w-12 block lg:hidden ">
          <CiCircleList onClick={toggleNavbar} size={20} />
        </div>
        <div className="  w-96 lg:w-full text-sm lg:text-xl text-start     ">
          ระบบประมูลศาลเจ้าขอนแก่น
        </div>

        <div className="w-72 lg:w-full text-end  lg:text-start   ">
          <div className="flex flex-row justify-end lg:pr-16">
            <HeaderProfile />
          </div>
          {/* <ul className="flex flex-row justify-end gap-4 lg:pr-8">
            <li className="flex flex-row gap-1 items-center cursor-pointer hover:bg-red-100 px-0 lg:px-4 py-1 hover:rounded-lg border-b-2 border-red-500 ">
              {" "}
              <FaSignOutAlt size={15} className="text-gray-600" />{" "}
              <p className="text-sm text-gray-700  " onClick={handleLogout}>
                ออกจากระบบ
              </p>
            </li>
          </ul> */}
        </div>
      </div>
    </div>
  );
};

export default Header;
