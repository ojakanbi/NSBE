import Link from 'next/link';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
    <div className="min-h-screen flex flex-col bg-gray-100">
        {/* PSU NSBE Heading */}
        <header className="bg-gray-100 py-6">
          <h1 className="text-4xl font-bold text-blue-600 text-center">PSU NSBE</h1>
        </header>

        {/* Main Content */}
        <main className="flex flex-col flex-grow items-center justify-center px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          <Link href="/national-login">
              <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg cursor-pointer text-center">
                <h2 className="text-2xl font-semibold text-gray-800">National login</h2>
                <p className="text-gray-600 mt-2">Your Nationals guide</p>
              </div>
            </Link>
            {/* Link to Scholarships */}
            <Link href="/scholarships">
              <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg cursor-pointer text-center">
                <h2 className="text-2xl font-semibold text-gray-800">View Scholarships</h2>
                <p className="text-gray-600 mt-2">Browse available scholarships and their details.</p>
              </div>
            </Link>

            {/* Link to Leaderboard */}
            <Link href="/leaderboard">
              <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg cursor-pointer text-center">
                <h2 className="text-2xl font-semibold text-gray-800">View Leaderboard</h2>
                <p className="text-gray-600 mt-2">See who’s top on the list for NATIONALS!</p>
              </div>
            </Link>
          </div>
        </main>

        {/* Fixed Footer */}
        <Footer />
      </div>
    </>
  
  );
}