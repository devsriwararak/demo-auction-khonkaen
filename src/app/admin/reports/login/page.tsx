"use client";
import Pagination from "@/app/components/Pagination";
import { decryptToken } from "@/lib/tool";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";

interface dataType {
  username: string;
  type: number;
  date: string;
  time : string;
}

const Page = () => {
  // Systems
  const dateNow = moment().format("YYYY-MM-DD");
  const token = decryptToken();

  // States
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPage] = useState(1);
  const [data, setData] = useState<dataType[]>([]);
  const [searchDate, setSearchDate] = useState({
    search: "",
    dateStart: dateNow,
    dateEnd: dateNow,
  });

  const fetchData = async () => {
    const sendData = {
      page,
      search: searchDate.search,
      dateStart: searchDate.dateStart,
      dateEnd: searchDate.dateEnd,
    };
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/report/login`,
        sendData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        console.log(res.data.result);
        setData(res.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchDate.search, searchDate.dateStart, searchDate.dateEnd]);
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-64">
          <p className="text-xs">ค้นหาจาก username</p>
          <input
            value={searchDate.search || ""}
            onChange={(e) =>
              setSearchDate((prev) => ({
                ...prev,
                search: e.target.value,
              }))
            }
            type="text"
            className="border border-gray-400 mt-1 rounded-md px-4 py-1"
            placeholder="ค้นหาจาก username"
          />
        </div>
        <div className="">
          <p className="text-xs">วันที่เริ่มต้น</p>
          <input
            value={searchDate.dateStart || ""}
            onChange={(e) =>
              setSearchDate((prev) => ({
                ...prev,
                dateStart: e.target.value,
              }))
            }
            type="date"
            className="border border-gray-400 mt-1 rounded-md px-4 py-1"
            placeholder="วันที่เริ่มต้น"
          />
        </div>
        <div className="">
          <p className="text-xs">วันที่สิ้นสุด</p>
          <input
            value={searchDate.dateEnd || ""}
            onChange={(e) =>
              setSearchDate((prev) => ({
                ...prev,
                dateEnd: e.target.value,
              }))
            }
            type="date"
            className="border border-gray-400 mt-1 rounded-md px-4 py-1"
            placeholder="วันที่สิ้นสุด"
          />
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-300 rounded-lg mt-5 text-sm">
        <table className="table-auto  w-full ">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-300 ">
              <th className="px-4 py-2 text-start font-medium ">username</th>
              <th className="px-4 py-2 text-start font-medium ">วันที่</th>
              <th className="px-4 py-2 text-start font-medium ">เวลา</th>
              <th className="px-4 py-2 text-start font-medium ">ประเภท</th>
            </tr>
          </thead>

          <tbody>
            {data?.map((item: dataType, index: number) => (
              <React.Fragment key={index}>
                <tr className="hover:bg-gray-100   ">
                  <td className="px-4 py-2 font-medium w-6/12  ">
                    {item.username || ""}
                  </td>
                  <td className="px-4 py-2 font-extralight text-gray-800  w-2/12 ">
                    {item.date || "-"}
                  </td>

                  <td className="px-4 py-2 font-extralight text-gray-800  w-2/12 ">
                    {item.time || "-"}
                  </td>
                  <td className="px-3 py-2 font-extralight text-gray-800 w-2/12  ">
                    {item.type === 1 ? "เข้าสู่ระบบ" :"ออกจากระบบ"}
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
      {/* pagination */}
      <Pagination page={page} setPage={setPage} totalPage={totalPage} />
    </div>
  );
};

export default Page;
