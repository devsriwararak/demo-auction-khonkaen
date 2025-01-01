"use client";
import React, { useEffect, useState } from "react";
import ReportSale from "./ReportSale";
import ReportProduct from "./ReportProduct";

interface PageProps {
  //   setPath: (path: string) => void;
}

const Page: React.FC<PageProps> = () => {
  const [path, setPath] = useState("1");

  // Functions

  return (
    <div>
      <div className="flex flex-row gap-4">
        <button
          onClick={() => setPath("1")}
          className={` ${path == "1" ? "bg-red-500 text-white" : "bg-none border border-red-500 text-red-600"} w-1/5 px-4 py-1   rounded-md`}
        >
          สรุปยอดขาย (ภาพรวม)
        </button>
        <button
          onClick={() => setPath("2")}
          className={` ${path == "2" ? "bg-red-500 text-white" : "bg-none border border-red-500 text-red-600"} w-1/5 px-4 py-1  rounded-md`}
        >
          สรุปรายการสินค้า
        </button>
      </div>

      {/* Contants */}
      <div className="mt-5">
        {path === "1" && <ReportSale />}
        {path === "2" && <ReportProduct />}
      </div>
    </div>
  );
};

export default Page;
