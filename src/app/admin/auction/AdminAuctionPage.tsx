"use client";
import React, { useEffect, useState } from "react";

// Icons
import {
  FaBoxes,
  FaDocker,
  FaMobileAlt,
  FaPlug,
  FaPrayingHands,
  FaRegEdit,
  FaRegSave,
  FaRegTrashAlt,
} from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { RiNumber1, RiNumber2, RiNumber3 } from "react-icons/ri";
import { TbWorldCancel } from "react-icons/tb";
import axios from "axios";
import { decryptToken, errorMessage, getSocket } from "@/lib/tool";
import moment from "moment";
import Select, { SingleValue } from "react-select";
import { toast } from "react-toastify";
import ModalAddProduct from "./ModalAddProduct";
import ModalAddCustomer from "./ModalAddCustomer";
import Swal from "sweetalert2";
import ModalChangePrice from "./ModalChangePrice";
// import Display from "@/app/display/page";


interface OptionType {
  value: string | number;
  label: string;
}

interface UserData {
  id: number;
  name: string;
}

interface SendDataType {
  id: number;
  government: number;
  lottery: number;
  status: number | string
  products: {
    category_id: number;
    results: Array<{
      name: string;
      quantity: number;
      category_name: string;
      product_id: number;
      unit: string;
    }>;
  }[];
  customers: {
    customer_id: number;
    customer_name: string;
    price: number;
  }[];
}

