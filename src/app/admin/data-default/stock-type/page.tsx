'use client'
import React from 'react'
import UnitType from './UnitType';


const PageStockType = () => {

  return (
    <div className='flex flex-col md:flex-row gap-4'>
      {/* <div className='w-full border border-gray-300 rounded-md px-4 py-4 bg-white h-fit'>
        <CategoryTypeComponent />
      </div> */}
      <div className='w--1/2 border border-gray-300 rounded-md px-4 py-4 bg-white h-fit'>
        <UnitType/>
      </div>
    </div>
  )
}

export default PageStockType