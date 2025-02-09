"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import axios from "axios";
import { decryptToken, errorMessage } from "@/lib/tool";
import { toast } from "react-toastify";

interface ModalPropType {
  open: boolean;
  setOpen: (test: boolean) => void;
  id: number | null;
  fetchDataMain : ()=>void
}

// interface dataType {
//   status: number;
//   token: string;
// }

const ModalEditUser: React.FC<ModalPropType> = ({ open, setOpen, id , fetchDataMain}) => {
  // systems
  const token = decryptToken();

  //   state
//   const [data, setData] = useState<dataType | null>(null);
  const [sendData, setSendData] = useState<{
    username: string;
    password: string;
    token : string
    status: number ;
  }>({
    username: "",
    password: "",
    token : "",
    status: 0 ,
  });

  //   Functions
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        // setData(res.data);
        setSendData((prev)=> ({
            ...prev,
            status : res.data.status
        }))
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSendData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async()=>{
    try {
        const data = {
            id,
            username : sendData.username,
            password : sendData.password,
            status : sendData.status
        }

        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/users/update`,data,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
    
          if (res.status === 200) {
            toast.success(res.data.message)
            fetchDataMain()
            setOpen(!open)
          }
        
    } catch (error: unknown) {
        console.log(error);
        errorMessage(error)
        
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-sm data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-base font-medium text-gray-900"
                  >
                    แก้ไขข้อมูล status : {sendData?.status}
                  </DialogTitle>
                  {/* test : {JSON.stringify(sendData)} */}
                  <div className="flex flex-col gap-1 mt-5">
                    <p className="text-sm font-light">แก้ไข Username?</p>
                    <input
                      onChange={(e) => handleChange(e)}
                      name="username"
                      type="text"
                      className="border border-gray-400 px-4 py-1 rounded-md"
                      placeholder="กรอก Username ใหม่"
                    />
                  </div>
                  <div className="flex flex-col gap-1 mt-5 w-full">
                    <p className="text-sm font-light">แก้ไขรหัสผ่าน ?</p>
                    <input
                      onChange={(e) => handleChange(e)}
                      name="password"
                      type="password"
                      className="border border-gray-400 px-4 py-1 rounded-md"
                      placeholder="กรอกหัสผ่านใหม่"
                    />
                  </div>
                  <div className="flex flex-col gap-1 mt-5">
                    <p className="text-sm font-light">
                      เปลี่ยนสิทธิ์การใช้งาน
                      <span className="text-red-500">
                        {" "}
                        {sendData?.token && "แก้ไขไม่ได้"}
                      </span>
                    </p>
                    <select
                      disabled={sendData?.token !== ""}
                      name="status"
                      onChange={(e) => handleChange(e)}
                      value={sendData.status || 0}
                      className={`${
                        sendData?.token ? "bg-red-500 text-white" : ""
                      } border border-gray-400 px-4 py-1 rounded-md`}
                    >
                      <option value="">เลือก</option>
                      <option value="3">Admin</option>
                      <option value="0">Member</option>
                      <option value="1">Account</option>
                      <option value="2">Display</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-row gap-3 mt-6 justify-end items-end">
                <button onClick={handleSave} className="bg-green-500 text-white px-4 py-1 rounded-md">
                  อัพเดท
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalEditUser;
