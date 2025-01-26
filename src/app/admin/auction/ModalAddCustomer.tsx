"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import Select, { SingleValue } from "react-select";
import { TbHandClick } from "react-icons/tb";
import { toast } from "react-toastify";
import axios from "axios";

// ICONS

// COMPONENTS
import Pagination from "@/app/components/Pagination";

// UTILS
import { decryptToken } from "@/lib/tool";

// -------------------- Types --------------------
interface OptionType {
  value: number | string;
  label: string;
}

interface DataType {
  id: number;
  name: string;
  code: string;
  price: number;
}



// ---- Props ของโมดัล ----
interface ModalAddProductProps {
  open: boolean; // หน้า parent จะกำหนด open/close
  setOpen: React.Dispatch<React.SetStateAction<boolean>>; 
  onAddCustomer: (cusId: number, cusName: string, price: number) => boolean; // เปลี่ยนเป็น void
}

const ModalAddCustomer: React.FC<ModalAddProductProps> = ({
  open,
  setOpen,
  onAddCustomer,
}) => {
  const [isClient, setIsClient] = useState(false);

  // ตัวเลือก Category ทั้งหมดจาก API (/api/product/category/all)
  const [categoryData, setCategoryData] = useState<OptionType[]>([]);

  // Category ที่ผู้ใช้เลือกขณะค้นหา
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // คำค้นหา
  const [search, setSearch] = useState("");

  // รายการสินค้า (DataType[]) ที่ดึงจาก API
  const [data, setData] = useState<DataType[]>([]);

  // เก็บจำนวน (quantity) ที่ผู้ใช้พิมพ์ในแต่ละแถว: { productId: string }
  const [inputs, setInputs] = useState<{ [key: number]: string }>({});

  // ระบบ Pagination
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const token = decryptToken();

  const handleClose = () => {
    setOpen(false);
  };

  const fetchData = async () => {
    try {
      const sendData = {
        page,
        search,
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/customer/all`,
        sendData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 200) {
        console.log(res.data);
        
        setData(res.data.result);
        setTotalPage(res.data.totalPages);
      }
    } catch (error) {
      console.error("fetchData error:", error);
    }
  };

  // ---- 3) เมื่อผู้ใช้กรอก quantity ในแต่ละสินค้า ----
  const handleInputChange = (productId: number, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleSelectProduct = ( category: DataType) => {
    // console.log({category});
    
    // ดึงค่าจำนวน
    const enteredQty = inputs[category.id];
    if (!enteredQty || Number(enteredQty) <= 0) {
      toast.error("กรุณาระบุจำนวน (มากกว่า 0) ก่อนเลือกสินค้า!");
      return;
    }
    const quantityNumber = Number(enteredQty);
    if (isNaN(quantityNumber)) {
      toast.error("กรุณากรอกจำนวนเป็นตัวเลขเท่านั้น!");
      return;
    }
  
    // เรียกฟังก์ชัน parent
    const success = onAddCustomer(category.id,category.name, quantityNumber);
    // console.log('success', success);
    
  
    // ตรวจค่า success (true=เพิ่มสำเร็จ, false=ซ้ำ)
    if (success) {
      // ถ้าสำเร็จ
      toast.success(`บันทึกข้อมูล "${category.name}" จำนวน ${enteredQty} เรียบร้อย`);
    } else {
      // ถ้าซ้ำ
      toast.error(`เลือกสินค้านี้ไปแล้ว!`);
    }
    setInputs({})
  };


  // ---- useEffect: โหลด Category ครั้งแรก ----
  useEffect(() => {
    setIsClient(true);
  }, []);

  // ทุกครั้งที่ search, selectedCategory, page เปลี่ยน -> fetch ใหม่
  useEffect(() => {
    fetchData();
  }, [search, selectedCategory, page]);

  // -------------------------------------------------
  // Render
  // -------------------------------------------------
  return (
    <Dialog open={open} onClose={handleClose} className="relative z-10">
      {/* Backdrop */}
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity 
                   data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 
                   data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 
                        text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden 
                       rounded-lg bg-white text-left shadow-xl transition-all 
                       data-[closed]:translate-y-4 data-[closed]:opacity-0 
                       data-[enter]:duration-300 data-[leave]:duration-200 
                       data-[enter]:ease-out data-[leave]:ease-in 
                       sm:my-8 sm:w-full sm:max-w-xl 
                       data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            {/* Header */}
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 shrink-0 
                                items-center justify-center rounded-full bg-red-100 sm:mx-0">
                  <MdOutlineAddShoppingCart
                    aria-hidden="true"
                    className="h-6 w-6 text-red-600"
                  />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-gray-900"
                  >
                    จัดการผู้บริจาค
                  </DialogTitle>
                </div>
              </div>

              {/* Body */}
              <div className="mt-2 w-full">
                {/* ส่วนค้นหา */}
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  {/* ช่องค้นหา */}
                  <div className="w-full sm:w-1/2">
                    <label className="text-gray-700 font-light text-sm">
                      ค้นหาผู้บริจาค
                    </label>
                    <input
                      type="text"
                      className="px-4 py-1.5 border border-gray-300 
                                 shadow-md rounded-md w-full mt-1"
                      placeholder="เช่น บริษัท ABC จำกัด"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                    />
                  </div>
                </div>

                {/* Table แสดงรายการสินค้า */}
                <div className="overflow-x-auto border rounded-lg mt-5">
                  <table className="table-auto w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-300">
                        <th className="px-4 py-3 text-start font-medium">
                          รหัส
                        </th>
                        <th className="px-4 py-3 text-start font-medium">
                          ชื่อสกุล
                        </th>
                        
                        <th className="px-4 py-3 text-start font-medium">
                          จำนวนเงิน
                        </th>
                        <th className="px-4 py-3 text-start font-medium">
                          เลือก
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item) => (
                        <React.Fragment key={item.id}>
                          <tr className="hover:bg-gray-100">
                            <td className="px-4 py-3 font-medium">
                              {item.code}
                            </td>
                            <td className="px-4 py-3 text-gray-800">
                              {item.name}
                            </td>
                            <td className="px-4 py-3">
                              <input
                                value={inputs[item.id] || ""}
                                onChange={(e) =>
                                  handleInputChange(item.id, e.target.value)
                                }
                                type="text"
                                className="w-16 bg-gray-50 px-2 py-1 
                                           rounded-md border border-gray-300"
                                placeholder="0"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <TbHandClick
                                onClick={() =>
                                  handleSelectProduct(item)
                                }
                                size={28}
                                className="bg-blue-600 hover:bg-blue-700 
                                           text-white p-1 rounded-full 
                                           cursor-pointer"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5}>
                              <hr />
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <Pagination page={page} setPage={setPage} totalPage={totalPage} />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 
                            sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex w-full justify-center rounded-md 
                           bg-red-600 px-3 py-2 text-sm font-semibold text-white 
                           shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
                ปิด
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalAddCustomer;