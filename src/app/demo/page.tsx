"use client";
// demo.tsx
import React from "react";
import { io, Socket } from "socket.io-client";

const DemoPage: React.FC = () => {

    const fetchCustomerData = () => {
        const socket: Socket = io("http://localhost:5000");
        socket.emit("test_01"); // แจ้งเซิร์ฟเวอร์ให้ Broadcast ข้อมูล
        console.log("Requested customer data.");
        // socket.disconnect();
      };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Demo Page</h1>
      <button
        onClick={fetchCustomerData}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Get Customer Data
      </button>
    </div>
  );
};

export default DemoPage;