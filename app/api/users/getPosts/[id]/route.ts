import connectDB from "@/server/config/db";
import postModel from "@/server/models/post";
import userModel from "@/server/models/user";
import { NextRequest, NextResponse } from "next/server";





export async function GET(req: NextRequest, {params} : {params: {id: string}}) {
    try {
        
        const id = params.id;

        await connectDB();

        const user = await userModel.findById(id);

        if(!user) {
            throw Error("User not found!");
        }

        const posts = user.posts;

        const userPosts = await postModel.find({ _id : { $in : posts }});

        return NextResponse.json(userPosts, {status: 200});

    } catch (error) {
        console.log("An error occurred in get users' posts route ", error);
        return NextResponse.json({message: "An error occurred in get users' posts route!"}, {status: 500});
    }
}