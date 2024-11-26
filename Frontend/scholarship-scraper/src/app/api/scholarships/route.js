import axios from 'axios';

export async function GET(req) {
  try {
    // Replace with your actual Flask backend URL
    const response = await axios.get('http://localhost:8000/api/scholarships');
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error('Error in Next.js API route:', error.message);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch data from Flask backend' }),
      { status: 500 }
    );
  }
}