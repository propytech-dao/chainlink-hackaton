'use client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const RentalDetails = () => {
  const [rental, setRental] = useState<any>();

  useEffect(() => {
    if (true) {
      // Mocked rental data
      const mockedRentals = {
        '1': {
          id: '1',
          title: 'Beautiful Apartment',
          value: 1200,
          period: 12,
          description: 'A beautiful apartment in the city center.',
          image: 'https://via.placeholder.com/300',
        },
        '2': {
          id: '2',
          title: 'Modern Condo',
          value: 1500,
          period: 6,
          description: 'A modern condo with all amenities.',
          image: 'https://via.placeholder.com/300',
        },
        // Add more mocked rentals as needed
      };

      const rental = mockedRentals['1'];

      setRental(rental);
    }
  }, []);
  if (!rental) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <img
        className="w-full h-64 object-cover rounded"
        src={rental.image}
        alt={rental.title}
      />
      <h1 className="text-3xl font-bold mt-4">{rental.title}</h1>
      <p className="text-xl text-gray-600 mt-2">Value: ${rental.value}/month</p>
      <p className="text-xl text-gray-600">
        Lending Period: {rental.period} months
      </p>
      <p className="mt-4">{rental.description}</p>
    </div>
  );
};

export default RentalDetails;
