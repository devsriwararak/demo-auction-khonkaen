import React from "react";
import {
  FaMobileAlt,
  FaPrayingHands,
  FaRegEdit,
  FaRegSave,
  FaRegTrashAlt,
} from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { RiNumber1, RiNumber2, RiNumber3 } from "react-icons/ri";
import { TbWorldCancel } from "react-icons/tb";


const page = () => {
  return (
    <div className="flex flex-row gap-8">
      {/* LEFT SECTION */}
      <div className="w-4/6">
        <div className="bg-white shadow-md rounded-md px-5 py-4">
          <div className="flex flex-col lg:flex-row gap-0 items-center justify-between">
            <div className="w-1/3 flex flex-col gap-2 justify-start items-start  ">
              <label htmlFor="" className="text-sm">
                เลือกหัวข้อประมูล
              </label>
              <select className="bg-gray-100 w-52 px-4 py-1 rounded-lg border border-gray-300">
                <option value="">111</option>
                <option value="">111</option>
              </select>
            </div>
            <div className="w-2/3 flex flex-row gap-2 justify-end">
              <button className="text-sm bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-2 rounded-md flex flex-row gap-2 items-center">
              <MdOutlineAddShoppingCart size={18}  /> เพิ่มสินค้าใหม่
              </button>
              <button className="text-sm bg-gradient-to-r from-green-600 to-green-500 text-white px-3 py-2 rounded-md flex flex-row gap-2 items-center">
              <FiUserPlus size={18}  /> เพิ่มผู้บริจาคใหม่
              </button>
              <button className="text-sm bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-2 rounded-md flex flex-row gap-2 items-center">
              <TbWorldCancel size={18}  /> เคลียห้องประมูล
              </button>
            </div>
          </div>

          <div className="flex flex-row gap-4 mt-6">
            <div className="w-1/3">
              <p className="text-sm">ฉลากออมสิน / หน่วย</p>
              <input
                type="text"
                placeholder="ฉลากออมสิน"
                className="bg-gray-100 px-4 py-1.5 rounded-md border border-gray-300 mt-2 w-full"
              />
            </div>

            <div className="w-1/3">
              <p className="text-sm">ล็อตเตอรี่ / ใบ</p>
              <input
                type="text"
                placeholder="ล็อตเตอรี่"
                className="bg-gray-100 px-4 py-1.5 rounded-md border border-gray-300 mt-2 w-full"
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-md px-5 py-4 mt-4 overflow-y-scroll">
          {/* Start วัตถุมงคล */}
          <div className="flex flex-row gap-4">
            <div className="w-1/4 flex flex-col justify-center items-center">
              วัตถุมงคล
              <FaPrayingHands
                className="bg-red-100 p-2 rounded-md mt-2"
                size={70}
              />
            </div>
            <div className="w-3/4">
              <div className="overflow-x-auto border rounded-lg  ">
                <table className="table-auto  w-full ">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-300  ">
                      <th className="px-4 py-3 text-start font-medium ">
                        ชื่อ
                      </th>
                      <th className="px-4 py-3 text-start font-medium ">
                        จำนวน
                      </th>
                      <th className="px-4 py-3 text-start font-medium ">
                        หน่วยนับ
                      </th>
                      <th className="px-4 py-3 text-start font-medium ">ลบ</th>
                    </tr>
                  </thead>

                  <tbody className="">
                    <tr className="">
                      <td className="px-4 py-3">สินค้า 001</td>
                      <td className="px-4 py-3 font-light text-gray-600">10</td>
                      <td className="px-4 py-3 font-light text-gray-600">
                        ชิ้น
                      </td>
                      <td className="px-4 py-3 font-light text-gray-600">
                        <FaRegTrashAlt size={18} className="text-red-500" />
                      </td>
                    </tr>
                    <tr className="">
                      <td className="px-4 py-3">สินค้า 002</td>
                      <td className="px-4 py-3 font-light text-gray-600">20</td>
                      <td className="px-4 py-3 font-light text-gray-600">
                        ชิ้น
                      </td>
                      <td className="px-4 py-3 font-light text-gray-600">
                        <FaRegTrashAlt size={18} className="text-red-500" />
                      </td>
                    </tr>
                    <tr className="">
                      <td className="px-4 py-3">สินค้า 003</td>
                      <td className="px-4 py-3 font-light text-gray-600">30</td>
                      <td className="px-4 py-3 font-light text-gray-600">
                        ชิ้น
                      </td>
                      <td className="px-4 py-3 font-light text-gray-600">
                        <FaRegTrashAlt size={18} className="text-red-500" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* End วัตถุมงคล */}
          <hr className="my-6" />

          {/* Start โทรศัพท์ */}
          <div className="flex flex-row gap-4">
            <div className="w-1/4 flex flex-col justify-center items-center">
              โทรศัพท์
              <FaMobileAlt
                className="bg-red-100 p-2 rounded-md mt-2"
                size={70}
              />
            </div>
            <div className="w-3/4">
              <div className="overflow-x-auto border rounded-lg  ">
                <table className="table-auto  w-full ">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-300  ">
                      <th className="px-4 py-3 text-start font-medium ">
                        ชื่อ
                      </th>
                      <th className="px-4 py-3 text-start font-medium ">
                        จำนวน
                      </th>
                      <th className="px-4 py-3 text-start font-medium ">ลบ</th>
                    </tr>
                  </thead>

                  <tbody className="">
                    <tr className="">
                      <td className="px-4 py-3">สินค้า 004</td>
                      <td className="px-4 py-3 font-light text-gray-600">10</td>
                      <td className="px-4 py-3 font-light text-gray-600">
                        ชิ้น
                      </td>
                      <td className="px-4 py-3 font-light text-gray-600">
                        <FaRegTrashAlt size={18} className="text-red-500" />
                      </td>
                    </tr>
                    <tr className="">
                      <td className="px-4 py-3">สินค้า 005</td>
                      <td className="px-4 py-3 font-light text-gray-600">19</td>
                      <td className="px-4 py-3 font-light text-gray-600">
                        อัน
                      </td>
                      <td className="px-4 py-3 font-light text-gray-600">
                        <FaRegTrashAlt size={18} className="text-red-500" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* End วัตถุมงคล */}
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-2/6 flex flex-col gap-4">
        <div className="bg-white shadow-md rounded-md h-3/4 px-4 py-4">
          <div className="overflow-x-auto border rounded-lg  ">
            <table className="table-auto  w-full ">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-300  ">
                  <th className="px-4 py-3 text-start font-medium ">ลำดับ</th>
                  <th className="px-4 py-3 text-start font-medium ">
                    ผู้บริจาค
                  </th>
                  <th className="px-4 py-3 text-start font-medium ">
                    จำนวนเงิน
                  </th>
                  <th className="px-4 py-3 text-start font-medium ">แก้ไข</th>
                </tr>
              </thead>

              <tbody className="">
                <tr className="">
                  <td className="px-4 py-3 font-light text-gray-600">1</td>
                  <td className="px-4 py-3">นายณัฐวุฒิ ศรีวรารักษ์</td>
                  <td className="px-4 py-3 font-light text-gray-600">500</td>
                  <td className="px-4 py-3 font-light text-gray-600">
                    <FaRegEdit size={18} className="text-blue-500" />
                  </td>
                </tr>
                <tr className="">
                  <td className="px-4 py-3 font-light text-gray-600">2</td>
                  <td className="px-4 py-3">บ. เดฟศรีวรารักษ์</td>
                  <td className="px-4 py-3 font-light text-gray-600">200</td>
                  <td className="px-4 py-3 font-light text-gray-600">
                    <FaRegEdit size={18} className="text-blue-500" />
                  </td>
                </tr>
                <tr className="">
                  <td className="px-4 py-3 font-light text-gray-600">3</td>
                  <td className="px-4 py-3">สินค้า 004</td>
                  <td className="px-4 py-3 font-light text-gray-600">700</td>
                  <td className="px-4 py-3 font-light text-gray-600">
                    <FaRegEdit size={18} className="text-blue-500" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-md h-1/4 px-4 py-4 flex flex-col  justify-between ">
          <div className="flex flex-row gap-2 justify-center items-center px-20">
            <div className="w-16  flex justify-center"><RiNumber1 size={45} className="bg-black hover:bg-gray-800 rounded-full p-2 text-white cursor-pointer" /></div>
            <div className="w-16 flex justify-center"><RiNumber2 size={45} className="bg-black hover:bg-gray-800 rounded-full p-2 text-white cursor-pointer" /></div>
            <div className="w-16 flex justify-center"><RiNumber3 size={45} className="bg-black hover:bg-gray-800 rounded-full p-2 text-white cursor-pointer" /></div>
 
          </div>

          <div className="">
            <button className=" bg-gradient-to-r from-red-700 to-red-500 rounded-md py-2 text-white   w-full flex flex-row gap-2 items-center justify-center">
              {" "}
              <FaRegSave size={18}  />
              บันทีก / อัพเดท
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
