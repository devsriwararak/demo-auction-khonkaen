"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import axios from "axios";
import { encryptData, errorMessage } from "@/lib/tool";

const Loginpage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();



  const handleRedireact = async (token: string, status: string) => {
    const encryptedToken = encryptData(token)
    const encryptedStatus = encryptData(status)

    Cookies.set("auth_token", encryptedToken, { expires: 1 });

    Cookies.set("status", encryptedStatus, { expires: 1 });
    router.refresh();
  };

  // const handleLogin2 = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const res = await axios.post(
  //       `${process.env.NEXT_PUBLIC_API_URL}/auth/${process.env.NEXT_PUBLIC_API_VERSION}/login`,
  //       {
  //         username,
  //         password,
  //       }
  //     );

  //     if (res.status === 200) {
   
  //       const token = res.data.token.token;
  //       const status = res.data.token.status;
  //       await handleRedireact(token, status);
  //       console.log({token});
  //     }
  //   } catch (err: unknown) {
  //     console.log(err);
  //     errorMessage(err);
  //   }
  // };

  const handleLogin = async (e:React.FormEvent) => {
    e.preventDefault()

    let addToken = "";
    let addStatus = "";

    if (username === "admin" && password === "1234") {
      addToken = "Token_admin";
      addStatus = "3";
      await handleRedireact(addToken, addStatus);
      router.push("/admin");
    } else if (username === "member" && password === "1234") {
      addToken = "Token_member";
      addStatus = "0";
      await handleRedireact(addToken, addStatus);
      router.push("/member");
    } else if (username === "display" && password === "1234") {
      addToken = "Token_display";
      addStatus = "2";
      await handleRedireact(addToken, addStatus);
      router.push("/display");
    } else if (username === "account" && password === "password") {
      addToken = "Token_account";
      addStatus = "1";
      await handleRedireact(addToken, addStatus);
      router.push("/account");
    } else {
      alert("Login Failed");
    }
  };

  

  return (
    <div className="bg-red-100 h-screen flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-md w-80 lg:w-2/3 px-6 py-6 ">
        <div className="flex flex-row gap-8">
          <div className="w-2/4 bg-red-300 rounded-md hidden md:block ">
            <div className="  flex justify-center items-center ">
              <Image
                src="/images/login.webp"
                alt="Login Image"
                layout="responsive"
                width={500}
                height={500}
              />
            </div>
          </div>
          <div className="w-full lg:w-2/4  flex flex-col gap-2 justify-center  ">
            <h1 className="text-3xl">เข้าสู่ระบบ</h1> 
            <p className="mt-2 text-sm text-gray-400">
              ระบบประมูลศาลเจ้าขอนแก่น
            </p>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-4 mt-6">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="text-black bg-gray-100 px-4 py-2 rounded-md border border-gray-200"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-black bg-gray-100 px-4 py-2 rounded-md border border-gray-200"
                />
                <div className="flex flex-row gap-2 py-4 ">
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded-md"
                  >
                    เข้าสู่ระบบ
                  </button>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-md">
                    ส่ง OTP
                  </button>
                </div>
              </div>
            </form>
            <div className="flex justify-start items-start  text-sm text-gray-400 ">
              สงวนลิขสิทธิ์เฉพาะศาลเจ้าปึงเถ่ากงม่าขอนแก่น เท่านั้น *
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loginpage;
