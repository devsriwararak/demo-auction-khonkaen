import React from "react";
import { FcLeft, FcRight } from "react-icons/fc";

interface PaginationProps {
  page: number;
  setPage: (newPage: number) => void;
  totalPage : number
  
}

// ถ้าหากมีการเปลี่ยนหน้า ต้องการให้ setPage กลับไปด้วย
const Pagination: React.FC<PaginationProps> = ({ page, setPage , totalPage}) => {

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1); // ใช้หน้าก่อนหน้าจาก API
    }
  };

  const handleNextPage = () => {
    if (page < totalPage) {
      setPage(page + 1); // ไปหน้าถัดไป
    }
  };


  return (
    <div className="mt-4 flex flex-row justify-end items-center">
      <div className="w-10 flex justify-end cursor-pointer  ">
        <FcLeft
          size={30}
          className="bg-white hover:bg-gray-100 shadow-lg rounded-lg border-2 border-gray-200 p-1"
          onClick={handlePreviousPage}
        />
      </div>
      <div className="w-20 flex justify-center  text-sm cursor-pointer ">
      หน้า {page} / {totalPage}
      </div>
      <div className="w-10  flex justify-start cursor-pointer ">
        <FcRight
          size={30}
          className="bg-white hover:bg-gray-100 shadow-lg rounded-lg border-2 border-gray-200 p-1"
          onClick={handleNextPage}
        />
      </div>
    </div>
  );
};

export default Pagination;

