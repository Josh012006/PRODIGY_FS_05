import connectDB from "@/server/config/db";
import userModel from "@/server/models/user";
import { NextRequest, NextResponse } from "next/server";




export async function PATCH(req: NextRequest) {
    try {
        
        const { userId, toFollowId } = await req.json();
        const num = req.nextUrl.searchParams.get("num");

        await connectDB();

        const user = await userModel.findById(toFollowId);
        const user2 = await userModel.findById(userId);

        if(num === "1") {
            user.followers.push(userId);
            user2.following.push(toFollowId);
        }
        else {
            user.followers = user.followers.filter((follower: string) => follower !== userId);
            user2.following = user2.following.filter((following: string) => following !== toFollowId);
        }

        await user.save();
        await user2.save();


        return NextResponse.json({message: "Follow route successfully executed!"}, {status: 200});

    } catch (error) {
        console.log("An error occurred in the follow route ", error);
        return NextResponse.json({message: "An error occurred in the follow route!"}, {status: 500});
    }
}