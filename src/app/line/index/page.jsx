"use client";

import React from "react";
import Image from "next/image";

const Lineapp = () => {
  return (
    <div
      className="w-screen min-w-[375px] max-w-[425px] min-h-[100vh] p-0 m-0 flex flex-col bg-cover bg-top bg-no-repeat"
      style={{
        backgroundImage: "url('/img/Background.png')",
      }}
    >
      <div className="w-full mt-32 items-center text-center px-6">
        <h1 className="text-3xl text-white">กองบุญที่เปิดให้ร่วมบุญ</h1>
      </div>
      <div className="fixed bottom-0 mt-10 bg-cover bg-center w-full min-w-[375px] max-w-[425px] h-[80px]">
        <Image src="/img/footerimg.png" fill sizes="425px" alt="some image" />
      </div>
    </div>
  );
};

export default Lineapp;
