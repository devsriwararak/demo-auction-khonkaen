// "use client";

// import flatpickr from "flatpickr";
// import { useEffect, useRef } from "react";
// import { Thai } from "flatpickr/dist/l10n/th.js";
// import moment from "moment";
// import { Calendar } from "./icons";

// interface propsType {
//   label?: string
//   className?: string
//   name?: string
//   value?: string;
//    disabled?: boolean;

//   onChange?: (date: string | Date | null) => void;
// }

// const DatePickerOne = ({ label, name, onChange, value, disabled }: propsType) => {
//   const inputRef = useRef<HTMLInputElement | null>(null);

//   useEffect(() => {
//     if (inputRef.current) {
//       flatpickr(inputRef.current, {
//         mode: "single",
//         dateFormat: "d M Y", // แสดงวันที่แบบ 01 ม.ค. 2566
//         defaultDate:  value && moment(value, "YYYY-MM-DD").isValid()
//         ? moment(value, "YYYY-MM-DD").toDate()
//         : new Date()
        
//         ,
//         locale: {
//           ...Thai,
//           firstDayOfWeek: 1, // อาทิตย์เป็นวันแรก
//           weekdays: {
//             shorthand: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"],
//             longhand: ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"],
//           },
//           months: {
//             shorthand: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
//             longhand: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"],
//           },
//         },
//         onChange: (selectedDates) => {
//           if (!selectedDates.length) return;
//           const d = selectedDates[0];
//           const formattedDate = moment(d).format("YYYY-MM-DD"); // ปีสากล
//           onChange?.(formattedDate);
//         },
//         disable: disabled ? ['*'] : []
//       });
//     }

//   }, [value]);

//   return (
//     <div>
//       <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
//         {label}
//       </label>
//       <div className="relative ">
//         <input
//         ref={inputRef}
//           className="form-datepicker w-full rounded-[7px]  border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
//           placeholder="mm/dd/yyyy"
//           data-class="flatpickr-right"
//           name={name}
//           defaultValue={value}
//           readOnly
//           disabled={disabled}
//         />

//         <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
//           <Calendar className="size-5 text-[#9CA3AF]" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DatePickerOne;

"use client";

import flatpickr from "flatpickr";
import { useEffect, useRef } from "react";
import { Thai } from "flatpickr/dist/l10n/th.js";
import moment from "moment";
import { Calendar } from "./icons";
import { Instance as FlatpickrInstance } from "flatpickr/dist/types/instance"; // Import type

interface propsType {
  label?: string;
  className?: string; // เราจะใช้ตัวนี้ด้วย
  name?: string;
  value?: string | null; // รองรับ null
  disabled?: boolean;
  onChange?: (date: string | null) => void; // รองรับ null
}

const DatePickerOne = ({ label, name, onChange, value, disabled, className }: propsType) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Ref ไว้เก็บ instance ของ flatpickr
  const fpInstanceRef = useRef<FlatpickrInstance | null>(null);

  // --- 1. Effect สำหรับ "สร้าง" และ "ทำลาย" (ทำงานครั้งเดียว) ---
  useEffect(() => {
    if (!inputRef.current) return;

    // สร้าง instance
    fpInstanceRef.current = flatpickr(inputRef.current, {
      mode: "single",
      dateFormat: "d M Y", // "01 ม.ค. 2566"
      
      // **FIX 1: defaultDate ควรเป็น null ถ้า value ไม่มีค่า**
      defaultDate: value && moment(value, "YYYY-MM-DD").isValid()
        ? moment(value, "YYYY-MM-DD").toDate()
        : undefined, 
      
      locale: {
        ...Thai,
        firstDayOfWeek: 1,
        weekdays: {
          shorthand: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"],
          longhand: ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"],
        },
        months: {
          shorthand: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
          longhand: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"],
        },
      },
      onChange: (selectedDates) => {
        if (!selectedDates.length) {
          onChange?.(null); // ส่ง null ถ้าผู้ใช้ลบวันที่
          return;
        }
        const d = selectedDates[0];
        const formattedDate = moment(d).format("YYYY-MM-DD"); // ปีสากล
        onChange?.(formattedDate);
      },
      // **FIX 2: ลบ 'disable' config ที่ผิดทิ้งไป**
      // (เราใช้ <input disabled={...}> ซึ่งถูกต้องอยู่แล้ว)
    });

    // คืน function cleanup: จะทำงานตอน component unmount
    return () => {
      fpInstanceRef.current?.destroy();
      fpInstanceRef.current = null;
    };
  }, []); // <-- **FIX 3: Dependency array ว่าง = ทำงานแค่ครั้งเดียว**

  // --- 2. Effect สำหรับ "อัปเดต" ค่า (เมื่อ prop 'value' เปลี่ยน) ---
  useEffect(() => {
    if (!fpInstanceRef.current) return; // ถ้า instance ยังไม่ถูกสร้าง ก็ไม่ต้องทำอะไร

    const currentValue = fpInstanceRef.current.selectedDates[0];
    const nextValue = value && moment(value, "YYYY-MM-DD").isValid()
      ? moment(value, "YYYY-MM-DD").toDate()
      : undefined;

    // เช็คก่อนว่าค่าไม่ตรงกันจริงๆ ค่อยสั่ง set (ป้องกัน loop)
    if (currentValue?.getTime() !== nextValue?.getTime()) {
      fpInstanceRef.current.setDate(nextValue || "", false); // false = ไม่ต้อง trigger onChange
    }
  }, [value]); // <-- effect นี้จะทำงานเมื่อ 'value' จากข้างนอกเปลี่ยน

  return (
    // **FIX 4: ใช้ className ที่ส่งเข้ามา**
    <div className={className}> 
      <label className="mb-1 block text-body-sm font-medium text-black text-xs">
        {label}
      </label>
      <div className="relative ">
        <input
          ref={inputRef}
          className="form-datepicker w-full rounded-[7px]  border-[1.5px] border-stroke bg-transparent px-5 py-2 font-normal outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary bg-white"
          placeholder="กรุณาเลือกวันที่" // เปลี่ยน placeholder
          data-class="flatpickr-right"
          name={name}
          // **FIX 5: ลบ defaultValue={value} ทิ้ง** (flatpickr จัดการเอง)
          readOnly
          disabled={disabled}
        />

        <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
          <Calendar className="size-5 text-[#9CA3AF]" />
        </div>
      </div>
    </div>
  );
};

export default DatePickerOne;
