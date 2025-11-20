"use client";
import Image from "next/image";
import React from "react";
import { RiNumber1, RiNumber2, RiNumber3 } from "react-icons/ri";

interface SendDataType {
  title: string;
  id: number;
  government: number;
  lottery: number;
  products: {
    product_name: string;
    qty: number;
    category_name: string;
    product_id: number;
    unit: string;
  }[];
  customers: {
    customer_id: number;
    name: string;
    customer_name: string;
    price: number;
  }[];
}

interface displayProp {
  h: string | null;
  data: SendDataType | null;
  countNumber :number | null
}

const DisplayScreen: React.FC<displayProp> = ({ h, data, countNumber }) => {
  return (
    <div
      className={`flex ${
        h ? h : "h-screen w-screen"
      }  flex-col items-center justify-center   bg-red-200  `}
      style={{
        backgroundImage: `url(/images/bg.jpg)`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
      }}
    >

{/* ต้องการให้มี Effect zoomเข้าออก */}
      {countNumber && !h && (
      <div className="absolute top-0 right-10 lg:right-32 mt-10 p-4 z-10 bg-white rounded-full border-4 border-yellow-400 animate-[zoomInOut_1.5s_ease-in-out_infinite]  ">
        {countNumber === 1 && (<div > <RiNumber1 className="w-16 h-16 lg:w-24 lg:h-24 " /> </div>)}
        {countNumber === 2 && (<div><RiNumber2 className="w-16 h-16 lg:w-24 lg:h-24" /></div>)}
        {countNumber === 3 && (<div><RiNumber3 className="w-16 h-16 lg:w-24 lg:h-24 " /></div>)}
      </div>
      )}

      {!h && (
        <div
          className={`absolute top-0 left-0 w-full flex  justify-between lg:px-8  `}
        >
          <Image
            src="/images/lantern-left-2.png"
            alt="Lantern Left"
            width={200}
            height={100}
            className="w-20 lg:w-60 lg:h-72"
          />
          <Image
            src="/images/lantern-right-2.png"
            alt="Lantern Right"
            width={200}
            height={100}
            className="w-20 lg:w-60 lg:h-72"
          />
        </div>
      )}

      <div className={`${h ? "px-4" : "px-6 lg:px-20"} w-full   `}>
        <div
          className={`bg-red-200 bg-opacity-50 rounded-md   flex flex-col items-center justify-center ${
            h ? "h-40 " : "h-full "
          } overflow-y-scroll  `}
        >
          {!data?.title && !h && (
            <div className={`py-10 lg:py-20`}>
              <div className="flex flex-row gap-4 justify-center">
                <Image
                  src="/images/auction_logo_1.png"
                  alt="Login Image"
                  width={300}
                  height={200}
                  className="w-40 h-40 lg:w-72 lg:h-72"
                />
               
              </div>
              <div className="text-center flex flex-col justify-center items-center mt-6 ">
                <h1 className="text-4xl lg:text-6xl font-extrabold text-outline-title">
                  ขอเชิญร่วม ประมูล และ บริจาค
                </h1>
                <h2 className="text-2xl lg:text-4xl mt-8 font-extrabold text-outline-p ">
                  ศาลเจ้าปึงเถ่ากงม่า ขอนแก่น
                </h2>
              </div>
            </div>
          )}

     

          {/* ถ้ามีหัวข้อประมูล มา */}
          {data?.title && (
            <div
              className={` ${h ? "h-40 py-6 px-4" : "h-full py-6 lg:py-20 px-6 lg:px-40 "}   w-full   `}
            >
              <h1
                className={`text-center text-red-800 ${
                  h ? "text-xl" : " text-5xl lg:text-7xl text-outline-title"
                } font-extrabold `}
              >
                {data?.title}
              </h1>

              {/*สินค้า  */}
              <div
                className={`text-center flex flex-row gap-4 justify-center mt-6  font-semibold ${
                  h ? "" : "text-xl lg:text-4xl text-outline-product text-yellow-400 "
                } leading-relaxed `}
              >
                {[
                  `ฉลากออมสิน ${data?.government || 0} ใบ`,
                  `ล็อตเตอรี่ ${data?.lottery || 0} ใบ`,
                  ...data?.products?.map(
                    (item) => `${item.product_name} ${item.qty} ${item.unit}`
                  ),
                ].join(" / ")}
              </div>

              {/* 3 อันดับ */}
              <div className={`flex flex-col ${h ? "gap-3 mt-6" : "gap-8 lg:gap-12 mt-12"}   `}>
                {data?.customers.length > 0 && (
                  <>
                  {/* animate-[zoomInOut_1.5s_ease-in-out_infinite]  */}
                    <div
                      className={`flex flex-row justify-between font-extrabold text-red-800   ${
                        h ? "" : "text-3xl lg:text-5xl text-outline-winner"
                      } `}
                    >
                      <h1> {`1. ${data?.customers[0]?.name || ""}`} </h1>{" "}
                      <p>
                        {Number(
                          data?.customers[0]?.price || 0
                        ).toLocaleString()}{" "}
                        ฿
                      </p>
                    </div>
                    <div
                      className={`flex flex-row justify-between font-semibold ${
                        h ? "" : "text-2xl lg:text-3xl"
                      }`}
                    >
                      <h1>2. {data?.customers[1]?.name} </h1>
                      <p>
                        {Number(
                          data?.customers[1]?.price || 0
                        ).toLocaleString()}{" "}
                        ฿
                      </p>
                    </div>
                    <div
                      className={`flex flex-row justify-between font-semibold ${
                        h ? "" : "text-2xl lg:text-3xl"
                      }`}
                    >
                      <h1>3. {data?.customers[2]?.name} </h1>
                      <p>
                        {Number(
                          data?.customers[2]?.price || 0
                        ).toLocaleString()}{" "}
                        ฿
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayScreen;
