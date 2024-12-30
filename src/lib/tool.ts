import { AxiosError } from "axios";

// import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";


const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "default_key";


export const errorMessage = (err: unknown) => {
  if (err instanceof AxiosError) {
    // หาก err เป็น AxiosError และมีข้อมูล response
    console.log(err.response?.data?.error || "An error occurred");
    alert(err.response?.data?.error || "An error occurred");
  } else if (err instanceof Error) {
    // หาก err เป็น Error object ทั่วไป
    console.log(err.message);
    alert(err.message);
  } else {
    // หาก err เป็นชนิดอื่นที่ไม่รู้จัก
    console.log("An unknown error occurred");
    alert("An unknown error occurred");
  }
}



export const alertConfirmError = async (): Promise<boolean> => {
  const Swal = (await import("sweetalert2")).default;

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



export const createExcel = async (data: any) => {
  const worksheet = XLSX.utils.json_to_sheet(data); // แปลง JSON เป็น Worksheet
  const workbook = XLSX.utils.book_new(); // สร้าง Workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Users"); // เพิ่ม Worksheet ใน Workbook

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  }); // แปลงเป็น buffer

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  }); // สร้าง blob
  saveAs(blob, "data.xlsx"); // ดาวน์โหลดไฟล์ Excel
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