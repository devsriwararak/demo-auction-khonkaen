"use client";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface WinnerScreenPropType {
  id: number | null;
}

interface dataType {
  id: number;
  government: number;
  lottery: number;
  name: string;
  price: number;
  title: string;
}

const WinnerScreen: React.FC<WinnerScreenPropType> = ({ id }) => {
  // State
  const [data, setData] = useState<dataType | null>(null);
  const [products, setProducts] = useState<string | null>(null);

  // System
  const hasFetched = useRef(false);

  const fetchData = async () => {
    if (id === null) {
      console.warn("ID is null. Skipping fetch.");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auction/winner`,
        { id }
      );
      console.log("Response:", res.data);
      if (res.status === 200) {
        setData(res.data.results);
        setProducts(res.data.products);
      }
    } catch (error) {
      console.log("Error fetching winner data:", error);
    }
  };

  useEffect(() => {
    if (id !== null && !hasFetched.current) {
      fetchData();
      hasFetched.current = true;
    }
  }, [id]);

  return (
    <div>
      <div
        className={`flex h-screen w-screen  flex-col items-start justify-start   bg-red-200 overflow-y-scroll relative `}
        style={{
          backgroundImage: `url(/images/bg.jpg)`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
        }}
      >
        {!data?.id && (
          <h1 className="text-white text-5xl ">ยังไม่จบการประมูล</h1>
        )}

        {data?.id && (
          <div className={`py-20 px-60 `}>
            <div className="flex flex-col lg:flex-row gap-4 justify-center">
              <Image
                src="/images/admin-home-01.png"
                alt="Login Image"
                width={200}
                height={200}
              />
              <Image
                src="/images/admin-home-02.png"
                alt="Login Image"
                width={200}
                height={200}
              />
            </div>

            <h2 className="text-4xl text-center mt-4 font-extrabold text-yellow-400  text-outline-product">
              ขอแสดงความยินดี
            </h2>

            <div className="bg-red-900 mt-10 text-center py-2 border-2 border-yellow-500 rounded-md">
              <h2 className="text-6xl text-white font-semibold text-outline-product px-20 py-1">
                {data?.name || ""}
              </h2>
            </div>

            <h2 className="text-5xl text-red-900 font-extrabold text-outline-winner mt-8 text-center">
              {data?.title || ""}
            </h2>

            <p className="text-center text-yellow-400 mt-8 text-2xl font-extrabold text-outline-product">
              {products || ""}
            </p>

            <div className="flex mt-12 justify-center items-end gap-4 font-extrabold text-red-900 text-outline-winner">
              <p className="text-4xl ">มูลค่า</p>
              <p className="text-6xl">5,000</p>
              <p className="text-4xl">บาท</p>
            </div>
          </div>
        )}

 {/*  */}
 <div className="absolute bottom-0 left-0 flex justify-between w-full px-24 py-10">
        {/* ต้องการให้หันซ้าย */}
        <Image
          src="/images/lion-right.gif"
          alt="Left Image"
          width={300}
          height={300}
          className="z-10  transform scale-x-[-1]"
        />
{/* รูปด้านขวาปกติ */}
        <Image
          src="/images/lion-right.gif"
          alt="Right Image"
          width={300}
          height={300}
          className="z-10 "
        />
      </div>

      </div>
    </div>
  );
};

export default WinnerScreen;
