"use client";
import Pagination from "@/app/components/Pagination";
import React, { useEffect, useState } from "react";
import { FiAirplay, FiPlus } from "react-icons/fi";
import { RiFileExcel2Line } from "react-icons/ri";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import ModalAdd from "./ModalAdd";
import Swal from "sweetalert2";
import { alertConfirmError } from "@/lib/tool";

const dataTest = [
  {
    id: 0,
    header_1: "0001",
    header_2: "0002",
    header_3: "0003",
    header_4: "0004",
  },
  {
    id: 1,
    header_1: "0005",
    header_2: "0006",
    header_3: "0007",
    header_4: "0008",
  },
  {
    id: 2,
    header_1: "0009",
    header_2: "0010",
    header_3: "0011",
    header_4: "0012",
  },
];

const Page = () => {
  const [open, setOpen] = useState(false);
  const [sendDataToModal, setSendDataToModal] = useState({
    id: 0,
    name: "",
  });
  const [search, setSearch] = useState("");


  const [data, setData] = useState(dataTest);
  // modal Add Action
  const handleModalAdd = async () => {
    setOpen(!open);
  };

  const handleOpenAdd = async (status: string, id: number, name: string) => {
    setSendDataToModal({
      id: status === "add" ? 0 : id,
      name: status === "add" ? "" : name,
    });
    await handleModalAdd();
  };

  const handleDelete = async (id: number) => {
    try {
      const confirm = await alertConfirmError();
      if (confirm) {
        Swal.fire(`ลบเสร็จ ! ${id}`, "", "success");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = () => {
    if (!search) {
      setData(dataTest);
    } else {
      const newData = dataTest.filter((item) => item.header_1.includes(search));
      setData(newData);
    }
    
  };

  useEffect(() => {
    handleSearch();
  }, [search]);

  return (
    <div>
      <ModalAdd
        open={open}
        handleModalAdd={handleModalAdd}
        sendDataToModal={sendDataToModal}
      />
      <div className="flex flex-row gap-3 items-center">
        <FiAirplay size={20} />
        <h1 className="text-xl">หัวข้อประมูล</h1>
      </div>

      {/* Filter */}
      <div className="flex flex-col lg:flex-row gap-3 justify-start items-center mt-4">
        <div className="w-full lg:w-96 flex flex-row gap-2 ">
          <input
            className="w-full lg:w-48 px-2 lg:px-4 py-1 rounded-md shadow-md"
            type="date"
          />
          <input
            className="w-full lg:w-48 px-2 lg:px-4 py-1 rounded-md shadow-md"
            type="date"
          />
        </div>

        <div className="w-full ">
          <input
            className="w-full lg:w-48 px-2 lg:px-4 py-1 rounded-md shadow-md"
            type="text"
            placeholder="ค้นหาชื่อหัวข้อประมูล"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full flex flex-row justify-end gap-4">
          <button
            onClick={() => handleOpenAdd("add", 0, "")}
            className="bg-red-700 hover:bg-red-800 w-full lg:w-40  text-white px-4 py-1 rounded-md flex justify-center items-center gap-2"
          >
            {" "}
            <FiPlus size={20} /> เพิ่มข้อมูล
          </button>
          <button className="bg-green-600 hover:bg-green-700 w-full lg:w-40 text-white px-4 rounded-md flex justify-center items-center gap-2">
            {" "}
            <RiFileExcel2Line /> Excel
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="mt-6 w-full bg-white px-4 py-4 rounded-md shadow-md">
        <div className="overflow-x-auto border border-gray-300 rounded-lg  shadow-lg ">
          <table className="table-auto  w-full ">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-300 ">
                <th className="px-4 py-3 text-start font-medium ">ชื่อ</th>
                <th className="px-4 py-3 text-start font-medium ">Header 2</th>
                <th className="px-4 py-3 text-start font-medium ">Header 3</th>
                <th className="px-4 py-3 text-start font-medium ">Header 4</th>
                <th className="px-4 py-3 text-start font-medium ">
                  แก้ไข / ลบ
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <React.Fragment key={item.id}>
                  <tr className="hover:bg-gray-100   ">
                    <td className="px-4 py-3 font-medium  ">{item.header_1}</td>
                    <td className="px-4 py-3 font-extralight text-gray-800 ">
                      {item.header_2}
                    </td>
                    <td className="px-4 py-3 font-extralight text-gray-800">
                      {item.header_3}
                    </td>
                    <td className="px-4 py-3 font-extralight text-gray-800">
                      {item.header_4}
                    </td>
                    <td className="px-4 py-3  flex flex-row gap-2 items-center">
                      <FaRegEdit
                        size={18}
                        onClick={() => handleOpenAdd("edit", 1, "test-01")}
                      />
                      <FaRegTrashAlt
                        size={18}
                        className="text-red-700"
                        onClick={() => handleDelete(1)}
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
        <Pagination />
      </div>
    </div>
  );
};

export default Page;
