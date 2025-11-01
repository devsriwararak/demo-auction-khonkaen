import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import CryptoJS from "crypto-js";


export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const cookieAuth  = request.cookies.get('auth_token')?.value;
  const cookieStatus  = request.cookies.get('status')?.value;
  const path = request.nextUrl.pathname;
  let token = ""
  let status = ""
  
  // ถอดรหัส
  const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "";

   const decryptData = (ciphertext: string) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  }

  if (cookieAuth){
    token = decryptData(cookieAuth) 
  }
  if(cookieStatus) {
    status = decryptData(cookieStatus)
  }


  if (path.startsWith('/_next') || path.startsWith('/static') || path.startsWith('/images') || path === '/favicon.ico') {
    return NextResponse.next();
  }


// ฉันต้องการให้หน้า /admin ไปที่หน้า /display/screen และ 3 วิก็กลับมา
  // ตรวจสอบว่าเข้าสู่ระบบหรือยัง
  if (!token && !status && path !== '/login' && path !== '/display' && path !== '/demo') {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // ตรวจสอบสถานะการเข้าสู่ระบบ
  if (status === '3' && !path.startsWith('/admin') && !path.startsWith(`/display/screen`)) {
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  } 

  else if (status === '2' && !path.startsWith('/admin')) {
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  else if (status === '1' && !path.startsWith('/admin')) {
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  else if (status === '0' && !path.startsWith('/admin')) {
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }



  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'], 
};


