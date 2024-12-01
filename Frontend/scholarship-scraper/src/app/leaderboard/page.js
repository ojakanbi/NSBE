import BackToHome from '../components/BackToHomeButton';

export default function Leaderboard() {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        <BackToHome />
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Leaderboard</h1>
        <p className="text-gray-600">Points Leaderboard feature coming soon!</p>
      </div>
    );
  }