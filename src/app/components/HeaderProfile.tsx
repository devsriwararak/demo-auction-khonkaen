'use client'
import React from 'react'
import Swal from "sweetalert2";
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { SlLock, SlLogout, SlSettings, SlUser, SlWallet } from 'react-icons/sl';
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { decryptData } from '@/lib/tool';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

interface CustomJwtPayload {
  id: string;
  status: string;
}

const HeaderProfile = () => {
    const router = useRouter();


      

      const handleLogout = async () => {
        try {
          Swal.fire({
            title: "ออกจากระบบ ?",
            text: "คุณแน่ใจหรือไม่ที่จะออกจากระบบ !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "red",
            cancelButtonColor: "gray",
            confirmButtonText: "ออกจากระบบ",
            cancelButtonText: "ยกเลิก",
          }).then((result) => {
            if (result.isConfirmed) {
              logout()
              
            }
          });
        } catch (error) {
          console.log(error);
        }
      };

      const logout = async()=>{
        try {
          const cookieAuth = Cookies.get('auth_token')
          if(!cookieAuth) return false
          
          const token = decryptData(cookieAuth) 
          const decodedToken = jwtDecode<CustomJwtPayload>(token);
          const user_id = decodedToken.id || 0

          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
            {user_id}
         
          );

          if(res.status === 200){
            Cookies.remove("auth_token");
            Cookies.remove("status");
            router.refresh();
          }
          
          
        } catch (error) {
          console.log(error);
          
        }
      }

      const solutions = [
        { name: 'จัดการข้อมูลส่วนตัว',  href: '#', icon: SlUser  },
        { name: 'ตั้งค่าความปลอดภัย',  href: '#', icon: SlLock },
        { name: 'ตั้งค่าบัญชี',  href: '#', icon: SlWallet },
        { name: 'ออกจากระบบ',  href: '#', icon: SlLogout , action : handleLogout},
      
      ]
    
  return (
    <Popover className="relative">
      <PopoverButton className="inline-flex items-center gap-x-2 text-sm/6  text-gray-900">
        <span>ตั้งค่าระบบ</span>
        <SlSettings  aria-hidden="true" className="size-5" />
      </PopoverButton>

      <PopoverPanel
        transition
        className="absolute left-1/4 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="flex-auto overflow-hidden rounded-3xl bg-white text-sm/6 shadow-lg ring-1 ring-gray-900/5">
          <div className="p-4">
            {solutions.map((item) => (
              <div key={item.name} className="group relative flex gap-2 items-center rounded-lg  hover:bg-gray-50">
                <div className="mt-1 flex size-11 flex-none items-center justify-center rounded-lg  group-hover:bg-gray-200">
                  <item.icon aria-hidden="true" className="size-5 text-gray-500 group-hover:text-gray-600" />
                </div>
                <div>
                  <a href={item.href} className="font-light text-gray-900" onClick={item.action}>
                    {item.name}
                    <span className="absolute inset-0" />
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </PopoverPanel>
    </Popover>
  )
}

export default HeaderProfile