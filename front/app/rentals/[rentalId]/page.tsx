'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const RentalDetails = () => {
  const [rental, setRental] = useState<any>();

  useEffect(() => {
    // Mocked rental data
    const mockedRentals = {
      '1': {
        id: '1',
        title: 'Beautiful Apartment',
        value: 20,
        period: 5,
        description: 'A beautiful apartment in the city center.',
        image: 'https://via.placeholder.com/300',
      },
      '2': {
        id: '2',
        title: 'Modern Condo',
        value: 50,
        period: 6,
        description: 'A modern condo with all amenities.',
        image: 'https://via.placeholder.com/300',
      },
      // Add more mocked rentals as needed
    };

    const rental = mockedRentals['1'];

    setRental(rental);
  }, []);

  if (!rental) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="relative w-full h-64">
        <Image
          src="/apartment.webp"
          alt="Rental property"
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>
      <div className="p-6">
        <h1 className="text-3xl font-bold mt-4">{rental.title}</h1>
        <p className="text-xl text-gray-600 mt-2">Value: ${rental.value}/day</p>
        <p className="text-xl text-gray-600">
          Lending Period: {rental.period} days
        </p>
        <p className="mt-4 text-gray-700">{rental.description}</p>
        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => {}}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Rent
          </button>
          <button
            onClick={() => {}}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Check In
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentalDetails;
