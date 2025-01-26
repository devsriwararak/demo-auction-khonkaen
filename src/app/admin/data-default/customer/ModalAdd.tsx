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
import { toast } from "react-toastify";

type ModalAddProps = {
  open: boolean;
  handleModalAdd: () => void;
  fetchData: () => void;
  id: number;
};

const ModalAdd: React.FC<ModalAddProps> = ({
  open,
  handleModalAdd,
  fetchData,
  id,
}) => {
  const token = decryptToken();

  const [dataObject, setDataObject] = useState({
    name: "",
    address_customer: "",
    address_send: "",
    contact: "",
    noun: "",
    tel: "",
    ref: "",
  });

  const handleSave = async () => {
    try {
      const sendData = {
        id: id ? id : "",
        name: dataObject.name,
        address_customer: dataObject.address_customer,
        address_send: dataObject.address_send,
        contact: dataObject.contact,
        noun: dataObject.noun,
        tel: dataObject.tel,
        ref: dataObject.ref,
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/customer/add`,
        sendData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        toast.success(res.data.message);
        fetchData();
        handleModalAdd();
        if (id === 0) {
          setDataObject({
            name: "",
            address_customer: "",
            address_send: "",
            contact: "",
            noun: "",
            tel: "",
            ref: "",
          });
        }
      }
    } catch (err: unknown) {
      console.log(err);
      errorMessage(err);
    }
  };

  const fetchDataByid = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/customer/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        console.log(res.data);
        if (id > 0) {
          setDataObject({
            name: res.data.name,
            address_customer: res.data.address_customer,
            address_send: res.data.address_send,
            contact: res.data.contact,
            noun: res.data.noun,
            tel: res.data.tel,
            ref: res.data.ref,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSetValues = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataObject((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (id > 0) {
      fetchDataByid();
    } else {
      setDataObject({
        name: "",
        address_customer: "",
        address_send: "",
        contact: "",
        noun: "",
        tel: "",
        ref: "",
      });
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
                  เพิ่มผู้บริจาค : {id}
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
                      name="name"
                      value={dataObject.name || ""}
                      onChange={(e) => handleSetValues(e)}
                      placeholder="ชื่อ-สกุล"
                    />
                  </div>
                </div>

                <div className="">
                  <p className="font-light text-sm">ที่อยุ่</p>
                  <input
                    type="text"
                    className="w-full mt-1 bg-gray-50 border border-gray-300 rounded-lg shadow-lg px-4 py-1.5"
                    name="address_customer"
                    value={dataObject.address_customer || ""}
                    onChange={(e) => handleSetValues(e)}
                    placeholder="ที่อยุ่"
                  />
                </div>

                <div className="mt-4">
                  <p className="font-light text-sm">สถานที่จัดส่ง</p>
                  <input
                    type="text"
                    className="w-full mt-1 bg-gray-50 border border-gray-300 rounded-lg shadow-lg px-4 py-1.5"
                    name="address_send"
                    value={dataObject.address_send || ""}
                    onChange={(e) => handleSetValues(e)}
                    placeholder="สถานที่จัดส่ง"
                  />
                </div>

                <div className="py-4 flex flex-col lg:flex-row gap-4">
                  <div className="w-full">
                    <p className="font-light text-sm">ผู้ติดต่อ</p>
                    <input
                      type="text"
                      className="w-full mt-1 bg-gray-50 border border-gray-300 rounded-lg shadow-lg px-4 py-1.5"
                      name="contact"
                      value={dataObject.contact || ""}
                      onChange={(e) => handleSetValues(e)}
                      placeholder="ผู้ติดต่อ"
                    />
                  </div>
                  <div className="w-full">
                    <p className="font-light text-sm">ออกฉลากในนาม</p>
                    <input
                      type="text"
                      className="w-full mt-1 bg-gray-50 border border-gray-300 rounded-lg shadow-lg px-4 py-1.5"
                      name="noun"
                      value={dataObject.noun || ""}
                      onChange={(e) => handleSetValues(e)}
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
                      name="tel"
                      value={dataObject.tel || ""}
                      onChange={(e) => handleSetValues(e)}
                      placeholder="เบอร๋โทร"
                    />
                  </div>
                  <div className="w-full">
                    <p className="font-light text-sm">เลขอ้างอิง</p>
                    <input
                      type="text"
                      className="w-full mt-1 bg-gray-50 border border-gray-300 rounded-lg shadow-lg px-4 py-1.5"
                      name="ref"
                      value={dataObject.ref || ""}
                      onChange={(e) => handleSetValues(e)}
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
