
// middleware ได้
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {

// return NextResponse.next();
// }

// export const config = {
//   matcher: ['/:path*'], 
// };


// middleware ไม่ได้

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decryptData } from './lib/tool';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const cookieAuth  = request.cookies.get('auth_token')?.value;
  const cookieStatus  = request.cookies.get('status')?.value;
  const path = request.nextUrl.pathname;
  let token = ""
  let status = ""
  
  // ถอดรหัส
  if (cookieAuth){
    token = decryptData(cookieAuth) 
  }
  if(cookieStatus) {
    status = decryptData(cookieStatus)
  }


  if (path.startsWith('/_next') || path.startsWith('/static') || path.startsWith('/images') || path === '/favicon.ico') {
    return NextResponse.next();
  }



  // ตรวจสอบว่าเข้าสู่ระบบหรือยัง
  if (!token && !status && path !== '/login' && path !== '/display' && path !== '/demo') {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // ตรวจสอบสถานะการเข้าสู่ระบบ
  if (status === '3' && !path.startsWith('/admin')) {
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  } 

  else if (status === '0' && !path.startsWith('/member')) {
    url.pathname = '/member'
    return NextResponse.redirect(url)
  }







  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'], 
};


