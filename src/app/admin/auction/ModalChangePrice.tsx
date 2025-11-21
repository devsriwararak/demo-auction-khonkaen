// "use client";
// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogBackdrop,
//   DialogPanel,
//   DialogTitle,

// } from "@headlessui/react";
// import { toast } from "react-toastify";
// import { optionType } from "@/app/type";
// import Select from "react-select";
// import axios from "axios";
// import { decryptToken } from "@/lib/tool";


// // ---- Props ของโมดัล ----
// interface CustomerType {
//   customer_id?: number; // ใส่ ? เผื่อบางทีไม่มี
//   customer_name?: string;
//   price: number;
// }

// interface ModalAddProductProps {
//   open: boolean;
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
//   const [priceState, setPriceState] = useState<number | string>("");
//   const [optionCustomer, setOptionCustomer] = useState<optionType[]>([]);
//   const [selectCustomer, setSelectCustomer] = useState("")

//   // System 
//   const token = decryptToken()

//     const fetchDataCustomer = async () => {
//     try {
//       const sendData = {
//         page: 0,
//       };
//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/customer/all/`,
//         sendData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (res.status === 200) {
//         const newData: optionType[] = res.data.result.map(
//           (item: optionType) => ({
//             value: item.id,
//             label: item.name,
//           })
//         );

//         setOptionCustomer(newData);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };


//   const handleSubmit = () => {
//     if (!priceState || isNaN(Number(priceState))) {
//       toast.error("กรุณากรอกจำนวนเงินที่ถูกต้อง");
//       return;
//     }

//     const newPrice = Number(priceState);
//     const targetId = Number(cusId);

//     const currentIndex = customers.findIndex(
//       (item) => Number(item.customer_id) === targetId
//     );

//     if (currentIndex === -1) {
//       toast.error("ไม่พบข้อมูล");
//       return;
//     }

//     // --- หาแถวถัดไป (รุ่นน้อง) ---
//     const nextRow = customers[currentIndex + 1];

//     // ✅ เหลือไว้แค่เช็คแถวถัดไป (รุ่นน้อง) ว่าห้ามต่ำกว่าเขา
//     // (เช่น แก้แถว 2 เป็น 60,000 ได้ แต่ห้ามต่ำกว่าแถว 3 ที่เป็น 1,000)
//     if (nextRow) {
//       const nextPrice = Number(nextRow.price);
//       // ถ้าใส่ 60,000 (newPrice) > 1,000 (nextPrice) --> ผ่าน
//       if (newPrice <= nextPrice) {
//         toast.error(
//           `ราคาต้องมากกว่าแถวด้านล่าง (ต้องมากกว่า ${nextPrice} บาท)`
//         );
//         return;
//       }
//     }

//     alert(targetId)
//     // บันทึก
//     toast.success("บันทึกสำเร็จ");
//     onAddChangePrice(targetId, newPrice);
//     setOpen(false);
//   };


//   useEffect(() => {
//     if (open && price !== null) {
//       setPriceState(price);
//       fetchDataCustomer()
//     }
//   }, [open, price, cusId]);



//   return (
//     <Dialog open={open} onClose={setOpen} className="relative z-10">
//       <DialogBackdrop
//         transition
//         className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
//       />
//       <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
//         <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
//           <DialogPanel
//             transition
//             className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-sm data-closed:sm:translate-y-0 data-closed:sm:scale-95"
//           >
//             <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//               <div className="sm:flex sm:items-start">
//                 <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
//                   <DialogTitle
//                     as="h3"
//                     className="text-base font-semibold text-gray-900"
//                   >
//                     แก้ไขจำนวนเงิน
//                   </DialogTitle>

//                   <div className="mt-3 flex flex-col lg:flex-row gap-4 items-center">
//                     {optionCustomer.length > 0 && (
//                       <Select
//                         options={optionCustomer}
//                         value={String(selectCustomer)}
//                         onChange={async (e) => setSelectCustomer(String(e))}
//                         placeholder="เลือกลูกค้าใหม่"
//                         className="text-sm w-2/3 "
//                       />
//                     )}
//                   </div>

//                   <div className="mt-4">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       ราคาใหม่
//                     </label>
//                     <input
//                       type="number"
//                       value={priceState}
//                       onChange={(e) => setPriceState(e.target.value)}
//                       placeholder="กรอกจำนวนเงิน"
//                       className="w-full py-2 rounded-md border border-gray-300 shadow-sm px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
//                       autoFocus 
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

