import { AxiosError } from "axios";

// import Swal from "sweetalert2";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";
let socket: Socket  | null = null; // เก็บ instance ของ Socket



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
export const createExcel = async (data: BlobPart, sendData: sendDataType) => {
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
    `Auction_Titles_${sendData.startDate || "all"}_${sendData.endDate || "all"
    }.xlsx`
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
export const dataUnitProduct = ()=>{
  const data = [
    {id:0, name: "ชิ้น"},
    {id:1, name: "อัน"},
    {id:2, name: "เครื่อง"},
    {id:3, name: "ถาด"},
    {id:4, name: "องค์"},
    {id:5, name: "อื่นๆ "},
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

  for(let i = 0; i < numberString.length; i++){
    const digit = parseInt(numberString.charAt(numberString.length - i - 1), 10)
    if(digit !== 0){
      if(i === 1 && digit === 1){
        result = "สิบ" + result
      }else if(i === 1 && digit === 2){
        result = "ยี่สิบ" + result
      }else if(i !== 0 || digit !== 1){
        result = thaiNumbers[digit] + thaiPositions[i] + result
      }
    }
  }

  result += "บาท"

  if(decimalPart && decimalPart !== "00"){
    result += " " + convertNumberToThaiWords(parseInt(decimalPart)) + "สตางค์"

  }else {
    result += "ถ้วน"
  }


  return result
 
};
