"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
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
import Select from "react-select";
import ModalAddProduct from "./ModalAddProduct";
import ModalAddCustomer from "./ModalAddCustomer";

const page = () => {
  const [isClient, setIsClient] = useState(false);

  const [open, setOpen] = useState({
    product : false,
    customer : false
  })

  const handleModal = (numb: number)=>{
    if(numb === 1) {
      setOpen({product : ! open.product, customer : false})
    }
    if(numb === 2) {
      setOpen({product : false, customer : !open.customer})
    }
  }


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
      <ModalAddProduct  open={open.product} setOpen={setOpen}  />
      <ModalAddCustomer open={open.customer} setOpen={setOpen} />


      {/* LEFT SECTION */}
      <div className="w-full lg:w-4/6">
        <div className="bg-white shadow-md rounded-md px-5 py-4">
          <div className="flex flex-col  lg:flex-row gap-0 items-end justify-between">
            <div className="w-full lg:w-1/3 flex flex-col gap-2 justify-start items-start  ">
              <label htmlFor="" className="text-sm">
                เลือกหัวข้อประมูล
              </label>
              <div className=" w-full">
                {isClient ? <Select options={options} /> : null}
              </div>
            </div>
            
            <div className="w-full lg:w-2/3 flex  flex-wrap lg:flex-row gap-2 justify-start lg:justify-end  lg:mt-0">
              <button onClick={()=>handleModal(1)} className="text-sm bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-2 rounded-md flex flex-row gap-2 items-center">
                <MdOutlineAddShoppingCart size={18} /> เพิ่มสินค้าใหม่
              </button>
              <button onClick={()=>handleModal(2)} className="text-sm bg-gradient-to-r from-green-600 to-green-500 text-white px-3 py-2 rounded-md flex flex-row gap-2 items-center">
                <FiUserPlus size={18} /> เพิ่มผู้บริจาคใหม่
              </button>
              <button  className="text-sm bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-2 rounded-md flex flex-row gap-2 items-center">
                <TbWorldCancel size={18} /> เคลียร์ห้องประมูล
              </button>
            </div>
          </div>

          <div className="flex flex-row gap-4 mt-6">
            <div className="w-full lg:w-1/3">
              <p className="text-sm">ฉลากออมสิน / หน่วย</p>
              <input
                type="text"
                placeholder="ฉลากออมสิน"
                className="bg-gray-100 px-4 py-1.5 rounded-md border border-gray-300 mt-2 w-full"
              />
            </div>

            <div className="w-full lg:w-1/3">
              <p className="text-sm">ล็อตเตอรี่ / ใบ</p>
              <input
                type="text"
                placeholder="ล็อตเตอรี่"
                className="bg-gray-100 px-4 py-1.5 rounded-md border border-gray-300 mt-2 w-full"
              />
            </div>
          </div>
        </div>

        <div className="bg-white h-[500px] shadow-md rounded-md px-5 py-4 mt-4 overflow-y-scroll">
          {/* Start วัตถุมงคล */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-1/4 flex flex-col justify-start items-center text-base">
              <FaPrayingHands
                className="bg-red-100 p-2 rounded-md mb-2"
                size={70}
              />
              หมวดหมู่ วัตถุมงคล
            </div>
            <div className="w-full lg:w-3/4">
              <div className="overflow-x-auto border rounded-lg  ">
                <table className="table-auto  w-full text-sm ">
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
                      <td className="px-4 py-3">ส้มมงคล ถาดที่ 1</td>
                      <td className="px-4 py-3 font-light text-gray-600">10</td>
                      <td className="px-4 py-3 font-light text-gray-600">
                        ชิ้น
                      </td>
                      <td className="px-4 py-3 font-light text-gray-600">
                        <FaRegTrashAlt size={18} className="text-red-500" />
                      </td>
                    </tr>
                    <tr className="bg-gray-100">
                      <td className="px-4 py-3">บูชาองค์เทพเจ้า</td>
                      <td className="px-4 py-3 font-light text-gray-600">20</td>
                      <td className="px-4 py-3 font-light text-gray-600">
                        องค์
                      </td>
                      <td className="px-4 py-3 font-light text-gray-600">
                        <FaRegTrashAlt size={18} className="text-red-500" />
                      </td>
                    </tr>
                    <tr className="">
                      <td className="px-4 py-3">ตะเกียงฟ้าดิน</td>
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
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-1/4 flex flex-col justify-start items-center">
              <FaMobileAlt
                className="bg-red-100 p-2 rounded-md mb-2"
                size={70}
              />
              หมวดหมู่ โทรศัพท์
            </div>
            <div className="w-full lg:w-3/4">
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
                      <td className="px-4 py-3">I Phone 15 Promax</td>
                      <td className="px-4 py-3 font-light text-gray-600">2</td>
                      <td className="px-4 py-3 font-light text-gray-600">
                        เครื่อง
                      </td>
                      <td className="px-4 py-3 font-light text-gray-600">
                        <FaRegTrashAlt size={18} className="text-red-500" />
                      </td>
                    </tr>
                    <tr className="bg-gray-100">
                      <td className="px-4 py-3">I Pad Pro 2024</td>
                      <td className="px-4 py-3 font-light text-gray-600">3</td>
                      <td className="px-4 py-3 font-light text-gray-600">
                        เครื่อง
                      </td>
                      <td className="px-4 py-3 font-light text-gray-600">
                        <FaRegTrashAlt size={18} className="text-red-500" />
                      </td>
                    </tr>

                    <tr className="">
                      <td className="px-4 py-3">Nokia A1234</td>
                      <td className="px-4 py-3 font-light text-gray-600">1</td>
                      <td className="px-4 py-3 font-light text-gray-600">
                        เครื่อง
                      </td>
                      <td className="px-4 py-3 font-light text-gray-600">
                        <FaRegTrashAlt size={18} className="text-red-500" />
                      </td>
                    </tr>

                    <tr className="">
                      <td className="px-4 py-3">i Mobile 20S</td>
                      <td className="px-4 py-3 font-light text-gray-600">4</td>
                      <td className="px-4 py-3 font-light text-gray-600">
                        เครื่อง
                      </td>
                      <td className="px-4 py-3 font-light text-gray-600">
                        <FaRegTrashAlt size={18} className="text-red-500" />
                      </td>
                    </tr>

                    <tr className="">
                      <td className="px-4 py-3">มือถือวิทยุ</td>
                      <td className="px-4 py-3 font-light text-gray-600">5</td>
                      <td className="px-4 py-3 font-light text-gray-600">
                        เครื่อง
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
      <div className="w-full lg:w-2/6 flex flex-col gap-4">
        <div className="bg-white shadow-md rounded-md  px-4 py-4">
          <div className="overflow-x-auto border rounded-lg  ">
            <table className="table-auto  w-full text-sm ">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-300  ">
                  <th className="px-2 py-3 text-start font-medium  ">ลำดับ</th>
                  <th className="px-4 py-3 text-start font-medium ">
                    ผู้บริจาค
                  </th>
                  <th className="px-4 py-3 text-start font-medium ">
                    จำนวนเงิน
                  </th>
                  <th className="px-2 py-3 text-start font-medium ">แก้ไข</th>
                </tr>
              </thead>

              <tbody className="">
                <tr className="">
                  <td className="px-2 py-3 font-light text-gray-600">1</td>
                  <td className="px-4 py-3 text-green-600 font-medium">
                    นายณัฐวุฒิ ศรีน้ำเงินเข้ม
                  </td>
                  <td className="px-4 py-3  text-green-600 font-medium ">
                    99,999
                  </td>
                  <td className="px-2 py-3 font-light text-gray-600">
                    <FaRegEdit size={18} className="text-blue-500" />
                  </td>
                </tr>
                <tr className="">
                  <td className="px-2 py-3 font-light text-gray-600">2</td>
                  <td className="px-4 py-3">บ.เดฟศรีวรารักษ์</td>
                  <td className="px-4 py-3 font-light text-gray-600">60,000</td>
                  <td className="px-2 py-3 font-light text-gray-600">
                    <FaRegEdit size={18} className="text-blue-500" />
                  </td>
                </tr>
                <tr className="">
                  <td className="px-2 py-3 font-light text-gray-600">3</td>
                  <td className="px-4 py-3">วันนิสา ประทุมธานี</td>
                  <td className="px-4 py-3 font-light text-gray-600">8,000</td>
                  <td className="px-2 py-3 font-light text-gray-600">
                    <FaRegEdit size={18} className="text-blue-500" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className=" mt-4 border border-gray-200 px-2 py-2 rounded-md shadow-md ">
            <div className="p-2 bg-red-500 rounded-md h-72 ">
              <div className="bg-red-200 bg-opacity-60  rounded-md py-4 px-4 ">
                <p className=" text-center">หน้าจอแสดง หน้าประมูล Real Time</p>
                <p className="text-base mt-4 text-gray-100 stroke-cyan-500 text-center">
                  ฉลากออมสิน 10 ใบ / ล็อตเตอรี่ 2 ใบ / I Phone 15 Promax 2
                  เครื่อง
                </p>

                <ul className="mt-6 flex flex-col gap-2 relative ">
                  <li className="text-xl flex justify-between">
                    <p>1. นายณัฐวุฒิ ศรีน้ำเงินเข้ม</p> <p>999,999</p>
                  </li>
                  <li className="text-lg flex justify-between">
                    <p>2. บ.เดฟศรีวรารักษ์</p> <p>60,000</p>
                  </li>
                  <li className="text-base flex justify-between">
                    <p>3. วันนิสา ประทุมธานี</p> <p>8,000</p>
                  </li>
                </ul>
              </div>

              <div className="flex flex-row gap-4 justify-between  -mt-20  ">
                <Image
                  src="/images/login.webp"
                  alt="Login Image"
                  width={200}
                  height={200}
                  className="w-32 opacity-10"
                />
                <Image
                  src="/images/login.webp"
                  alt="Login Image"
                  width={200}
                  height={200}
                  className="w-32 transform scale-x-[-1]   opacity-10"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-md py-6 px-4  flex flex-col  justify-center ">
          <div className="flex flex-row gap-2 justify-center items-center px-20">
            <div className="w-16  flex justify-center">
              <RiNumber1
                size={45}
                className="bg-red-700 hover:bg-gray-800 hover:text-white rounded-full p-2 text-white cursor-pointer"
              />
            </div>
            <div className="w-16 flex justify-center">
              <RiNumber2
                size={45}
                className="bg-gray-300 hover:bg-gray-800 hover:text-white rounded-full p-2  cursor-pointer"
              />
            </div>
            <div className="w-16 flex justify-center">
              <RiNumber3
                size={45}
                className="bg-gray-300 hover:bg-gray-800 hover:text-white rounded-full p-2  cursor-pointer"
              />
            </div>
          </div>

          <div className="">
            <button className=" mt-4 bg-gradient-to-r from-green-600 to-green-500 rounded-md py-2 text-white   w-full flex flex-row gap-2 items-center justify-center">
              {" "}
              <FaRegSave size={18} />
              บันทีก / อัพเดท
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
