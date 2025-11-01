'use client'
import { CategoryType } from '@/app/type';
import { alertConfirmError, decryptToken, errorMessage } from '@/lib/tool';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FiEdit, FiTrash } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const CategoryTypeComponent = () => {

    const token = decryptToken();

  // States
  const [data, setData] = useState<CategoryType[]>([])
  const [id, setId] = useState<string | number | null>(null)
  const [name, setName] = useState("")

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
        setData(res.data)

      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    try {
      const sendData = {
        id: id ? id : null,
        name
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/category/add`,
        sendData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        toast.success(res.data.message);
        fetchDataCategory();
        setId(null)
        setName("")
      }
    } catch (err: unknown) {
      console.log(err);
      errorMessage(err);
    }
  };

  const handleEdit = (id: string | number, name: string) => {
    if (!id && !name) {
      toast.warning('ข้อมูลไม่ครบ')
      return
    }
    setId(id)
    setName(name)

  }

  const handleDelete = async (id: number | string) => {
    try {
      const confirm = await alertConfirmError();
      if (confirm) {
        const res = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/product/category/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 200) {
          Swal.fire(`ลบเสร็จ !`, "", "success");
          await fetchDataCategory();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    fetchDataCategory()
  }, [])

  return (
    <div>
                <h3>ข้อมูลประภทสินค้า</h3>
        <div className='my-4 bg-gray-200 px-4 py-4 rounded-md flex items-end'>
          <div className="w-full  ">
            <p className="text-sm">ชื่อประภทสินค้า</p>
            <input
              type="text"
              className="mt-1.5  border border-gray-400  rounded-md px-4 py-1 w-full "
              placeholder="ชื่อประภทสินค้า"
              onChange={(e) => setName(e.target.value)}
              value={name || ""}
              name="name"
            />
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex w-full h-10 justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-regreend-500 sm:ml-3 sm:w-auto"
          >
            บันทึก
          </button>
        </div>

        <ul>
          {data.map((item) => {
            return (
              <li key={item.id} className={`hover:bg-gray-200 py-2 px-3 ${item.id === id ? "bg-gray-300" : ""}`}>
                <div className='flex justify-between'>
                  <p>{item.name}</p>
                  <div className='flex gap-2'>
                    <FiEdit className=' cursor-pointer' onClick={()=>handleEdit(item.id, item.name)} />
                    <FiTrash  className=' cursor-pointer' onClick={()=>handleDelete(item.id)}/>
                  </div>
                </div>
              </li>
            )
          })}

        </ul>
    </div>
  )
}

export default CategoryTypeComponent