"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { toast } from "react-toastify";
import Select from "react-select";
import axios from "axios";
import { decryptToken } from "@/lib/tool";
import { optionType } from "@/app/type";

interface CustomerType {
  customer_id?: number;
  customer_name?: string;
  price: number;
  id?: string | number
  name? : string | number
}

interface ModalAddProductProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAddChangePrice: (oldCusId: number, newCusId: number, newPrice: number , newCusName: string) => void;
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
  const [optionCustomer, setOptionCustomer] = useState<optionType[]>([]);
  const [selectCustomer, setSelectCustomer] = useState<optionType | null>(null);

  // System
  const token = decryptToken();

  const fetchDataCustomer = async () => {
    try {
      const sendData = { page: 0 };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/customer/all/`,
        sendData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        const newData: optionType[] = res.data.result.map((item: CustomerType) => ({
          value: item.id,
          label: item.name,
        }));
        setOptionCustomer(newData);
        return newData;
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const handleSubmit = () => {
    // 1. เช็คราคา
    if (!priceState || isNaN(Number(priceState))) {
      toast.error("กรุณากรอกจำนวนเงินที่ถูกต้อง");
      return;
    }

    // 2. เช็คว่าเลือกลูกค้าหรือไม่
    if (!selectCustomer) {
      toast.error("กรุณาเลือกลูกค้า");
      return;
    }

    const newPrice = Number(priceState);
    const oldTargetId = Number(cusId);      // ID ของแถวที่กำลังแก้
    const newTargetId = Number(selectCustomer.value); // ID ที่เลือกใหม่

    // ----------------------------------------------------------
    // ✅ ส่วนที่เพิ่ม: เช็คชื่อซ้ำ (Duplicate Check)
    // ----------------------------------------------------------
    const isDuplicate = customers.some((item) => {
      // ถ้า ID ในรายการ ตรงกับ ID ใหม่ที่เลือก
      const isMatch = Number(item.customer_id) === newTargetId;
      // และต้องไม่ใช่แถวตัวเอง (กรณีเลือกคนเดิมแต่แก้ราคา ถือว่าไม่ซ้ำ)
      const isNotSelf = Number(item.customer_id) !== oldTargetId;

      return isMatch && isNotSelf;
    });

    if (isDuplicate) {
      toast.error(`ลูกค้า "${selectCustomer.label}" มีอยู่ในรายการแล้ว`);
      return;
    }
    // ----------------------------------------------------------

    const currentIndex = customers.findIndex(
      (item) => Number(item.customer_id) === oldTargetId
    );

    if (currentIndex === -1) {
      toast.error("ไม่พบข้อมูลแถวเดิม");
      return;
    }

    // --- เช็คราคาตามลำดับชั้น (Hierarchy Check) ---
    const nextRow = customers[currentIndex + 1];

    if (nextRow) {
      // ถ้าแถวถัดไปเป็นคนเดียวกับที่เราจะเปลี่ยนไปหา (กรณีสลับที่) อาจจะต้องระวัง Logic นี้
      // แต่ถ้าเช็คซ้ำด้านบนแล้ว กรณีนี้จะไม่เกิดขึ้น (เพราะถ้าซ้ำมันจะเด้งออกไปก่อน)
      
      const nextPrice = Number(nextRow.price);
      if (newPrice <= nextPrice) {
        toast.error(`ราคาต้องมากกว่าแถวด้านล่าง (ต้องมากกว่า ${nextPrice} บาท)`);
        return;
      }
    }

    // บันทึก
    // toast.success("บันทึกสำเร็จ");
    onAddChangePrice(oldTargetId, newTargetId, newPrice , selectCustomer.label);
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      if (price !== null) setPriceState(price);
      
      const loadData = async () => {
        const options = await fetchDataCustomer();
        if (cusId && options) {
          const currentCus = options.find((op) => Number(op.value) === Number(cusId));
          if (currentCus) setSelectCustomer(currentCus);
        }
      };
      loadData();
    }
  }, [open, price, cusId]);

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
                  <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                    แก้ไขข้อมูล
                  </DialogTitle>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ลูกค้า
                    </label>
                    <Select
                      options={optionCustomer}
                      value={selectCustomer}
                      onChange={(newValue) => setSelectCustomer(newValue as optionType)}
                      placeholder="เลือกลูกค้า"
                      className="text-sm w-full z-50"
                      menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                      styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                    />
                  </div>

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