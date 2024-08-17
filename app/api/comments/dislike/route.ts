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
            comment.dislikes.push(userId); 
            comment.likes = comment.likes.filter((like: string) => like !== userId);
        }

        else {
            comment.dislikes = comment.dislikes.filter((dislike: string) => dislike !== userId);
        }

        await comment.save();


        return NextResponse.json({message: "DisLike route successfully executed!"}, {status: 200});

    } catch (error) {
        console.log("An error occurred in the dislike route for comments ", error);
        return NextResponse.json({message: "An error occurred in the dislike route for comments!"}, {status: 500});
    }
}