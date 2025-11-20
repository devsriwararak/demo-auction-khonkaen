// "use client";
// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import { decryptToken, formathDateThai } from "@/lib/tool";
// import moment from "moment";
// import ModalReportProductList from "@/app/components/modals/ModalReportProductList";


// // 2. Helper สำหรับจัด format ตัวเลข
// const formatNumber = (num: number) => {
//   return new Intl.NumberFormat('th-TH').format(num);
// };

// // 3. DatePicker Component (Inline เพื่อลดปัญหา dependency)
// interface DatePickerProps {
//   label: string;
//   value: string;
//   onChange: (value: string) => void;
//   className?: string;
// }

// const DatePickerOne: React.FC<DatePickerProps> = ({ label, value, onChange, className }) => {
//   return (
//     <div className={`flex flex-col ${className}`}>
//       <label className="text-sm text-gray-600 mb-1">{label}</label>
//       <input
//         type="date"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="h-10 px-3 border border-gray-400 rounded-md focus:outline-none focus:border-red-500 text-gray-700 bg-white w-full"
//       />
//     </div>
//   );
// };

// // --- Types ---

// interface SummaryType {
//   date: string;
//   lottery: number | string;
//   government: number | string
// }

// interface ProductListType {
//   id: number;
//   date: string;
//   product_name: string;
//   qty: number;
//   unit: string;
//   lottery: number;
//   price: string | number
//   total: string | number
// }

// interface dataType {
//   summary: SummaryType[];
//   list: ProductListType[];
// }

// const ReportProduct = () => {

//   const dateNow = moment().format("YYYY-MM-DD");

//   const [openModalPdf, setOpenModalPdf] = useState(false);

//   // States
//   const [searchDate, setSearchDate] = useState({
//     dateStart: dateNow,
//     dateEnd: dateNow,
//     billType: 1,
//   });
//   const [data, setData] = useState<dataType | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [id , setId] = useState<number | null>(null)

//   // Functions
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const token = decryptToken()
//       const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

//       const res = await axios.post(
//         `${baseURL}/api/report/list`,
//         {
//           dateStart: searchDate.dateStart,
//           dateEnd: searchDate.dateEnd,
//           billType: searchDate.billType,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//         }
//       );

//       if (res.status === 200) {
//         console.log("API Response:", res.data);
//         setData(res.data);
//       }
//     } catch (error) {
//       console.error("Fetch Error:", error);
//       // Fallback Mock Data กรณีเชื่อมต่อไม่ได้ (เพื่อให้เห็นผลลัพธ์บนหน้าจอ)
//       console.log("Using Mock Data");
//       setData({
//         summary: [{ date: dateNow, lottery: 0, government: 0 }], // Mock summary
//         list: [] // Mock list
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // คำนวณยอดรวม Lottery จาก Summary
//   const totalLottery = useMemo(() => {
//     if (!data?.summary) return 0;
//     return data.summary.reduce((acc, curr) => acc + Number(curr.lottery || 0), 0);
//   }, [data]);

//   const totalGovernment = useMemo(() => {
//     if (!data?.summary) return 0;
//     return data.summary.reduce((acc, curr) => acc + Number(curr.government || 0), 0);
//   }, [data]);

//   // Fetch ครั้งแรกเมื่อโหลดหน้า และเมื่อมีการเปลี่ยนวันที่/ประเภทบิล
//   useEffect(() => {
//     fetchData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [searchDate.dateStart, searchDate.dateEnd, searchDate.billType]);


//   const handleOpenModal = async () => {
//     setOpenModalPdf(!openModalPdf);
//   };

//   return (
//     <div className="p-6 bg-white min-h-screen font-sans">

//       {openModalPdf && (
//         <ModalReportProductList
//           handleOpenModal={() => handleOpenModal()}
//           open={openModalPdf}
//           id={100}
//           header={searchDate.billType === 1 ? "ใบเสร็จรับเงิน (ประมูล)" : "ใบเสร็จรับเงิน (ขายสินค้า)"}
//           type={searchDate.billType === 1 ? "auction" : "sale"}
//         />
//       )}

