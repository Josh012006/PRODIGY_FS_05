import connectDB from "@/server/config/db";
import commentModel from "@/server/models/comment";
import { NextRequest, NextResponse } from "next/server";




export async function PATCH(req: NextRequest) {
    try {
        
        const { userId, commentId } = await req.json();
        const num = req.nextUrl.searchParams.get("num");

        await connectDB();

        const comment = await commentModel.findById(commentId);

        if(num === "1") {
            comment.likes.push(userId); 
            comment.dislikes = comment.dislikes.filter((dislike: string) => dislike !== userId);
        }

        else {
            comment.likes = comment.likes.filter((like: string) => like !== userId);
        }

        await comment.save();


        return NextResponse.json({message: "Like route successfully executed!"}, {status: 200});

    } catch (error) {
        console.log("An error occurred in the like route for comments ", error);
        return NextResponse.json({message: "An error occurred in the like route for comments!"}, {status: 500});
    }
}