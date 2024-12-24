import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col gap-14 items-center justify-center py-4 lg:py-16 ">
      <div className="text-center flex flex-col gap-6">
        <h1 className=" text-4xl lg:text-6xl">โปรแกรมประมูล และ บันทึกใบส่งของ</h1>
        <h2 className="text-3xl">สมาคมปึงเถ่ากงม่าขอนแก่น</h2>
      </div>

      <div className="flex  flex-col lg:flex-row gap-4">
        <Image
          src="/images/admin-home-01.png"
          alt="Login Image"
          width={300}
          height={200}
        />
            <Image
          src="/images/admin-home-02.png"
          alt="Login Image"
          width={300}
          height={200}
        />
      </div>
    </div>
  );
};

export default page;
