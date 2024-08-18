import connectDB from "@/server/config/db";
import userModel from "@/server/models/user";
import { NextRequest, NextResponse } from "next/server";




export async function POST(req: NextRequest) {
    try {
        
        const { followingTab } = await req.json();

        await connectDB();

        const following = await userModel.find({ _id: {$in: followingTab}});

        return NextResponse.json(following, {status: 200});


    } catch (error) {
        console.log("An error occurred in get following route ", error);
        return NextResponse.json({message: "An error occurred in get following route"}, {status: 500});
    }
}