"use client";
import { createExcel, decryptToken } from "@/lib/tool";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { RiFileExcel2Line } from "react-icons/ri";

interface dataType {
  government: number;
  lottery: number;
  resultList: {
    product_name: string;
    qty: number;
    unit: string;
  }[];
}

const ReportProduct = () => {
  // Systems
  const dateNow = moment().format("YYYY-MM-DD");
  const token = decryptToken();

  // States
  const [searchDate, setSearchDate] = useState({
    dateStart: dateNow,
    dateEnd: dateNow,
    billType: 1,
  });
  const [data, setData] = useState<dataType | null>(null);

  // Functions
  const fetchData = async () => {
    try {
      const sendData = {
        dateStart: searchDate.dateStart,
        dateEnd: searchDate.dateEnd,
        billType: searchDate.billType,
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/report/list/all`,
        sendData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        console.log(res.data);
        setData(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendExcel = async () => {
    try {
      const sendData = {
        dateStart: searchDate.dateStart,
        dateEnd: searchDate.dateEnd,
        billType: searchDate.billType,
        search : ""
      };
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/report/product/send/excel`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
          params: sendData,
        }
      );

      await createExcel(res.data, sendData, "รายการสินค้า");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchDate.dateStart, searchDate.dateEnd, searchDate.billType]);

  return (
    <div>
      <div className="flex flex-row gap-4 items-center justify-start">
        <div className="w-1/5">
          <p className="text-sm text-gray-600">วันที่เริ่มต้น</p>
          <input
            value={searchDate.dateStart}
            onChange={(e) =>
              setSearchDate((prev) => ({
                ...prev,
                dateStart: e.target.value,
              }))
            }
            type="date"
            className="border border-gray-200 rounded-md shadow-md px-4 py-1 w-full"
          />
        </div>
        <div className="w-1/5">
          <p className="text-sm text-gray-600">วันที่สิ้นสุด</p>
          <input
            value={searchDate.dateEnd}
            onChange={(e) =>
              setSearchDate((prev) => ({
                ...prev,
                dateEnd: e.target.value,
              }))
            }
            type="date"
            className="border border-gray-200 rounded-md shadow-md px-4 py-1 w-full"
          />
        </div>
        <div className="w-1/5">
          <p className="text-sm text-gray-600">เลือกประเภทบิล</p>
          <select
            className="w-48 px-4 mt-1 py-1 border border-gray-400 rounded-md"
            value={searchDate.billType || 1}
            onChange={(e) =>
              setSearchDate((prev) => ({
                ...prev,
                billType: Number(e.target.value),
              }))
            }
          >
            <option value="1">ประมูล</option>
            <option value="2">ขายสินค้า</option>
          </select>
        </div>

        <div className="w-1/5">
          <button
            onClick={() => sendExcel()}
            className="bg-green-600 hover:bg-green-700 w-full lg:w-40 text-white px-4 py-1 rounded-md flex justify-center items-center gap-2"
          >
            {" "}
            <RiFileExcel2Line /> Excel
          </button>
        </div>
      </div>

      {/* Content */}

      <div className="flex flex-col lg:flex-row gap-4 mt-5 text-sm">
        <div className="w-3/12 h-20  border border-gray-200 rounded-md shadow-md px-4 py-3">
          <p className="text-base">สลากออมสิน {data?.government || 0} ใบ</p>
          <p className="text-base mt-2">ล็อตเตอรี่ {data?.lottery || 0} ใบ</p>
        </div>
        <div className="w-9/12 h-full  border border-gray-200 rounded-md shadow-md px-4 py-3">
          <div className="overflow-x-auto border border-gray-300 rounded-lg ">
            <table className="table-auto  w-full ">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-300 ">
                  <th className="px-4 py-2 text-start font-medium ">
                    ชื่อสินค้า
                  </th>
                  <th className="px-4 py-2 text-start font-medium ">จำนวน</th>
                  <th className="px-4 py-2 text-start font-medium ">
                    หน่วยนับ
                  </th>
                </tr>
              </thead>

              <tbody>
                {data?.resultList.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr className="hover:bg-gray-100   ">
                      <td className="px-4 py-2 font-medium w-8/12  ">
                        {item.product_name || ""}
                      </td>

                      <td className="px-4 py-2 font-extralight text-gray-800  w-2/12 ">
                        {item.qty || 0}
                      </td>
                      <td className="px-3 py-2 font-extralight text-gray-800 w-2/12  ">
                        {item.unit || "-"}
                      </td>
                    </tr>
                    <tr key={`${index}-divider`}>
                      <td colSpan={10}>
                        <hr />
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Content */}
    </div>
  );
};

export default ReportProduct;
