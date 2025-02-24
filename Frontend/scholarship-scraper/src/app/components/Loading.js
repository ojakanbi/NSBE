import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-gray-700">
      {/* Animated NSBE Logo */}
      <motion.div
        className="w-20 h-20 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      >
        <img src="/nsbe-logo.png" alt="NSBE Logo" className="w-16 h-16 drop-shadow-lg" />
      </motion.div>

      {/* Animated Dots */}
      <motion.div
        className="flex space-x-2 mt-4"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
      </motion.div>

      {/* Loading Text */}
      <p className="mt-4 text-lg font-semibold text-gray-600 tracking-wide">
        Loading your experience...
      </p>
    </div>
  );
}
