import { decryptToken } from "@/lib/tool";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FcMoneyTransfer, FcShop } from "react-icons/fc";

const ReportSale = () => {
  // Systems
  const dateNow = moment().format("YYYY-MM-DD");
  const token = decryptToken();

  // States
  const [searchDate, setSearchDate] = useState({
    dateStart: dateNow,
    dateEnd: dateNow,
  });

  const [data, setData] = useState({
    auctionSum_1 : 0,
    auctionSum_2 : 0,
    saleSum_1 : 0,
    saleSum_2 : 0,
    totalCash_1 : 0,
    totalCash_2 : 0,
    total : 0
  })

  // Functions
  const fetchData = async () => {
    try {
      const sendData = {
        dateStart: searchDate.dateStart,
        dateEnd: searchDate.dateEnd,
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/report/all`,
        sendData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      
      if (res.status === 200) {
       console.log(res.data);
       setData({
        auctionSum_1 : res.data.auctionSum_1 || 0,
        auctionSum_2 : res.data.auctionSum_2 || 0,
        saleSum_1 : res.data.saleSum_1 || 0,
        saleSum_2 : res.data.saleSum_2 || 0,
        totalCash_1 : res.data.totalCash_1 || 0,
        totalCash_2 : res.data.totalCash_2 || 0,
        total : res.data.total || 0
       })
       
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    fetchData()
  },[searchDate.dateStart, searchDate.dateEnd])

  return (
    <div>
      <div className="flex flex-row gap-4 items-center justify-start">
        <div className="w-1/5">
          <p className="text-sm text-gray-600">วันที่เริ่มต้น</p>
          <input
            value={searchDate.dateStart}
            onChange={(e) =>
              setSearchDate((prev) => ({
                ...prev,
                dateStart: e.target.value,
              }))
            }
            type="date"
            className="border border-gray-200 rounded-md shadow-md px-4 py-1 w-full"
          />
        </div>
        <div className="w-1/5">
          <p className="text-sm text-gray-600">วันที่สิ้นสุด</p>
          <input
          value={searchDate.dateEnd}
          onChange={(e) =>
            setSearchDate((prev) => ({
              ...prev,
              dateEnd: e.target.value,
            }))
          }
            type="date"
            className="border border-gray-200 rounded-md shadow-md px-4 py-1 w-full"
          />
        </div>
      </div>

      {/* Contents */}

      <div className="flex flex-col lg:flex-row gap-4 mt-8">
        <div className="w-full ">
          <div className="flex flex-row gap-4 px-4 py-6 border border-gray-300 rounded-md shadow-sm">
            <div className="w-1/3 flex flex-col justify-center items-center">
              <FcMoneyTransfer size={100} />
              <hr className="text-gray-700 " />
              <p className="text-xl ">เล่มประมูล</p>
            </div>
            <div className="w-2/3 flex flex-col items-start justify-center">
              <p className="text-2xl"> เงินสด {Number(data.auctionSum_1).toLocaleString()} บาท</p>
              <hr className="text-gray-500 w-52 my-4" />
              <p className="text-2xl"> เงินเชื่อ {Number(data.auctionSum_2).toLocaleString()} บาท</p>
            </div>
          </div>

          <div className="flex flex-row gap-4 px-4 py-6 border border-gray-300 rounded-md shadow-sm mt-4">
            <div className="w-1/3 flex flex-col justify-center items-center">
              <FcShop size={100} />
              <hr className="text-gray-700 " />
              <p className="text-xl ">เล่มขายสินค้า</p>
            </div>
            <div className="w-2/3 flex flex-col items-start justify-center">
              <p className="text-2xl"> เงินสด {Number(data.saleSum_1).toLocaleString()} บาท</p>
              <hr className="text-gray-500 w-52 my-4" />
              <p className="text-2xl"> เงินเชื่อ {Number(data.saleSum_2).toLocaleString()} บาท</p>
            </div>
          </div>
        </div>
        <div className="w-full px-4 py-3 border border-gray-300 shadow-sm rounded-md flex flex-col justify-center items-center">
          <p className="text-2xl">รวมข้อมูลเล่มประมูล และ เล่มขายสินค้า</p>

          <div className="mt-4">
            <p className="text-xl">เงินสด {Number(data.totalCash_1).toLocaleString()} บาท</p>
            <hr className="text-gray-500 my-3" />
            <p className="text-xl">เงินเชื่อ {Number(data.totalCash_2).toLocaleString()} บาท</p>
          </div>

          <div className="mt-8">
            <hr className=" border border-gray-300  w-96 " />

            <p className="text-xl mt-4 text-center"> รวมเป็นเงิน {Number(data.total).toLocaleString()} บาท </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSale;
