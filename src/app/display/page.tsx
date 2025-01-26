// /display.tsx
"use client";
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import DisplayScreen from "./DisplayScreen";
import WinnerScreen from "./WinnerScreen";
import { getSocket } from "@/lib/tool";

interface SendDataType {
  title: string;
  id: number ;
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
    customer_name: string;
    name : string;
    price: number;
  }[];
}

const defaultData: SendDataType = {
  title: "",
  id: 0,
  government: 0,
  lottery: 0,
  products: [],
  customers: [],
};

interface displayProp {
  h: string;
}

const Display: React.FC<displayProp> = ({ h }) => {

  const [data, setData] = useState<SendDataType | null>(null);
  const [screen, setScreen] = useState("show_display_screen")
  const socket : Socket = getSocket();

  useEffect(() => {
    if (!socket) {
      console.log("ไม่มี socket");
      return;
    }
  
    console.log("มี socket");
  
    const handleStep1 = (data: string) => {
      console.log("Customer Data Received:", data);
      setData((prev) => ({
        ...prev || defaultData,
        title: data,
      }));
    };
  
    const handleStep2 = (data: SendDataType) => {
      console.log("Step 2 Data Received:", data);
      setData(data);
    };
  
    const handleChangeScreen = (data: string) => {
      console.log("Screen Change Received:", data);
      setScreen(data);
    };

    const handleReloadScreen = (data:number)=> {
      if(data ===1){
        window.location.reload()
      }
    }
  
    // ตั้ง Listener
    socket.on("show_step_1", handleStep1);
    socket.on("show_step_2", handleStep2);
    socket.on("show_change_screen", handleChangeScreen);
    socket.on("show_reload_screen", handleReloadScreen);
  
    return () => {
      // ลบ Listener เมื่อ Component ถูกทำลาย
      socket.off("show_step_1", handleStep1);
      socket.off("show_step_2", handleStep2);
      socket.off("show_change_screen", handleChangeScreen);
      socket.off("show_reload_screen", handleReloadScreen);
    };
  }, [socket]); 

  useEffect(() => {
    console.log("Socket status:", socket.connected);
  }, [socket]);
  
// ฉันทดสอบ API ใน postman ข้อมูลมา 1 row ถูกต้อง
// อาจจะมาจากการเรียกใช้ ueffect ใน Component
  return (
    <div>
      {/* {JSON.stringify(data)} */}
    {screen === "show_display_screen" && <DisplayScreen h={h} data={data} /> }
    {screen === "show_winner_screen" && !h && <WinnerScreen id={data?.id || null}  /> }
      
    </div>
  );
};

export default Display;
