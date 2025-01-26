"use client";
import { decryptToken, errorMessage } from "@/lib/tool";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type ModalAddProps = {
  open: boolean;
  handleModalAdd: () => void;
  id: number;
  fetchData: () => void;
};

const ModalAdd: React.FC<ModalAddProps> = ({
  open,
  handleModalAdd,
  id,
  fetchData,
}) => {
  const token = decryptToken();
  const [name, setName] = useState("");
  const dateNow = moment().format("YYYY-MM-DD");
  const [date, setDate] = useState(dateNow);

  const handleSave = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auction_title/add`,
        { name, 
          date, 
          id: id ? id : "" 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      

      if (res.status === 200) {
        toast.success(res.data.message)
        setName("");
        fetchData();
        handleModalAdd();
      }
    } catch (err: unknown) {
      console.log(err);
      errorMessage(err);
    }
  };

  const fetchDataByid = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auction_title/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        console.log(res.data);
        if (id > 0) {
          setName(res.data.name);
          setDate(res.data.date);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id > 0) {
      fetchDataByid();
    } else {
      setName("");
      setDate(dateNow)
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
                  เพิ่มหัวข้อประมูล test : {id}
                </DialogTitle>
                <div className="py-4 flex flex-col lg:flex-row gap-4">
                  <input
                    type="date"
                    value={date || ""}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg shadow-lg px-4 py-1.5"
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="หัวข้อประมูล"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg shadow-lg px-4 py-1.5"
                    value={name || ""}
                    onChange={(e) => setName(e.target.value)}
                  />
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
