import connectDB from "@/server/config/db";
import postModel from "@/server/models/post";
import { NextRequest, NextResponse } from "next/server";




export async function PATCH(req: NextRequest) {
    try {
        
        const { userId, postId } = await req.json();
        const num = req.nextUrl.searchParams.get("num");

        await connectDB();

        const post = await postModel.findById(postId);

        if(num === "1") {
            post.likes.push(userId); 
        }

        else {
            post.likes = post.likes.filter((like: string) => like !== userId);
        }

        await post.save();


        return NextResponse.json({message: "Like route successfully executed!"}, {status: 200});

    } catch (error) {
        console.log("An error occurred in the like route for posts ", error);
        return NextResponse.json({message: "An error occurred in the like route for posts!"}, {status: 500});
    }
}