import RentalCard from '@/components/RentalCard';
export default function Rentals() {
  return (
    <div className="flex min-h-screen font-poppins">
      <aside className="w-64 bg-white text-black flex flex-col p-4">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <a href="#" className="block py-2 px-4 rounded hover:bg-gray-700">
                Home
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="block py-2 px-4 rounded hover:bg-gray-700">
                Rentals
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="block py-2 px-4 rounded hover:bg-gray-700">
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-100">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">
            Rentals Available in Your Area
          </h1>
        </header>
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <RentalCard />

          {/* Add more RentalCard components as needed */}
        </section>
      </main>
    </div>
  );
}
