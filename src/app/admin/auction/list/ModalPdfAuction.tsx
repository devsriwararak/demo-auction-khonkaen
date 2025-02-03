"use client";
import { useRef } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import React from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { convertNumberToThaiWords } from "@/lib/tool";
import Image from "next/image";

type ModalPropsType = {
  open: boolean;
  handleOpenModal: (numb: number) => void;
};

const ModalPdfAuction: React.FC<ModalPropsType> = ({
  open,
  handleOpenModal,
}) => {
  const contentData = {
    title: "Invoice Copy 1",
    companyName: "My Company",
    address: ["123 Street", "City, Country"],
    invoiceNo: "N2025-0001",
    date: "30/01/2025",
    products: [
      { name: "Product 1", qty: 1, price: 100, total: 100 },
      { name: "Product 2", qty: 2, price: 200, total: 400 },
      { name: "Product 2", qty: 2, price: 200, total: 400 },
      { name: "Product 2", qty: 2, price: 200, total: 400 },
    ],
    sum: 1000,
    totalAmount: convertNumberToThaiWords(500),
    notes: "This is a sample note.",
  };
  const pdfContentRef = useRef<HTMLDivElement>(null);

  // ต้องการทำให้ Titles ที่แสดงผลใน PDF เป็นภาษาไทย แบบไม่ลงฟอร์น
  // const handlePreviewPDF = async () => {
  //   if (!pdfContentRef.current) return;
  //   const titles = ["ต้นฉบับ", "สำเนา", "ใบรับของ"];
  //   const pdf = new jsPDF();

  //   for (const title of titles) {
  //     const tempDiv = document.createElement("div");
  //     tempDiv.style.fontSize = "16px";
  //   tempDiv.style.fontFamily = "Arial, sans-serif"; // ใช้ฟอนต์ระบบที่รองรับ
  //   tempDiv.style.position = "absolute";
  //   tempDiv.style.top = "-9999px"; // ซ่อน <div>
  //   tempDiv.innerHTML = title;

  //   document.body.appendChild(tempDiv); // เพิ่ม <div> ลงใน DOM
  //     // เพิ่มหัวข้อใหม่ในแต่ละหน้า
  //     pdf.setFontSize(16);
  //     pdf.text(title, 10, 10); 

  //     // แปลง HTML เป็น Canvas
  //     const canvas = await html2canvas(pdfContentRef.current);
  //     const imgData = canvas.toDataURL("image/png");

  //     const pageWidth = pdf.internal.pageSize.getWidth();
  //     const pageHeight = pdf.internal.pageSize.getHeight();
  //     const imgWidth = canvas.width;
  //     const imgHeight = canvas.height;

  //     const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
  //     const imgX = 0; 
  //     const imgY = 12; 

  //     // เพิ่มเนื้อหาในหน้า PDF
  //     pdf.addImage(
  //       imgData,
  //       "PNG",
  //       imgX,
  //       imgY,
  //       imgWidth * ratio,
  //       imgHeight * ratio
  //     );

  //     // เพิ่มหน้าถัดไป (ยกเว้นหน้าสุดท้าย)
  //     if (title !== titles[titles.length - 1]) {
  //       pdf.addPage();
  //     }
  //   }

  //   const pdfBlob = pdf.output("blob");
  //   const url = URL.createObjectURL(pdfBlob);

  //   // เปิดหน้าต่างใหม่เพื่อแสดง PDF Preview
  //   const previewWindow = window.open(url, "_blank");
  //   previewWindow?.focus();
  // };

  const handlePreviewPDF = async () => {
    if (!pdfContentRef.current) return;
  
    const titles = ["ต้นฉบับ", "สำเนา", "ใบรับของ"]; // ข้อความภาษาไทย
    const pdf = new jsPDF();
  
    for (const title of titles) {
      // สร้าง <div> ชั่วคราวสำหรับข้อความภาษาไทย
      const tempDiv = document.createElement("div");
      tempDiv.style.fontSize = "18px"; // ขนาดฟอนต์ที่ใหญ่พอ
      tempDiv.style.fontFamily = "Arial, sans-serif"; // ฟอนต์ที่รองรับ
      tempDiv.style.lineHeight = "1.2"; // เพิ่ม line-height ป้องกันการตัดส่วนท้าย
      tempDiv.style.padding = "10px"; // เพิ่ม padding เพื่อไม่ให้ข้อความถูกตัด
      tempDiv.style.position = "absolute";
      tempDiv.style.top = "-9999px"; // ซ่อน <div> ออกจากหน้าจอ
      tempDiv.innerHTML = title;
  
      document.body.appendChild(tempDiv); // เพิ่ม <div> ลงใน DOM
  
      // แปลง <div> เป็น Canvas
      const canvas = await html2canvas(tempDiv);
      const imgData = canvas.toDataURL("image/png");
  
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgX = 10; // ระยะห่างจากขอบซ้าย
      const imgY = 5; // ระยะห่างจากขอบบน
      const imgWidth = 25; // กำหนดความกว้างของภาพข้อความ
      const imgHeight = (canvas.height / canvas.width) * imgWidth; // คำนวณอัตราส่วนความสูง
  
      // เพิ่มภาพข้อความภาษาไทยลงใน PDF
      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth, imgHeight);
  
      document.body.removeChild(tempDiv); // ลบ <div> หลังใช้งาน
  
      // เพิ่มเนื้อหาอื่นจาก HTML
      const canvasContent = await html2canvas(pdfContentRef.current);
      const contentImgData = canvasContent.toDataURL("image/png");
  
      const contentX = 10; // ระยะห่างจากขอบซ้าย
      const contentY = imgY + imgHeight + 1; // ระยะห่างจากข้อความภาษาไทย
      const contentWidth = pageWidth - 20; // ลดขอบซ้าย-ขวา
      const contentHeight = (canvasContent.height / canvasContent.width) * contentWidth; // คำนวณอัตราส่วน
  
      // เพิ่มเนื้อหาในหน้า PDF
      pdf.addImage(contentImgData, "PNG", contentX, contentY, contentWidth, contentHeight);
  
      // เพิ่มหน้าถัดไป (ยกเว้นหน้าสุดท้าย)
      if (title !== titles[titles.length - 1]) {
        pdf.addPage();
      }
    }
  
    const pdfBlob = pdf.output("blob");
    const url = URL.createObjectURL(pdfBlob);
  
    // เปิดหน้าต่างใหม่เพื่อแสดง PDF Preview
    const previewWindow = window.open(url, "_blank");
    previewWindow?.focus();
  };

  return (
    <Dialog
      open={open}
      onClose={() => handleOpenModal(3)}
      className="relative z-10"
    >
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl sm:my-8 sm:w-full sm:max-w-4xl ">
            <div className="mb-8">
              <div className=" text-center flex justify-end px-6 pt-4 -mb-10 ">
                <button
                  onClick={handlePreviewPDF}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  พิมพ์เอกสาร
                </button>
              </div>
            </div>

            {/* Hidden PDF Content */}
            <div ref={pdfContentRef} className="px-12 pb-10  ">
              {/* Header */}

              <div className="flex flex-row gap-4 justify-center w-full">
                <Image
                  src="/images/admin-home-01.png"
                  alt="Login Image"
                  width={200}
                  height={200}
                  className=" w-36 h-36 "
                />
                <Image
                  src="/images/admin-home-02.png"
                  alt="Login Image"
                  width={200}
                  height={200}
                  className="w-36 h-36 "
                />
              </div>

              <div className="mt-3 text-center text-xl">
                <h1>ใบรับของ</h1>
                <h2 className="mt-2">
                  คณะกรรมการจัดงานศาลเจ้าปึงเถ่ากงม่า ขอนแก่น (ประจำปี 2568)
                </h2>
              </div>

              <div className="flex flex-row gap-1 justify-between mt-8">
                <div className="w-9/12 flex flex-col gap-2 ">
                  <div>
                    ชื่อผู้บริจาค :{" "}
                    <span className=" font-extralight">xxx</span>
                  </div>

                  <div>
                    ที่อยู่ : <span className=" font-extralight">xxx</span>
                  </div>

                  <div>
                    ออกสลากในนาม : <span className=" font-extralight">xxx</span>
                  </div>

                  <div>
                    ผู้ติดต่อ : <span className=" font-extralight">xxx</span>
                  </div>
                </div>

                <div className="w-3/12">
                  <div className="w-full flex flex-col  gap-2">
                    <div>
                      วันที่ : <span className=" font-extralight">xxx</span>
                    </div>

                    <div>
                      เลขที่ใบเสร็จ :{" "}
                      <span className=" font-extralight">xxx</span>
                    </div>

                    <div>
                      เบอร์โทรศัพท์ :{" "}
                      <span className=" font-extralight">xxx</span>
                    </div>

                    <div>
                      บิลอ้างอิง : <span className=" font-extralight">xxx</span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="px-4"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              ></div>

              {/* Table */}
              <table className="mt-8 w-full ">
                <thead>
                  <tr className="border-b ">
                    <th className="px-4 py-2 border border-black bg-gray-50 font-medium">
                      ลำดับ
                    </th>
                    <th className="px-4 py-2 border border-black bg-gray-50 font-medium">
                      รายละเอียด
                    </th>
                    <th className="px-4 py-2 border border-black bg-gray-50 font-medium text-center">
                      จำนวน
                    </th>
                    <th className="px-4 py-2 border border-black bg-gray-50 font-medium text-center" >
                      จำนวนเงิน
                    </th>
                    <th className="px-4 py-2 border border-black bg-gray-50 font-medium text-center">
                      ลายมือผู้รับ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 10 }).map((_, index) => {
                    const product = contentData.products[index];
                    return (
                      <tr key={index}>
                        <td className="px-4 py-2 border border-black w-1/12 font-light text-center">
                          {index + 1}
                        </td>
                        <td className="px-4 py-2 border border-black w-6/12 font-light">
                          {product?.name || ""}
                        </td>
                        <td className="px-4 py-2 border border-black w-1/12 font-light text-center">
                          {product?.qty || ""}
                        </td>
                        <td className="px-4 py-2 border border-black w-2/12 font-light text-center">
                          {product?.price.toFixed(2)}
                        </td>
                        <td className="px-4 border border-black w-2/12 font-light text-center">
                          {product?.total.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}

                  <tr>
                    <td></td>
                    <td className="px-4 py-2 text-sm text-center">
                      ( {contentData.totalAmount} )
                    </td>
                    <td></td>
                    <td className="px-4 py-2 text-sm">รวมเป็นเงิน</td>
                    <td className="px-4 py-2">1000</td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-6">
                บิลอ้างอิง : <span className=" font-extralight">xxx</span>
              </div>

              <div className="mt-2">
                สถานที่จัดส่ง : <span className=" font-extralight">xxx</span>
              </div>

              <div className="mt-2">
                หมายเหตุ : <span className=" font-extralight">xxx</span>
              </div>

              <div className="mt-8 flex flex-row justify-center gap-4 font-light">
                <div className="w-full flex flex-col justify-center items-center">
                    <span> ผู้รับเงิน</span>
                    <span className="mt-2">( ........................................................ )</span>
                    <span className="text-sm mt-2" >วันที่ .........................................................</span>
                </div>

                <div className="w-full flex flex-col justify-center items-center">
                    <span>ผู้รับสินค้า</span>
                    <span className="mt-2">( ........................................................ )</span>
                    <span className="text-sm mt-2" >วันที่ .........................................................</span>
                </div>

              </div>

            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalPdfAuction;
