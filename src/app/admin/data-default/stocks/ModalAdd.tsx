"use client";
import { dataUnitProduct, decryptToken, errorMessage } from "@/lib/tool";
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

interface OptionType {
  id: string | number;
  name: string;
}

const ModalAdd: React.FC<ModalAddProps> = ({
  open,
  handleModalAdd,
  fetchData,
  id,
}) => {
  const token = decryptToken();

  const [dataObject, setDataObject] = useState({
    category_id: "",
    name: "",
    unit: "",
  });
  // Select หมวดหมู่
  const [categoryData, setCategoryData] = useState<OptionType[]>([]);
  // const [selectedCategory, setSelectedCategory] = useState<OptionType | null>(
  //   null
  // );

  // Select หน่วยนับ
  const [unitData] = useState(dataUnitProduct());

  const handleSave = async () => {
    try {
      const sendData = {
        id: id ? id : "",
        category_id: dataObject.category_id,
        name: dataObject.name,
        unit: dataObject.unit,
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/add`,
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
            category_id: "",
            name: "",
            unit: "",
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/${id}`,
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
            category_id: res.data.category_id,
            name: res.data.name,
            unit: res.data.unit,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSetValues = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDataObject((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const fetchDataCategory = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/category/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        const addDefaultOption: OptionType = { id: "", name: "ทั้งหมด" };
        const allOption = [addDefaultOption, ...res.data];
        setCategoryData(allOption);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id > 0) {
      fetchDataByid();
    } else {
      fetchDataCategory();
      setDataObject({
        category_id: "",
        name: "",
        unit: "",
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
                   {!id ? "เพิ่มข้อมูลสินค้า" : "แก้ไขข้อมูลสินค้า"}
                </DialogTitle>

                <div className="mt-4 w-2/3 pr-3">
                  <p className="text-sm">เลือกหมวดหมู่</p>
                  <select
                    className=" border border-gray-400 rounded-md px-4 py-1 mt-1.5 w-full "
                    name="category_id"
                    onChange={(e) => handleSetValues(e)}
                    value={dataObject.category_id || ""}
                  >
                    {categoryData.map((item) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>

                <div className="mt-4 flex flex-row gap-4">
                  <div className="w-2/3">
                    <p className="text-sm">ชื่อสินค้า</p>
                    <input
                      type="text"
                      className="mt-1.5  border border-gray-400  rounded-md px-4 py-1 w-full "
                      placeholder="ชื่อสินค้า"
                      onChange={(e) => handleSetValues(e)}
                      value={dataObject.name || ""}
                      name="name"
                    />
                  </div>
                  <div className="w-1/3">
                    <p className="text-sm">เลือกหน่วยนับ</p>
                    
                    <select
                      className=" border border-gray-400 rounded-md px-4 py-1 mt-1.5 w-full"
                      name="unit"
                      onChange={(e) => handleSetValues(e)}
                      value={dataObject.unit || ""}
                    >
                      {unitData.map((item) => (
                        <option key={item.id} value={item.name}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 mt-4">
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
