import connectDB from "@/server/config/db";
import userModel from "@/server/models/user";
import { hashPassword } from "@/server/utils/managePassword";
import { NextRequest, NextResponse } from "next/server";





export async function POST(req: NextRequest) {
    try {
        
        const {userId, newPassword} = await req.json();

        await connectDB();

        const user = await userModel.findByIdAndUpdate(userId, {password: await hashPassword(newPassword)}, {new: true});

        if(!user) {
            throw Error("No such user!");
        }

        return NextResponse.json({message: "Password updated successfully!"}, {status: 200});


    } catch (error) {
        console.log("An error in update password route ", error);
        return NextResponse.json({message: "An error in update password route!"}, {status: 500});
    }
}