import React from 'react';
import { Button, Field, Label } from '@headlessui/react';
import { Input } from '@headlessui/react';
import Image from 'next/image';

export function LoginView() {
  return (
    <main className="w-full sm:w-auto  h-full sm:h-auto bg-[#f7f3f7] font-poppins rounded-[17px] p-4">
      <div className="flex flex-col items-center mb-4 mt-4">
        <div className="flex items-center justify-center rounded-full">
          <Image src="/logo.svg" width={40} height={40} alt="logo"></Image>
        </div>
        <span className="text-center font-poppins text-sm text-black mt-2">
          Connect to propytech
        </span>
      </div>

      <div className="flex justify-center items-center mb-4">
        <div className="w-8 h-10 bg-cover bg-no-repeat"></div>
      </div>

      <div className="flex flex-col gap-1 mb-4">
        <Input
          aria-label="test"
          placeholder="username"
          className="p-2 bg-[#f8f9fb] rounded-lg border border-[#d0d5dd]"
        />

        <Input
          aria-label="test"
          placeholder="password"
          className="p-2 mt-2 bg-[#f8f9fb] rounded-lg border border-[#d0d5dd]"
        />
      </div>

      <button className="flex justify-center items-center w-full h-10 bg-[#7e5afa] rounded-lg text-white font-poppins text-sm font-medium">
        Continue
      </button>

      {/* <div className="flex items-center justify-between w-full my-4">
        <div className="flex-grow h-px bg-gray-300"></div>
        <span className="mx-2 text-sm font-normal text-gray-500">ou</span>
        <div className="flex-grow h-px bg-gray-300"></div>
      </div> */}

      {/* <div className="flex flex-col gap-3">
        <Button className="flex items-center p-2 bg-white rounded-lg border border-gray-300 shadow-sm">
          <div className="w-5 h-5 bg-cover bg-no-repeat mr-2"></div>
          <span className="text-sm font-normal">Login with Email</span>
        </Button>
        <Button className="flex items-center p-2 bg-white rounded-lg border border-gray-300 shadow-sm">
          <div className="w-5 h-5 bg-cover bg-no-repeat mr-2"></div>
          <span className="text-sm font-normal">Login with Wallet</span>
        </Button>
      </div> */}
    </main>
  );
}
