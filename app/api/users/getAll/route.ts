import connectDB from "@/server/config/db";
import userModel from "@/server/models/user";
import { NextRequest, NextResponse } from "next/server";



export async function GET(eq: NextRequest) {
    try {
        
        await connectDB();

        const users = await userModel.find({});

        return NextResponse.json(users, {status: 200});

    } catch (error) {
        console.log("An error occurred in get All users route ", error);
        return NextResponse.json({message: "An error occurred in get all users route!"}, {status: 500});
    }
}