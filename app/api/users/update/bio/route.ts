import connectDB from "@/server/config/db";
import userModel from "@/server/models/user";
import { NextRequest, NextResponse } from "next/server";






export async function POST(req: NextRequest) {
    try {

        const {userId, bio} = await req.json();
        
        await connectDB();

        const user = await userModel.findByIdAndUpdate(userId, {bio}, {new: true});

        if(!user) {
            throw Error("No user found!");
        }

        return NextResponse.json({message: "User's bio successfully updated!"}, {status: 200});


    } catch (error) {
        console.log("An error occurred in update bio route ", error);
        return NextResponse.json({message: "An error occurred in update bio route!"}, {status: 500});
    }
}