import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const itineraryJsonPath = path.join(process.cwd(), 'public', 'itinerary.json');

// Handle GET request (Fetch itinerary data)
export async function GET() {
    try {
        if (fs.existsSync(itineraryJsonPath)) {
            const itineraryJson = fs.readFileSync(itineraryJsonPath, 'utf8');
            const itineraryData = JSON.parse(itineraryJson);
            return NextResponse.json({ success: true, data: itineraryData });
        } else {
            return NextResponse.json({ success: false, message: "Itinerary file not found", data: { schedule: {} } }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message, data: { schedule: {} } }, { status: 500 });
    }
}
