'use client'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

const PageClear = () => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [show, setShow] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/clear`, {
                username,
                password
            })
            console.log(res);
            if (res.status === 200) {
                toast.success('เข้าสู่ระบบ')
                setShow(true)
            }

        } catch (error) {
            console.log(error);
            toast.error('ไม่สามารถเข้าสู่ระบบได้')
            setShow(false)
        }
    }


    const handleClickClear = async () => {

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/clear`, {})
            console.log(res);
            if (res.status === 200) {
                toast.success('ทำรายกรสำเร็จ')
                setUsername("")
                setPassword("")
            }

        } catch (error) {
            console.log(error);
            toast.error('ไม่สามารถเข้าสู่ระบบได้')
            setShow(false)
        } finally {
            setUsername("")
            setPassword("")
        }
    }



    useEffect(() => {

        if (inputRef.current) {
            inputRef.current.focus(); //Property 'focus' does not exist on type 'never'.
        }

    }, []);

    return (
        <>

            <div className='flex justify-center items-center rounded-md mt-4'>

                <form onSubmit={handleSave} >
                    <div className='bg-white border border-gray-200 px-6 py-6'>
                        <div className='flex gap-2'>
                            <input type="text"
                                value={username}
                                placeholder="username"
                                onChange={(e) => setUsername(e.target.value)}
                                className='border border-gray-100 px-4 py-2 rounded-md'
                                ref={inputRef}
                            />

                            <input type="password"
                                placeholder="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='border border-gray-100 px-4 py-2 rounded-md'
                            />

                        </div>
                        <button type='submit' className='w-full mt-4 bg-red-600 text-white active:bg-red-700 rounded-md py-2'>ตรวจสอบ</button>
                    </div>
                </form>



            </div>

            {show && (
                <div className='flex justify-center items-center rounded-md mt-4'>
                    <button onClick={handleClickClear} className='text-xl bg-red-500 px-4 py-2 text-white rounded-md active:bg-red-600'>
                        เคลียข้อมูลทั้งหมด !!!!
                    </button>
                </div>
            )}
        </>
    )
}

export default PageClear