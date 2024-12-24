import { AxiosError } from "axios";
import Swal from "sweetalert2";

export const errorMessage = (err : unknown)=>{
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

// export const alertConfirmError = async () => {
//   Swal.fire({
//     title: "ลบข้อมูล ?",
//     text: "คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้ !",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonColor: "red",
//     cancelButtonColor: "gray",
//     confirmButtonText: "ลบ",
//     cancelButtonText: "ยกเลิก",
//   }).then((result) => {
//     return result.isConfirmed; 
//   });
// }

export const alertConfirmError = (): Promise<boolean> => {
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
    return result.isConfirmed; // ส่งค่า true หากยืนยัน
  });
};