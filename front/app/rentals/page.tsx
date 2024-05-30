// /app/rentals/index.tsx
import RentalCard from '@/components/RentalCard';
import React from 'react';

export default function Rentals() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="">
        <h1 className="text-left text-md text-[#222]  font-poppins font-medium tracking-tight ">
          rentals available in your area:
        </h1>
        <RentalCard />
      </div>
    </div>
  );
}
