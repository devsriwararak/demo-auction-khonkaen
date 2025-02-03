
"use client";
import React, { memo } from "react";

interface MenuItemsProps {
  item: {
    id: number;
    name: string;
    icon: React.ReactNode;
    path: string;
    status: number;
  };
  pathname: string;
  toggleNavbar: () => void;
}

const Menuitems: React.FC<MenuItemsProps> = memo(
  ({ item, pathname, toggleNavbar }) => {
    
    return (
      <li
        className={`${
            pathname === item.path
            ? "bg-gradient-to-r from-red-700 to-red-500 text-white"
            : ""
        } px-4 py-1.5 hover:bg-red-100 rounded-md cursor-pointer text-sm`}
      >
        <a
          className="flex flex-row gap-2 items-center"
          href={item.path}
          onClick={toggleNavbar}
        >
          {item.icon}
          {item.name}
        </a>
      </li>
    );
  }
);

Menuitems.displayName = "Menuitems"
export default Menuitems;
