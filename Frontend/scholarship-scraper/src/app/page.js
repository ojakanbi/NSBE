import Link from 'next/link';
import Footer from './components/Footer';
import Image from 'next/image';
export default function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-100">

        <header className="bg-gradient-to-r from-blue-900 to-green-600 py-4 shadow-md">
          <div className="flex items-center justify-center gap-4">

            <Image
              src="/nsbe-logo.png"
              alt="NSBE Logo"
              width={60}
              height={60}
              className="drop-shadow-md"
            />

            {/* Title */}
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                Penn State University <br className="hidden md:block" />
                <span className="text-yellow-300">National Society of Black Engineers</span>
              </h1>
              <p className="text-gray-200 text-sm md:text-base mt-1">
                Excellence, Innovation, and Impact in Engineering.
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main
          className="flex flex-col flex-grow items-center justify-center px-6 min-h-screen bg-cover bg-center relative"
          style={{
            backgroundImage: "url('/chicago-night.jpg')",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

          {/* Content Wrapper */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full z-10">
            {/* National Login Card */}
            <Link href="/national-login">
              <div className="bg-white/7 backdrop-blur-sm shadow-lg rounded-xl p-6 hover:shadow-xl cursor-pointer text-center border border-gray-300/20 transition duration-300 transform hover:scale-105">
                <h2 className="text-2xl font-semibold text-white">NSBE Nationals Hub</h2>
                <p className="text-gray-300 mt-2">Everything you need for an unforgettable NSBE Nationals.</p>
              </div>
            </Link>



            {/* Scholarships Card */}
            {/* <Link href="/scholarships">
          <div className="bg-white/10 backdrop-blur-md shadow-lg rounded-xl p-6 hover:shadow-xl cursor-pointer text-center border border-gray-300/20 transition duration-300 transform hover:scale-105">
            <h2 className="text-2xl font-semibold text-white">View Scholarships</h2>
            <p className="text-gray-300 mt-2">Browse available scholarships and their details.</p>
          </div>
        </Link> */}

            {/* Leaderboard Card */}
            {/* <Link href="/leaderboard">
          <div className="bg-white/10 backdrop-blur-md shadow-lg rounded-xl p-6 hover:shadow-xl cursor-pointer text-center border border-gray-300/20 transition duration-300 transform hover:scale-105">
            <h2 className="text-2xl font-semibold text-white">View Leaderboard</h2>
            <p className="text-gray-300 mt-2">See who’s top on the list for NATIONALS!</p>
          </div>
        </Link> */}
          </div>
        </main>

        {/* Fixed Footer */}
        <Footer />
      </div>
    </>

  );
}