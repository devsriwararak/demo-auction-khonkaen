"use client";
import Pagination from "@/app/components/Pagination";
import React, { useEffect, useState } from "react";
import { FiAirplay, FiCoffee, FiPlus } from "react-icons/fi";
import { RiFileExcel2Line } from "react-icons/ri";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import ModalAdd from "./ModalAdd";
import Swal from "sweetalert2";
import { alertConfirmError, createExcel, decryptToken } from "@/lib/tool";
import axios from "axios";
import moment from "moment";

interface dataType {
  id: number;
  cus_num: string;
  cus_name: string;
  cus_tel: string;
}

const Page = () => {
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [data, setData] = useState<dataType[]>([]);
  const [id, setId] = useState(0);

  const token = decryptToken();
  const dateNow = moment().format("YYYY-MM-DD");

  const [searchDate, setSearchDate] = useState({
    startDate: dateNow,
    endDate: dateNow,
  });

  // Pagination
  const [page, setPage] = useState(2);
  const [totalPage, setTotalPage] = useState(0);

  // modal Add Action
  const handleModalAdd = async () => {
    setOpen(!open);
  };

  const handleOpenAdd = async (status: string, id: number, title: string) => {
    setId(id);
    await handleModalAdd();
  };

  // All Functions

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${process.env.NEXT_PUBLIC_API_VERSION}/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            cus_name: search,
            page : page
          },
        }
      );

      if (res.status === 200) {
        console.log(res.data.pagination);

        setData(res.data.data);

        // Pagination
        setPage(res.data.pagination.current_page)
        setTotalPage(res.data.pagination.total_pages)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataCategory = async()=> {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/category/${process.env.NEXT_PUBLIC_API_VERSION}/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
          },
        }
      );
      console.log('category nam');
      

      if(res.status === 200) {
        console.log(res.data);
        
      }
      
    } catch (error) {
      console.log(error);
      
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const confirm = await alertConfirmError();
      if (confirm) {
        const res = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/customers/${process.env.NEXT_PUBLIC_API_VERSION}/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 204) {
          Swal.fire(`ลบเสร็จ !`, "", "success");
          await fetchData();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDataCategory()
    fetchData();
  }, [search, searchDate.startDate, searchDate.endDate , page]);

  return (
    <div>
      <ModalAdd
        open={open}
        handleModalAdd={handleModalAdd}
        // sendDataToModal={sendDataToModal}
        fetchData={fetchData}
        id={id}
      />
      <div className="flex flex-row gap-3 items-center">
        <FiCoffee size={20} />
        <h1 className="text-xl">ข้อมูลผู้บริจาค</h1>
      </div>

      {/* Filter */}
      <div className="flex flex-col lg:flex-row gap-3 justify-start items-center mt-4">
        <div className="w-full ">
          <input
            className="w-full lg:w-48 px-2 lg:px-4 py-1 rounded-md shadow-md"
            type="text"
            placeholder="ค้นหาชื่อผู้บริจาค"
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
          <button
            onClick={() => createExcel(data)}
            className="bg-green-600 hover:bg-green-700 w-full lg:w-40 text-white px-4 rounded-md flex justify-center items-center gap-2"
          >
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
                <th className="px-4 py-3 text-start font-medium ">รหัส</th>
                <th className="px-4 py-3 text-start font-medium ">ชื่อ-สกุล</th>
                <th className="px-2 py-3 text-start font-medium ">เบอร์โทร</th>
                <th className="px-4 py-3 text-start font-medium ">
                  แก้ไข / ลบ
                </th>
              </tr>
            </thead>

            <tbody>
              {data?.map((item) => (
                <React.Fragment key={item.id}>
                  <tr className="hover:bg-gray-100   ">
                    <td className="px-4 py-3 font-medium  ">{item.cus_num}</td>
                    <td className="px-4 py-3 font-extralight text-gray-800  ">
                      <p className="w-32">{item.cus_name}</p>
                    </td>
                    <td className="px-4 py-3 font-extralight text-gray-800  ">
                      <p className="w-32">{item.cus_tel}</p>
                    </td>

                    <td className="px-4 py-3  flex flex-row gap-2 items-center">
                      <FaRegEdit
                        size={18}
                        onClick={() =>
                          handleOpenAdd("edit", item.id, item.cus_name)
                        }
                      />
                      <FaRegTrashAlt
                        size={18}
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
        <Pagination page={page} setPage={setPage}  totalPage={totalPage} />
      </div>
    </div>
  );
};

export default Page;
