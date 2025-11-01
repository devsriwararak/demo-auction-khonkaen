"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import Image from "next/image";
import axios from "axios";
import { decryptToken } from "@/lib/tool";

type ModalByIdType = {
  open: boolean;
  handleOpenModal: (numb: number) => void;
  id: number;
};

interface auctionDataType {
  id: number;
  code: string;
  name: string;
  title: string;
  price: number;
  status: number;
  date: string;
  government: number;
  lottery: number;
  images: string;
}

interface CategoryData {
  category_id: number;
  results: {
    id: string;
    name: string;
    category_name: string;
    product_id: number;
    quantity: number;
    unit: string;
  }[];
}

const ModalById: React.FC<ModalByIdType> = ({ open, handleOpenModal, id }) => {
  // States
  const [auctionData, setAuctionData] = useState<auctionDataType | null>(null);
  const [productsData, setProductsData] = useState<CategoryData[]>([]);
  // Systems
  const token = decryptToken();

  const fetchDataAuction = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auction/all/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        setAuctionData(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataAuctionProductList = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auction/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        setProductsData(res.data.products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = auctionData?.images || "downloaded-image.jpg"; // ใช้ชื่อไฟล์จากข้อมูล หรือกำหนดชื่อเริ่มต้น
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  useEffect(() => {
    fetchDataAuction();
    fetchDataAuctionProductList();
  }, [id]);
  return (
    <Dialog
      open={open}
      onClose={() => handleOpenModal(1)}
      className="relative z-10"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-4xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="sm:flex sm:items-start bg-gray-100 px-4 py-2">
              <div className=" text-center sm:mt-0 sm:ml-4 sm:text-left ">
                <DialogTitle
                  as="h3"
                  className="text-base font-semibold text-gray-900 "
                >
                  รายละเอียด
                </DialogTitle>
              </div>
            </div>

            <div className="bg-white px-4 py-4 flex flex-col lg:flex-row gap-4">
              <div className="w-full px-2 py-2">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="w-full">
                    <p className="text-gray-700 text-base font-medium">
                      เลขที่บิล
                    </p>
                    <p className="text-sm font-light  mt-1">
                      {auctionData?.code}
                    </p>
                  </div>
                  <div className="w-full">
                    <p className="text-gray-700 text-base font-medium">
                      วันที่ประมูล
                    </p>
                    <p className="text-sm font-light mt-1">
                      {auctionData?.date}
                    </p>
                  </div>
                </div>

                <div className="w-full mt-4 ">
                  <p className="text-gray-700 text-base font-medium">
                    หัวข้อประมูล
                  </p>
                  <p className="text-sm font-light mt-1">
                    {auctionData?.title}
                  </p>
                </div>

                <div className="w-full mt-4 bg-gray-100 px-4 py-1 rounded-md border border-gray-400">
                  <p className="text-gray-700 text-base font-medium">ผู้บริจาค</p>
                  <p className="text-sm font-light mt-1">{auctionData?.name}</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 mt-4">
                  <div className="w-full">
                    <p className="text-gray-700 text-base font-medium">
                      สลากออมสิน
                    </p>
                    <p className="text-sm font-light mt-1">
                      {auctionData?.government}{" "}
                      <span className="text-sm">ใบ</span>
                    </p>
                  </div>
                  <div className="w-full">
                    <p className="text-gray-700 text-base font-medium">
                      ล็อตเตอรี่
                    </p>
                    <p className="text-sm font-light mt-1">
                      {auctionData?.lottery} <span className="text-sm">ใบ</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 mt-4">
                  <div className="w-full">
                    <p className="text-gray-700 text-base font-medium">สถานะ</p>
                    <p className="text-sm font-light mt-2">
                      {auctionData?.status === 1 && (
                        <span className="border-l-4 border-red-600 bg-red-100 px-2 py-1">
                          ยังไม่ชำระเงิน
                        </span>
                      )}
                      {auctionData?.status === 2 && (
                        <span className="border-l-4 border-green-600 bg-green-100 px-2 py-1">
                          ชำระเงินแล้ว
                        </span>
                      )}
                      {auctionData?.status === 3 && (
                        <span className="border-l-4 border-red-600 bg-red-100 px-2 py-1">
                          ยกเลิกบิล
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="w-full">
                    <p className="text-gray-700 text-base font-medium">
                      จำนวนเงิน
                    </p>
                    <p className="text-sm font-light mt-2 ">
                      {Number(auctionData?.price || 0).toLocaleString()}{" "}
                      <span className="text-sm">บาท</span>
                    </p>
                  </div>
                </div>

                <hr className="mt-6 " />

                <div className="text-start mt-6">
                  <button
                    onClick={() =>
                      handleDownload(
                        `${process.env.NEXT_PUBLIC_API_URL}/uploads/${auctionData?.images}`
                      )
                    }
                    className="bg-green-600 text-white px-4 py-1 rounded-md"
                  >
                    ดาวน์โหลด
                  </button>
                </div>
              </div>
              <div className="w-full boder-l-2 border-gray-500  px-2 py-2">
                <div className="overflow-x-auto border border-gray-300 rounded-lg  shadow-lg h-48 ">
                  <table className="table-auto  w-full ">
                    <thead className="">
                      <tr className="bg-gray-50  top-0 sticky border-b border-gray-300   ">
                        <th className="px-3 py-1 text-start font-medium    ">
                          สินค้า
                        </th>
                        <th className="px-3 py-1 text-start font-medium ">
                          จำนวน
                        </th>
                        <th className="px-3 py-1 text-start font-medium ">
                          หน่วยนับ
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {productsData?.map((item) => (
                        <React.Fragment key={item.category_id}>
                          <tr className="bg-gray-100">
                            <td
                              colSpan={3}
                              className="px-3 py-1 font-medium text-gray-700"
                            >
                              {item.category_id === 1 && "วัตถุมงคล"}
                              {item.category_id === 2 && "โทรศัพท์"}
                              {item.category_id === 3 && "เครื่องใช้สำนักงาน"}
                              {item.category_id === 4 && "เครื่องใช้ไฟฟ้า"}
                              {item.category_id === 5 && "อื่นๆ"}
                            </td>
                          </tr>
                          {item.results.map((item) => (
                            <tr className="hover:bg-gray-50   " key={item.id}>
                              <td className="px-3 py-1 font-extralight text-gray-800  ">
                                <p className="">{item.name}</p>
                              </td>
                              <td className="px-3 py-1 font-extralight text-gray-800  ">
                                <p className="">{item.quantity}</p>
                              </td>
                              <td className="px-3 py-1 font-extralight text-gray-800  ">
                                <p className="">{item.unit}</p>
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 text-center">
                  {auctionData?.images && (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${auctionData?.images}`}
                      alt=""
                      width={1000}
                      height={1000}
                      className="w-full h-full mt-4 rounded-md shadow-md"
                    />
                  )}
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalById;
