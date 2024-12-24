"use client";
import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { CiCircleList } from "react-icons/ci";

type HeaderProps = {
  toggleNavbar: () => void;
};

const Header: React.FC<HeaderProps> = ({ toggleNavbar }) => {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      Swal.fire({
        title: "ออกจากระบบ ?",
        text: "คุณแน่ใจหรือไม่ที่จะออกจากระบบ !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "red",
        cancelButtonColor: "gray",
        confirmButtonText: "ออกจากระบบ",
        cancelButtonText: "ยกเลิก",
      }).then((result) => {
        if (result.isConfirmed) {
          Cookies.remove("auth_token");
          Cookies.remove("status");
          router.refresh();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white border-b-2 border-gray-200 shadow-lg">
      <div className="px-4 lg:px-6 py-4  flex flex-row gap-2 justify-between items-center  ">
        <div className="w-12 block lg:hidden ">
          <CiCircleList onClick={toggleNavbar} size={20} />
        </div>
        <div className="w-96 lg:w-full text-sm lg:text-md text-start    ">
          ระบบประมูลศาลเจ้าขอนแก่น
        </div>

        <div className="w-72 lg:w-full text-end  lg:text-start   ">
          <ul className="flex flex-row justify-end gap-4 lg:pr-8">
            <li className="flex flex-row gap-1 items-center cursor-pointer hover:bg-red-100 px-0 lg:px-4 py-1 hover:rounded-lg border-b-2 border-red-500 ">
              {" "}
              <FaSignOutAlt size={15} className="text-gray-600" />{" "}
              <p className="text-sm text-gray-700  " onClick={handleLogout}>
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
