"use client";
import Pagination from "@/app/components/Pagination";
import React, { useEffect, useState } from "react";
import { FiCoffee, FiPlus } from "react-icons/fi";
import { RiFileExcel2Line } from "react-icons/ri";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import ModalAdd from "./ModalAdd";
import Swal from "sweetalert2";
import { alertConfirmError, createExcel, decryptToken } from "@/lib/tool";
import axios from "axios";
import Select from "react-select";

interface dataType {
  id: number;
  name: string;
  unit: string;
  category_name: string;
}

interface OptionType {
  value: number;
  label: string;
}

const Page = () => {
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [data, setData] = useState<dataType[]>([]);
  const [id, setId] = useState(0);
  const [categoryData, setCategoryData] = useState<OptionType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | OptionType | null>(null);
  const [isClient, setIsClient] = useState(false);

  const token = decryptToken();

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

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
        category_id: selectedCategory,
        search,
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/all`,
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

  const fetchDataCategory = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/category/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        const options = res.data.map((item: { id: number; name: string }) => ({
          value: item.id,
          label: item.name,
        }));
        const addDefaultOption = { value: "", label: "ทั้งหมด" };
        const allOption = [addDefaultOption, ...options];
        setCategoryData(allOption);
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/product/${id}`,
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
        category_id : selectedCategory,
        search,
      };
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/send/excel`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
          params: sendData,
        }
      );

      await createExcel(res.data, sendData, "ข้อมูลสินค้า")

    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    fetchDataCategory();
    fetchData();
    setIsClient(true);
  }, [search, selectedCategory, page]);

  if (!isClient) {
    return null;
  }

  return (
    <div>
      <ModalAdd
        open={open}
        handleModalAdd={handleModalAdd}
        fetchData={fetchData}
        id={id}
      />
      <div className="flex flex-row gap-3 items-center">
        <FiCoffee size={20} />
        <h1 className="text-lg">ข้อมูลสินค้า</h1>
      </div>

      {/* Filter */}
      <div className="flex flex-col lg:flex-row gap-3 justify-start items-center mt-4">
        <div className="w-full flex flex-row gap-2 items-center ">
          <input
            className="w-full lg:w-48 px-2 lg:px-4 py-1.5 rounded-md border border-gray-400"
            type="text"
            placeholder="ค้นหาชื่อสินค้า"
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            options={categoryData}
            onChange={(selectedOption) =>
              setSelectedCategory(selectedOption ? selectedOption.value : null)
            }
            placeholder="เลือกหมวดหมู่"
            isClearable
            className="w-48 border "
          />
        </div>

        <div className="w-full flex flex-row justify-end gap-4">
          <button
            onClick={() => handleOpenAdd(0)}
            className="bg-red-700 hover:bg-red-800 w-full lg:w-52  text-white px-4 py-1 rounded-md flex justify-center items-center gap-2"
          >
            {" "}
            <FiPlus size={20} /> เพิ่มข้อมูลสินค้า
          </button>
          <button onClick={() => sendExcel()} className="bg-green-600 hover:bg-green-700 w-full lg:w-40 text-white px-4 rounded-md flex justify-center items-center gap-2">
            {" "}
            <RiFileExcel2Line /> Excel
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="mt-4 w-full bg-white px-4 py-4 rounded-md shadow-md">
        <div className="overflow-x-auto border border-gray-300 rounded-lg  shadow-lg ">
          <table className="table-auto  w-full text-sm ">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-300 ">
                <th className="px-4 py-3 text-start font-medium ">ชื่อ</th>
                <th className="px-4 py-3 text-start font-medium ">หน่วยนับ</th>
                <th className="px-2 py-3 text-start font-medium ">หมวดหมู่</th>
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
                      <p className="w-32">{item.unit}</p>
                    </td>
                    <td className="px-4 py-3 font-extralight   ">
                      {item.category_name}
                    </td>

                    <td className="px-4 py-3  flex flex-row gap-2 items-center cursor-pointer">
                      <FaRegEdit
                        size={16}
                        onClick={() => handleOpenAdd(item.id)}
                      />
                      <FaRegTrashAlt
                        size={16}
                        className="text-red-700"
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
