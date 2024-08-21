import { NextRequest, NextResponse } from "next/server";

import jwt from "jsonwebtoken";
import userModel from "@/server/models/user";
import User from "@/interfaces/user";
import connectDB from "@/server/config/db";



export async function GET(req:NextRequest) {
    try {

        await connectDB();
        
        const token = req.cookies.get('connexiaToken')?.value;

        if(!token) {
            return NextResponse.json({message: "You are not authenticated!"}, {status: 401});
        }

        const decoded: any = jwt.verify(token as any, process.env.JWT_SECRET as string);

        const user = await userModel.findById(decoded._doc._id);

        if(!user) {
            return NextResponse.json({message: "This user doesn't exist!"}, {status: 404});
        }
        else {
            return NextResponse.json(user, {status: 200});
        }


    } catch (error) {
        console.log("An error occurred in fetchInfos route ", error);
        return NextResponse.json({message: "An unexpected error occurred in fetchInfos route!"}, {status: 500});
    }
}