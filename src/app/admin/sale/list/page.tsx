"use client";
import Pagination from "@/app/components/Pagination";
import React, { useEffect, useState } from "react";
import { FiList } from "react-icons/fi";
import { RiFileExcel2Line } from "react-icons/ri";
import { FaRegEdit, FaRegMoneyBillAlt, FaRegTimesCircle } from "react-icons/fa";

import Swal from "sweetalert2";

import { createExcel, decryptData, decryptToken, errorMessage, formathDateThai } from "@/lib/tool";
import axios from "axios";
import moment from "moment";
// import ModalById from "./ModalById";
import { toast } from "react-toastify";
import EditSale from "./EditSale";
import ModalPdf from "@/app/components/modals/ModalPdf";
import Cookies from "js-cookie";
import DatePickerOne from "@/app/components/ui/DatePickerOne";

interface dataType {
  id: number;
  code: string;
  title: string;
  name: string;
  date: string;
  price: number;
  status: number;
}

const PageSaleList = () => {
  // States
  const [openModalById, setOpenModalById] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalPdf, setOpenModalPdf] = useState(false);
  const [search, setSearch] = useState("");
  const [data, setData] = useState<dataType[]>([]);
  const [id, setId] = useState(0);
  const [header, setHeader] = useState<string>("");
  const [status, setStatus] = useState<number | null>(null)


  // Systems
  const token = decryptToken();
  const dateNow = moment().format("YYYY-MM-DD");

  const [searchDate, setSearchDate] = useState({
    startDate: dateNow,
    endDate: dateNow,
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

  const handleSetModal = async (id: number, numb: number, header: string) => {
    setId(id);
    setHeader(header);
    await handleOpenModal(numb);
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/sale/all`,
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
        startDate: searchDate.startDate,
        endDate: searchDate.endDate,
        search,
      };
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sale/send/excel`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
          params: sendData,
        }
      );

      await createExcel(res.data, sendData, "รายการขายสินค้า");
    } catch (error) {
      console.log(error);
    }
  };

  const handlePay = async (id: number) => {
    // Swal.fire({
    //   title: "ชำระเงิน ?",
    //   text: "กรุณาตรวจสอบให้แน่ใจก่อนชำระเงิน  !",
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonColor: "green",
    //   cancelButtonColor: "gray",
    //   confirmButtonText: "ตกลง",
    //   cancelButtonText: "ยกเลิก",
    // }).then(async (result) => {
    //   if (result.isConfirmed) {
    //     try {
    //       const res = await axios.post(
    //         `${process.env.NEXT_PUBLIC_API_URL}/api/sale/add_pay`,
    //         { id },
    //         {
    //           headers: {
    //             Authorization: `Bearer ${token}`,
    //           },
    //         }
    //       );
    //       if (res.status === 200) {
    //         toast.success(res.data.message);
    //         await fetchData();
    //       }
    //     } catch (error: unknown) {
    //       console.log(error);
    //       errorMessage(error);
    //     }
    //   }
    // });

    Swal.fire({
      title: "ชำระเงิน ?",
      text: "กรุณาตรวจสอบให้แน่ใจก่อนชำระเงิน !",
      icon: "warning",
      input: "radio",
      inputOptions: {
        1: "เงินสด",
        2: "เงินโอน",
      },
      inputValue: "1",
      inputValidator: (value) => {
        if (!value) {
          return "กรุณาเลือกวิธีชำระเงิน!";
        }
      },
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "gray",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const paymentMethod = result.value;
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/sale/add_pay`,
            { id, paymentMethod },
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

  const handleCancel = async (id: number, code: string) => {
    Swal.fire({
      title: `ยกเลิกบิล ${code} ?`,
      text: "ยกเลิกบิลจะไม่สามารถกลับมาใช้งานได้  !",
      icon: "warning",
      input: "text",
      inputPlaceholder: "กรุณากรอกหมายเหตุการยกเลิก...",
      inputValidator: (value) => {
        if (!value) {
          return "กรุณากรอกหมายเหตุก่อนดำเนินการ!";
        }
        return null;
      },
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "gray",
      confirmButtonText: "ยกเลิกบิล",
      cancelButtonText: "ออก",
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/sale/cancel`,
            { id, note: result.value },
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
  }, [search, searchDate.startDate, searchDate.endDate, page]);

  useEffect(() => {
    const cookieAuth = Cookies.get("status");
    if (cookieAuth) {
      const status = decryptData(cookieAuth);
      setStatus(Number(status))
    }
  }, []);

  return (
    <div>
      <div className="flex flex-row gap-3 items-center">
        <FiList size={20} />
        <h1 className="text-lg">รายการขายสินค้า</h1>
      </div>

      {openModalEdit && (
        <EditSale
          handleOpenModal={handleOpenModal}
          open={openModalEdit}
          id={id}
          fetchData={fetchData}
          handlePay={handlePay}
          handleCancel={handleCancel}
          handleSetModal={handleSetModal}
          status={status}
        />
      )}

      {openModalPdf && (
        <ModalPdf
          handleOpenModal={handleOpenModal}
          open={openModalPdf}
          id={id}
          header={header}
          type={"sale"}
        />
      )}

      <div className="flex flex-col lg:flex-row gap-3 justify-start items-center mt-4">
        <div className="w-full flex flex-col lg:flex-row gap-3 items-end ">
          <input
            className="w-full lg:w-48 px-2 h-10 lg:px-4 py-1 rounded-md border border-gray-400"
            type="text"
            placeholder="ค้นหาเลขที่บิล"
            onChange={(e) => setSearch(e.target.value)}
          />

          <DatePickerOne
            label="วันที่เริ่มต้น"
            onChange={(newDate) => {
              setSearchDate((prevSearchDate) => ({
                ...prevSearchDate,
                startDate: newDate || "",
              }));
            }}
            value={searchDate?.startDate || ""}
            className='w-full'
          />

          <DatePickerOne
            label="วันที่สิ้นสุด"
            name=""
            onChange={(newDate) => {
              setSearchDate((prevSearchDate) => ({
                ...prevSearchDate,
                endDate: newDate || "",
              }));
            }}
            value={searchDate?.endDate || ""}
            className='w-full'
          />


          {/* 
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
          /> */}
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
                <th className="px-3 py-2 text-start font-medium ">รหัส</th>

                <th className="px-3 py-2 text-start font-medium ">
                  ผู้บริจาค
                </th>
                <th className="px-3 py-2 text-start font-medium ">วันที่</th>
                <th className="px-3 py-2 text-center font-medium ">จำนวนเงิน</th>
                <th className="px-3 py-2 text-center font-medium  ">
                  ชำระเงิน
                </th>
                <th className="px-3 py-2 text-center font-medium ">แก้ไข</th>
                <th className="px-3 py-2 text-center font-medium ">ยกเลิก</th>
              </tr>
            </thead>

            <tbody>
              {data?.map((item) => (
                <React.Fragment key={item.id}>
                  <tr className="hover:bg-gray-100   ">
                    <td className="px-3 py-3 font-medium w-1/12  ">
                      <p
                        className={` border-l-4 px-2   ${item.status === 1 || item.status === 3
                          ? "bg-red-100 hover:bg-red-300 border-red-700"
                          : "bg-green-100 hover:bg-green-300 border-green-700"
                          }`}
                      >
                        {item.code}
                      </p>
                    </td>

                    <td className="px-3 py-3 font-extralight text-gray-800 w-4/12   ">
                      <p className="">{item.name}</p>
                    </td>
                    <td className="px-3 py-3 font-extralight text-gray-800  w-1/12  ">
                      <p className="">{formathDateThai(item.date)}</p>
                    </td>

                    <td className="px-3 py-3 font-extralight text-gray-800 w-2/12 text-center   ">
                      <p className="">
                        {Number(item.price || 0).toLocaleString()}
                      </p>
                    </td>

                    <td className="px-3 py-3 font-extralight text-gray-800  w-1/12  ">
                      <div className="flex justify-center">
                        {item.status === 1 && (
                          <FaRegMoneyBillAlt
                            onClick={() => handlePay(item.id)}
                            size={20}
                            className="text-red-700 cursor-pointer "
                          />
                        )}
                        {item.status === 2 && (
                          <span className="bg-green-100 text-green-700 px-2 rounded-md text-sm">
                            ชำระแล้ว
                          </span>
                        )}
                        {item.status === 3 && " - "}
                      </div>
                    </td>
                    <td className="px-3 py-3 font-extralight text-gray-800 w-1/12   ">
                      <div className="flex justify-center">
                        <FaRegEdit
                          onClick={() => handleSetModal(item.id, 2, "")}
                          size={16}
                          className="text-red-700 cursor-pointer "
                        />
                      </div>
                    </td>

                    <td className="px-3 py-3 font-extralight text-gray-800 w-1/12  ">
                      <div className="flex justify-center">
                        <FaRegTimesCircle
                          onClick={
                            status !== 0 && (item.status === 1 || status === 3)
                              ? () => handleCancel(item.id, item.code)
                              : undefined
                          }
                          size={23}
                          className={` ${(item.status === 2 || item.status === 3 || status === 0) && status !== 3
                            ? "bg-gray-400"
                            : "bg-red-600 cursor-pointer"
                            } text-white p-1 rounded-full  `}
                        />
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

export default PageSaleList;