//       <h1 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-red-500 pl-3">
//         รายงานสรุปรายการสินค้า
//       </h1>

//       {/* Filter Section */}
//       <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
//         <div className="flex flex-col md:flex-row gap-4 items-end justify-start flex-wrap">

//           <div className="flex gap-4 w-full md:w-auto flex-1">
//             <DatePickerOne
//               label="วันที่เริ่มต้น"
//               onChange={(newDate) => {
//                 setSearchDate((prev) => ({ ...prev, dateStart: newDate || "" }));
//               }}
//               value={searchDate.dateStart}
//               className='w-full'
//             />

//             <DatePickerOne
//               label="วันที่สิ้นสุด"
//               onChange={(newDate) => {
//                 setSearchDate((prev) => ({ ...prev, dateEnd: newDate || "" }));
//               }}
//               value={searchDate.dateEnd}
//               className='w-full'
//             />
//           </div>

//           <div className="w-full md:w-48">
//             <p className="text-sm text-gray-600 mb-1">เลือกประเภทบิล</p>
//             <select
//               className="w-full px-4 h-10 border border-gray-400 rounded-md bg-white focus:outline-none focus:border-red-500 text-gray-700"
//               value={searchDate.billType}
//               onChange={(e) =>
//                 setSearchDate((prev) => ({ ...prev, billType: Number(e.target.value) }))
//               }
//             >
//               <option value="1">ประมูล</option>
//               <option value="2">ขายสินค้า</option>
//             </select>
//           </div>

//           <div className="w-full md:w-auto">
//             {/* <button
//               onClick={fetchData}
//               disabled={loading}
//               className="bg-red-500 active:bg-red-700 hover:bg-red-600 text-white w-full md:w-auto px-6 py-2 rounded-md shadow transition-colors h-10 flex items-center justify-center gap-2 disabled:opacity-50"
//             >
//               {loading ? "กำลังค้นหา..." : "ค้นหา"}
//             </button> */}
//             <button
//               onClick={() =>
//                 handleOpenModal()
//               }
//               className="  px-2 py-1.5 rounded-md text-red-500 flex gap-1 items-center border border-red-500"
//             >
//               พืมพ์
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Result Content */}
//       <div className="flex flex-col lg:flex-row gap-4 text-sm">

//         {/* Summary Card */}
//         <div className="w-full lg:w-3/12 h-fit border border-gray-200 rounded-md shadow-sm bg-white overflow-hidden">
//           <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
//             <p className="text-lg font-semibold text-gray-700">สรุปยอดรวม</p>
//           </div>
//           <div className="p-4 space-y-3">
//             <div className="flex justify-between items-center border-b border-gray-100 pb-2">
//               <span className="text-gray-600">สลากออมสิน</span>
//               <span className="font-bold text-blue-600 text-lg">{formatNumber(totalGovernment)} <span className="text-sm font-normal text-gray-500">ใบ</span></span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-gray-600">ล็อตเตอรี่</span>
//               <span className="font-bold text-red-600 text-lg">{formatNumber(totalLottery)} <span className="text-sm font-normal text-gray-500">ใบ</span></span>
//             </div>
//           </div>
//         </div>

//         {/* Data Table */}
//         <div className="w-full lg:w-9/12 border border-gray-200 rounded-md shadow-sm bg-white flex flex-col">
//           <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
//             <p className="text-lg font-semibold text-gray-700">รายการสินค้า</p>
//           </div>
//           <div className="overflow-x-auto p-2">
//             <table className="table-auto w-full">
//               <thead>
//                 <tr className="bg-white text-gray-600 uppercase text-xs leading-normal border-b-2 border-gray-100">
//                   <th className="px-4 py-3 text-left font-semibold w-32">วันที่</th>
//                   <th className="px-4 py-3 text-left font-semibold">ชื่อสินค้า</th>
//                   <th className="px-4 py-3 text-right font-semibold w-24">จำนวน</th>
//                   <th className="px-4 py-3 text-center font-semibold w-24">หน่วยนับ</th>
//                   <th className="px-4 py-3 text-center font-semibold w-24">ราคา/หน่วย</th>
//                   <th className="px-4 py-3 text-center font-semibold w-24">ราคารวม</th>
//                 </tr>
//               </thead>

