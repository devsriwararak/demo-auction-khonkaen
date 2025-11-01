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
  unit: string;
  category_id: number;
  category_name: string;
}


// ---- Props ของโมดัล ----
interface ModalAddProductProps {
  open: boolean; // หน้า parent จะกำหนด open/close
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAddProduct: (
    catId: number,
    productName: string,
    quantity: number,
    price: number,
    total: number,
    category_name: string,
    product_id: number,
    unit: string
  ) => boolean; // เปลี่ยนเป็น void
}

const ModalAddProduct: React.FC<ModalAddProductProps> = ({
  open,
  setOpen,
  onAddProduct,
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

  const [inputQty, setInputsQty] = useState<{ [key: number]: string }>({});
  const [inputPrice, setInputPrice] = useState<{ [key: number]: string }>({});

  // ระบบ Pagination
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const token = decryptToken();

  // ปิดโมดัล
  const handleClose = () => {
    setOpen(false);
  };

  // ---- 1) โหลด Category ทั้งหมด ----
  const fetchDataCategory = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/category/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 200) {
        const categories = res.data.map(
          (item: { id: number; name: string }) => ({
            value: item.id,
            label: item.name,
          })
        );
        // เพิ่มตัวเลือก "ทั้งหมด"
        const allOption = { value: 0, label: "ทั้งหมด" };
        setCategoryData([allOption, ...categories]);
      }
    } catch (error) {
      console.error("fetchDataCategory error:", error);
    }
  };

  // ---- 2) โหลดรายการสินค้าตามเงื่อนไข ----
  const fetchData = async () => {
    try {
      const sendData = {
        page,
        category_id: selectedCategory || 0,
        search,
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/all`,
        sendData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 200) {
        setData(res.data.result);
        setTotalPage(res.data.totalPages);
      }
    } catch (error) {
      console.error("fetchData error:", error);
    }
  };

  // ---- 3) เมื่อผู้ใช้กรอก quantity ในแต่ละสินค้า ----
  const handleInputChange = (productId: number, value: string, numb:number) => {
    if(numb === 1){
        setInputsQty((prev) => ({
            ...prev,
            [productId]: value,
          }));
    } else if(numb === 2){
        setInputPrice((prev) => ({
            ...prev,
            [productId]: value,
          }));
    }

  };

  const handleSelectProduct = (categoryId: number, product: DataType) => {
    console.log({ product });

    // ดึงค่าจำนวน
    const enteredQty = inputQty[product.id];
    const enteredPrice = inputPrice[product.id] 

    if (!enteredQty || Number(enteredQty) <= 0) {
      toast.error("กรุณาระบุจำนวน (มากกว่า 0) ก่อนเลือกสินค้า!");
      return;
    }

    const quantityNumber = Number(enteredQty);
    const priceNumber = Number(enteredPrice)
    if (isNaN(quantityNumber)) {
      toast.error("กรุณากรอกจำนวนเป็นตัวเลขเท่านั้น!");
      return;
    }
    const total = priceNumber * quantityNumber || 0

    // เรียกฟังก์ชัน parent
    const success = onAddProduct(
      categoryId,
      product.name,
      quantityNumber,
      priceNumber,
      total ,
      product.category_name,
      product.id,
      product.unit
    );
    console.log("success", success);

    if (success) {
      // ถ้าสำเร็จ
      toast.success(
        `บันทึกข้อมูล "${product.name}" `
      );
    } else {
      // ถ้าซ้ำ
      toast.error(`เลือกสินค้านี้ไปแล้ว!`);
    }
    setInputsQty({});
    setInputPrice({})
  };

  useEffect(() => {
    setIsClient(true);
    fetchDataCategory();
  }, []);

  useEffect(() => {
    fetchData();
  }, [search, selectedCategory, page]);


  return (
    <Dialog open={open} onClose={handleClose} className="relative z-20">
      {/* Backdrop */}
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity 
                   data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 
                   data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          className="flex min-h-full items-end justify-center p-4 
                        text-center sm:items-center sm:p-0"
        >
          <DialogPanel
            transition
            className="relative transform overflow-hidden 
                       rounded-lg bg-white text-left shadow-xl transition-all 
                       data-[closed]:translate-y-4 data-[closed]:opacity-0 
                       data-[enter]:duration-300 data-[leave]:duration-200 
                       data-[enter]:ease-out data-[leave]:ease-in 
                       sm:my-8 sm:w-full sm:max-w-5xl 
                       data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            {/* Header */}
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="flex flex-row gap-4">
                <div>
                  <MdOutlineAddShoppingCart
                    aria-hidden="true"
                    className="h-6 w-6 text-red-600"
                  />
                </div>
                <div>
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-gray-900"
                  >
                    จัดการสินค้า
                  </DialogTitle>
                </div>
              </div>

              {/* Body */}
              <div className="mt-2 w-full">
                {/* ส่วนค้นหา */}
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  {/* เลือกหมวดหมู่ */}
                  <div className="w-full sm:w-1/2">
                    <label className="text-gray-700 font-light text-sm">
                      เลือกหมวดหมู่สินค้า
                    </label>
                    {isClient && (
                      <Select
                        options={categoryData}
                        onChange={(selectedOption: SingleValue<OptionType>) => {
                          if (!selectedOption) {
                            setSelectedCategory(null);
                            return;
                          }
                          const catId = Number(selectedOption.value) || 0;
                          setSelectedCategory(catId > 0 ? catId : null);
                          setPage(1); // รีเซ็ตหน้า
                        }}
                        placeholder="ทั้งหมด"
                        isClearable
                        className="mt-1"
                      />
                    )}
                  </div>

                  {/* ช่องค้นหา */}
                  <div className="w-full sm:w-1/2">
                    <label className="text-gray-700 font-light text-sm">
                      ค้นหาสินค้า
                    </label>
                    <input
                      type="text"
                      className="px-4 py-1.5 border border-gray-300 
                                 shadow-md rounded-md w-full mt-1"
                      placeholder="เช่น พระ, iPhone"
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
                          ชื่อ
                        </th>
                        <th className="px-4 py-3 text-start font-medium">
                          หน่วยนับ
                        </th>
                        <th className="px-4 py-3 text-start font-medium">
                          หมวดหมู่
                        </th>
                        <th className="px-4 py-3 text-start font-medium">
                          จำนวน
                        </th>
                        <th className="px-4 py-3 text-start font-medium">
                          ราคา
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
                            <td className="px-4 py-3 font-medium w-5/12">
                              {item.name}
                            </td>
                            <td className="px-4 py-3 text-gray-800 w-2/12">
                              {item.unit}
                            </td>
                            <td className="px-4 py-3 w-2/12">{item.category_name}</td>
                            <td className="px-4 py-3 w-1/12">
                              <input
                                value={inputQty[item.id] || ""}
                                onChange={(e) =>
                                  handleInputChange(item.id, e.target.value,1)
                                }
                                type="number"
                                className="w-16 bg-gray-50 px-2 py-1 
                                           rounded-md border border-gray-300"
                                placeholder="0"
                              />
                            </td>
                            <td className="px-4 py-3 w-1/12">
                              <input
                                value={inputPrice[item.id] || ""}
                                onChange={(e) =>
                                  handleInputChange(item.id, e.target.value,2)
                                }
                                type="number"
                                className="w-16 bg-gray-50 px-2 py-1 
                                           rounded-md border border-gray-300"
                                placeholder="0"
                              />
                            </td>
                            <td className="px-4 py-3 w-1/12">
                              <TbHandClick
                                onClick={() =>
                                  handleSelectProduct(item.category_id, item)
                                }
                                size={28}
                                className="bg-blue-600 hover:bg-blue-700 
                                           text-white p-1 rounded-full 
                                           cursor-pointer"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={6}>
                              <hr />
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <Pagination
                  page={page}
                  setPage={setPage}
                  totalPage={totalPage}
                />
              </div>
            </div>

            {/* Footer */}
            <div
              className="bg-gray-50 px-4 py-3 
                            sm:flex sm:flex-row-reverse sm:px-6"
            >
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

export default ModalAddProduct;
