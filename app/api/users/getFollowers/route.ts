import connectDB from "@/server/config/db";
import userModel from "@/server/models/user";
import { NextRequest, NextResponse } from "next/server";




export async function POST(req: NextRequest) {
    try {
        
        const { followersTab } = await req.json();

        await connectDB();

        const followers = await userModel.find({ _id: {$in: followersTab}});

        return NextResponse.json(followers, {status: 200});


    } catch (error) {
        console.log("An error occurred in get followers route ", error);
        return NextResponse.json({message: "An error occurred in get followers route"}, {status: 500});
    }
}