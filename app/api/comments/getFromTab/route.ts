import connectDB from "@/server/config/db";
import commentModel from "@/server/models/comment";
import { NextRequest, NextResponse } from "next/server";




export async function POST(req: NextRequest) {
    try {
        const { commentsTab } = await req.json();

        await connectDB();

        const comments = await commentModel.find({_id: { $in: [...commentsTab] }});

        return NextResponse.json(comments, {status: 200});

    } catch (error) {
        console.log("An error occurred in get comments from tab route ", error);
        return NextResponse.json({message: "An error occurred in get comments from tab route!"}, {status: 500});
    }
}