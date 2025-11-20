// // ModalChangePrice.tsx
// // ต้องการแก้ไขจำนวนเงินที่ส่งมาจาก ID นั้นๆ
// "use client";
// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogBackdrop,
//   DialogPanel,
//   DialogTitle,
// } from "@headlessui/react";
// import { toast } from "react-toastify";

// // ---- Props ของโมดัล ----
// interface CustomerType {
//   id: string | number
//   customer_id: number;
//   customer_name: string;
//   price: number;
// }

// interface ModalAddProductProps {
//   open: boolean; // หน้า parent จะกำหนด open/close
//   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   onAddChangePrice: (cusId: number, price: number) => void;
//   cusId: number | null;
//   price: number | null;
//   customers: CustomerType[];
// }

// const ModalChangePrice: React.FC<ModalAddProductProps> = ({
//   open,
//   setOpen,
//   onAddChangePrice,
//   cusId,
//   price,
//   customers,
// }) => {
//   const [priceState, setPriceState] = useState<number | string>(price || "");

//   // const handleSubmit = () => {
//   //   if (!priceState || isNaN(Number(priceState))) {
//   //     toast.error("กรุณากรอกจำนวนเงินที่ถูกต้อง");
//   //     return;
//   //   }

//   //   const numericPrice = Number(priceState);
//   //   const numericId = Number(cusId);

//   //   // หาราคามากที่สุดใน customers
//   //   const maxPrice = Math.max(...customers.map((item) => item.price));


//   //   if (numericPrice <= maxPrice) {
//   //     toast.error(
//   //       `จำนวนเงินต้องไม่น้อยกว่าจำนวนเงินสูงสุดในปัจจุบัน (${maxPrice} บาท)`
//   //     );
//   //     return;
//   //   }

//   //   toast.success('บันทึกสำเร็จ')
//   //   onAddChangePrice(numericId, numericPrice);
//   //   setOpen(false);
//   // };


//   // 1. แถว 1 ราคา 10000
//   // 2. แถวอื่นๆ ราคา 500
//   // 3. แถวอื่น ๆ ราคา 400
//   //  ถ้าแถวไหนต้องการ แก้ไขข้อมูลราคาตัวเองได้ แต่ต้องไม่ให้ต่ำกว่าแถวอื่น ช่น แถว 1 ต้องการแก้เป็น 900 ได้ พราะ มากกว่้า 500 และ 400



//   const handleSubmit = () => {
//     if (!priceState || isNaN(Number(priceState))) {
//       toast.error("กรุณากรอกจำนวนเงินที่ถูกต้อง");
//       return;
//     }

//     const numericPrice = Number(priceState);
//     const numericId = Number(cusId);

//     // หา Index ของแถวที่กำลังแก้ไข
//     const currentIndex = customers.findIndex((item) => item.id === numericId);

//     // 1. เช็คกับแถวที่ "ถูกกว่า" (แถวถัดไป / แถวข้างล่าง)
//     // ถ้ามีแถวถัดไป ให้เช็คว่าราคาเราต้องมากกว่าแถวนั้น
//     const nextRow = customers[currentIndex + 1];
//     if (nextRow && numericPrice < nextRow.price) {
//       toast.error(`จำนวนเงินต้องไม่น้อยกว่าแถวถัดไป (${nextRow.price} บาท)`);
//       return;
//     }

//     // (แถม) 2. เช็คกับแถวที่ "แพงกว่า" (แถวก่อนหน้า / แถวข้างบน) - ถ้าต้องการ
//     // ถ้ามีแถวก่อนหน้า ให้เช็คว่าราคาเราต้องไม่เกินแถวนั้น
//     const prevRow = customers[currentIndex - 1];
//     if (prevRow && numericPrice > prevRow.price) {
//       toast.error(`จำนวนเงินต้องไม่มากกว่าแถวก่อนหน้า (${prevRow.price} บาท)`);
//       return;
//     }

//     // --- ถ้าอยากใช้ Logic เดิมเฉพาะ แถวที่ 1 (Top Tier) ---
//     // ถ้าแถวถัดไปทั้งหมดต้องถูกกว่าเรา (ใช้กรณี Top Tier)
//     if (currentIndex === 0) { // หรือเช็ค conditions อื่นที่ระบุว่าเป็นแถว 1
//       const otherRows = customers.filter((item) => item.id !== numericId);
//       const maxLowerTier = Math.max(...otherRows.map((item) => item.price), 0);

//       if (numericPrice < maxLowerTier) {
//         toast.error(`จำนวนเงินต้องไม่น้อยกว่าแถวอื่นๆ (${maxLowerTier} บาท)`);
//         return;
//       }
//     }

