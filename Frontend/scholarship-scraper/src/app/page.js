// src/app/page.js
export default async function Home() {
  // Fetch data from the Next.js API route
  const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:300' : process.env.NEXT_PUBLIC_FRONTEND_URL;

  const res = await fetch(`${baseURL}/api/scholarships`, {
    cache: 'no-store', // Avoid caching for fresh data on every request
  });

  if (!res.ok) {
    console.error('Failed to fetch scholarships:', res.statusText);
    throw new Error('Failed to fetch scholarships');
  }

  const scholarships = await res.json();

  return (
    <div>
      <h1>Scholarship List</h1>
      <ul>
        {Object.entries(scholarships).map(([name, details], index) => (
          <li key={index}>
            <strong>{name}</strong>: {details[2]} - {details[1]} <br />
            <a href={details[0]} target="_blank" rel="noopener noreferrer">
              View Scholarship
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}