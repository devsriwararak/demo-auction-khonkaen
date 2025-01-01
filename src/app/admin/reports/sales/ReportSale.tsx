import React from "react";
import { FcMoneyTransfer, FcShop } from "react-icons/fc";

const ReportSale = () => {
  return (
    <div>
      <div className="flex flex-row gap-4 items-center justify-start">
        <div className="w-1/5">
          <p className="text-sm text-gray-600">วันที่เริ่มต้น</p>
          <input
            type="date"
            className="border border-gray-200 rounded-md shadow-md px-4 py-1 w-full"
          />
        </div>
        <div className="w-1/5">
          <p className="text-sm text-gray-600">วันที่สิ้นสุด</p>
          <input
            type="date"
            className="border border-gray-200 rounded-md shadow-md px-4 py-1 w-full"
          />
        </div>
      </div>

      {/* Contents */}

      <div className="flex flex-col lg:flex-row gap-4 mt-8">
        <div className="w-full ">
          <div className="flex flex-row gap-4 px-4 py-6 border border-gray-300 rounded-md shadow-sm">
            <div className="w-1/3 flex flex-col justify-center items-center">
              <FcMoneyTransfer size={100} />
              <hr className="text-gray-700 " />
              <p className="text-xl ">เล่มประมูล</p>
            </div>
            <div className="w-2/3 flex flex-col items-start justify-center">
              <p className="text-2xl"> เงินสด 0 บาท</p>
              <hr className="text-gray-500 w-52 my-4" />
              <p className="text-2xl"> เงินเชื่อ 0 บาท</p>
            </div>
          </div>

          <div className="flex flex-row gap-4 px-4 py-6 border border-gray-300 rounded-md shadow-sm mt-4">
            <div className="w-1/3 flex flex-col justify-center items-center">
              <FcShop size={100} />
              <hr className="text-gray-700 " />
              <p className="text-xl ">เล่มขายสินค้า</p>
            </div>
            <div className="w-2/3 flex flex-col items-start justify-center">
              <p className="text-2xl"> เงินสด 0 บาท</p>
              <hr className="text-gray-500 w-52 my-4" />
              <p className="text-2xl"> เงินเชื่อ 0 บาท</p>
            </div>
          </div>
        </div>
        <div className="w-full px-4 py-3 border border-gray-300 shadow-sm rounded-md flex flex-col justify-center items-center">
          <p className="text-2xl">รวมข้อมูลเล่มประมูล และ เล่มขายสินค้า</p>

          <div className="mt-4">
            <p className="text-xl">เงินสด 0 บาท</p>
            <hr className="text-gray-500 my-3" />
            <p className="text-xl">เงินเชื่อ 0 บาท</p>
          </div>

          <div className="mt-8">
            <hr className=" border border-gray-300  w-96 " />

            <p className="text-xl mt-4 text-center"> รวมเป็นเงิน 0 บาท </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSale;
