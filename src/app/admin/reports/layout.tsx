"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SlChart, SlOrganization } from "react-icons/sl";

export default function SaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  return (
    <div>
      <ul className="flex flex-row gap-6 items-center">
        <li>
          <Link
            className={`${
              pathName === "/admin/reports/sales"
                ? "border-b-2 border-red-500 pb-1  "
                : ""
            } flex flex-row gap-2 items-center `}
            href="/admin/reports/sales"
          >
            <SlChart  size={18} />
            รายงานสรุปยอดขาย
          </Link>
        </li>
        <li>
          <Link
            className={`${
              pathName === "/admin/reports/login"
                ? "border-b-2 border-red-500 pb-1 "
                : ""
            }  flex flex-row gap-2 items-center `}
            href="/admin/reports/login"
          >
            <SlOrganization  size={18} />
            ประวัตืการเข้าสู่ระบบ
          </Link>
        </li>
      </ul>

      <div className="mt-6 border border-gray-200  bg-white shadow-lg rounded-md px-4 py-4">
        {children}
      </div>
    </div>
  );
}
