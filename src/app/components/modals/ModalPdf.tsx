"use client";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import React from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { convertNumberToThaiWords, decryptToken } from "@/lib/tool";
import Image from "next/image";
import axios from "axios";

type ModalPropsType = {
  open: boolean;
  handleOpenModal: (numb: number) => void;
  id: number;
  header: string
  type: string
};

interface CategoryData {
  category_id: number;
  results: {
    // id: number | null;
    name: string;
    category_name: string;
    product_id: number;
    quantity: number;
    unit: string;
    price : number | null;
  }[];
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
  auction_title_id: number;
  products: CategoryData[];
}

const ModalPdf: React.FC<ModalPropsType> = ({
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
    auction_title_id: 0,
    products: [],
  });

  // Systems
  const token = decryptToken();
  const pdfContentRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/${type}/all/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        setSendData((prev) => ({
          ...prev,
          id: res.data.id,
          code: res.data.code,
          title: res.data.title,
          date: res.data.date,
          government: res.data.government,
          lottery: res.data.lottery,
          name: res.data.name,
          price: res.data.price,
          status: res.data.status,
          noun: res.data.noun,
          ref: res.data.ref,
          tel: res.data.tel,
          address_customer: res.data.address_customer,
          address_send: res.data.address_send,
          contact: res.data.contact,
          note: res.data.note,
          customer_id: res.data.customer_id,
          auction_title_id: res.data.auction_id,
        }));

        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataAuctionProductList = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/${type}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        // setProductsData(res.data.products);
        console.log(res.data);
        
        setSendData((prev) => ({
          ...prev,
          products: res.data.products,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

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
      const contentHeight =
        (canvasContent.height / canvasContent.width) * contentWidth; // คำนวณอัตราส่วน

      // เพิ่มเนื้อหาในหน้า PDF
      pdf.addImage(
        contentImgData,
        "PNG",
        contentX,
        contentY,
        contentWidth,
        contentHeight
      );

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

  const productItems = sendData.products.flatMap(
    (category) => category.results
  );
  useEffect(() => {
    fetchData();
    fetchDataAuctionProductList();
  }, []);

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

            {/* {JSON.stringify(sendData)} */}
            {/* {JSON.stringify(productItems)} */}

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
                <h1> {header || ""}</h1>
                <h2 className="mt-2">
                  คณะกรรมการจัดงานศาลเจ้าปึงเถ่ากงม่า ขอนแก่น (ประจำปี 2568)
                </h2>
              </div>

              <div className="flex flex-row gap-32 justify-between mt-8">
                <div className="w-8/12 flex flex-col gap-2 ">
                  <div>
                    ชื่อผู้บริจาค :{" "}
                    <span className=" font-extralight">
                      {sendData?.name || "-"}
                    </span>
                  </div>

                  <div>
                    ที่อยู่ :{" "}
                    <span className=" font-extralight">
                      {sendData?.address_customer || "-"}
                    </span>
                  </div>

                  <div>
                    ออกสลากในนาม :{" "}
                    <span className=" font-extralight">
                      {sendData?.name || "-"}
                    </span>
                  </div>

                  <div>
                    ผู้ติดต่อ :{" "}
                    <span className=" font-extralight">
                      {sendData?.name || "-"}
                    </span>
                  </div>
                </div>

                <div className="w-4/12  flex flex-col gap-2  ">
                  <div>
                    วันที่ :{" "}
                    <span className=" font-extralight">
                      {sendData?.date || "-"}
                    </span>
                  </div>

                  <div>
                    เลขที่ใบเสร็จ :{" "}
                    <span className=" font-extralight">
                      {sendData?.code || "-"}
                    </span>
                  </div>

                  <div>
                    เบอร์โทรศัพท์ :{" "}
                    <span className=" font-extralight">
                      {sendData?.tel || "-"}
                    </span>
                  </div>

                  <div>
                    บิลอ้างอิง :{" "}
                    <span className=" font-extralight">
                      {sendData?.ref || "-"}
                    </span>
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
                    <th className="px-4 py-2 border border-black bg-gray-50 font-medium text-center">
                      จำนวนเงิน
                    </th>
                    <th className="px-4 py-2 border border-black bg-gray-50 font-medium text-center">
                      ลายมือผู้รับ
                    </th>
                  </tr>
                </thead>

                <tbody>
                
                  {
                    [
                      {id:1, name:"สลากออมสิน", quantity : sendData.government || 0, price: 0},
                      {id:2, name:"ล็อตเตอรี่", quantity : sendData.lottery || 0, price: 0},
                      ...Array.from({length:8}, (_, index)=> ({
                        id: index + 3,
                        name : productItems[index]?.name || "",
                        quantity : Number(productItems[index]?.quantity || 0).toLocaleString() || 0 ,
                        price :Number(productItems[index]?.price || 0).toLocaleString() || 0
                      }))
                    ].map((item, index)=> (
                      <tr key={index}>
                      <td className="px-4 py-2 border border-black w-1/12 font-light text-center">
                        {index + 1}{" "}
                      </td>
                      <td className="px-4 py-2 border border-black w-6/12 font-light">
                        {item?.name || ""}{" "}
                      </td>
                      <td className="px-4 py-2 border border-black w-1/12 font-light text-center">
                        {Number(item?.quantity || 0).toLocaleString() || ""}{" "}
                      </td>
                      <td className="px-4 py-2 border border-black w-2/12 font-light text-center">
                      {Number(item?.price || 0).toLocaleString() || ""}{" "}{" "}
                      </td>
                      <td className="px-4 border border-black w-2/12 font-light text-center">
                        {" "}
                      </td>
                    </tr>
                    ))
                  }
           

                  <tr>
                    <td></td>
                    <td className="px-4 py-2 text-sm text-center">
                      ( {convertNumberToThaiWords(sendData.price || 0)} )
                    </td>
                    <td></td>
                    <td className="px-4 py-2 text-sm">รวมเป็นเงิน</td>
                    <td className="px-4 py-2">
                      {Number(sendData.price || 0).toLocaleString()} บาท
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-6">
                ชำระเงิน :{" "}
                <span className=" font-extralight">
                  {sendData.status === 1 && "ยังไม่ชำระเงิน"}
                  {sendData.status === 2 && "ชำระเงินแล้ว"}
                  {sendData.status === 3 && "ยกเลิกบิล"}
                </span>
              </div>

              <div className="mt-2">
                สถานที่จัดส่ง :{" "}
                <span className=" font-extralight">
                  {sendData?.address_send || "-"}
                </span>
              </div>

              <div className="mt-2">
                หมายเหตุ :{" "}
                <span className=" font-extralight">
                  {sendData?.note || "-"}
                </span>
              </div>

              <div className="mt-8 flex flex-row justify-center gap-4 font-light">
                <div className="w-full flex flex-col justify-center items-center">
                  <span> ผู้รับเงิน</span>
                  <span className="mt-2">
                    ( ........................................................ )
                  </span>
                  <span className="text-sm mt-2">
                    วันที่
                    .........................................................
                  </span>
                </div>

                <div className="w-full flex flex-col justify-center items-center">
                  <span>ผู้รับสินค้า</span>
                  <span className="mt-2">
                    ( ........................................................ )
                  </span>
                  <span className="text-sm mt-2">
                    วันที่
                    .........................................................
                  </span>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalPdf;
