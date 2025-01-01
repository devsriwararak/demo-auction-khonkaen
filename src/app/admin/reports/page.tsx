"use client";
import { redirect, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";


const Page = () => {
  const router = useRouter();


  useEffect(() => {
    router.push("/admin/reports/sales");
  }, []);

  return <div></div>;
};

export default Page;
