import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';


export default function AdminLayout({
  children, // เนื้อหาของหน้าภายใต้ /admin
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='h-screen flex flex-col'>
        <Header/>
      <div className="flex flex-1 overflow-hidden " >
        <Navbar/>
        <main className="flex-1 py-10 px-10 overflow-auto bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}
