"use client";
import Pagination from "@/app/components/Pagination";
import React, { useEffect, useState } from "react";
import { FiHardDrive } from "react-icons/fi";
import { RiFileExcel2Line } from "react-icons/ri";
import { FaRegMoneyBillAlt } from "react-icons/fa";

import Swal from "sweetalert2";

import { createExcel, decryptToken, errorMessage } from "@/lib/tool";
import axios from "axios";
import { toast } from "react-toastify";

interface dataType {
  id: number;
  code: string;
  title: string;
  name: string;
  date: string;
  price: number;
  status: number;
}

const Page = () => {
  // States
  const [openModalById, setOpenModalById] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalPdf, setOpenModalPdf] = useState(false);

  const [data, setData] = useState<dataType[]>([]);
  // const [id, setId] = useState(0);

  // Systems
  const token = decryptToken();

  //   Search
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState({
    billType: 1,
    statusType: "",
  });

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  // modal Add Action

  const handleOpenModal = async (numb: number) => {
    if (numb === 1) {
      setOpenModalById(!openModalById);
    } else if (numb === 2) {
      setOpenModalEdit(!openModalEdit);
    } else if (numb === 3) {
      setOpenModalPdf(!openModalPdf);
    }
  };

  const handleSetModal = async ( numb: number) => {
    // setId(id);
    await handleOpenModal(numb);
  };

  // All Functions

  const fetchData = async () => {
    try {
      const sendData = {
        page: page,
        billType: searchType.billType,
        statusType: searchType.statusType,
        search,
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/debtor/all`,
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

  const sendExcel = async () => {
    try {
      const sendData = {
        billType: searchType.billType,
        statusType: searchType.statusType,
        search,
      };
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/debtor/send/excel`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
          params: sendData,
        }
      );

      await createExcel(res.data, sendData, "บัญชีลูกหนี้");
    } catch (error) {
      console.log(error);
    }
  };

  const handlePay = async (id: number) => {
    let sqlSelect = ""
    if(searchType.billType === 1) {
      sqlSelect = "auction"
    }
    if( searchType.billType === 2) {
      sqlSelect = "sale"
    }


    Swal.fire({
      title: "ชำระเงิน ?",
      text: "กรุณาตรวจสอบให้แน่ใจก่อนชำระเงิน  !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "gray",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/${sqlSelect}/add_pay`,
            { id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (res.status === 200) {
            toast.success(res.data.message);
            await fetchData();
          }
        } catch (error: unknown) {
          console.log(error);
          errorMessage(error);
        }
      }
    });
  };



  useEffect(() => {
    fetchData();
  }, [search, searchType.billType, searchType.statusType, page]);

  return (
    <div>
      <div className="flex flex-row gap-3 items-center">
        <FiHardDrive size={20} />
        <h1 className="text-lg">บัญชีลูกหนี้</h1>
      </div>

      {/* Filter */}
      <div className="flex flex-col lg:flex-row gap-3 justify-start items-center mt-4">
        <div className="w-full flex flex-col lg:flex-row gap-3 ">
          <div className="flex flex-col">
            <p className="text-sm text-gray-600">ค้นหาเลขที่บิล</p>
            <input
              className="w-full lg:w-48 px-2 lg:px-4 py-1 mt-1 rounded-md border border-gray-400"
              type="text"
              placeholder="ค้นหาเลขที่บิล"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-col ">
            <p className="text-sm text-gray-600">เลือกประเภทบิล</p>
            <select
            value={searchType.billType || 1}
              className="w-48 px-4 mt-1 py-1 border border-gray-400 rounded-md"
              onChange={(e) => setSearchType((prev)=> ({
                ...prev,
                billType: Number(e.target.value)
              }))}
            >
              <option value="1">ประมูล</option>
              <option value="2">ขายสินค้า</option>
            </select>
          </div>

          <div className="flex flex-col ">
            <p className="text-sm text-gray-600">ประเภทลูกหนี้</p>
            <select
               onChange={(e) => setSearchType((prev)=> ({
                ...prev,
                statusType: e.target.value
              }))}
              className="w-48 px-4 mt-1 py-1 border border-gray-400 rounded-md"
            >
              <option value="">ทั้งหมด</option>
              <option value="1">ค้างชำระ</option>
              <option value="2">ชำระแล้ว</option>
            </select>
          </div>
        </div>

        <div className="w-full flex flex-row justify-end gap-4">
          <button
            onClick={() => sendExcel()}
            className="bg-green-600 hover:bg-green-700 w-full lg:w-40 text-white px-4 py-1 rounded-md flex justify-center items-center gap-2"
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
                <th className="px-4 py-2 text-start font-medium ">รหัส</th>
           
                <th className="px-4 py-2 text-start font-medium ">ผู้ชนะ</th>
                <th className="px-4 py-2 text-start font-medium ">วันที่</th>
                <th className="px-4 py-2 text-end font-medium ">จำนวนเงิน</th>
                <th className="px-4 py-2 text-center font-medium  ">
                  ชำระเงิน
                </th>
              </tr>
            </thead>

            <tbody>
              {data?.map((item) => (
                <React.Fragment key={item.id}>
                  <tr className="hover:bg-gray-100   ">
                    <td
                      className="px-4 py-3 font-medium w-1/12  "
                      onClick={() => handleSetModal(1)}
                    >
                      <p
                        className={`cursor-pointer border-l-4 px-2   ${
                          item.status === 1 || item.status === 3
                            ? "bg-red-100 hover:bg-red-300 border-red-700"
                            : "bg-green-100 hover:bg-green-300 border-green-700"
                        }`}
                      >
                        {item.code}
                      </p>
                    </td>
               
                    <td className="px-4 py-3 font-extralight text-gray-800  w-4/12 ">
                      <p className="">{item.name}</p>
                    </td>
                    <td className="px-3 py-3 font-extralight text-gray-800 w-1/12  ">
                      <p className="">{item.date}</p>
                    </td>

                    <td className="px-3 py-3 text-end font-extralight text-gray-800  w-2/12 ">
                      <p className="">
                        {Number(item.price || 0).toLocaleString()}
                      </p>
                    </td>

                    <td className="px-2 py-3 font-extralight text-gray-800 w-2/12  ">
                      <div className="flex justify-center">
                        {item.status === 1 && (
                          <FaRegMoneyBillAlt
                            onClick={() => handlePay(item.id)}
                            size={20}
                            className="text-red-700 cursor-pointer "
                          />
                        )}
                        {item.status === 2 && (
                          <span className="bg-green-100 text-green-700 px-1 rounded-md text-sm">
                            ชำระแล้ว
                          </span>
                        )}
                        {item.status === 3 && " - "}
                      </div>
                    </td>
             

               
                  </tr>
                  <tr key={`${item.id}-divider`}>
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
    </div>
  );
};

export default Page;
