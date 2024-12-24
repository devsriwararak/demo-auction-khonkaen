import React from 'react'
import { FcLeft , FcRight  } from "react-icons/fc";


const Pagination = () => {
  return (
    <div className='mt-4 flex flex-row justify-end items-center'>
        <div className='w-10 flex justify-end cursor-pointer  '><FcLeft size={30} className='bg-white hover:bg-gray-100 shadow-lg rounded-lg border-2 border-gray-200 p-1'/></div>
        <div className='w-20 flex justify-center  text-sm cursor-pointer '>หน้า 1/3</div>
        <div className='w-10  flex justify-start cursor-pointer '><FcRight size={30} className='bg-white hover:bg-gray-100 shadow-lg rounded-lg border-2 border-gray-200 p-1'  /></div>
    </div>
  )
}

export default Pagination