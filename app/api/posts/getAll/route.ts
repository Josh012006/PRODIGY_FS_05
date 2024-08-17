import connectDB from "@/server/config/db";
import postModel from "@/server/models/post";
import { NextRequest, NextResponse } from "next/server";




export async function GET(req: NextRequest) {
    try {
        
        await connectDB();

        const posts = await postModel.find().sort({ createdAt: -1 });

        return NextResponse.json(posts, {status: 200});

    } catch (error) {
        console.log("An error occurred in get all posts route ", error);
        return NextResponse.json({message: "An error occurred in get all posts route!"}, {status: 500});
    }
}