//     toast.success("บันทึกสำเร็จ");
//     onAddChangePrice(numericId, numericPrice);
//     setOpen(false);
//   };

//   return (
//     <Dialog open={open} onClose={setOpen} className="relative z-10">
//       <DialogBackdrop
//         transition
//         className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
//       />

//       <div className=" fixed inset-0 z-10 w-screen overflow-y-auto">
//         <div className=" flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
//           <DialogPanel
//             transition
//             className=" relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-sm data-closed:sm:translate-y-0 data-closed:sm:scale-95"
//           >
//             <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//               <div className="sm:flex sm:items-start">
//                 <div className="mt-3 text-center sm:mt-0  sm:text-left">
//                   <DialogTitle
//                     as="h3"
//                     className="text-base font-semibold text-gray-900"
//                   >
//                     แก้ไขจำนวนเงิน
//                   </DialogTitle>
//                   <div className="mt-2">
//                     <input
//                       type="number"
//                       value={priceState || ""}
//                       onChange={(e) => setPriceState(e.target.value)}
//                       placeholder="กรอกจำนวนเงิน"
//                       className="w-full py-1  rounded-md  border border-gray-400 shadow-sm px-4"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 sm:ml-3 sm:w-auto"
//               >
//                 บันทึก
//               </button>
//               <button
//                 type="button"
//                 data-autofocus
//                 onClick={() => setOpen(false)}
//                 className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
//               >
//                 ยกเลิก
//               </button>
//             </div>
//           </DialogPanel>
//         </div>
//       </div>
//     </Dialog>
//   );
// };

// export default ModalChangePrice;

// ModalChangePrice.tsx
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
  customer_id?: number; // ใส่ ? เผื่อบางทีไม่มี
  customer_name?: string;
  price: number;
}

interface ModalAddProductProps {
  open: boolean;
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
  const [priceState, setPriceState] = useState<number | string>("");

  // อัปเดต State เมื่อเปิด Modal หรือเปลี่ยน ID (UX ที่ดี)
  useEffect(() => {
    if (open && price !== null) {
      setPriceState(price);
    }
  }, [open, price, cusId]);



const handleSubmit = () => {
    if (!priceState || isNaN(Number(priceState))) {
      toast.error("กรุณากรอกจำนวนเงินที่ถูกต้อง");
      return;
    }

    const newPrice = Number(priceState);
    const targetId = Number(cusId);

    const currentIndex = customers.findIndex(
      (item) => Number(item.customer_id) === targetId
    );

    if (currentIndex === -1) {
      toast.error("ไม่พบข้อมูล");
      return;
    }

    // --- หาแถวถัดไป (รุ่นน้อง) ---
    const nextRow = customers[currentIndex + 1];

    // ❌ ปิดการเช็คแถวก่อนหน้า (รุ่นพี่) เพื่อให้ราคาแซงกันได้ตามต้องการ
    /* const prevRow = customers[currentIndex - 1];
    if (prevRow) {
      const prevPrice = Number(prevRow.price);
      if (newPrice >= prevPrice) {
        toast.error(`ราคาต้องถูกกว่าแถวด้านบน (ห้ามเกิน ${prevPrice} บาท)`);
        return;
      }
    }
    */

    // ✅ เหลือไว้แค่เช็คแถวถัดไป (รุ่นน้อง) ว่าห้ามต่ำกว่าเขา
    // (เช่น แก้แถว 2 เป็น 60,000 ได้ แต่ห้ามต่ำกว่าแถว 3 ที่เป็น 1,000)
    if (nextRow) {
      const nextPrice = Number(nextRow.price);
      // ถ้าใส่ 60,000 (newPrice) > 1,000 (nextPrice) --> ผ่าน
      if (newPrice <= nextPrice) { 
        toast.error(
            `ราคาต้องมากกว่าแถวด้านล่าง (ต้องมากกว่า ${nextPrice} บาท)`
        );
        return;
      }
    }

    // บันทึก
    toast.success("บันทึกสำเร็จ");
    onAddChangePrice(targetId, newPrice);
    setOpen(false);
  };



  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-sm data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-gray-900"
                  >
                    แก้ไขจำนวนเงิน
                  </DialogTitle>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ราคาใหม่
                    </label>
                    <input
                      type="number"
                      value={priceState}
                      onChange={(e) => setPriceState(e.target.value)}
                      placeholder="กรอกจำนวนเงิน"
                      className="w-full py-2 rounded-md border border-gray-300 shadow-sm px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      autoFocus // ให้ cursor เด้งมาช่องนี้เลย
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