"use client";
import { handleCaptureScreen } from "@/lib/tool";
import axios from "axios";
import Image from "next/image";
import { useRouter  } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface ClientScreenProps {
    id: number ;
  }

interface dataType {
  id: number;
  government: number;
  lottery: number;
  name: string;
  price: number;
  title: string;
}



const PageScreen : React.FC<ClientScreenProps> =({id}) => {
    // State
    const [data, setData] = useState<dataType | null>(null);
    const [products, setProducts] = useState<string | null>(null);
    // const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const winnerRef = useRef<HTMLDivElement>(null);


    // System
    const hasFetched = useRef(false);
    const router = useRouter();
    // const searchParams = useSearchParams();
    // const id = Number(searchParams.get("id"));



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

          setTimeout(async() => {
            await handleCaptureScreen(id, winnerRef);
          }, 2000);
          
        }
      } catch (error) {
        console.log("Error fetching winner data:", error);
      }
    };

   
    useEffect(() => {
      const startPage = async () => {
        if (id !== null && !hasFetched.current) {
          await fetchData();
          hasFetched.current = true;
        }
      };
      startPage();
    }, [id]);

    useEffect(() => {
        const timer = setTimeout(() => {
          router.back(); 
        }, 3000); 
    
        return () => clearTimeout(timer); 
      }, [router]);

    return (
      <div ref={winnerRef}>
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
            <div className={`py-6 lg:py-20 px-6 lg:px-60  w-full  `}>
              <div className="flex flex-row gap-4 justify-center">
                <Image
                  src="/images/auction_logo_1.png"
                  alt="Login Image"
                  width={200}
                  height={200}
                  className="w-40 h-40 lg:w-60 lg:h-60"
                />
                
              </div>

              <h2 className="text-2xl lg:text-4xl text-center mt-4 font-extrabold text-yellow-400  text-outline-product">
                ขอแสดงความยินดี
              </h2>

              <div className="bg-red-900 mt-10 text-center border-2 border-yellow-500 rounded-md lg:mx-40 flex flex-col items-center justify-center py-4">
                
                <div className="text-3xl lg:text-6xl text-white font-semibold text-outline-product px-6 lg:px-14 ">
                  {data?.name || ""}
                </div>
                <p>{ " " }</p>
                <p>{ " " }</p>
               
              </div>

              <h2 className="text-3xl lg:text-5xl text-red-900 font-extrabold text-outline-winner mt-8 text-center">
                {data?.title || ""}
              </h2>

              <p className="text-center text-yellow-400 mt-8 text-2xl font-extrabold text-outline-product">
                {products || ""}
              </p>

              <div className="flex mt-12 justify-center items-end gap-4 font-extrabold text-red-900 text-outline-winner">
                <p className="text-2xl lg:text-4xl ">มูลค่า</p>
                <p className="text-4xl lg:text-6xl">{Number(data?.price).toLocaleString() || 0}</p>
                <p className="text-2xl lg:text-4xl">บาท</p>
              </div>
            </div>
          )}

          {/*  */}
          <div className="absolute bottom-0 left-0 flex justify-between w-full  lg:px-24 py-0  mb-20 lg:mb-0">
            {/* ต้องการให้หันซ้าย */}
            <Image
              src="/images/lion-right.gif"
              alt="Left Image"
              width={300}
              height={300}
              className="z-10 w-28 h-28 lg:w-60 lg:h-60   transform scale-x-[-1]"
            />
            {/* รูปด้านขวาปกติ */}
            <Image
              src="/images/lion-right.gif"
              alt="Right Image"
              width={300}
              height={300}
              className="z-10 w-28 h-28 lg:w-60 lg:h-60  "
            />
          </div>
        </div>
      </div>
    );
  }


export default PageScreen;
