"use client";
import Link from "next/link";
import { usePathname  } from "next/navigation";
import React from "react";
import { FaHome } from "react-icons/fa";
import { FiHome, FiAirplay, FiCoffee, FiBox ,FiMonitor , FiList, FiHardDrive , FiShoppingCart ,FiCalendar,FiToggleRight, FiShare2       } from "react-icons/fi";

const Navbar = () => {
  const pathname  = usePathname()
  const menu_1 = [
    {
      id: 0,
      name: "หน้าหลัก",
      icon: <FiHome size={18} />,
      path: "/admin",
      status: 0,
    },
    {
      id: 1,
      name: "หัวข้อประมูล",
      icon: <FiAirplay size={18} />,
      path: "/admin/data-default/title",
      status: 0,
    },
    {
      id: 2,
      name: "ข้อมูลผู้บริจาค",
      icon: <FiCoffee  size={18} />,
      path: "",
      status: 0,
    },
    {
      id: 3,
      name: "ข้อมูลสินค้า",
      icon: <FiBox  size={18} />,
      path: "",
      status: 0,
    },
  ];
  const menu_2 = [
    { id: 0, name: "ประมูล", icon: <FiMonitor  size={18} />, path: "", status: 3 },
    {
      id: 1,
      name: "รายการประมูล",
      icon: <FiList  size={18} />,
      path: "",
      status: 0,
    },
  ];

  const menu_3 = [
    {
      id: 0,
      name: "ขายสินค้า",
      icon: <FiShoppingCart   size={18} />,
      path: "",
      status: 3,
    },
    {
      id: 1,
      name: "รายการขายสินค้า",
      icon: <FiList size={18} />,
      path: "",
      status: 0,
    },
  ];
  const menu_4 = [
    {
      id: 0,
      name: "บัญชีลูกหนี้",
      icon: <FiHardDrive  size={18} />,
      path: "",
      status: 0,
    },
    {
      id: 1,
      name: "สรุปยอดขาย",
      icon: <FiCalendar  size={18} />,
      path: "",
      status: 0,
    },
    {
      id: 2,
      name: "จัดการผู้ใช้งาน",
      icon: <FiToggleRight size={18} />,
      path: "",
      status: 0,
    },
    { id: 3, name: "ส่งออก", icon: <FiShare2 size={18} />, path: "", status: 0 },
  ];

  return (
    <div className="">
      <aside className="w-64 h-full bg-white p-4 border-r-2 border-gray-200">
        <nav>
          <ul className="flex flex-col gap-1 ">
            {menu_1.map((item) => (
              <li
                key={item.id}
                className={`${pathname === item.path ? "bg-gradient-to-r from-red-700 to-red-500 text-white" : ""} px-4  py-1.5 hover:bg-red-100 rounded-md cursor-pointer`}
              >
                <Link
                  className="flex flex-row gap-2 items-center "
                  href={item.path}
                >
                  {" "}
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <hr className="text-black mt-3" />

          <ul className="flex flex-col gap-1 mt-3 ">
            {menu_2.map((item) => (
              <li
                key={item.id}
                className={`${pathname === item.path ? "bg-gradient-to-r from-red-700 to-red-500 text-white" : ""} px-4  py-1.5 hover:bg-red-100 rounded-md cursor-pointer`}
              >
                <Link
                  className="flex flex-row gap-2 items-center "
                  href={item.path}
                >
                  {" "}
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <hr className="text-black mt-3" />

          <ul className="flex flex-col gap-1 mt-3 ">
            {menu_3.map((item) => (
              <li
                key={item.id}
                className={`${pathname === item.path ? "bg-gradient-to-r from-red-700 to-red-500 text-white" : ""} px-4  py-1.5 hover:bg-red-100 rounded-md cursor-pointer`}
              >
                <Link
                  className="flex flex-row gap-2 items-center "
                  href={item.path}
                >
                  {" "}
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <hr className="text-black mt-3" />

          <ul className="flex flex-col gap-1 mt-3 ">
            {menu_4.map((item) => (
              <li
                key={item.id}
                className={`${pathname === item.path ? "bg-gradient-to-r from-red-700 to-red-500 text-white" : ""} px-4  py-1.5 hover:bg-red-100 rounded-md cursor-pointer`}
              >
                <Link
                  className="flex flex-row gap-2 items-center "
                  href={item.path}
                >
                  {" "}
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <hr className="text-black mt-3" />
        </nav>
      </aside>
    </div>
  );
};

export default Navbar;
