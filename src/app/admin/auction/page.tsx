"use client";              // 1) ประกาศให้เป็น Client Component
import React from "react";
import dynamic from "next/dynamic";

// ถ้ามีไฟล์ AdminAuctionPage.tsx แยก ก็ import แบบ dynamic
const AdminAuctionNoSSR = dynamic(() => import("./AdminAuctionPage"), {
  ssr: false, // 2) ปิด SSR
});

export default function Page() {
  return <AdminAuctionNoSSR />;
}