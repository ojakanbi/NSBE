import Link from 'next/link';

export default function BackToHome() {
  return (
    <div className="mb-4">
      <Link href="/" className="text-blue-600 hover:underline font-medium text-sm flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Home
      </Link>
    </div>
  );
}