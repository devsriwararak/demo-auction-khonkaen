import { AxiosError } from "axios";

// import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import { toast } from "react-toastify";


const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "default_key";

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

// export const alertConfirmError  = async()=>{
//   return true
// }




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