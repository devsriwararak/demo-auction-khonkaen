"use client";
import ModalEditUser from "@/app/components/modals/ModalEditUser";
import { decryptToken } from "@/lib/tool";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { FiToggleRight } from "react-icons/fi";

interface dataType {
  id: number;
  username: string;
  password: string;
  status: number;
  token: string;
}

const Page = () => {
  // systems
  const token = decryptToken();

  //   Stater
  const [data, setData] = useState<dataType[]>([]);
  const [openModalUser, setOpenModalUser] = useState(false)
  const [id, setId] = useState<number | null>(null)

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        setData(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleModal = (id:number)=>{
    setId(id)
    setOpenModalUser(!openModalUser)
    
  }

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
        {openModalUser && (
            <ModalEditUser open={openModalUser} setOpen={setOpenModalUser} id={id} fetchDataMain={fetchData} />
        )}
      <div className="flex flex-row gap-3 items-center">
        <FiToggleRight size={20} />
        <h1 className="text-lg">ข้อมูลผู้บริจาค</h1>
      </div>
      <div className="mt-3 w-full bg-white px-4 py-4 rounded-md shadow-md text-sm">
        <div className="overflow-x-auto border border-gray-300 rounded-lg  shadow-lg ">
          <table className="table-auto  w-full ">
            <thead className="text-sm">
              <tr className="bg-gray-50 border-b border-gray-300 ">
                <th className="px-4 py-2 text-start font-medium ">Username</th>
                <th className="px-4 py-2 text-center font-medium ">
                  สิทธิ์การใช้งาน
                </th>
                <th className="px-4 py-2 text-center font-medium ">
                  สถานะเข้าสู่ระบบ
                </th>
                <th className="px-4 py-2 text-center font-medium ">แก้ไข</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {data?.map((item) => (
                <React.Fragment key={item.id}>
                  <tr className="hover:bg-gray-100 w-5/12  ">
                    <td className="px-4 py-3 font-medium  ">{item.username}</td>
                    <td className="px-4 py-3 font-extralight text-gray-800 text-center  w-2/12  ">
                      <p className="">{item.status}</p>
                    </td>
                    <td className="px-4 py-3 font-extralight text-gray-800  text-center w-2/12 ">
                      {item.token && (
                        <p className="bg-green-200 text-green-700 rounded-md">
                          กำลังใช้งาน
                        </p>
                      )}
                      {!item.token && (
                        <p className="bg-red-200 text-red-700 rounded-md">
                          ออกจากระบบ
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 font-extralight text-gray-800 w-1/12   ">
                      <div className="flex justify-center">
                        <FaRegEdit
                          size={16}
                            onClick={() => handleModal(item.id)}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr key={`${item.id}-divider`}>
                    <td colSpan={5}>
                      <hr />
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Page;
