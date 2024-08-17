import connectDB from "@/server/config/db";
import commentModel from "@/server/models/comment";
import postModel from "@/server/models/post";
import userModel from "@/server/models/user";
import { NextRequest, NextResponse } from "next/server";




export async function POST(req: NextRequest) {
    try {
        const { comment, postId, issuer } = await req.json();

        await connectDB();

        const user = await userModel.findById(issuer);

        const newComment = new commentModel({
            issuer: user._id,
            issuerUsername: user.username,
            content: comment
        });

        const comm = await newComment.save();

        const post = await postModel.findById(postId);

        post.comments.push(comm._id);

        await post.save();

        return NextResponse.json(comm, {status: 200});

    } catch (error) {
        console.log("An error occurred in add comment route ", error);
        return NextResponse.json({message: "An error occurred in add comment route!"}, {status: 500});
    }
}