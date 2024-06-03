'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function RentalCard() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl font-poppins shadow-md overflow-hidden md:max-w-2xl">
      <div className="flex flex-col">
        <div className="relative w-full h-48 md:h-auto ">
          <Image
            src="/apartment.webp"
            alt="Rental property"
            layout="responsive"
            width={600}
            height={400}
            className="object-cover"
          />
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            Rental Property
          </div>
          <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
            Beautiful Apartment
          </h1>
          <p className="mt-2 text-gray-500">Value: 12 USDT/day</p>
          <p className="mt-2 text-gray-500">max Lending Period: 30 days</p>
          <button
            onClick={() => {
              startTransition(() => {
                router.push('/rentals/1');
              });
            }}
            className="mt-4 px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
