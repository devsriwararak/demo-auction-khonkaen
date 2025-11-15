import axios, { AxiosError } from "axios";

// import Swal from "sweetalert2";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
import CryptoJS from "crypto-js";
import html2canvas from "html2canvas";
import Cookies from "js-cookie";
import moment from "moment";
import 'moment/locale/th';
import { RefObject } from "react";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";
let socket: Socket | null = null; // เก็บ instance ของ Socket



const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "";

interface sendDataType {
  startDate?: string;
  endDate?: string;
  search?: string;
}


export const errorMessage = (err: unknown) => {
  if (err instanceof AxiosError) {
    // หาก err เป็น AxiosError และมีข้อมูล response
    console.log(err || "An error occurred");
    toast.error(err.response?.data?.message || "An error occurred")
  } else if (err instanceof Error) {
    // หาก err เป็น Error object ทั่วไป
    console.log(err.message);
    // alert(err.message);
    toast.error('111111')
  } else {
    // หาก err เป็นชนิดอื่นที่ไม่รู้จัก
    console.log("An unknown error occurred");
    alert("An unknown error occurred");
  }
}



export const alertConfirmError = async (): Promise<boolean> => {
  if (typeof window === 'undefined') {
    throw new Error("This function can only be used in the browser.");
  }

  const Swal = (await import('sweetalert2')).default;

  return Swal.fire({
    title: "ลบข้อมูล ?",
    text: "คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้ !",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "red",
    cancelButtonColor: "gray",
    confirmButtonText: "ลบ",
    cancelButtonText: "ยกเลิก",
  }).then((result) => {
    return result.isConfirmed;
  });
};






// ต้องการใส่ type ให้ data และ sendData
export const createExcel = async (data: BlobPart, sendData: sendDataType, name: string) => {
  // สร้าง Blob จาก Response
  const blob = new Blob([data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // สร้างลิงก์ดาวน์โหลด
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  // ตั้งชื่อไฟล์ที่ต้องการดาวน์โหลด
  link.setAttribute(
    "download",
    `${name || "no name"}_${sendData.startDate || "all"}.xlsx`
  );

  // คลิกลิงก์เพื่อดาวน์โหลด
  document.body.appendChild(link);
  link.click();

  // ลบลิงก์หลังดาวน์โหลดเสร็จ
  document.body.removeChild(link);
}

// เข้ารหัส
export const encryptData = (data: string) => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString()
}

// ถอดรหัส
export const decryptData = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}

// ถอดรหัส Token โดยเฉพาะ
export const decryptToken = () => {
  const token = Cookies.get('auth_token');
  if (token) {
    const bytes = CryptoJS.AES.decrypt(token, SECRET_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  }
}

// Data
export const dataUnitProduct = () => {
  const data = [
    { id: 0, name: "ชิ้น" },
    { id: 1, name: "อัน" },
    { id: 2, name: "เครื่อง" },
    { id: 3, name: "ถาด" },
    { id: 4, name: "องค์" },
    { id: 5, name: "อื่นๆ " },
  ]
  return data
}

export const getSocket = (): Socket => {
  if (!socket) {
    //  socket = io("http://192.168.1.7:5000"); 
    socket = io(process.env.NEXT_PUBLIC_API_URL, {
      transports: ["websocket"], // ใช้ WebSocket เป็นโปรโตคอลหลัก
      reconnection: true, // เปิดการเชื่อมต่อใหม่อัตโนมัติ
      reconnectionAttempts: 5, // จำนวนครั้งสูงสุดที่พยายามเชื่อมต่อใหม่
      timeout: 10000, // เวลา timeout ในการเชื่อมต่อ (ms)
    });
    console.log("Socket.IO instance created.");
  }
  return socket; // คืนค่า socket
};


export const convertNumberToThaiWords = (number: number): string => {
  const thaiNumbers = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
  const thaiPositions = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];

  let result = ""
  let numberString = number.toString()
  // let isBaht = true

  const decimalPart = numberString.split(".")[1]
  numberString = numberString.split(".")[0]

  for (let i = 0; i < numberString.length; i++) {
    const digit = parseInt(numberString.charAt(numberString.length - i - 1), 10)
    if (digit !== 0) {
      if (i === 1 && digit === 1) {
        result = "สิบ" + result
      } else if (i === 1 && digit === 2) {
        result = "ยี่สิบ" + result
      } else if (i !== 0 || digit !== 1) {
        result = thaiNumbers[digit] + thaiPositions[i] + result
      }
    }
  }

  result += "บาท"

  if (decimalPart && decimalPart !== "00") {
    result += " " + convertNumberToThaiWords(parseInt(decimalPart)) + "สตางค์"

  } else {
    result += "ถ้วน"
  }


  return result

};


export const handleCaptureScreen = async (id: number, winnerRef: RefObject<HTMLDivElement | null>) => {
  if (window.innerWidth < 1024) {
    // กำหนด 1024px เป็นเกณฑ์สำหรับ Desktop
    console.log("แคปหน้าจอได้เฉพาะในจอคอมพิวเตอร์");
    return;
  }

  if (winnerRef.current) {
    const canvas = await html2canvas(winnerRef.current); // แคปหน้าจอจาก WinnerScreen
    const imgData = canvas.toDataURL("image/png");
    // setCapturedImage(imgData); 

    if (id) {
      console.log("Screen captured successfully.");
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auction/save_image`,
          { image: imgData, id }
        );
        if (res.status === 200) {
          console.log(res.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};


export function getThaiFiscalYear(): number {
  const date = new Date();
  const year = date.getFullYear(); // ค.ศ.
  const month = date.getMonth() + 1; // เดือน (0-11 → บวก 1 ให้เป็น 1-12)

  const buddhistYear = year + 543; // แปลงเป็น พ.ศ.

  // ถ้าเดือนเป็น ต.ค. - ธ.ค. → บวกปีเพิ่มอีก 1
  if (month >= 10) {
    return buddhistYear + 1;
  }

  return buddhistYear;
}

// export const formathDateThai = (time: string) => {
//   const date = moment.parseZone(time);
//   const formattedDate = date.add(543, 'year').format('D MMM YYYY');
//   return formattedDate
// }

export const formathDateThai = (time: string) => {
  if (!time) {
    return ""; // หรือ "Invalid date" ตามที่คุณต้องการ
  }

  // 1. ลองตรวจสอบและแปลงจากรูปแบบใหม่ (DD/MM/YYYY) ก่อน
  // ใช้ 'true' เพื่อให้ตรวจสอบ format แบบ "strict"
  let date = moment(time, "DD/MM/YYYY", true);

  // 2. ถ้า format แรกไม่สำเร็จ (ไม่ใช่ DD/MM/YYYY)
  if (!date.isValid()) {
    // ให้กลับไปใช้ logic เดิม (parseZone) เพื่อไม่ให้กระทบของเก่า
    date = moment.parseZone(time);
  }

  // 3. ถ้าลองทั้ง 2 แบบแล้วยังพัง (เช่น time เป็น "abc")
  if (!date.isValid()) {
    return "Invalid date"; // หรือ time เพื่อแสดงค่าที่พัง
  }

  // 4. ถ้าสำเร็จ ให้แปลงเป็น พ.ศ. และจัดรูปแบบ
  // (Moment.js จะใช้ locale 'th' ที่ตั้งค่าไว้โดยอัตโนมัติ)
  const formattedDate = date.add(543, 'year').format('D MMM YYYY');
  
  return formattedDate;
};
