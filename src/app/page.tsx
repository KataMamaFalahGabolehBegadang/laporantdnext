import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Admin Login Button */}
      <div className="absolute top-4 right-4">
        <Link href="/admin/login">
          <button className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
            Admin Login
          </button>
        </Link>
      </div>

      <div className="flex min-h-screen items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Reporting System</h1>
          <p className="text-center mb-8 text-gray-600">Choose the report type to proceed:</p>
          <div className="space-y-4">
            <Link href="/morning" className="block">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
                Morning Report
              </button>
            </Link>
            <Link href="/afternoon" className="block">
              <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
                Afternoon Report
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
