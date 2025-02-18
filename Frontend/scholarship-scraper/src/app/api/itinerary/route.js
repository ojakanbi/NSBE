import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'public', 'itinerary.json');
        const jsonData = fs.readFileSync(filePath, 'utf-8');
        const itinerary = JSON.parse(jsonData);
        console.log("Loaded itinerary:", itinerary);

        return NextResponse.json({ success: true, data: itinerary });
    } catch (error) {
        console.error("Error loading itinerary:", error);
        return NextResponse.json({ success: false, message: "Failed to load itinerary." }, { status: 500 });
    }
}
