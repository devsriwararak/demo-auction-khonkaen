'use client'
import { useEffect, useState } from "react";

interface Message {
  id: string;
  username: string;
  status: string;
}

const WebSocketComponent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState("Disconnected");
  const [userId, setUserId] = useState(0);

  const handleSendSocket = ()=> {
       // สร้างการเชื่อมต่อ WebSocket
       const ws = new WebSocket(`ws://192.168.1.96:8080/ws/user/${userId}`);

       // เมื่อเชื่อมต่อสำเร็จ
       ws.onopen = () => {
         setStatus("Connected");
         console.log("WebSocket connected");
       };
   
       // เมื่อมีข้อความเข้ามา
       ws.onmessage = (event) => {
         const data: Message = JSON.parse(event.data); // แปลงข้อมูลที่ได้รับ
         console.log(data);
         
        //  setMessages((prevMessages) => [...prevMessages, data]);
        setMessages([data])
       };
   
       // เมื่อการเชื่อมต่อถูกปิด
       ws.onclose = () => {
         setStatus("Disconnected");
         console.log("WebSocket disconnected");
       };
   
       // เมื่อเกิดข้อผิดพลาด
       ws.onerror = (error) => {
         console.error("WebSocket error", error);
       };
   
       // ปิด WebSocket เมื่อ component ถูก unmount
       return () => {
         ws.close();
       };
  }

  useEffect(() => {
 
  }, [userId]);

  return (
    <div>
      <h1>WebSocket Status: {status}</h1>
      <input
        type="text"
        placeholder="Enter userId"
        onChange={(e) => setUserId(Number(e.target.value))}
      />
      <button onClick={handleSendSocket} >ส่งค่า</button>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            ID: {msg.id}, Username: {msg.username}, Status: {msg.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WebSocketComponent;