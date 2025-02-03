'use client'
import React, { useState } from "react";
import Header from "./Header";
import Navbar from "./Navbar";


const LayoutPage = ({ children }: { children: React.ReactNode }) => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarVisible(!isNavbarVisible);
  };

  return (
    <div className="h-screen flex flex-col">
        
      <Header toggleNavbar={toggleNavbar} />
    
      <div className="flex flex-1 overflow-hidden ">
        <div
          className={`fixed top-0 left-0 h-full z-10 bg-white shadow-lg sm:relative sm:translate-x-0 sm:flex ${
            isNavbarVisible ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300`}
        >
          <Navbar toggleNavbar={toggleNavbar} />
        </div>

        {/* <Navbar /> */}
        <main className="flex-1 py-6 px-6 lg:px-10 overflow-auto bg-gray-100  ">
          <div className="mx-auto container">
          {children}
          </div>
          
        </main>
      </div>
    </div>
  );
};

export default LayoutPage;
