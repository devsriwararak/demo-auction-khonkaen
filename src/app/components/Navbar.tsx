// เวลาเปลี่ยนเมนูทำไมช้าจัง

"use client";
import { usePathname } from "next/navigation";
import React from "react";
import {
  FiHome,
  FiAirplay,
  FiCoffee,
  FiBox,
  FiMonitor,
  FiList,
  FiHardDrive,
  FiShoppingCart,
  FiCalendar,
  FiToggleRight,
  FiShare2,
} from "react-icons/fi";
import Menuitems from "./Menuitems";

type NavbarProps = {
  toggleNavbar: () => void;
};
const Navbar: React.FC<NavbarProps> = ({ toggleNavbar }) => {
  const pathname = usePathname();

  const menus = [
    {
      title: "เมนูหลัก",
      items: [
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
          icon: <FiCoffee size={18} />,
          path: "/admin/data-default/customer",
          status: 0,
        },
        {
          id: 3,
          name: "ข้อมูลสินค้า",
          icon: <FiBox size={18} />,
          path: "/admin/data-default/stocks",
          status: 0,
        },
      ],
    },
    {
      title: "การประมูล",
      items: [
        {
          id: 0,
          name: "ประมูล",
          icon: <FiMonitor size={18} />,
          path: "/admin/auction",
          status: 3,
        },
        {
          id: 1,
          name: "รายการประมูล",
          icon: <FiList size={18} />,
          path: "/admin/auction/list",
          status: 0,
        },
      ],
    },
    {
      title: "ขายสินค้า",
      items: [
        {
          id: 0,
          name: "ขายสินค้า",
          icon: <FiShoppingCart size={18} />,
          path: "/admin/sale",
          status: 3,
        },
        {
          id: 1,
          name: "รายการขายสินค้า",
          icon: <FiList size={18} />,
          path: "",
          status: 0,
        },
      ],
    },
    {
      title: "รายงาน",
      items: [
        {
          id: 0,
          name: "บัญชีลูกหนี้",
          icon: <FiHardDrive size={18} />,
          path: "/admin/",
          status: 0,
        },
        {
          id: 1,
          name: "สรุปยอดขาย",
          icon: <FiCalendar size={18} />,
          path: "/admin/reports",
          status: 0,
        },
        {
          id: 2,
          name: "จัดการผู้ใช้งาน",
          icon: <FiToggleRight size={18} />,
          path: "/admin/sale",
          status: 0,
        },
        {
          id: 3,
          name: "ส่งออก",
          icon: <FiShare2 size={18} />,
          path: "/admin/",
          status: 0,
        },
      ],
    },
  ];

  return (
    <div className="">
      <div className="w-64 h-full bg-white p-4 border-r-2 border-gray-200">
        {menus.map((menu, index) => (
          <div key={index} className={`${index === 0 ?"mt-0" : "mt-4"}`}>
            <h3 className="text-base font-medium flex flex-row  items-center gap-2">{menu.title}  <span className="flex-grow border-t border-gray-300 ml-2"></span></h3>
            <ul className="flex flex-col gap-1 mt-2">
              {menu.items.map((item) => (
                <Menuitems
                  key={item.id}
                  item={item}
                  pathname={pathname}
                  toggleNavbar={toggleNavbar}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