//               <tbody className="text-gray-700 text-sm font-light">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={4} className="text-center py-12 text-gray-500">
//                       <div className="flex justify-center items-center gap-2">
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
//                         กำลังโหลดข้อมูล...
//                       </div>
//                     </td>
//                   </tr>
//                 ) : data?.list && data.list.length > 0 ? (
//                   data.list.map((item, index) => (
//                     <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
//                       <td className="px-4 py-3 text-left whitespace-nowrap">
//                         {formathDateThai(item.date)}
//                       </td>
//                       <td className="px-4 py-3 text-left font-medium text-gray-800">
//                         {item.product_name || "-"}
//                       </td>
//                       <td className="px-4 py-3 text-right font-bold text-blue-600">
//                         {formatNumber(item.qty || 0)}
//                       </td>
//                       <td className="px-4 py-3 text-center">
//                         {item.unit || "-"}
//                       </td>

//                       <td className="px-4 py-3 text-right font-bold text-blue-600">
//                         {formatNumber(Number(item?.price) || 0)}
//                       </td>
//                       <td className="px-4 py-3 text-right font-bold text-blue-600">
//                         {formatNumber(Number(item.total) || 0)}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={4} className="text-center py-12 text-gray-400 bg-gray-50/50">
//                       ไม่พบข้อมูลสินค้าในช่วงเวลานี้
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReportProduct;


"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import axios from "axios";

// --- 1. Helpers & Utilities ---

const decryptToken = () => {
  if (typeof window !== 'undefined') return localStorage.getItem('token') || '';
  return '';
};

const formatDateThai = (dateStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('th-TH').format(num);
};

const getThaiFiscalYear = () => {
  const date = new Date();
  return date.getMonth() >= 9 ? date.getFullYear() + 544 : date.getFullYear() + 543;
};

const convertNumberToThaiWords = (amount: number): string => {
  return amount ? `${amount.toLocaleString()} บาทถ้วน` : "ศูนย์บาทถ้วน";
};

// --- 2. Types Definitions ---

interface SummaryType {
  date: string;
  lottery: number | string;
  government: number | string;
}

interface ProductListType {
  id: number;
  date: string;
  product_name: string;
  qty: number;
  unit: string;
  lottery: number;
  price: string | number;
  total: string | number;
  auction_id?: number;
  sale_id?: number;
}

interface dataType {
  summary: SummaryType[];
  list: ProductListType[];
}

// --- 3. Sub-Components ---

// 3.1 DatePicker Component
interface DatePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const DatePickerOne: React.FC<DatePickerProps> = ({ label, value, onChange, className }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-sm text-gray-600 mb-1">{label}</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 px-3 border border-gray-400 rounded-md focus:outline-none focus:border-red-500 text-gray-700 bg-white w-full"
      />
    </div>
  );
};

// 3.2 ModalReportProductList Component (พิมพ์รายงานสรุป)
type ModalPropsType = {
  open: boolean;
  handleClose: () => void;
  data: dataType | null;
  filter: {
    dateStart: string;
    dateEnd: string;
    billType: number;
  };
};

