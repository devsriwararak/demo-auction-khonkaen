"use client";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import React from "react";
import axios from "axios";
// import { useRouter } from "next/navigation"; // ใช้งานจริงให้ uncomment
// import { convertNumberToThaiWords, decryptToken, formathDateThai, getThaiFiscalYear } from "@/lib/tool"; // ใช้งานจริงให้ uncomment

// --- Mock Helpers (สำหรับ Preview เท่านั้น - ในโค้ดจริงให้ Import จาก @/lib/tool) ---

const decryptToken = () => {
  if (typeof window !== 'undefined') return localStorage.getItem('token') || '';
  return '';
};

const formathDateThai = (dateStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getThaiFiscalYear = () => {
  const date = new Date();
  return date.getMonth() >= 9 ? date.getFullYear() + 544 : date.getFullYear() + 543;
};

const convertNumberToThaiWords = (amount: number): string => {
  return amount ? `${amount.toLocaleString()} บาทถ้วน` : "ศูนย์บาทถ้วน";
};

// --- End Mock Helpers ---

type ModalPropsType = {
  open: boolean;
  handleOpenModal: (numb: number) => void;
  id: number;
  header: string
  type: string
};

interface ProductItem {
  id: number;
  product_name: string;
  qty: number;
  unit: string;
  price: number;
  total: number;
  name : string
  quantity : string | number
}

interface SendDataType {
  id: number;
  code: string;
  title: string;
  date: string;
  government: number;
  lottery: number;
  name: string;
  price: number;
  status: number;
  noun: string;
  ref: string;
  tel: string;
  address_customer: string;
  address_send: string;
  contact: string;
  note: string;
  customer_id: number;
  products: ProductItem[];
}

const ModalReportProductList: React.FC<ModalPropsType> = ({
  open,
  handleOpenModal,
  id,
  header,
  type
}) => {
  const [sendData, setSendData] = useState<SendDataType>({
    id: 0,
    code: "",
    title: "",
    date: "",
    government: 0,
    lottery: 0,
    name: "",
    price: 0,
    status: 0,
    noun: "",
    ref: "",
    tel: "",
    address_customer: "",
    address_send: "",
    contact: "",
    note: "",
    customer_id: 0,
    products: [],
  });

  // ✅ เรียกใช้ Token ตามรูปแบบที่คุณต้องการ
  const token = decryptToken();
  // const router = useRouter(); // ใช้งานจริงหากต้องการ redirect
  const pdfContentRef = useRef<HTMLDivElement>(null);

  // ดึงข้อมูลส่วนหัวบิล (Header)
  const fetchDataHeader = async () => {
    if (!id) return;
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      
      // ✅ ส่ง Authorization Header ตามรูปแบบที่คุณกำหนด
      const res = await axios.get(
        `${baseURL}/api/${type}/all/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setSendData((prev) => ({
          ...prev,
          ...res.data 
        }));
      }
    } catch (error) {
      console.error("Fetch Header Error:", error);
    }
  };

  // ดึงข้อมูลรายการสินค้า (Products)
  const fetchDataProducts = async () => {
     if (!id) return;
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      
      // ✅ ส่ง Authorization Header
      const res = await axios.get(
        `${baseURL}/api/${type}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (res.status === 200) {
        console.log("Products Response:", res.data);
        
        const rawProducts = res.data.products || res.data.list || (Array.isArray(res.data) ? res.data : []);
        
        const mappedProducts: ProductItem[] = rawProducts.map((item: ProductItem) => ({
            id: item.id,
            product_name: item.product_name || item.name || "", 
            qty: Number(item.qty || item.quantity || 0),        
            unit: item.unit || "",
            price: Number(item.price || 0),
            total: Number(item.total || (item.price * item.qty) || 0)
        }));

        setSendData((prev) => ({
          ...prev,
          products: mappedProducts,
        }));
      }
    } catch (error) {
      console.error("Fetch Products Error:", error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    if (open && id) {
        fetchDataHeader();
        fetchDataProducts();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, id]);

  return (
    <Dialog
      open={open}
      onClose={() => handleOpenModal(0)}
      className="relative z-50"
    >
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl sm:my-8 sm:w-full sm:max-w-4xl ">
            
            {/* ปุ่มควบคุม (ไม่แสดงตอนพิมพ์) */}
            <div className="mb-8 print:hidden bg-gray-50 border-b border-gray-200">
              <div className="flex justify-between items-center px-6 py-4">
                <h3 className="text-lg font-bold text-gray-800">ตัวอย่างเอกสาร</h3>
                <div className="flex gap-2">
                    <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow flex items-center gap-2"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
                    </svg>
                    พิมพ์เอกสาร
                    </button>
                    <button
                    onClick={() => handleOpenModal(0)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded shadow"
                    >
                    ปิด
                    </button>
                </div>
              </div>
            </div>

            {/* ส่วนเนื้อหาที่จะพิมพ์ (หน้าเดียว) */}
            <div ref={pdfContentRef} className="px-8 py-8 bg-white text-black print:p-0 w-full max-w-[210mm] mx-auto min-h-[297mm] relative">
              
              {/* Header Logos */}
              <div className="flex flex-row gap-8 justify-center w-full items-center mb-4">
                 <div className="w-20 h-20 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center text-xs text-gray-400 overflow-hidden">
                    {/* <img src="/logo1.png" className="w-full h-full object-contain" /> */}
                    Logo 1
                 </div>
                 <div className="w-20 h-20 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center text-xs text-gray-400 overflow-hidden">
                    {/* <img src="/logo2.png" className="w-full h-full object-contain" /> */}
                    Logo 2
                 </div>
              </div>

              {/* Header Text */}
              <div className="text-center font-serif border-b-2 border-gray-800 pb-4 mb-6">
                <h1 className="font-bold text-3xl text-gray-900">{header || "ใบเสร็จรับเงิน"}</h1>
                <h2 className="mt-2 text-lg font-medium text-gray-700">
                  คณะกรรมการจัดงานศาลเจ้าปึงเถ่ากงม่า ขอนแก่น (ประจำปี {getThaiFiscalYear()})
                </h2>
              </div>

              {/* Info Section */}
              <div className="flex flex-row justify-between text-base mb-6">
                <div className="w-[60%] space-y-2">
                  <div className="flex"><span className="w-24 font-semibold">ชื่อผู้บริจาค:</span> <span className="font-light border-b border-dotted border-gray-400 flex-1 ml-2">{sendData?.name || "-"}</span></div>
                  <div className="flex"><span className="w-24 font-semibold">ที่อยู่:</span> <span className="font-light border-b border-dotted border-gray-400 flex-1 ml-2">{sendData?.address_customer || "-"}</span></div>
                  <div className="flex"><span className="w-24 font-semibold">ผู้ติดต่อ:</span> <span className="font-light border-b border-dotted border-gray-400 flex-1 ml-2">{sendData?.contact || "-"}</span></div>
                </div>

                <div className="w-[35%] space-y-2">
                  <div className="flex"><span className="w-28 font-semibold">วันที่:</span> <span className="font-light border-b border-dotted border-gray-400 flex-1 text-right">{formathDateThai(sendData?.date)}</span></div>
                  <div className="flex"><span className="w-28 font-semibold">เลขที่ใบเสร็จ:</span> <span className="font-light border-b border-dotted border-gray-400 flex-1 text-right">{sendData?.code || "-"}</span></div>
                  <div className="flex"><span className="w-28 font-semibold">เบอร์โทรศัพท์:</span> <span className="font-light border-b border-dotted border-gray-400 flex-1 text-right">{sendData?.tel || "-"}</span></div>
                  <div className="flex"><span className="w-28 font-semibold">บิลอ้างอิง:</span> <span className="font-light border-b border-dotted border-gray-400 flex-1 text-right">{sendData?.ref || "-"}</span></div>
                </div>
              </div>

              {/* Table */}
              <div className="min-h-[400px]">
                <table className="w-full border-collapse border border-black text-sm">
                    <thead>
                    <tr className="bg-gray-200 text-gray-900">
                        <th className="px-2 py-2 border border-black font-bold w-12 text-center">ลำดับ</th>
                        <th className="px-4 py-2 border border-black font-bold text-left">รายการสินค้า / รายละเอียด</th>
                        <th className="px-2 py-2 border border-black font-bold w-20 text-center">จำนวน</th>
                        <th className="px-2 py-2 border border-black font-bold w-20 text-center">หน่วย</th>
                        <th className="px-2 py-2 border border-black font-bold w-28 text-right">ราคา/หน่วย</th>
                        <th className="px-2 py-2 border border-black font-bold w-32 text-right">จำนวนเงิน</th>
                    </tr>
                    </thead>

                    <tbody>
                    {
                        [
                        // รายการพิเศษ (ถ้ามี)
                        sendData.government > 0 && { id: 1, product_name: "สลากออมสิน", qty: sendData.government, unit: "ใบ", price: 0, total: 0 },
                        sendData.lottery > 0 && { id: 2, product_name: "ล็อตเตอรี่", qty: sendData.lottery, unit: "ใบ", price: 0, total: 0 },
                        // รายการสินค้าจริงจาก products array
                        ...sendData.products
                        ]
                        .filter((item): item is ProductItem => !!item)
                        .map((item, index) => (
                            <tr key={index} className="align-top">
                            <td className="px-2 py-2 border-x border-black text-center">{index + 1}</td>
                            <td className="px-4 py-2 border-x border-black">{item.product_name}</td>
                            <td className="px-2 py-2 border-x border-black text-center">{Number(item.qty).toLocaleString()}</td>
                            <td className="px-2 py-2 border-x border-black text-center">{item.unit}</td>
                            <td className="px-2 py-2 border-x border-black text-right">{Number(item.price).toLocaleString()}</td>
                            <td className="px-2 py-2 border-x border-black text-right">{Number(item.total).toLocaleString()}</td>
                            </tr>
                        ))
                    }
                    
                    {/* เติมบรรทัดว่างให้เต็มหน้ากระดาษเพื่อให้ตารางดูสวยงาม */}
                    {Array.from({ length: Math.max(0, 10 - (sendData.products.length + (sendData.government > 0 ? 1 : 0) + (sendData.lottery > 0 ? 1 : 0))) }).map((_, i) => (
                        <tr key={`empty-${i}`}>
                            <td className="px-2 py-2 border-x border-black text-center text-transparent">.</td>
                            <td className="px-4 py-2 border-x border-black"></td>
                            <td className="px-2 py-2 border-x border-black"></td>
                            <td className="px-2 py-2 border-x border-black"></td>
                            <td className="px-2 py-2 border-x border-black"></td>
                            <td className="px-2 py-2 border-x border-black"></td>
                        </tr>
                    ))}

                    {/* Footer ของตาราง */}
                    <tr className="border-t border-black bg-gray-50 font-bold">
                        <td colSpan={4} className="px-4 py-2 border border-black text-center text-lg">
                        ( {convertNumberToThaiWords(sendData.price || 0)} )
                        </td>
                        <td className="px-2 py-2 border border-black text-center">รวมเป็นเงิน</td>
                        <td className="px-2 py-2 border border-black text-right text-lg">
                        {Number(sendData.price || 0).toLocaleString()}
                        </td>
                    </tr>
                    </tbody>
                </table>
              </div>

              {/* Footer Info */}
              <div className="mt-6 text-sm space-y-2 border-t-2 border-gray-800 pt-4">
                <div><span className="font-semibold">สถานะชำระเงิน:</span> <span className="ml-2">{sendData.status === 1 ? "ยังไม่ชำระเงิน" : sendData.status === 2 ? "ชำระเงินแล้ว" : "ยกเลิกบิล"}</span></div>
                <div><span className="font-semibold">สถานที่จัดส่ง:</span> <span className="ml-2">{sendData?.address_send || "-"}</span></div>
                <div><span className="font-semibold">หมายเหตุ:</span> <span className="ml-2">{sendData?.note || "-"}</span></div>
              </div>

              {/* Signature Area */}
              <div className="mt-12 flex flex-row justify-around text-base">
                <div className="text-center">
                  <div className="mb-10 border-b border-black w-48 mx-auto"></div>
                  <div className="font-semibold">ผู้ออกบิล</div>
                  <div className="mt-1 text-sm">วันที่ ........./........./.........</div>
                </div>
                <div className="text-center">
                  <div className="mb-10 border-b border-black w-48 mx-auto"></div>
                  <div className="font-semibold">ผู้รับสินค้า</div>
                  <div className="mt-1 text-sm">วันที่ ........./........./.........</div>
                </div>
              </div>
              
              {/* Watermark or Copy text (Optional) */}
              <div className="absolute bottom-4 right-8 text-xs text-gray-400 print:hidden">
                * ต้นฉบับ
              </div>

            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalReportProductList;