
"use client";
import Link from "next/link";
import React, { memo } from "react";
import { usePathname } from "next/navigation";


interface MenuItemsProps {
  item: {
    id: number;
    name: string;
    icon: React.ReactNode;
    path: string[];
    status : number[];
    
  };
  toggleNavbar: () => void;
  checkStatus: number | null ;

}

const Menuitems: React.FC<MenuItemsProps> = memo(
  ({ item, toggleNavbar, checkStatus }) => {
    
    const pathname = usePathname();

    if(!item.status.includes(checkStatus as number)){
      return null
    }
    
    return (
      <li
        className={`${
            item.path.includes(pathname)
            ? "bg-gradient-to-r from-red-700 to-red-500 text-white"
            : ""
        } px-4 py-1.5 hover:bg-red-100 rounded-md cursor-pointer text-sm`}
      >
        <Link
          className="flex flex-row gap-2 items-center"
          href={item.path[0]}
          onClick={toggleNavbar}
        >
          {item.icon}
          {item.name}
        </Link>
      </li>
    );
  }
);

Menuitems.displayName = "Menuitems"
export default Menuitems;
