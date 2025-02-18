import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const userJsonPath = path.join(process.cwd(), 'public', 'user.json'); 

// Handle GET request (Fetch user data)
export async function GET() {
    try {
        if (fs.existsSync(userJsonPath)) {
            const userJson = fs.readFileSync(userJsonPath, 'utf8');
            const userData = JSON.parse(userJson);
            return NextResponse.json({ success: true, data: userData });
        } else {
            return NextResponse.json({ success: false, message: "File not found" }, { status: 404 });
        }
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

// Handle POST request (Find user by email)
export async function POST(req) {
    try {
        const body = await req.json(); // Ensure request body is parsed safely
        const email = body.email?.toLowerCase(); // Ensure email is lowercase

        if (!email) {
            return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
        }

        let userData = [];
        if (fs.existsSync(userJsonPath)) {
            userData = JSON.parse(fs.readFileSync(userJsonPath, 'utf8'));
        }

        const user = userData.find(u => u.email.toLowerCase() === email);

        if (user) {
            return NextResponse.json({ success: true, data: user });
        } else {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
