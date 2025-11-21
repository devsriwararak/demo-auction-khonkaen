"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { decryptToken, errorMessage, formathDateThai } from "@/lib/tool";
import { FiCoffee, FiPlus, FiPrinter, FiSave, FiSlash } from "react-icons/fi";
import { LuClipboardList } from "react-icons/lu";
import { GoAlert } from "react-icons/go";
import { FaRegTrashAlt } from "react-icons/fa";
import { BsCartPlus, BsCashCoin } from "react-icons/bs";
import Select from "react-select";
import { toast } from "react-toastify";
import moment from "moment";
import { useRouter } from "next/navigation";
import ModalAddProduct from "@/app/admin/sale/ModalAddProduct";
import ModalAdd from "@/app/admin/data-default/customer/ModalAdd";

interface PropsType {
  id?: number | null;
  fetchData?: () => Promise<void>;
  handlePay?: (id: number) => Promise<void>;
  handleCancel?: (id: number, code: string) => Promise<void>;
  handleSetModal?: (id: number, numb: number, header: string) => Promise<void>;
  status : number | null
}

interface optionType {
  id: number;
  value: number;
  label: string;
  name: string;
}

interface CategoryData {
  category_id: number;
  results: {
    name: string;
    category_name: string;
    product_id: number;
    quantity: number;
    price: number;
    total: number;
    unit: string;
  }[];
}

interface SendDataType {
  id: number;
  code: string;
  title: string;
  date: string;
  government: number;
  lottery: number;
  name: string;
  price: number;
  status: number;
  noun: string;
  ref: string;
  tel: string;
  address_customer: string;
  address_send: string;
  contact: string;
  note: string;
  customer_id: number;
  products: CategoryData[];
}

