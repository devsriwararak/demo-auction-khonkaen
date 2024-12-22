import { AxiosError } from "axios";

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