const Page = () => {
  // State
  const [dateSelectTitle, setDataSelectTitle] = useState<OptionType[]>([]);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [countNumber, setCountNumber] = useState<number>(1)
  const [selectedCusId, setSelectedCusId] = useState<{
    cusId: number | null;
    price: number | null;
  }>({
    cusId: null,
    price: null,
  });
  // const socket: Socket = io("http://192.168.1.7:5000"); //ใช้งานได้
  const socket = getSocket(); // ไม่ทำงานเมื่อไปหน้าอื่น และกลับมาหน้านี้

  if (!socket.connect) {
    console.log("socket is not working");
    socket.connect();
  }

  // Modal
  const [openModalProduct, setOpenModalProduct] = useState(false);
  const [openModalCustomer, setOpenModalCustomer] = useState(false);
  const [openModalChangePrice, setOpenModalChangePrice] = useState(false);

  // All Data
  const [sendData, setSendData] = useState<SendDataType>({
    id: 0,
    government: 0,
    lottery: 0,
    status: 0,
    products: [
      { category_id: 1, results: [] },
      { category_id: 2, results: [] },
      { category_id: 3, results: [] },
      { category_id: 4, results: [] },
      { category_id: 5, results: [] },
    ],
    customers: [],
  });

  // Systems
  const token = decryptToken();
  const dateNow = moment().format("YYYY-MM-DD");

  const fetchDataAuctionTitle = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auction/title`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            date: dateNow,
          },
        }
      );
      if (res.status === 200) {
        const rawData: UserData[] = res.data;
        const newOptions: OptionType[] = rawData.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setDataSelectTitle(newOptions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataById = async (id: number) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auction/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        console.log(res.data);
        const data: SendDataType = res.data;
        setSendData(data);
      }
    } catch (error) {
      console.log(error);
      // เคลียร์ localStorage ถ้า fetch ไม่ได้
      localStorage.removeItem("auctionId");
      setSelectedOption(null);
      setSendData({
        id: 0,
        government: 0,
        lottery: 0,
        status: 0,
        products: [
          { category_id: 1, results: [] },
          { category_id: 2, results: [] },
          { category_id: 3, results: [] },
          { category_id: 4, results: [] },
          { category_id: 5, results: [] },
        ],
        customers: [],
      });
    }
  };

  const handleChangeSelect = async (option: SingleValue<OptionType>) => {
    if (option) {
      // ผู้ใช้เลือกค่าใหม่
      setIsDisabled(true); // ปิด select เพื่อไม่ให้เปลี่ยนอีก

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auction/start`,
          { auction_id: option.value },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.status === 200) {
          console.log(res.data);
          // เก็บลง localStorage
          localStorage.setItem(
            "auctionData",
            JSON.stringify({
              id: res.data.id,
              auction_id: option.value,
              name: res.data.name,
            })
          );
          await handleSave();
          setSelectedOption(option);
          // อยากส่ง ID ไป และ ไป WHERE ข้อมูลใน ID กลับมา
          socket.emit("step_1", res.data.id);
        }
      } catch (error: unknown) {
        errorMessage(error);
      }
    } else {
      // ถ้าเคลียร์ค่า (กด clear)
      setSelectedOption(null);
      setIsDisabled(false);
      // ลบออกจาก localStorage
      localStorage.removeItem("auctionData");
    }
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSendData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClearChoice = () => {
    Swal.fire({
      title: "ยกเลิกห้องประมูล ?",
      text: "ถ้ายังไม่กด จบประมูล ระบบจะไม่บันทึกรายการให้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "gray",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        clearRoom();
        socket.emit("reload_screen", 1);
        setSelectedOption(null);
        setIsDisabled(false);
        localStorage.removeItem("auctionData");
        setSendData({
          id: 0,
          government: 0,
          lottery: 0,
          status: 0,
          products: [
            { category_id: 1, results: [] },
            { category_id: 2, results: [] },
            { category_id: 3, results: [] },
            { category_id: 4, results: [] },
            { category_id: 5, results: [] },
          ],
          customers: [],
        });
        toast.success("ทำรายการสำเร็จ");
      }
    });
  };

  const clearRoom = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auction/clear`,
        { id: sendData.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        await fetchDataAuctionTitle();
        // await handleSave();
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error("ทำรายการไม่สำเร็จ");
    }
  };

  const readDataOpenPage = () => {
    const stored = localStorage.getItem("auctionData");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.auction_id && parsed.name) {
          setSelectedOption({ value: parsed.auction_id, label: parsed.name });
          setIsDisabled(true);
          fetchDataById(parsed.id);
        }
      } catch (error) {
        console.error("Error parsing localStorage:", error);
      }
    }
  };

  // ฟังก์ชัน callback สำหรับรับสินค้าใหม่จาก Modal
  const handleAddProduct = (
    catId: number,
    productName: string,
    quantity: number,
    category_name: string,
    product_id: number,
    unit: string
  ): boolean => {
    let isDuplicate = false;
    console.log({ catId });

    setSendData((prev) => {
      const updated = prev.products.map((cat) => {
        if (cat.category_id === catId) {
          // เช็คซ้ำ
          const found = cat.results.some((item) => item.name === productName);
          if (found) {
            // ถ้าเจอซ้ำ
            isDuplicate = true;
            return cat; // ไม่เพิ่ม
          }

          // ไม่ซ้ำ -> เพิ่ม
          console.log({ cat });

          return {
            ...cat,
            results: [
              ...cat.results,
              { name: productName, quantity, category_name, product_id, unit },
            ],
          };
        }
        return cat;
      });

      return { ...prev, products: updated };
    });

    // สุดท้าย return !isDuplicate
    // (ถ้าไม่ซ้ำ => true, ถ้าซ้ำ => false)
    return !isDuplicate;
  };

  const handleAddCustomer = (
    cusId: number,
    cusName: string,
    price: number
  ): boolean => {
    let isDuplicate = false;
    console.log("test");

    setSendData((prev) => {
      const found = prev.customers.some(
        (item) => item.customer_id === cusId || item.customer_name === cusName
      );

      // เช็คซ้ำ
      if (found) {
        // ถ้าเจอซ้ำ
        isDuplicate = true;
        return prev; // ไม่เพิ่ม
      }

      // ไม่ซ้ำ -> เพิ่ม
      console.log({ prev });

      // เช็คจำนวนเงิน ต้องมากกว่าที่มีอยู่ทั้งหมด
      const maxPrice = Math.max(...prev.customers.map((item) => item.price));

      if (price <= maxPrice) {
        return prev;
      }

      const updateCustomers = [
        ...prev.customers,
        { customer_id: cusId, customer_name: cusName, price },
      ];

      return { ...prev, customers: updateCustomers };
    });

    // สุดท้าย return !isDuplicate
    // (ถ้าไม่ซ้ำ => true, ถ้าซ้ำ => false)
    return !isDuplicate;
  };

  // ต้องการแก้ไขราคา แทนที่ราคากับ cusId ที่มีอยู่แล้ว
  const handleAddChangePrice = (cusId: number, price: number) => {
    setSendData((prev) => ({
      ...prev,
      customers: prev.customers.map((item) =>
        item.customer_id === cusId
          ? { ...item, price } // อัปเดทราคา
          : item
      ),
    }));
  };

  const handleDeleteProduct = (categoryId: number, productIndex: number) => {
    setSendData((prev) => {
      const updatedProducts = prev.products.map((cat) => {
        if (cat.category_id === categoryId) {
          // ลบสินค้าตาม index
          const newResults = cat.results.filter(
            (_, idx) => idx !== productIndex
          );
          return { ...cat, results: newResults };
        }
        return cat;
      });
      return { ...prev, products: updatedProducts };
    });
  };

  const switchDisplay = async (num: number) => {
    let newNum = "show_display_screen";
    newNum = num === 1 ? newNum : "show_winner_screen";
    socket.emit("change_screen", newNum);
  };

  const handleWinner = async () => {
    if (!sendData?.id) {
      toast.error("ไม่พบข้อมูล ID");
      return;
    }
    try {
      Swal.fire({
        title: "จบการประมูล ?",
        text: "กรุณาตรวจสอบให้แน่ใจก่อนจบการประมูล !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "red",
        cancelButtonColor: "gray",
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await showWinner();
          await handleSave()
          setIsDisabled(false)
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const showWinner = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auction/add_winner`,
        { id: sendData?.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        toast.success("ทำรายการสำเร็จ");
      }
    } catch (err: unknown) {
      console.log(err);
      errorMessage(err);
    }
  };

  const handleChangeNumber = (numb: number) => {
    setCountNumber(numb)
    socket.emit("change_number_count", Number(numb));
  }

  const handleSave = async () => {
    try {
      const dataLocalStorage = localStorage.getItem("auctionData");
      let id = "";
      if (dataLocalStorage) {
        const data = JSON.parse(dataLocalStorage);
        id = data.id || "";
      }
      const data = {
        id,
        government: sendData.government,
        lottery: sendData.lottery,
        products: sendData.products,
        customers: sendData.customers,
      };

      // API
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auction/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        toast.success(res.data.message);
        fetchDataById(Number(id));
        socket.emit("step_2", Number(id));
        await switchDisplay(1);
        setCountNumber(1)
      }
    } catch (error: unknown) {
      console.log(error);
      errorMessage(error);
    }
  };

  const productCat1 = sendData.products.find((item) => item.category_id === 1);
  const productCat2 = sendData.products.find((item) => item.category_id === 2);
  const productCat3 = sendData.products.find((item) => item.category_id === 3);
  const productCat4 = sendData.products.find((item) => item.category_id === 4);
  const productCat5 = sendData.products.find((item) => item.category_id === 5);

  useEffect(() => {
    readDataOpenPage();
    fetchDataAuctionTitle();
  }, []);

  useEffect(() => {
    if (!socket.connected) {
      console.log("Socket not connected. Attempting to reconnect...");
      socket.connect();
    }

    socket.on("example_event", (data) => {
      console.log("Received data:", data);
    });

    return () => {
      socket.off("example_event");
    };
  }, [socket]);

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {openModalProduct && (
        <ModalAddProduct
          open={openModalProduct}
          setOpen={setOpenModalProduct}
          onAddProduct={handleAddProduct}
        />
      )}
      {openModalCustomer && (
        <ModalAddCustomer
          open={openModalCustomer}
          setOpen={setOpenModalCustomer}
          onAddCustomer={handleAddCustomer}
        />
      )}

      {openModalChangePrice && (
        <ModalChangePrice
          cusId={selectedCusId.cusId}
          price={selectedCusId.price}
          customers={sendData.customers}
          open={openModalChangePrice}
          setOpen={setOpenModalChangePrice}
          onAddChangePrice={handleAddChangePrice}
        />
      )}


      {/* LEFT SECTION */}
      <div className="w-full lg:w-4/6">
        <div className="bg-white shadow-md rounded-md px-5 py-4">
          <div className="flex flex-col lg:flex-row gap-0 items-end justify-between">
            {/* เลือกหัวข้อประมูล */}
            <div className="w-full lg:w-1/3 flex flex-col gap-2 justify-start items-start">
              <label htmlFor="" className="text-sm">
                เลือกหัวข้อประมูล
              </label>
              <div className="w-full">
                <Select
                  className=" "
                  placeholder="-- เลือกหัวข้อ --"
                  options={dateSelectTitle}
                  onChange={handleChangeSelect}
                  value={selectedOption}
                  isClearable
                  isDisabled={isDisabled} // ถ้ามีค่าแล้ว lock ไว้
                />
              </div>
            </div>

            {/* ปุ่มต่าง ๆ */}
            <div className="w-full lg:w-2/3 flex flex-wrap lg:flex-row gap-2 justify-start lg:justify-end">
              <button
                disabled={!isDisabled}
                onClick={() => setOpenModalProduct(!openModalProduct)}
                className={`text-sm bg-gradient-to-r ${isDisabled
                  ? "from-blue-600 to-blue-500"
                  : "from-blue-400 to-blue-300"
                  } text-white px-3 py-2 rounded-md flex flex-row gap-2 items-center`}
              >
                <MdOutlineAddShoppingCart size={18} /> เลือกสินค้า
              </button>
              <button
                disabled={!isDisabled}
                onClick={() => setOpenModalCustomer(!openModalCustomer)}
                className={`text-sm bg-gradient-to-r ${isDisabled
                  ? "from-green-600 to-green-500"
                  : "from-green-400 to-green-300"
                  } text-white px-3 py-2 rounded-md flex flex-row gap-2 items-center`}
              >
                <FiUserPlus size={18} /> เลือกผู้บริจาค
              </button>
              <button
                // disabled={!isDisabled}
                onClick={handleClearChoice}
                className={`text-sm bg-gradient-to-r  from-red-600 to-red-500
                   text-white px-3 py-2 rounded-md flex flex-row gap-2 items-center`}
              >
                <TbWorldCancel size={18} /> เคลียห้องประมูล
              </button>
            </div>
          </div>

          {/* Input ฉลากออมสิน / ล็อตเตอรี่ */}
          <div className="flex flex-row gap-4 mt-6">
            <div className="w-full lg:w-1/5">
              <p className="text-sm">ฉลากออมสิน / หน่วย</p>
              <input
                type="text"
                disabled={!isDisabled}
                placeholder="ฉลากออมสิน"
                className=" px-4 py-1.5 rounded-md border border-gray-300 shadow-sm  mt-2 w-full"
                name="government"
                value={sendData.government || 0}
                onChange={(e) => handleChangeInput(e)}
              />
            </div>
            <div className="w-full lg:w-1/5">
              <p className="text-sm">ล็อตเตอรี่ / ใบ</p>
              <input
                type="text"
                disabled={!isDisabled}
                placeholder="ล็อตเตอรี่"
                className=" px-4 py-1.5 rounded-md border border-gray-300 shadow-sm mt-2 w-full"
                name="lottery"
                value={sendData.lottery || 0}
                onChange={(e) => handleChangeInput(e)}
              />
            </div>
          </div>
        </div>

        {/* ตารางสินค้า */}
        <div className="bg-white  shadow-md rounded-md px-5 py-4 mt-4 overflow-y-scroll">
          {/* หมวดวัตถุมงคล */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-1/4 flex flex-col justify-start items-center text-sm">
              <FaPrayingHands
                className="bg-red-100 p-2 rounded-md mb-2 "
                size={70}
              />
              หมวดหมู่ วัตถุมงคล
            </div>
            <div className="w-full lg:w-3/4">
              <div className="overflow-x-auto border rounded-lg">
                <table className="table-auto w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-300">
                      <th className="px-4 py-1 text-start font-medium">ชื่อ</th>
                      <th className="px-4 py-1 text-center font-medium ">
                        จำนวน
                      </th>
                      <th className="px-4 py-1 text-center font-medium">
                        หน่วยนับ
                      </th>
                      <th className="px-4 py-1 text-center font-medium ">ลบ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productCat1?.results &&
                      productCat1.results.length > 0 &&
                      productCat1.results.map((item, idx) => (
                        <tr key={idx}>
                          <td className="border px-4 py-1 w-5/12 ">
                            {item.name}
                          </td>
                          <td className="border px-2 py-1 w-2/12 text-center">{item.quantity}</td>
                          <td className="border px-2 py-1 w-3/12 text-center">
                            {item.unit}
                          </td>
                          <td className="px-4 py-3 font-light text-gray-600 w-2/12">
                            <div className="flex justify-center">
                              <FaRegTrashAlt
                                onClick={() => handleDeleteProduct(1, idx)}
                                size={16}
                                className="text-red-500 cursor-pointer"
                              />
                            </div>

                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <hr className="my-6" />

          {/* หมวดโทรศัพท์ */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-1/4 flex flex-col justify-start items-center text-sm">
              <FaMobileAlt
                className="bg-red-100 p-2 rounded-md mb-2"
                size={70}
              />
              หมวดหมู่ โทรศัพท์
            </div>
            <div className="w-full lg:w-3/4">
              <div className="overflow-x-auto border rounded-lg">
                <table className="table-auto w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-300">
                      <th className="px-4 py-1 text-start font-medium">ชื่อ</th>
                      <th className="px-4 py-1 text-center font-medium">
                        จำนวน
                      </th>
                      <th className="px-4 py-1 text-center font-medium">
                        หน่วยนับ
                      </th>
                      <th className="px-4 py-1 text-center font-medium">ลบ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productCat2?.results &&
                      productCat2.results.length > 0 &&
                      productCat2.results.map((item, idx) => (
                        <tr key={idx}>
                          <td className="border px-2 py-1 w-5/12">{item.name}</td>
                          <td className="border px-2 py-1 text-center w-2/12">{item.quantity}</td>
                          <td className="border px-2 py-1 text-center w-3/12">
                            {item.category_name}
                          </td>
                          <td className="px-4 py-3 font-light text-gray-600 w-2/12 ">
                            <div className="flex justify-center">
                              <FaRegTrashAlt
                                onClick={() => handleDeleteProduct(2, idx)}
                                size={16}
                                className="text-red-500 cursor-pointer"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <hr className="my-6" />

          {/* หมวดหมู่ เครื่องใช้สำนักงาน */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-1/4 flex flex-col justify-start items-center text-sm">
              <FaBoxes className="bg-red-100 p-2 rounded-md mb-2" size={70} />
              หมวดหมู่ เครื่องใช้สำนักงาน
            </div>
            <div className="w-full lg:w-3/4">
              <div className="overflow-x-auto border rounded-lg">
                <table className="table-auto w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-300">
                      <th className="px-4 py-1 text-start font-medium">ชื่อ</th>
                      <th className="px-4 py-1 text-center font-medium">
                        จำนวน
                      </th>
                      <th className="px-4 py-1 text-center font-medium">
                        หน่วยนับ
                      </th>
                      <th className="px-4 py-1 text-center font-medium">ลบ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productCat3?.results &&
                      productCat3.results.length > 0 &&
                      productCat3.results.map((item, idx) => (
                        <tr key={idx}>
                          <td className="border px-2 py-1">{item.name}</td>
                          <td className="border px-2 py-1">{item.quantity}</td>
                          <td className="border px-2 py-1">
                            {item.category_name}
                          </td>
                          <td className="px-4 py-3 font-light text-gray-600">
                            <div className="flex justify-center">
                              <FaRegTrashAlt
                                onClick={() => handleDeleteProduct(3, idx)}
                                size={16}
                                className="text-red-500 cursor-pointer"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <hr className="my-6" />

          {/* หมวดหมู่ เครื่องใช้ไฟฟ้า */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-1/4 flex flex-col justify-start items-center text-sm">
              <FaPlug className="bg-red-100 p-2 rounded-md mb-2" size={70} />
              หมวดหมู่ เครื่องใช้ไฟฟ้า
            </div>
            <div className="w-full lg:w-3/4">
              <div className="overflow-x-auto border rounded-lg">
                <table className="table-auto w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-300">
                      <th className="px-4 py-1 text-start font-medium">ชื่อ</th>
                      <th className="px-4 py-1 text-center font-medium">
                        จำนวน
                      </th>
                      <th className="px-4 py-1 text-center font-medium">
                        หน่วยนับ
                      </th>
                      <th className="px-4 py-1 text-center font-medium">ลบ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productCat4?.results &&
                      productCat4.results.length > 0 &&
                      productCat4.results.map((item, idx) => (
                        <tr key={idx}>
                          <td className="border px-2 py-1 w-5/12">{item.name}</td>
                          <td className="border px-2 py-1 text-center w-2/12">{item.quantity}</td>
                          <td className="border px-2 py-1 text-center w-3/12">
                            {item.category_name}
                          </td>
                          <td className="px-4 py-3 font-light text-gray-600 text-center w-2/12">
                            <div className="flex justify-center">
                              <FaRegTrashAlt
                                onClick={() => handleDeleteProduct(4, idx)}
                                size={16}
                                className="text-red-500 cursor-pointer"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <hr className="my-6" />

          {/* หมวดหมู่ อื่นๆ */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-1/4 flex flex-col justify-start items-center text-sm">
              <FaDocker className="bg-red-100 p-2 rounded-md mb-2" size={70} />
              หมวดหมู่ อื่น ๆ
            </div>
            <div className="w-full lg:w-3/4">
              <div className="overflow-x-auto border rounded-lg">
                <table className="table-auto w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-300">
                      <th className="px-4 py-1 text-start font-medium">ชื่อ</th>
                      <th className="px-4 py-1 text-start font-medium">
                        จำนวน
                      </th>
                      <th className="px-4 py-1 text-center font-medium">
                        หน่วยนับ
                      </th>
                      <th className="px-4 py-1 text-center font-medium">ลบ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productCat5?.results &&
                      productCat5.results.length > 0 &&
                      productCat5.results.map((item, idx) => (
                        <tr key={idx}>
                          <td className="border px-2 py-1  w-5/12">{item.name}</td>
                          <td className="border px-2 py-1 text-center w-2/12">{item.quantity}</td>
                          <td className="border px-2 py-1 text-center w-3/12">
                            {item.category_name}
                          </td>
                          <td className="px-4 py-3 font-light text-gray-600 w-2/12" >
                            <div className="flex justify-center">
                              <FaRegTrashAlt
                                onClick={() => handleDeleteProduct(5, idx)}
                                size={16}
                                className="text-red-500 cursor-pointer"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* RIGHT SECTION */}
      <div className="w-full lg:w-2/6 flex flex-col gap-4">
        <div className="bg-white shadow-md rounded-md px-4 py-4">
          <div className="overflow-x-auto border rounded-lg">
            <table className="table-auto w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-300">
                  <th className="border-b px-1 py-2 text-start font-medium">
                    ลำดับ
                  </th>
                  <th className="border-b px-6 py-2 text-start font-medium">
                    ผู้บริจาค
                  </th>
                  <th className="border-b px-2 py-2 text-start font-medium">
                    จำนวนเงิน
                  </th>
                  {/* <th className="border-b px-2 py-2 text-start font-medium">แก้ไข</th> */}
                </tr>
              </thead>

              <tbody>
                {sendData?.customers?.length > 0 &&
                  sendData?.customers?.map((item, idx) => (
                    <tr className="" key={item.customer_id}>
                      <td className="border-b px-4 py-3 font-light  text-gray-600  ">
                        {idx + 1}
                      </td>
                      <td className="border-b px-4 py-3 font-medium">
                        {item.customer_name}
                      </td>
                      <td className="border-b px-4 py-3 font-light  text-gray-600 ">
                        {item.price}
                      </td>
                      <td className="border-b px-4 py-3 font-light  text-gray-600  ">
                        <FaRegEdit
                          onClick={() => {
                            setOpenModalChangePrice(!openModalChangePrice);
                            setSelectedCusId({
                              cusId: Number(item.customer_id || 0),
                              price: Number(item.price || 0),
                            });
                          }}
                          size={18}
                          className="text-blue-700 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <p className="text-red-500 text-sm mt-1 text-center">
            ต้องกดบันทึกก่อน จำนวนเงิน ถึงจะเลียงลำดับ
          </p>
          {/* เรียกโชว์ใน Component ทำไมไม่ แสดงข้อมูล Real Time  */}
          {/* <Display  /> */}

        </div>

        <div className="bg-white shadow-md rounded-md py-6 px-4 flex flex-col justify-center">
          <div className="flex flex-row gap-2 justify-center items-center px-20">
            <div className="w-16 flex justify-center" onClick={() => handleChangeNumber(1)}>
              <RiNumber1
                size={45}
                className={`${countNumber === 1 ? "bg-red-700" : "bg-gray-300"} hover:bg-gray-800 hover:text-white rounded-full p-2 text-white cursor-pointer`}
              />
            </div>
            <div className="w-16 flex justify-center" onClick={() => handleChangeNumber(2)}>
              <RiNumber2
                size={45}
                className={`${countNumber === 2 ? "bg-red-700" : "bg-gray-300"} hover:bg-gray-800 hover:text-white rounded-full p-2 text-white cursor-pointer`}
              />
            </div>
            <div className="w-16 flex justify-center" onClick={() => handleChangeNumber(3)}>
              <RiNumber3
                size={45}
                className={`${countNumber === 3 ? "bg-red-700" : "bg-gray-300"} hover:bg-gray-800 hover:text-white rounded-full p-2 text-white cursor-pointer`}
              />
            </div>
          </div>

          <div className="flex flex-row gap-4 mt-6">
            <button
              disabled={!isDisabled || sendData.status == 1}
              onClick={handleSave}
              className={` bg-gradient-to-r ${isDisabled && sendData.status === 0
                ? "from-green-600 to-green-500"
                : "from-green-400 to-green-300"
                } rounded-md py-2 text-white w-full flex flex-row gap-2 items-center justify-center`}
            >
              <FaRegSave size={18} />
              บันทึก / อัพเดท
            </button>

            <button
              disabled={!isDisabled}
              onClick={handleWinner}
              className={` bg-gradient-to-r ${isDisabled
                ? "from-red-600 to-red-500"
                : "from-red-400 to-red-300"
                } rounded-md py-2 text-white w-full flex flex-row gap-2 items-center justify-center`}
            >
              <TbWorldCancel size={18} />
              จบการประมูล
            </button>
          </div>

          <div className="mt-4 flex flex-row gap-4">
            <button
              onClick={() => switchDisplay(1)}
              className={`w-full border border-red-700  ${sendData.status === 1 ? " bg-gray-200" : "hover:bg-red-100"} rounded-md py-1 text-sm`}
              disabled={sendData.status == 1}
            >
              หน้าประมูล
            </button>

            <button
              onClick={() => switchDisplay(2)}
              // className="w-full border border-red-700 hover:bg-red-100 rounded-md py-1 text-sm"
              className={`w-full border border-red-700  ${sendData.status !== 1 ? " bg-gray-200" : "hover:bg-red-100"} rounded-md py-1 text-sm`}
              disabled={sendData.status !== 1}
            >
              โชว์คนชนะ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