const ModalEditSale: React.FC<PropsType> = ({
  id,
  fetchData,
  handlePay = async () => { },
  handleCancel = async () => { },
  handleSetModal = async () => { },
  status
}) => {
  // States
  const [optionCustomer, setOptionCustomer] = useState<optionType[]>([]);
  const [openModalProduct, setOpenModalProduct] = useState(false);
  const [openEditCustomer, setOpenEditCustomer] = useState(false);

  const [sendData, setSendData] = useState<SendDataType>({
    id: 0,
    code: "",
    title: "",
    date: "",
    government: 0,
    lottery: 0,
    name: "",
    price: 0,
    status: 0,
    noun: "",
    ref: "",
    tel: "",
    address_customer: "",
    address_send: "",
    contact: "",
    note: "",
    customer_id: 0,
    products: [],
  });
  // Systems
  const token = decryptToken();
  const router = useRouter();
  const dateNowEn = moment().format("YYYY-MM-DD");

  const fetchDataCustomer = async () => {
    try {
      const sendData = {
        page: 0,
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/customer/all/`,
        sendData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        const newData: optionType[] = res.data.result.map(
          (item: optionType) => ({
            value: item.id,
            label: item.name,
          })
        );

        setOptionCustomer(newData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataSaleProductList = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sale/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        setSendData((prev) => ({
          ...prev,
          products: res.data.products,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataAll = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sale/all/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        setSendData((prev) => ({
          ...prev,
          id: res.data.id,
          code: res.data.code,
          title: res.data.title,
          date: res.data.date,
          government: res.data.government,
          lottery: res.data.lottery,
          name: res.data.name,
          price: res.data.price,
          status: res.data.status,
          noun: res.data.noun,
          ref: res.data.ref,
          tel: res.data.tel,
          address_customer: res.data.address_customer,
          address_send: res.data.address_send,
          contact: res.data.contact,
          note: res.data.note,
          customer_id: res.data.customer_id,
          auction_title_id: res.data.auction_id,
        }));

        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeSelectCustomer = async (id: optionType | null) => {
    if (!id) return null;
    const newId = id?.value;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/customer/${newId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        console.log(res.data);

        setSendData((prev) => ({
          ...prev,
          customer_id: res.data.id,
          name: res.data.name,
          noun: res.data.noun,
          ref: res.data.ref,
          tel: res.data.tel,
          address_customer: res.data.address_customer,
          address_send: res.data.address_send,
          contact: res.data.contact,
        }));
      }
    } catch (error: unknown) {
      console.log(error);
      errorMessage(error);
    }
  };

  const handleInputChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSendData((prev) => ({
      ...prev!,
      [name]: value,
    }));
  };

  // ต้องการเก็บค่า sendData.sum ที่มาจาก price * quantity ของรายการทั้งหมด
  const handleAddProduct = (
    catId: number,
    productName: string,
    quantity: number,
    price: number,
    total: number,
    category_name: string,
    product_id: number,
    unit: string
  ): boolean => {
    let isDuplicate = false;

    setSendData((prev) => {
      if (!prev) return prev;
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
              {
                name: productName,
                quantity,
                price,
                total,
                category_name,
                product_id,
                unit,
              },
            ],
          };
        }
        return cat;
      });

      // คำนวณหา ราคาทั้งหมด จากรายการทั้งหมด
      const newSum = updated.reduce((total, category) => {
        const categorySum = category.results.reduce((catTotal, item) => {
          return catTotal + item.price * item.quantity;
        }, 0);
        return total + categorySum;
      }, 0);

      return { ...prev, products: updated, price: newSum };
    });

    // สุดท้าย return !isDuplicate
    // (ถ้าไม่ซ้ำ => true, ถ้าซ้ำ => false)
    return !isDuplicate;
  };

  const handleDeleteProduct = (categoryId: number, productIndex: number) => {
    setSendData((prev) => {
      if (!prev) return prev;
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

  const handlePlayInModal = async (id: number) => {
    await handlePay(id);
    // await fetchDataAll();
    setTimeout(async () => {
      await fetchDataAll();
    }, 3000);
  };

  const handleCancelForModal = async (id: number, code: string) => {
    if (!handleCancel) return false;

    await handleCancel(id, code);
    //  await fetchDataAll();
    setTimeout(async () => {
      await fetchDataAll();
    }, 3000);
  };

  const handleSave = async () => {
    try {
      if (!sendData.customer_id) return toast.error("กรุณาเลือกผู้บริจาค !");

      const data = {
        id,
        date: dateNowEn,
        government: sendData.government || 0,
        lottery: sendData.lottery || 0,
        price: sendData.price || 0,
        note: sendData.note,
        customer_id: sendData.customer_id,
        customer_name: sendData.name,
        products: sendData.products,
      };

      const checkProductNull = data.products.some(
        (item) => item.results.length > 0
      );

      if (!checkProductNull) return toast.error("กรุณาเพิ่มสินค้าก่อนบันทึก");

      // API
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sale/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        toast.success(res.data.message);
        if (id) await fetchDataAll();
        if (id && fetchData) {
          await fetchData();
        }
        setTimeout(() => {
          router.push("/admin/sale/list");
        }, 1500);
      }
    } catch (error: unknown) {
      console.log(error);
      errorMessage(error);
    }
  };

  // สำหรับแก้ไขผู้ประมูล
  const handleModalAddCustomer = async () => {
    setOpenEditCustomer(!openEditCustomer);
  };

  const fetchBeforChangeCustomer = async () => {
    const selectOption: optionType | null = {
      id: id || 0,
      value: sendData.customer_id,
      label: sendData.name,
      name: sendData.name,
    };
    await handleChangeSelectCustomer(selectOption);
    await fetchDataCustomer();
  };

  useEffect(() => {
    fetchDataCustomer();
    fetchDataSaleProductList();
    if (id) fetchDataAll();
  }, [id]);



  return (
    <div>
      {openModalProduct && (
        <ModalAddProduct
          open={openModalProduct}
          setOpen={setOpenModalProduct}
          onAddProduct={handleAddProduct}
        />
      )}

      {openEditCustomer && sendData.customer_id ? (
        <ModalAdd
          open={openEditCustomer}
          handleModalAdd={handleModalAddCustomer}
          fetchData={fetchBeforChangeCustomer}
          id={sendData.customer_id}
        />
      ) : (
        openEditCustomer && toast.error("ไม่พบผู้บริจาค")
      )}

      {/* Start Main */}
      <div className="flex flex-col lg:flex-row gap-4  ">
        {/* Left Section */}
        <section className="w-6/12 ">
          <div className="bg-white rounded-md shadow-lg px-6 py-4">
            <div className="flex flex-row gap-2 justify-between ">
              <div className="flex flex-row gap-2 items-center">
                <FiCoffee size={16} />
                <p className=" font-medium text-sm">
                  รายละเอียดบิล (เลือกผู้บริจาค)
                </p>
              </div>
            </div>

            {/* data : {JSON.stringify(sendData)} */}

            <div className="mt-3 flex flex-col lg:flex-row gap-4 items-center">
              {optionCustomer.length > 0 && (
                <Select
                  options={optionCustomer}
                  value={optionCustomer.find(
                    (item) => item.value === sendData?.customer_id
                  )}
                  onChange={handleChangeSelectCustomer}
                  placeholder="เลือกลูกค้าใหม่"
                  className="text-sm w-2/3 "
                />
              )}

              <div className="w-40  ">
                {sendData?.customer_id ? (
                  <button
                    onClick={() => handleModalAddCustomer()}
                    className=" bg-blue-500 text-white rounded-md text-sm px-4 py-1 "
                  >
                    แก้ไขผู้ประมูล
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="mt-5 text-sm">
              <div className="flex flex-row gap-4">
                <div className="w-full">
                  <p>ชื่อ-สกุล</p>
                  <p className=" text-sm font-light">{sendData?.name}</p>
                </div>
              </div>

              <div className="flex flex-row gap-4 mt-3">
                <div className="w-full">
                  <p>ที่อยู่</p>
                  <p className=" text-sm font-light">
                    {sendData?.address_customer || "-"}
                  </p>
                </div>
                <div className="w-full">
                  <p className="">เลขที่ใบเสร็จ</p>
                  <p className=" text-sm font-light">{sendData?.code || "-"}</p>
                </div>
              </div>

              <div className="flex flex-row gap-4 mt-3">
                <div className="w-full">
                  <p className="">เบอร์โทรศัพท์</p>
                  <p className=" text-sm font-light">{sendData?.tel || "-"}</p>
                </div>

                <div className="w-full">
                  <p className="">สถานที่จัดส่ง</p>
                  <p className=" text-sm font-light">
                    {sendData?.address_send || "-"}
                  </p>
                </div>
              </div>

              <div className="flex flex-row gap-4 mt-3">
                <div className="w-full">
                  <p>ผู้ติดต่อ</p>
                  <p className=" text-sm font-light">
                    {sendData?.contact || "-"}
                  </p>
                </div>

                <div className="w-full">
                  <p>ออกสลากในนาม</p>
                  <p className=" text-sm font-light">{sendData.noun || "-"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md shadow-lg px-6 py-4 mt-4 text-sm">
            {/* <div className="flex flex-row gap-2 items-center">
              <FiCoffee size={16} />
              <p className=" font-medium ">อื่น ๆ</p>
            </div> */}

            <div className="w-full">
              <div className="flex flex-row gap-4  justify-end items-end w-full mt-4   ">
                <div className="w-full flex flex-col lg:flex-row gap-2 items-center">
                  <div className="flex flex-col gap-2">
                    <p className="">สลากออมสิน</p>
                    <input
                      type="text"
                      className=" w-full  rounded-md border border-gray-400 px-4 py-0.5"
                      placeholder="0"
                      value={sendData?.government || ""}
                      name="government"
                      onChange={(e) => handleInputChange(e)}
                    />
                  </div>
                </div>
                <div className="w-full flex flex-col lg:flex-row gap-2 items-center">
                  <div className="flex flex-col gap-2">
                    <p className="">ล็อตเตอรี่</p>
                    <input
                      type="text"
                      className="w-full  rounded-md border border-gray-400 px-4 py-0.5"
                      placeholder="0"
                      value={sendData?.lottery || ""}
                      name="lottery"
                      onChange={(e) => handleInputChange(e)}
                    />
                  </div>
                </div>

                <div className="w-full flex flex-col lg:flex-row gap-2 items-center">
                  <div className="flex flex-col gap-2">
                    <p className="">บิลอ้างอิงเลขที่</p>
                    <input
                      type="text"
                      className=" w-full rounded-md border border-gray-400 px-4 py-0.5"
                      placeholder="0"
                      value={sendData?.ref || ""}
                      name="ref"
                      onChange={(e) => handleInputChange(e)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-row gap-2 items-center w-1/3 mt-6 ">
                <GoAlert size={18} />
                <p className=" font-medium">หมายเหตุ</p>
              </div>
              <textarea
                className="w-full  mt-3 bg-gray-100 rounded-md px-4 py-2.5 border border-gray-300"
                placeholder="กรอกหมายเหตุ"
                value={sendData?.note || ""}
                name="note"
                onChange={(e) => handleInputChange(e)}
              ></textarea>
            </div>
          </div>
        </section>

        {/* Right Section */}
        <section className="w-6/12 ">
          <div className="bg-white rounded-md shadow-lg px-6 py-4  ">
            <div className="flex flex-row gap-2 items-center justify-between">
              <div className="flex flex-row gap-2 items-center w-full">
                <BsCartPlus size={18} />
                <p className=" text-sm font-medium">รายการสินค้า</p>
              </div>

              <div className="w-full flex gap-2 justify-end ">
                <button
                  onClick={() => setOpenModalProduct(!openModalProduct)}
                  className=" bg-gradient-to-r from-blue-600 to-blue-500 px-2 py-1.5 rounded-md text-white flex gap-1 items-center text-sm"
                >
                  <FiPlus size={18} /> เพิ่มสินค้า
                </button>
              </div>
            </div>
            <div className="overflow-x-auto border border-gray-300 rounded-lg  shadow-lg h-80  mt-4">
              <table className="table-auto  w-full ">
                <thead className="">
                  <tr className="bg-gray-50  top-0 sticky border-b border-gray-300  text-sm  ">
                    <th className="px-3 py-1 text-start font-medium    ">
                      สินค้า
                    </th>
                    <th className="px-3 py-1 text-start font-medium ">จำนวน</th>
                    <th className="px-3 py-1 text-start font-medium ">
                      หน่วยนับ
                    </th>
                    <th className="px-3 py-1 text-start font-medium ">
                      ราคา/หน่วย
                    </th>
                    <th className="px-3 py-1 text-start font-medium ">รวม</th>
                    <th className="px-3 py-1 text-start font-medium ">ลบ</th>
                  </tr>
                </thead>

                <tbody>
                  {sendData.products?.map((item) => (
                    <React.Fragment key={item.category_id}>
                      <tr className="bg-gray-100">
                        <td
                          colSpan={6}
                          className="px-3 py-1 font-medium text-gray-700 border-b border-gray-300 text-sm"
                        >
                          {item.category_id === 1 && "วัตถุมงคล"}
                          {item.category_id === 2 && "โทรศัพท์"}
                          {item.category_id === 3 && "เครื่องใช้สำนักงาน"}
                          {item.category_id === 4 && "เครื่องใช้ไฟฟ้า"}
                          {item.category_id === 5 && "อื่นๆ"}
                        </td>
                      </tr>
                      {item.results.map((items, idx) => (
                        <tr
                          className="hover:bg-gray-50  text-sm  "
                          key={items.product_id}
                        >
                          <td className="px-3 py-1 font-extralight text-gray-800  ">
                            <p className="">{items.name}</p>
                          </td>
                          <td className="px-3 py-1 font-extralight text-gray-800  ">
                            <p className="">{items.quantity}</p>
                          </td>
                          <td className="px-3 py-1 font-extralight text-gray-800  ">
                            <p className="">{items.unit}</p>
                          </td>
                          <td className="px-3 py-1 font-extralight text-gray-800  ">
                            <p className="">
                              {" "}
                              {Number(items.price || 0).toLocaleString()}{" "}
                            </p>
                          </td>
                          <td className="px-3 py-1 font-extralight text-gray-800  ">
                            <p className="">
                              {" "}
                              {Number(
                                items.price * items.quantity || 0
                              ).toLocaleString()}{" "}
                            </p>
                          </td>
                          <td className="px-3 py-1 font-extralight text-gray-800  ">
                            <FaRegTrashAlt
                              size={16}
                              className="text-red-500"
                              onClick={() =>
                                handleDeleteProduct(item.category_id, idx)
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-row   gap-8 mt-5 text-sm ">
              <div className="w-7/12">
                <div className="flex flex-wrap gap-3 mt-4 justify-start items-end">
                  <button
                    onClick={handleSave}
                    disabled={sendData.status === 3}
                    className={`${sendData.status === 0 ||
                        sendData.status === 1 ||
                        sendData.status === 2
                        ? "bg-gradient-to-r from-green-600 to-green-500"
                        : "bg-gray-400"
                      } px-2 py-1.5 rounded-md text-white flex gap-1 items-center`}
                  >
                    <FiSave size={18} />
                    {!id ? "บันทึก" : "อัพเดท"}
                  </button>

                  {id && (
                    <button
                      disabled={sendData.status === 2 || sendData.status === 3}
                      onClick={() => handlePlayInModal(id)}
                      className={`${sendData.status === 1
                          ? "bg-gradient-to-r from-sky-500 to-sky-400"
                          : "bg-gray-400"
                        } px-2 py-1.5 rounded-md text-white flex gap-1 items-center`}
                    >
                      <BsCashCoin size={18} />
                      ชำระเงิน
                    </button>
                  )}

                  {id && (
                    // <button
                    //   disabled={sendData.status === 2 || sendData.status === 3}
                    //   onClick={() =>
                    //     handleCancelForModal(sendData.id, sendData.code)
                    //   }
                    //   className={`${
                    //     sendData.status === 1
                    //       ? "bg-gradient-to-r from-red-500 to-red-400"
                    //       : "bg-gray-400"
                    //   } px-2 py-1.5 rounded-md text-white flex gap-1 items-center`}
                    // >
                    //   <FiSlash size={18} />
                    //   ยกเลิกบิล
                    // </button>

                    <button
                      disabled={
                        status === 3
                          ? false 
                          : sendData.status === 2 || sendData.status === 3 || status === 0
                      }
                      className={`${ status!== 0 && (sendData.status === 1 || status === 3)
                        ? "bg-gradient-to-r from-red-500 to-red-400"
                        : "bg-gray-400"
                        } px-2 py-1.5 rounded-md text-white flex gap-1 items-center`}
                      onClick={() => handleCancelForModal(sendData.id, sendData.code)}
                    >
                      <FiSlash size={18} />
                      ยกเลิกบิล
                    </button>

                  )}

                  {id && (
                    <button
                      onClick={() => handleSetModal(sendData.id, 3, "ใบรับของ")}
                      className="  px-2 py-1.5 rounded-md text-red-500 flex gap-1 items-center border border-red-500"
                    >
                      <FiPrinter size={18} />
                      ใบรับของ
                    </button>
                  )}

                  {id && (
                    <button
                      disabled={sendData.status === 1 || sendData.status === 3}
                      onClick={() => handleSetModal(sendData.id, 3, "ใบเสร็จ")}
                      className={`${sendData.status === 1 || sendData.status === 3
                          ? "bg-gray-200"
                          : ""
                        } px-2 py-1.5 rounded-md text-red-500 flex gap-1 items-center border border-red-500`}
                    >
                      <FiPrinter size={18} />
                      ใบเสร็จ
                    </button>
                  )}
                </div>
              </div>

              <div className=" w-5/12  ">
                <div className="flex flex-row gap-2 items-center">
                  <LuClipboardList size={18} />
                  <p className=" font-medium">รายละเอียด</p>
                </div>

                <div className="flex flex-row gap-2 mt-4 items-end">
                  <p>วันที่ : </p>
                  <p className="font-light text-sm">
                    {" "}
                    {!id ?  formathDateThai(dateNowEn) :  formathDateThai(sendData?.date)}{" "}
                  </p>
                </div>

                <div className="flex flex-row gap-2 mt-2 items-end">
                  <p>ชำระเงิน : </p>
                  <p className="font-light text-sm">
                    {sendData?.status === 1 && "ยังไม่ชำระเงิน"}
                    {sendData?.status === 2 && "ชำระเงินแล้ว"}
                    {sendData?.status === 3 && "ยกเลิกบิล"}
                    {!sendData?.status && "-"}
                  </p>
                </div>

                <div className="flex flex-row gap-2 mt-2 items-end justify-between">
                  <p>
                    สินค้าทั้งหมด :{" "}
                    {sendData.products.reduce((total, category) => {
                      return total + category.results.length;
                    }, 0)}{" "}
                    <span className="font-light text-sm"> รายการ </span>{" "}
                  </p>
                </div>

                <div className="flex flex-row gap-2 mt-2 items-end justify-between">
                  <p>
                    ราคาทั้งหมด :{" "}
                    <span className="font-light text-sm">
                      {" "}
                      {Number(sendData?.price || 0).toLocaleString()} บาท{" "}
                    </span>{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ModalEditSale;
