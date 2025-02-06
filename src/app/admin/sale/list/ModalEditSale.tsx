'use client'
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import Page from "../page";
import PageSaleList from "./page";

type ModalByIdType = {
    open: boolean;
    handleOpenModal: (numb: number) => void;
    id: number;
    fetchData: () => Promise<void>;
    handlePay: (id: number) => void;
    handleCancel : (id:number, code:string) => Promise<void>
  };

const ModalEditSale :React.FC<ModalByIdType>=({
    open,
    handleOpenModal,
    id,
    fetchData,
    handlePay,
    handleCancel
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => handleOpenModal(2)}
      className="relative z-10"
    >

      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-7xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="sm:flex sm:items-start bg-gray-100 px-4 py-2">
              <div className=" text-center sm:mt-0 sm:ml-4 sm:text-left ">
                <DialogTitle
                  as="h3"
                  className="text-base font-semibold text-gray-900 "
                >
                  แก้ไขบิล {id}
                </DialogTitle>
              </div>
            </div>

            {/* Start Main */}
           <div className="px-4 py-4">
           <Page id={id} />
           </div>
         

            {/* END Main */}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default ModalEditSale