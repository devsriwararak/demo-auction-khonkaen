"use client";
import React, { useEffect, useState } from "react";
import { BsCartPlus, BsCashCoin } from "react-icons/bs";
import {  FaRegTrashAlt } from "react-icons/fa";
import { FiCoffee, FiPlus, FiPrinter, FiSave, FiSlash } from "react-icons/fi";
import { GoAlert } from "react-icons/go";
import { LuClipboardList } from "react-icons/lu";
import Select from "react-select";

const Page = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Left Section */}
      <section className="w-5/12 ">
        <div className="bg-white rounded-md shadow-lg px-6 py-4">
          <div className="flex flex-row gap-2 justify-between ">
            <div className="flex flex-row gap-2 items-center">
              <FiCoffee size={18} />
              <p className=" font-medium">เลือกผู้บริจาค</p>
            </div>

            <button className=" bg-gradient-to-r from-blue-600 to-blue-500 px-2 py-1.5 rounded-md text-white flex gap-1 items-center">
              <FiPlus size={18} />
              เพิ่มผู้บริจาค
            </button>
          </div>

          <div className="mt-3">
            {isClient ? <Select options={options} /> : null}
          </div>

          <div className="mt-6">
            <p>ชื่อ-สกุล</p>
            <p className=" text-sm font-light">นาย ณัฐวุฒิ ศรีน้ำเงินเข้ม</p>

            <p className="mt-4">สถานที่จัดส่ง</p>
            <p className=" text-sm font-light">
              11/11 ต.คนในเมือง อ.เมือง จ.ขอนแก่น 40000
            </p>

            <p className="mt-4">ผู้ติดต่อ</p>
            <p className=" text-sm font-light">นาย ทดสอบระบบ โดยเทสเตอร์ </p>

            <p className="mt-4">เบอร์โทร</p>
            <p className=" text-sm font-light">0850032649</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col lg:flex-row gap-2">
          <div className="bg-white rounded-md shadow-lg w-1/3 px-4 py-2 flex flex-col items-center justify-center">
            <h2 className="text-xl text-center text-gray-700 font-light">ฟีเจอร์ใหม่</h2>
            <h2 className="text-4xl mt-2 text-center">เร็วๆ นี้</h2>

          </div>
          <div className="bg-white rounded-md shadow-lg w-2/3 px-4 py-4">
            <ul className=" font-light text-gray-700 text-base">
              <li>- ชำระเงินผ่านพร้อมเพย์ / โมบายแบงก์กิ้ง</li>
              <li>- ระบบวิเคราะห์ยอดขายอัจฉริยะ</li>
              <li>- สร้างบิลแบบ Dynamic QR Code</li>
              <li>- แจ้งเตือนผ่านหลายช่องทาง ในเวลาเดียวกัน</li>
              <li>- ระบบบันทึกภาษีและ e-Tax Invoice</li>
              <li>- สร้างบิลอัตโนมัติจากคำสั่งซื้อออนไลน์ จากทุกที่</li>
              <li>- ระบบป้องกันการทุจริต</li>
            </ul>
          </div>

        </div>
      </section>

      {/* Right Section */}
      <section className="w-7/12 ">
        <div className="bg-white rounded-md shadow-lg px-6 py-4  ">
          <div className="flex flex-row gap-2 items-center justify-between">
            <div className="flex flex-row gap-2 items-center w-full">
              <BsCartPlus size={18} />
              <p className=" font-medium">รายการสินค้า</p>
            </div>

            <div className="w-full flex justify-end">
              <button className=" bg-gradient-to-r from-blue-600 to-blue-500 px-2 py-1.5 rounded-md text-white flex gap-1 items-center">
                <FiPlus size={18} /> เพิ่มสินค้า
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border rounded-lg  mt-4  h-80">
            <table className="table-auto text-sm w-full ">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-300   ">
                  <th className="px-4 py-3 text-start font-medium ">ชื่อ</th>
                  <th className="px-4 py-3 text-start font-medium ">จำนวน</th>
                  <th className="px-4 py-3 text-start font-medium ">
                    หน่วยนับ
                  </th>
                  <th className="px-4 py-3 text-start font-medium ">
                    ราคา/หน่วย
                  </th>
                  <th className="px-4 py-3 text-start font-medium ">ราคารวม</th>

                  <th className="px-4 py-3 text-start font-medium ">ลบ</th>
                </tr>
              </thead>

              <tbody className="">
                <tr className="">
                  <td className="px-4 py-3">แอปเปิ้ลแดง</td>
                  <td className="px-4 py-3 font-light text-gray-600">10</td>
                  <td className="px-4 py-3 font-light text-gray-600">ลูก</td>
                  <td className="px-4 py-3 font-light text-gray-600">5</td>
                  <td className="px-4 py-3 font-light text-gray-600">50</td>
                  <td className="px-4 py-3 font-light text-gray-600">
                    <FaRegTrashAlt size={18} className="text-red-500" />
                  </td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="px-4 py-3">โทรศัพท์มือถือ</td>
                  <td className="px-4 py-3 font-light text-gray-600">2</td>
                  <td className="px-4 py-3 font-light text-gray-600">
                    เครื่อง
                  </td>
                  <td className="px-4 py-3 font-light text-gray-600">5</td>
                  <td className="px-4 py-3 font-light text-gray-600">50</td>
                  <td className="px-4 py-3 font-light text-gray-600">
                    <FaRegTrashAlt size={18} className="text-red-500" />
                  </td>
                </tr>
                <tr className="">
                  <td className="px-4 py-3">แตงโมสุกสีเขียว</td>
                  <td className="px-4 py-3 font-light text-gray-600">20</td>
                  <td className="px-4 py-3 font-light text-gray-600">ลูก</td>
                  <td className="px-4 py-3 font-light text-gray-600">15</td>
                  <td className="px-4 py-3 font-light text-gray-600">300</td>
                  <td className="px-4 py-3 font-light text-gray-600">
                    <FaRegTrashAlt size={18} className="text-red-500" />
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3">น้ำยาล้างจาน</td>
                  <td className="px-4 py-3 font-light text-gray-600">6</td>
                  <td className="px-4 py-3 font-light text-gray-600">ขวด</td>
                  <td className="px-4 py-3 font-light text-gray-600">28</td>
                  <td className="px-4 py-3 font-light text-gray-600">168</td>
                  <td className="px-4 py-3 font-light text-gray-600">
                    <FaRegTrashAlt size={18} className="text-red-500" />
                  </td>
                </tr>
                <tr className="">
                  <td className="px-4 py-3">คอมพิวเตอร์ตั้งโต๊ะ</td>
                  <td className="px-4 py-3 font-light text-gray-600">1</td>
                  <td className="px-4 py-3 font-light text-gray-600">
                    เครื่อง
                  </td>
                  <td className="px-4 py-3 font-light text-gray-600">14,000</td>
                  <td className="px-4 py-3 font-light text-gray-600">14,000</td>
                  <td className="px-4 py-3 font-light text-gray-600">
                    <FaRegTrashAlt size={18} className="text-red-500" />
                  </td>
                </tr>
                <tr className="">
                  <td className="px-4 py-3">ปลั๊กไฟอย่างดีย์</td>
                  <td className="px-4 py-3 font-light text-gray-600">2</td>
                  <td className="px-4 py-3 font-light text-gray-600">
                    เครื่อง
                  </td>
                  <td className="px-4 py-3 font-light text-gray-600">350</td>
                  <td className="px-4 py-3 font-light text-gray-600">700</td>
                  <td className="px-4 py-3 font-light text-gray-600">
                    <FaRegTrashAlt size={18} className="text-red-500" />
                  </td>
                </tr>
                <tr className="">
                  <td className="px-4 py-3">กางเกงยีนส์</td>
                  <td className="px-4 py-3 font-light text-gray-600">20</td>
                  <td className="px-4 py-3 font-light text-gray-600">ตัว</td>
                  <td className="px-4 py-3 font-light text-gray-600">1,000</td>
                  <td className="px-4 py-3 font-light text-gray-600">20,000</td>
                  <td className="px-4 py-3 font-light text-gray-600">
                    <FaRegTrashAlt size={18} className="text-red-500" />
                  </td>
                </tr>
                <tr className="">
                  <td className="px-4 py-3">ชาวนากับงูเห่า</td>
                  <td className="px-4 py-3 font-light text-gray-600">4</td>
                  <td className="px-4 py-3 font-light text-gray-600">ตัว</td>
                  <td className="px-4 py-3 font-light text-gray-600">500</td>
                  <td className="px-4 py-3 font-light text-gray-600">2,000</td>
                  <td className="px-4 py-3 font-light text-gray-600">
                    <FaRegTrashAlt size={18} className="text-red-500" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex flex-row gap-8 mt-5 ">
            <div className="w-2/3">
              <div className="flex flex-row gap-2  justify-end items-end w-full   ">
                <div className="w-full flex flex-col lg:flex-row gap-2">
                  <p>บิลอ้างอิงเลขที่</p>
                  <input
                    type="text"
                    className="bg-gray-50 w-24 rounded-md border border-gray-300 px-4"
                    placeholder="0"
                  />
                </div>
                <div className="w-full flex flex-col lg:flex-row gap-2">
                  <p>เล่มที่</p>
                  <input
                    type="text"
                    className="bg-gray-50 w-24 rounded-md border border-gray-300 px-4"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex flex-row gap-2 items-center w-1/3 mt-6 ">
                <GoAlert size={18} />
                <p className=" font-medium">หมายเหตุ</p>
              </div>
              <textarea
                name=""
                className="w-full  mt-3 bg-gray-100 rounded-md px-4 py-2.5 border border-gray-300"
                id=""
                placeholder="กรอกหมายเหตุ"
              ></textarea>
            </div>
            <div className="w-1/3">
              <div className="flex flex-row gap-2 items-center">
                <LuClipboardList size={18} />
                <p className=" font-medium">รายละเอียด</p>
              </div>

              <div className="flex flex-row gap-2 mt-4 items-end">
                <p>วันที่ : </p>
                <p className="font-light text-sm">26/12/2567 </p>
              </div>

              <div className="flex flex-row gap-2 mt-2 items-end justify-between">
                <p>ออกสลากในนาม : </p>
                <p className="font-light text-sm">คุณนาย ชัยภูมิ </p>
              </div>

              <div className="flex flex-row gap-2 mt-2 items-end justify-between">
                <p>จำนวนทั้งหมด : </p>
                <p className="font-light text-sm">60 รายการ </p>
              </div>

              <div className="flex flex-row gap-2 mt-2 items-end justify-between">
                <p>ราคาทั้งหมด : </p>
                <p className="font-light text-sm">4,000 บาท </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-2 mt-4 justify-end items-end">
          <button className=" bg-gradient-to-r from-green-600 to-green-500 px-2 py-1.5 rounded-md text-white flex gap-1 items-center">
            <FiSave size={18} />
            บันทึก
          </button>
          <button className=" bg-gradient-to-r from-red-500 to-red-400 px-2 py-1.5 rounded-md text-white flex gap-1 items-center">
            <FiSlash size={18} />
            ยกเลิกบิล
          </button>

          <button className=" bg-gradient-to-r from-blue-500 to-blue-400 px-2 py-1.5 rounded-md text-white flex gap-1 items-center">
            <BsCashCoin size={18} />
            ชำระเงิน
          </button>
          <button className=" bg-gradient-to-r from-yellow-500 to-yellow-400 px-2 py-1.5 rounded-md text-white flex gap-1 items-center">
            <FiPrinter size={18} />
            ใบรับของ
          </button>
          <button className=" bg-gradient-to-r from-yellow-500 to-yellow-300 px-2 py-1.5 rounded-md text-white flex gap-1 items-center">
            <FiPrinter  size={18} />
            ใบเสร็จ
          </button>
        </div>
      </section>
    </div>
  );
};

export default Page;
