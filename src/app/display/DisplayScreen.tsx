"use client";
import Image from "next/image";
import React from "react";

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
  h: string;
  data: SendDataType | null;
}

const DisplayScreen: React.FC<displayProp> = ({ h, data }) => {
  return (
    <div
      className={`flex ${
        h ? h : "h-screen w-screen"
      }  flex-col items-center justify-center   bg-red-200 `}
      style={{
        backgroundImage: `url(/images/bg.jpg)`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
      }}
    >


      {!h && (
        <div
          className={`absolute top-0 left-0 w-full flex justify-between px-8`}
        >
          <Image
            src="/images/lantern-left-2.png"
            alt="Lantern Left"
            width={200}
            height={100}
            className=""
          />
          <Image
            src="/images/lantern-right-2.png"
            alt="Lantern Right"
            width={200}
            height={100}
            className=""
          />
        </div>
      )}

      <div className={`${h ? "px-4" : "px-20"} w-full   `}>
        <div
          className={`bg-red-200 bg-opacity-50 rounded-md   flex flex-col items-center justify-center ${
            h ? "h-40 " : "h-full "
          } overflow-y-scroll  `}
        >
          {!data?.title && !h && (
            <div className={`py-20`}>
              <div className="flex flex-col lg:flex-row gap-4 justify-center">
                <Image
                  src="/images/admin-home-01.png"
                  alt="Login Image"
                  width={300}
                  height={200}
                  // className={`${h && "w-20 h-20"}`}
                />
                <Image
                  src="/images/admin-home-02.png"
                  alt="Login Image"
                  width={300}
                  height={200}
                  // className={`${h && "w-20 h-20"}`}
                />
              </div>
              <div className="text-center flex flex-col justify-center items-center mt-6 ">
                <h1 className="text-6xl font-semibold">
                  ขอเชิญร่วม ประมูล และ บริจาค
                </h1>
                <h2 className="text-4xl mt-8 font-semibold">
                  ศาลเจ้าปึงเถ่ากงม่า ขอนแก่น
                </h2>
              </div>
            </div>
          )}

     

          {/* ถ้ามีหัวข้อประมูล มา */}
          {data?.title && (
            <div
              className={` ${h ? "h-40 py-6 px-4" : "h-full py-20 px-40 "}   w-full   `}
            >
              <h1
                className={`text-center text-red-800 ${
                  h ? "text-xl" : "text-7xl text-outline-title"
                } font-extrabold `}
              >
                {data?.title}
              </h1>

              {/*สินค้า  */}
              <div
                className={`text-center flex flex-row gap-4 justify-center mt-6  font-semibold ${
                  h ? "" : "text-3xl text-outline-product text-yellow-400"
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
              <div className={`flex flex-col ${h ? "gap-3 mt-6" : "gap-12 mt-12"}   `}>
                {data?.customers.length > 0 && (
                  <>
                    <div
                      className={`flex flex-row justify-between font-extrabold text-red-800   ${
                        h ? "" : "text-5xl text-outline-winner"
                      }`}
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
                        h ? "" : "text-3xl"
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
                        h ? "" : "text-3xl"
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
