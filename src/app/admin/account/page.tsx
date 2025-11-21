"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // สมมติว่าใช้ react-toastify
import { decryptToken } from "@/lib/tool"; // ฟังก์ชันถอดรหัส Token ของคุณ
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface CustomJwtPayload {
    id: string;
    status: string;
}

const AdminAccount = () => {

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);

    const token = decryptToken()
    const router = useRouter()


    const fetchUserData = async () => {

        const decodedToken = jwtDecode<CustomJwtPayload>(String(token));
        const userId = decodedToken.id || 0;

        try {
            // ยิง API ไปดึงข้อมูล Profile (ต้องมี API route นี้)
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/users/admin/${userId}`);
            console.log(res.data);

            if (res.status === 200) {
                setFormData((prev) => ({
                    ...prev,
                    username: res.data.username, // เอา username เดิมมาใส่
                }));
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    useEffect(() => {
        fetchUserData()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const decodedToken = jwtDecode<CustomJwtPayload>(String(token));
        const userId = decodedToken.id || 0;

        if (!userId) return;

        // เช็คว่ารหัสผ่านตรงกันไหม (ถ้ามีการกรอกรหัสผ่าน)
        if (formData.password && formData.password !== formData.confirmPassword) {
            toast.error("รหัสผ่านไม่ตรงกัน");
            return;
        }

        try {
            setLoading(true);

            // ส่งข้อมูลไป Backend
            const payload = {
                user_id: userId,
                username: formData.username,
                password: formData.password, // ส่งไปเป็น plain text ให้ backend เข้ารหัส
            };

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/users/admin`,
                payload
            );

            if (res.status === 200) {
                toast.success("บันทึกข้อมูลสำเร็จ");
                // เคลียร์ช่องรหัสผ่านหลังจากบันทึก
                setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
                logout()
            }
        } catch (error) {
            toast.error("เกิดข้อผิดพลาดในการบันทึก");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            const decodedToken = jwtDecode<CustomJwtPayload>(String(token));
            const userId = decodedToken.id || 0;

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
                { user_id :userId }
            );

            if (res.status === 200) {
                Cookies.remove("auth_token");
                Cookies.remove("status");
                router.refresh();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 mt-10">
            <h2 className="text-xl font-bold text-gray-900">ตั้งค่าบัญชีผู้ดูแล</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        รหัสผ่านใหม่ <span className="text-gray-400 text-xs">(เว้นว่างไว้ถ้าไม่เปลี่ยน)</span>
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="กรอกรหัสผ่านใหม่"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                {/* Confirm Password */}
                {formData.password && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">ยืนยันรหัสผ่าน</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="กรอกรหัสผ่านอีกครั้ง"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                >
                    {loading ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                </button>
            </form>
        </div>
    );
};

export default AdminAccount;