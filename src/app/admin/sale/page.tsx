"use client";
import React from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import Select from "react-select";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const Page = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Left Section */}
      <section className="w-5/12 ">
        <div className="bg-white rounded-md shadow-lg px-6 py-4">
          <p className=" font-medium">เลือกผู้บริจาค</p>

          <div className="mt-3">
            <Select options={options} />
          </div>

          <div className="mt-6">
            <p>ชื่อ-สกุล</p>
            <p className=" text-sm font-light">xxxxxxxxxx xxxxxxxxxxxxxx</p>

            <p className="mt-4">สถานที่จัดส่ง</p>
            <p className=" text-sm font-light">11/11 อ.เมือง จ.ขอนแก่น 40000</p>

            <p className="mt-4">ผู้ติดต่อ</p>
            <p className=" text-sm font-light">นาย ทดสอบระบบ </p>

            <p className="mt-4">เบอร์โทร</p>
            <p className=" text-sm font-light">0850032649</p>
          </div>
        </div>

        <div className="bg-white rounded-md shadow-lg px-6 py-4 mt-4">
          <p className=" font-medium">รายละเอียด</p>
          <div className="flex flex-row gap-2 mt-4 items-end">
            <p>วันที่ : </p>
            <p className="font-light text-sm">26/12/2567 </p>
          </div>

          <p className="mt-4">ออกสลากในนาม : </p>
          <div className="flex flex-row gap-2 mt-3  items-end">
            <div className="w-full flex flex-col lg:flex-row gap-2">
              <p>บิลอ้างอิงเลขที่</p>
              <input
                type="text"
                className="bg-gray-100 w-24 rounded-md border border-gray-400"
              />
            </div>
            <div className="w-full flex flex-col lg:flex-row gap-2">
              <p>เล่มที่</p>
              <input
                type="text"
                className="bg-gray-100 w-24 rounded-md border border-gray-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Right Section */}
      <section className="w-7/12 ">
        <div className="bg-white rounded-md shadow-lg px-6 py-4">
          <div className="flex flex-row gap-2   ">
            <button className=" bg-gradient-to-r from-blue-600 to-blue-500 px-2 py-1.5 rounded-md text-white">
              เพิ่มผู้บริจาคใหม่
            </button>
            <button className=" bg-gradient-to-r from-blue-600 to-blue-500 px-2 py-1.5 rounded-md text-white">
              เพิ่มสินค้า
            </button>
            <button className=" bg-gradient-to-r from-blue-600 to-blue-500 px-2 py-1.5 rounded-md text-white">
              บันทึก
            </button>
            <button className=" bg-gradient-to-r from-blue-600 to-blue-500 px-2 py-1.5 rounded-md text-white">
              ยกเลิก
            </button>
            <button className=" bg-gradient-to-r from-blue-600 to-blue-500 px-2 py-1.5 rounded-md text-white">
              ชำระเงิน
            </button>
            <button className=" bg-gradient-to-r from-blue-600 to-blue-500 px-2 py-1.5 rounded-md text-white">
              ใบรับของ
            </button>
            <button className=" bg-gradient-to-r from-blue-600 to-blue-500 px-2 py-1.5 rounded-md text-white">
              ใบเสร็จ
            </button>
          </div>
        </div>

        <div className="bg-white rounded-md shadow-lg px-6 py-4 mt-4 h-[460px]">
          <div className="overflow-x-auto border rounded-lg  ">
            <table className="table-auto  w-full ">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-300  ">
                  <th className="px-4 py-3 text-start font-medium ">ชื่อ</th>
                  <th className="px-4 py-3 text-start font-medium ">จำนวน</th>
                  <th className="px-4 py-3 text-start font-medium ">
                    หน่วยนับ
                  </th>
                  <th className="px-4 py-3 text-start font-medium ">ลบ</th>
                </tr>
              </thead>

              <tbody className="">
                <tr className="">
                  <td className="px-4 py-3">สินค้า 004</td>
                  <td className="px-4 py-3 font-light text-gray-600">10</td>
                  <td className="px-4 py-3 font-light text-gray-600">ชิ้น</td>
                  <td className="px-4 py-3 font-light text-gray-600">
                    <FaRegTrashAlt size={18} className="text-red-500" />
                  </td>
                </tr>
                <tr className="">
                  <td className="px-4 py-3">สินค้า 005</td>
                  <td className="px-4 py-3 font-light text-gray-600">19</td>
                  <td className="px-4 py-3 font-light text-gray-600">อัน</td>
                  <td className="px-4 py-3 font-light text-gray-600">
                    <FaRegTrashAlt size={18} className="text-red-500" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
