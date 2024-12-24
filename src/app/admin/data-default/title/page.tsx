'use client'
import React from "react";
import { FiAirplay } from "react-icons/fi";

const page = () => {
  return (
    <div>
      <div className="flex flex-row gap-3 items-center">
        <FiAirplay size={20} />
        <h1 className="text-xl">หัวข้อประมูล</h1>
      </div>

      <div>
        <input type="date" />
        <input type="date" />
        

        <input
            id="price"
            name="price"
            type="date"
            placeholder="0.00"
            className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
          />
      </div>
    </div>
  );
};

export default page;
