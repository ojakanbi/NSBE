import axios from 'axios';
const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : process.env.NEXT_PUBLIC_BACKEND_URL
console.log("ROUTE JS: ", baseURL)

export async function GET(req) {
    try {
        const response = await axios.get(`${baseURL}/api/scholarships`);
        return new Response(JSON.stringify(response.data), { status: 200 });
    } catch (error) {
        console.error('Error in Next.js API route:', error.message);
        return new Response(
            JSON.stringify({ error: 'Failed to fetch data from backend' }),
            { status: 500 }
        );
    }
}
