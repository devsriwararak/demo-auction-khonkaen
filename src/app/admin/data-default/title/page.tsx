"use client";
import Pagination from "@/app/components/Pagination";
import React, { useEffect, useState } from "react";
import { FiAirplay, FiPlus } from "react-icons/fi";
import { RiFileExcel2Line } from "react-icons/ri";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import ModalAdd from "./ModalAdd";
import Swal from "sweetalert2";
import { alertConfirmError, createExcel, decryptToken } from "@/lib/tool";
import axios from "axios";
import moment from "moment";

interface dataType {
  id: number;
  name: string;
  date: string;
  status: number;
}

const Page = () => {
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [data, setData] = useState<dataType[]>([]);
  const [id, setId] = useState(0);
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const dateNow = moment().format("YYYY-MM-DD");

  const [searchDate, setSearchDate] = useState({
    startDate: dateNow,
    endDate: dateNow,
  });

  const token = decryptToken();

  // modal Add Action
  const handleModalAdd = async () => {
    setOpen(!open);
  };

  const handleOpenAdd = async (id: number) => {
    setId(id);
    await handleModalAdd();
  };

  // All Functions

  const fetchData = async () => {
    try {
      const sendData = {
        page: page,
        startDate: searchDate.startDate,
        endDate: searchDate.endDate,
        search,
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auction_title/all`,
        sendData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        setData(res.data.result);
        setTotalPage(res.data.totalPages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const confirm = await alertConfirmError();
      if (confirm) {
        const res = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auction_title/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 200) {
          Swal.fire(`ลบเสร็จ !`, "", "success");
          await fetchData();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendExcel = async () => {
    try {
      const sendData = {
        startDate: searchDate.startDate,
        endDate: searchDate.endDate,
        search,
      };
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auction_title/send/excel`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
          params: sendData,
        }
      );

      await createExcel(res.data, sendData)




    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, searchDate.startDate, searchDate.endDate, page]);

  return (
    <div>
      <ModalAdd
        open={open}
        handleModalAdd={handleModalAdd}
        id={id}
        fetchData={fetchData}
      />
      <div className="flex flex-row gap-3 items-center">
        <FiAirplay size={20} />
        <h1 className="text-lg">หัวข้อประมูล</h1>
      </div>

      {/* Filter */}
      <div className="flex flex-col lg:flex-row gap-3 justify-start items-center mt-4">
        <div className="w-full lg:w-96 flex flex-row gap-2 ">
          <input
            className="w-full lg:w-48 px-2 lg:px-4 py-1 rounded-md border border-gray-400"
            type="date"
            value={searchDate?.startDate || ""}
            onChange={(e) =>
              setSearchDate((prev) => ({ ...prev, startDate: e.target.value }))
            }
          />
          <input
            className="w-full lg:w-48 px-2 lg:px-4 py-1 rounded-md border border-gray-400"
            type="date"
            value={searchDate?.endDate || ""}
            onChange={(e) =>
              setSearchDate((prev) => ({ ...prev, endDate: e.target.value }))
            }
          />
        </div>

        <div className="w-full ">
          <input
            className="w-full lg:w-48 px-2 lg:px-4 py-1 rounded-md border border-gray-400"
            type="text"
            placeholder="ค้นหาชื่อหัวข้อประมูล"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full flex flex-row justify-end gap-4">
          <button
            onClick={() => handleOpenAdd(0)}
            className="bg-red-700 hover:bg-red-800 w-full lg:w-40  text-white px-4 py-1 rounded-md flex justify-center items-center gap-2 "
          >
            {" "}
            <FiPlus size={20} /> เพิ่มข้อมูล
          </button>
          <button
            onClick={() => sendExcel()}
            className="bg-green-600 hover:bg-green-700 w-full lg:w-40 text-white px-4 rounded-md flex justify-center items-center gap-2 "
          >
            {" "}
            <RiFileExcel2Line /> Excel
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="mt-6 w-full bg-white px-4 py-4 rounded-md shadow-md  ">
        <div className="overflow-x-auto border border-gray-300 rounded-lg  shadow-lg ">
          <table className="table-auto  w-full text-sm ">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-300 ">
                <th className="px-4 py-3 text-start font-medium ">ชื่อ</th>
                <th className="px-4 py-3 text-start font-medium ">
                  วันที่สร้าง
                </th>
                <th className="px-2 py-3 text-start font-medium ">สถานะ</th>
                <th className="px-4 py-3 text-start font-medium ">
                  แก้ไข / ลบ
                </th>
              </tr>
            </thead>

            <tbody>
              {data?.map((item) => (
                <React.Fragment key={item.id}>
                  <tr className="hover:bg-gray-100   ">
                    <td className="px-4 py-3 font-medium  ">{item.name}</td>
                    <td className="px-4 py-3 font-extralight text-gray-800  ">
                      <p className="w-32">{item.date}</p>
                    </td>
                    <td className="px-2 py-3 font-extralight text-gray-800">
                      <p
                        className={`${
                          item.status === 0
                            ? "bg-green-200 text-green-700 rounded-md"
                            : "bg-red-200 text-red-700 rounded-md"
                        } w-32 text-center px-2 pt-1`}
                      >
                        {item.status === 0 ? "ยังไม่ประมูล" : "ประมูลแล้ว"}
                      </p>
                    </td>
                    <td className="px-4 py-3  flex flex-row gap-2 items-center">
                      <FaRegEdit
                        size={16}
                        onClick={() => handleOpenAdd(item.id)}
                        className="cursor-pointer"
                      />
                      <FaRegTrashAlt
                        size={16}
                        className="text-red-700 cursor-pointer"
                        onClick={() => handleDelete(item.id)}
                      />
                    </td>
                  </tr>
                  <tr key={`${item.id}-divider`}>
                    <td colSpan={5}>
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
    </div>
  );
};

export default Page;
