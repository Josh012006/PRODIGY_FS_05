import connectDB from "@/server/config/db";
import userModel from "@/server/models/user";
import { verifyPassword } from "@/server/utils/managePassword";
import { NextRequest, NextResponse } from "next/server";




export async function POST (req: NextRequest) {
    try {
        
        const { email, password } = await req.json();

        await connectDB();

        const user = await userModel.findOne({ email });

        if(!user) {
            return NextResponse.json({message: "This user doesn't exist!"}, {status: 404});
        }

        const verify = await verifyPassword(password, user.password);

        if(!verify) {
            return NextResponse.json({message: "Invalid credentials!"}, {status: 401});
        }
        else {
            console.log(user);
            return NextResponse.json({message: "User successfully logged in!"}, {status: 200});
        }

    } catch (error) {
        console.log("An error occurred in login route ", error);
        return NextResponse.json({message: "An unexpected error occurred in login route!"}, {status: 500});
    }
}