const ModalReportProductList: React.FC<ModalPropsType> = ({
  open,
  handleClose,
  data,
  filter
}) => {
  const pdfContentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  // คำนวณยอดรวมสำหรับแสดงใน Report
  const totalLottery = useMemo(() => {
    if (!data?.summary) return 0;
    return data.summary.reduce((acc, curr) => acc + Number(curr.lottery || 0), 0);
  }, [data]);

  const totalGovernment = useMemo(() => {
    if (!data?.summary) return 0;
    return data.summary.reduce((acc, curr) => acc + Number(curr.government || 0), 0);
  }, [data]);

  const grandTotalMoney = useMemo(() => {
    if (!data?.list) return 0;
    return data.list.reduce((acc, curr) => acc + Number(curr.total || 0), 0);
  }, [data]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className="relative z-50"
    >
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl sm:my-8 sm:w-full sm:max-w-5xl ">
            
            {/* ปุ่มควบคุม (ซ่อนตอนพิมพ์) */}
            <div className="mb-8 print:hidden bg-gray-50 border-b border-gray-200 sticky top-0 z-20">
              <div className="flex justify-between items-center px-6 py-4">
                <h3 className="text-lg font-bold text-gray-800">ตัวอย่างรายงาน</h3>
                <div className="flex gap-2">
                    <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow flex items-center gap-2"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
                    </svg>
                    พิมพ์รายงาน
                    </button>
                    <button
                    onClick={handleClose}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded shadow"
                    >
                    ปิด
                    </button>
                </div>
              </div>
            </div>

            {/* ส่วนเนื้อหาที่จะพิมพ์ (Report Layout) */}
            <div ref={pdfContentRef} className="px-8 py-8 bg-white text-black print:p-0 w-full max-w-[210mm] mx-auto min-h-[297mm] relative">
              
              {/* Header Text */}
              <div className="text-center font-serif border-b-2 border-gray-800 pb-4 mb-6">
                <h1 className="font-bold text-2xl text-gray-900">รายงานสรุปรายการสินค้า ({filter.billType === 1 ? 'ประมูล' : 'ขายสินค้า'})</h1>
                <h2 className="mt-2 text-lg font-medium text-gray-700">
                  คณะกรรมการจัดงานศาลเจ้าปึงเถ่ากงม่า ขอนแก่น (ประจำปี {getThaiFiscalYear()})
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    ประจำวันที่ {formatDateThai(filter.dateStart)} ถึง {formatDateThai(filter.dateEnd)}
                </p>
              </div>

              {/* Summary Section (Top) */}
              <div className="flex flex-row gap-4 justify-center mb-6 text-sm border border-gray-300 p-4 rounded-lg bg-gray-50 print:bg-transparent print:border-black">
                 <div className="flex items-center gap-2">
                    <span className="font-bold">สลากออมสิน:</span> 
                    <span>{formatNumber(totalGovernment)} ใบ</span>
                 </div>
                 <div className="w-px bg-gray-400 mx-4"></div>
                 <div className="flex items-center gap-2">
                    <span className="font-bold">ล็อตเตอรี่:</span> 
                    <span>{formatNumber(totalLottery)} ใบ</span>
                 </div>
                 <div className="w-px bg-gray-400 mx-4"></div>
                 <div className="flex items-center gap-2">
                    <span className="font-bold">รวมเป็นเงินทั้งสิ้น:</span> 
                    <span>{formatNumber(grandTotalMoney)} บาท</span>
                 </div>
              </div>

              {/* Table */}
              <div className="min-h-[400px]">
                <table className="w-full border-collapse border border-black text-sm">
                    <thead>
                    <tr className="bg-gray-200 text-gray-900 print:bg-gray-100">
                        <th className="px-2 py-2 border border-black font-bold w-12 text-center">ลำดับ</th>
                        <th className="px-4 py-2 border border-black font-bold w-28 text-center">วันที่</th>
                        <th className="px-4 py-2 border border-black font-bold text-left">ชื่อสินค้า</th>
                        <th className="px-2 py-2 border border-black font-bold w-20 text-right">จำนวน</th>
                        <th className="px-2 py-2 border border-black font-bold w-16 text-center">หน่วย</th>
                        <th className="px-2 py-2 border border-black font-bold w-24 text-right">ราคา/หน่วย</th>
                        <th className="px-2 py-2 border border-black font-bold w-28 text-right">ราคารวม</th>
                    </tr>
                    </thead>

                    <tbody>
                    {data?.list && data.list.length > 0 ? (
                        data.list.map((item, index) => (
                            <tr key={index} className="align-top">
                                <td className="px-2 py-2 border border-black text-center">{index + 1}</td>
                                <td className="px-2 py-2 border border-black text-center whitespace-nowrap">{formatDateThai(item.date)}</td>
                                <td className="px-4 py-2 border border-black">{item.product_name || "-"}</td>
                                <td className="px-2 py-2 border border-black text-right">{formatNumber(item.qty || 0)}</td>
                                <td className="px-2 py-2 border border-black text-center">{item.unit || "-"}</td>
                                <td className="px-2 py-2 border border-black text-right">{formatNumber(Number(item.price) || 0)}</td>
                                <td className="px-2 py-2 border border-black text-right">{formatNumber(Number(item.total) || 0)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="px-4 py-8 border border-black text-center text-gray-500">ไม่พบข้อมูล</td>
                        </tr>
                    )}

                    {/* Grand Total Footer in Table */}
                    <tr className="bg-gray-100 font-bold print:bg-gray-50">
                        <td colSpan={6} className="px-4 py-2 border border-black text-right">รวมเป็นเงินทั้งสิ้น</td>
                        <td className="px-2 py-2 border border-black text-right">{formatNumber(grandTotalMoney)}</td>
                    </tr>
                    </tbody>
                </table>
              </div>

              {/* Footer Text */}
              <div className="mt-4 text-xs text-gray-500 text-right print:text-black">
                พิมพ์เมื่อ: {new Date().toLocaleString('th-TH')}
              </div>

            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

// --- 4. Main Component: ReportProduct ---

const ReportProduct = () => {
  const dateNow = new Date().toISOString().split('T')[0];

  const [searchDate, setSearchDate] = useState({
    dateStart: dateNow,
    dateEnd: dateNow,
    billType: 1,
  });
  const [data, setData] = useState<dataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [openModalPdf, setOpenModalPdf] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

      const res = await axios.post(
        `${baseURL}/api/report/list`,
        {
          dateStart: searchDate.dateStart,
          dateEnd: searchDate.dateEnd,
          billType: searchDate.billType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (res.status === 200) {
        console.log("API Response:", res.data);
        setData(res.data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      console.log("Using Mock Data");
      // Mock for preview
      setData({
        summary: [{ date: dateNow, lottery: 100, government: 50 }],
        list: [
           { id: 1, date: dateNow, product_name: "สินค้าตัวอย่าง A", qty: 10, unit: "ชิ้น", lottery: 100, price: 1000, total: 10000, auction_id: 100 },
           { id: 2, date: dateNow, product_name: "สินค้าตัวอย่าง B", qty: 5, unit: "แพ็ค", lottery: 0, price: 500, total: 2500, auction_id: 101 }
        ] 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setOpenModalPdf(true);
  };

  const handleCloseModal = () => {
    setOpenModalPdf(false);
  };

  const totalLottery = useMemo(() => {
    if (!data?.summary) return 0;
    return data.summary.reduce((acc, curr) => acc + Number(curr.lottery || 0), 0);
  }, [data]);

  const totalGovernment = useMemo(() => {
    if (!data?.summary) return 0;
    return data.summary.reduce((acc, curr) => acc + Number(curr.government || 0), 0);
  }, [data]);

  // เรียกใช้ fetchData ทุกครั้งที่ filter เปลี่ยน (Auto Fetch)
  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDate.dateStart, searchDate.dateEnd, searchDate.billType]);

  return (
    <div className="p-6 bg-white min-h-screen font-sans">
      {openModalPdf && (
        <ModalReportProductList
          open={openModalPdf}
          handleClose={handleCloseModal}
          data={data} // ส่งข้อมูลชุดเดียวกับที่แสดงหน้าจอไปพิมพ์
          filter={searchDate}
        />
      )}

      <h1 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-red-500 pl-3">
        รายงานสรุปรายการสินค้า
      </h1>

      {/* Filter Section */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end justify-start flex-wrap">
          <div className="flex gap-4 w-full md:w-auto flex-1">
            <DatePickerOne
              label="วันที่เริ่มต้น"
              onChange={(newDate) => {
                setSearchDate((prev) => ({ ...prev, dateStart: newDate || "" }));
              }}
              value={searchDate.dateStart}
              className='w-full'
            />

            <DatePickerOne
              label="วันที่สิ้นสุด"
              onChange={(newDate) => {
                setSearchDate((prev) => ({ ...prev, dateEnd: newDate || "" }));
              }}
              value={searchDate.dateEnd}
              className='w-full'
            />
          </div>

          <div className="w-full md:w-48">
            <p className="text-sm text-gray-600 mb-1">เลือกประเภทบิล</p>
            <select
              className="w-full px-4 h-10 border border-gray-400 rounded-md bg-white focus:outline-none focus:border-red-500 text-gray-700"
              value={searchDate.billType}
              onChange={(e) =>
                setSearchDate((prev) => ({ ...prev, billType: Number(e.target.value) }))
              }
            >
              <option value="1">ประมูล</option>
              <option value="2">ขายสินค้า</option>
            </select>
          </div>

          <div className="w-full md:w-auto">
             {/* ปุ่มพิมพ์รายงานแทนปุ่มค้นหา */}
            <button
              onClick={handleOpenModal}
              disabled={loading || !data?.list?.length}
              className="bg-red-500 active:bg-red-700 hover:bg-red-600 text-white w-full md:w-auto px-6 py-2 rounded-md shadow transition-colors h-10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
              </svg>
              {loading ? "กำลังโหลด..." : "พิมพ์รายงาน"}
            </button>
          </div>
        </div>
      </div>

      {/* Result Content */}
      <div className="flex flex-col lg:flex-row gap-4 text-sm">
        
        {/* Summary Card */}
        <div className="w-full lg:w-3/12 h-fit border border-gray-200 rounded-md shadow-sm bg-white overflow-hidden">
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
            <p className="text-lg font-semibold text-gray-700">สรุปยอดรวม</p>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="text-gray-600">สลากออมสิน</span>
              <span className="font-bold text-blue-600 text-lg">
                {formatNumber(totalGovernment)} <span className="text-sm font-normal text-gray-500">ใบ</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">ล็อตเตอรี่</span>
              <span className="font-bold text-red-600 text-lg">
                {formatNumber(totalLottery)} <span className="text-sm font-normal text-gray-500">ใบ</span>
              </span>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="w-full lg:w-9/12 border border-gray-200 rounded-md shadow-sm bg-white flex flex-col">
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
            <p className="text-lg font-semibold text-gray-700">รายการสินค้า</p>
          </div>
          <div className="overflow-x-auto p-2">
            <table className="table-auto w-full">
              <thead>
                <tr className="bg-white text-gray-600 uppercase text-xs leading-normal border-b-2 border-gray-100">
                  <th className="px-4 py-3 text-left font-semibold w-32">วันที่</th>
                  <th className="px-4 py-3 text-left font-semibold">ชื่อสินค้า</th>
                  <th className="px-4 py-3 text-right font-semibold w-24">จำนวน</th>
                  <th className="px-4 py-3 text-center font-semibold w-24">หน่วยนับ</th>
                  <th className="px-4 py-3 text-right font-semibold w-28">ราคา/หน่วย</th>
                  <th className="px-4 py-3 text-right font-semibold w-28">ราคารวม</th>
                </tr>
              </thead>

              <tbody className="text-gray-700 text-sm font-light">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500">
                      <div className="flex justify-center items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                        กำลังโหลดข้อมูล...
                      </div>
                    </td>
                  </tr>
                ) : data?.list && data.list.length > 0 ? (
                  data.list.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-left whitespace-nowrap">
                        {formatDateThai(item.date)}
                      </td>
                      <td className="px-4 py-3 text-left font-medium text-gray-800">
                        {item.product_name || "-"}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-blue-600">
                        {formatNumber(item.qty || 0)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.unit || "-"}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-blue-600">
                        {formatNumber(Number(item.price) || 0)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-blue-600">
                        {formatNumber(Number(item.total) || 0)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400 bg-gray-50/50">
                      ไม่พบข้อมูลสินค้าในช่วงเวลานี้
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportProduct;