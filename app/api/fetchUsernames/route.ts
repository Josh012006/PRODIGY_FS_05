import connectDB from "@/server/config/db";
import userModel from "@/server/models/user";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest) {
    try {
        
        await connectDB();

        const users = await userModel.find({}, { username: 1, _id: 0 });

        const usernames = users.map(user => user.username);

        return NextResponse.json(usernames, {status: 200});

    } catch (error) {
        console.log("An error occurred in fetch usernames route ", error);
        return NextResponse.json({message: "An error occurred in fetch usernames route!"}, {status: 500});
    }
}