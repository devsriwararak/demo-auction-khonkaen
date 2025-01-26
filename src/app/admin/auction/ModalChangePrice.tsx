// ModalChangePrice.tsx
// ต้องการแก้ไขจำนวนเงินที่ส่งมาจาก ID นั้นๆ
"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { toast } from "react-toastify";

// ---- Props ของโมดัล ----
interface CustomerType {
  customer_id: number;
  customer_name: string;
  price: number;
}

interface ModalAddProductProps {
  open: boolean; // หน้า parent จะกำหนด open/close
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAddChangePrice: (cusId: number, price: number) => void;
  cusId: number | null;
  price: number | null;
  customers: CustomerType[];
}

const ModalChangePrice: React.FC<ModalAddProductProps> = ({
  open,
  setOpen,
  onAddChangePrice,
  cusId,
  price,
  customers,
}) => {
  const [priceState, setPriceState] = useState<number | string>(price || "");

  const handleSubmit = () => {
    if (!priceState || isNaN(Number(priceState))) {
      toast.error("กรุณากรอกจำนวนเงินที่ถูกต้อง");
      return;
    }

    const numericPrice = Number(priceState);
    const numericId = Number(cusId);

    // หาราคามากที่สุดใน customers
    const maxPrice = Math.max(...customers.map((item) => item.price));


    if (numericPrice <= maxPrice) {
      toast.error(
        `จำนวนเงินต้องไม่น้อยกว่าจำนวนเงินสูงสุดในปัจจุบัน (${maxPrice} บาท)`
      );
      return;
    }

    toast.success('บันทึกสำเร็จ')
    onAddChangePrice(numericId, numericPrice);
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className=" fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className=" flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className=" relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-sm data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0  sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-gray-900"
                  >
                    แก้ไขจำนวนเงิน
                  </DialogTitle>
                  <div className="mt-2">
                    <input
                      type="number"
                      value={priceState || ""}
                      onChange={(e) => setPriceState(e.target.value)}
                      placeholder="กรอกจำนวนเงิน"
                      className="w-full py-1  rounded-md  border border-gray-400 shadow-sm px-4"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 sm:ml-3 sm:w-auto"
              >
                บันทึก
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                ยกเลิก
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalChangePrice;
