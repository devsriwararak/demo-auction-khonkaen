"use client";
import { decryptToken, errorMessage } from "@/lib/tool";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

type ModalAddProps = {
  open: boolean;
  handleModalAdd: () => void;
  // sendDataToModal: {
  //   id: number;
  //   title: string;
  // };
  fetchData: () => void;
  id : number
};

const ModalAdd: React.FC<ModalAddProps> = ({
  open,
  handleModalAdd,
  fetchData,
  id
}) => {
  const token = decryptToken();

  const [cus_name , setCus_name] = useState("")
  const [cus_address , setCus_address] = useState("")
  const [cus_delivery , setCus_delivery] = useState("")
  const [cus_contact , setCus_contact] = useState("")
  const [cus_noun , setCus_noun] = useState("")
  const [cus_tel , setCus_tel] = useState("")
  const [cus_ref , setCus_ref] = useState("")

  const handleAddDataToState = (data : string ,name : string)=>{
    if(name === "cus_name"){
      setCus_name(data)
    }else if(name === "cus_address"){
      setCus_address(data)
    }else if(name === "cus_delivery"){
      setCus_delivery(data)
    }else if(name === "cus_contact"){
      setCus_contact(data)
    }else if(name === "cus_noun"){
      setCus_noun(data)
    }else if (name === "cus_tel"){
      setCus_tel(data)
    }else if(name === "cus_ref"){
      setCus_ref(data)
    }
    
  }

  const handleSave = async () => {
    // ถ้ามี id เข้ามาให้ใช้ เส้น

    try {
      let res;
      if (id) {
        res = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/customers/${process.env.NEXT_PUBLIC_API_VERSION}/${id}`,
          { cus_name, 
            cus_address,
            cus_delivery,
            cus_contact,
            cus_noun,
            cus_tel,
            cus_ref
           },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/customers/${process.env.NEXT_PUBLIC_API_VERSION}/create`,
          { cus_name, 
            cus_address,
            cus_delivery,
            cus_contact,
            cus_noun,
            cus_tel,
            cus_reference : cus_ref
           },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (res.status === 200) {
        fetchData();
        handleModalAdd();

        setCus_name("")
        setCus_address("")
        setCus_delivery("")
        setCus_contact("")
        setCus_noun("")
        setCus_tel("")
        setCus_ref("")
      }
    } catch (err: unknown) {
      console.log(err);
      errorMessage(err);
    }
  };

  const fetchDataByid = async()=>{
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/customers/${process.env.NEXT_PUBLIC_API_VERSION}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          
        }
      );
      if (res.status === 200) {
        console.log(res.data.data);
        if(id>0){
          setCus_name(res.data.data.cus_name)
          setCus_address(res.data.data.cus_address)
          setCus_delivery(res.data.data.cus_delivery)
          setCus_contact(res.data.data.cus_contact)
          setCus_noun(res.data.data.cus_noun)
          setCus_tel(res.data.data.cus_tel)
          setCus_ref(res.data.data.cus_reference)
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if(id > 0){
      fetchDataByid()
    }else {
      setCus_name("")
      setCus_address("")
      setCus_delivery("")
      setCus_contact("")
      setCus_noun("")
      setCus_tel("")
      setCus_ref("")
    }
    
  }, [id]);

  return (
    <Dialog open={open} onClose={handleModalAdd} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />



      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 ">
              <div className="mt-3 text-center  sm:mt-0 sm:text-left ">
                <DialogTitle
                  as="h3"
                  className="text-base font-semibold text-gray-900"
                >
                  เพิ่มผู้บริจาค  ID : {id}
                </DialogTitle>
                
                <div className="py-4 flex flex-col lg:flex-row gap-4">
                  <div className="w-full">
                    <p className="font-light text-sm">รหัสผู้บริจาค</p>
                    <input
                      type="text"
                      className="w-full mt-1 bg-gray-300 border border-gray-400 rounded-lg shadow-lg px-4 py-1.5"
                      onChange={() => {}}
                      disabled
                      placeholder="รหัสผู้บริจาค Gen Auto"
                    />
                  </div>
                  <div className="w-full">
                    <p className="font-light text-sm">ชื่อ-สกุล</p>
                    <input
                      type="text"
                      className="w-full mt-1 bg-gray-50 border border-gray-300 rounded-lg shadow-lg px-4 py-1.5"
                      value={cus_name || ""}
                      onChange={(e) =>handleAddDataToState(e.target.value, "cus_name")}
                      placeholder="ชื่อ-สกุล"
                    />
                  </div>
                </div>

                <div className="">
                  <p className="font-light text-sm">ที่อยุ่</p>
                  <input
                    type="text"
                    className="w-full mt-1 bg-gray-50 border border-gray-300 rounded-lg shadow-lg px-4 py-1.5"
                    value={cus_address || ""}
                    onChange={(e) =>handleAddDataToState(e.target.value, "cus_address")}
                    placeholder="ที่อยุ่"
                  />
                </div>

                
                <div className="mt-4">
                  <p className="font-light text-sm">สถานที่จัดส่ง</p>
                  <input
                    type="text"
                    className="w-full mt-1 bg-gray-50 border border-gray-300 rounded-lg shadow-lg px-4 py-1.5"
                    value={cus_delivery || ""}
                    onChange={(e) =>handleAddDataToState(e.target.value, "cus_delivery")}
                    placeholder="สถานที่จัดส่ง"
                  />
                </div>

                <div className="py-4 flex flex-col lg:flex-row gap-4">
                  <div className="w-full">
                    <p className="font-light text-sm">ผู้ติดต่อ</p>
                    <input
                      type="text"
                      className="w-full mt-1 bg-gray-50 border border-gray-300 rounded-lg shadow-lg px-4 py-1.5"
                      value={cus_contact || ""}
                      onChange={(e) =>handleAddDataToState(e.target.value, "cus_contact")}
                      placeholder="ผู้ติดต่อ"
                    />
                  </div>
                  <div className="w-full">
                    <p className="font-light text-sm">ออกฉลากในนาม</p>
                    <input
                      type="text"
                      className="w-full mt-1 bg-gray-50 border border-gray-300 rounded-lg shadow-lg px-4 py-1.5"
                      value={cus_noun || ""}
                      onChange={(e) =>handleAddDataToState(e.target.value, "cus_noun")}
                      placeholder="ออกฉลากในนาม"
                    />
                  </div>
                </div>

                <div className=" mb-7 flex flex-col lg:flex-row gap-4">
                  <div className="w-full">
                    <p className="font-light text-sm">เบอร๋โทร</p>
                    <input
                      type="text"
                      className="w-full mt-1 bg-gray-50 border border-gray-300 rounded-lg shadow-lg px-4 py-1.5"
                      value={cus_tel || ""}
                      onChange={(e) =>handleAddDataToState(e.target.value, "cus_tel")}
                      placeholder="เบอร๋โทร"
                    />
                  </div>
                  <div className="w-full">
                    <p className="font-light text-sm">เลขอ้างอิง</p>
                    <input
                      type="text"
                      className="w-full mt-1 bg-gray-50 border border-gray-300 rounded-lg shadow-lg px-4 py-1.5"
                      value={cus_ref || ""}
                      onChange={(e) =>handleAddDataToState(e.target.value, "cus_ref")}
                      placeholder="เลขอ้างอิง"
                    />
                  </div>
                </div>

              </div>
            </div>
            <div className="bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
                {!id ? "บันทึก" : "อัพเดท"}
              </button>
              <button
                type="button"
                data-autofocus
                onClick={handleModalAdd}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                ยกเลิก
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalAdd;
