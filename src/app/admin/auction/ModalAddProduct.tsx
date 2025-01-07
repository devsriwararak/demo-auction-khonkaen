"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import Select from "react-select";
import { FaRegTrashAlt } from "react-icons/fa";

interface ModalAddProductProps {
  open: boolean;
  setOpen: (item: { product: boolean; customer: boolean }) => void;
}
const ModalAddProduct: React.FC<ModalAddProductProps> = ({ open, setOpen }) => {
  const [isClient, setIsClient] = useState(false);

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  const handleClose = () => {
    setOpen({ product: false, customer: false });
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start ">
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-8">
                  <MdOutlineAddShoppingCart
                    aria-hidden="true"
                    className="size-5 text-red-600"
                  />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-gray-900 "
                  >
                    จัดการสินค้า
                  </DialogTitle>
                </div>
              </div>

              {/* Contents */}

              <div className="mt-2 w-full ">
                <div className="flex flex-row gap-4 items-end ">
                  <div className="w-full">
                    <p className="text-gray-700 font-light text-sm">
                      เลือกหมวดหมู่สินค้า
                    </p>
                    {isClient ? (
                      <Select options={options} className="mt-2" />
                    ) : null}
                  </div>

                  <div className="w-full">
                    <p className="text-gray-700 font-light text-sm mt-4">
                      ค้นหาสินค้า
                    </p>
                    <input
                      type="text "
                      className="px-4 py-1.5 border border-gray-300  shadow-md mt-1 rounded-md"
                      placeholder="ค้นหาสินค้า"
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto border rounded-lg mt-5 ">
                  <table className="table-auto  w-full text-sm ">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-300  ">
                        <th className="px-4 py-3 text-start font-medium ">
                          ชื่อ
                        </th>
                        <th className="px-4 py-3 text-start font-medium ">
                          จำนวน
                        </th>
                        <th className="px-4 py-3 text-start font-medium ">
                          หน่วยนับ
                        </th>
                        <th className="px-4 py-3 text-start font-medium ">
                          ลบ
                        </th>
                      </tr>
                    </thead>

                    <tbody className="">
                      <tr className="">
                        <td className="px-4 py-3">ส้มมงคล ถาดที่ 1</td>
                        <td className="px-4 py-3 font-light text-gray-600">
                          10
                        </td>
                        <td className="px-4 py-3 font-light text-gray-600">
                          ชิ้น
                        </td>
                        <td className="px-4 py-3 font-light text-gray-600">
                          <FaRegTrashAlt size={18} className="text-red-500" />
                        </td>
                      </tr>
                      <tr className="bg-gray-100">
                        <td className="px-4 py-3">บูชาองค์เทพเจ้า</td>
                        <td className="px-4 py-3 font-light text-gray-600">
                          20
                        </td>
                        <td className="px-4 py-3 font-light text-gray-600">
                          องค์
                        </td>
                        <td className="px-4 py-3 font-light text-gray-600">
                          <FaRegTrashAlt size={18} className="text-red-500" />
                        </td>
                      </tr>
                      <tr className="">
                        <td className="px-4 py-3">ตะเกียงฟ้าดิน</td>
                        <td className="px-4 py-3 font-light text-gray-600">
                          30
                        </td>
                        <td className="px-4 py-3 font-light text-gray-600">
                          ชิ้น
                        </td>
                        <td className="px-4 py-3 font-light text-gray-600">
                          <FaRegTrashAlt size={18} className="text-red-500" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={() => handleClose()}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
                ออก
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => handleClose()}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                บันทึก
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalAddProduct;
