import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
});

const API_KEY = process.env.TRANSIT_API_KEY;
const STOP_ID = "CTA:91697"; // Michigan & 11th Street (Hardcoded)
const CACHE_EXPIRATION = parseInt(process.env.CACHE_EXPIRATION, 10) || 300; // Default 5 min

export async function GET() {
    try {
        console.log("🚍 Fetching bus departures...");

        // 🛑 Check Redis Cache First
        const cachedData = await redis.get("bus_times");
        if (cachedData) {
            try {
                const parsedData = JSON.parse(cachedData); // Ensure proper parsing
                console.log("🛑 Cached Bus Departures Found:", parsedData);
                return new Response(JSON.stringify({ cached: true, data: parsedData }), {
                    headers: { "Content-Type": "application/json" },
                });
            } catch (error) {
                console.error("❌ Redis Cache Error: Invalid JSON format", error);
                await redis.del("bus_times"); // Clear corrupted cache
            }
        }


        // 🔹 Fetch Bus Departures from API
        const departuresResponse = await fetch(
            `https://external.transitapp.com/v3/public/stop_departures?global_stop_id=${STOP_ID}`,
            { headers: { apiKey: API_KEY } }
        );

        if (!departuresResponse.ok) {
            throw new Error(`❌ Failed to get departures: ${departuresResponse.statusText}`);
        }

        const departuresData = await departuresResponse.json();

        // ✅ Extract & Filter for Routes #4, #3, and #X4
        const allowedRoutes = ["4", "3", "X4"]; // Only show these routes
        const formattedDepartures = departuresData?.route_departures
            ?.filter(route => allowedRoutes.includes(route.route_short_name)) // Filter for valid routes
            ?.map(route => {
                const itinerary = Array.isArray(route.itineraries) && route.itineraries.length > 0 ? route.itineraries[0] : {};
                const schedule = Array.isArray(itinerary.schedule_items) && itinerary.schedule_items.length > 0
                    ? itinerary.schedule_items[0]
                    : {};

                return {
                    route_name: route.route_long_name || "Unknown Route",
                    route_short_name: route.route_short_name || "N/A",
                    headsign: itinerary.headsign || "Unknown Destination",
                    departure_time: schedule.departure_time || "No Departure Time",
                    stop_name: "Michigan & 11th Street", // Hardcoded stop name
                    google_maps_url: `https://www.google.com/maps/search/?api=1&query=41.86915324015468,-87.62397287426343`, // Stop location
                    landmark: "📍 Near McCormick Place",
                };
            }) || [];

        if (!Array.isArray(formattedDepartures) || formattedDepartures.length === 0) {
            throw new Error("❌ No valid bus departures found for Routes #4, #3, or #X4.");
        }

        console.log("🆕 Bus Departures:", formattedDepartures);

        // 💾 Store in Redis
        await redis.setex("bus_times", CACHE_EXPIRATION, JSON.stringify(formattedDepartures));

        console.log("✅ Redis Updated Successfully");

        return new Response(JSON.stringify({ cached: false, data: formattedDepartures }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("❌ Transit API Error:", error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
}
