import connectDB from "@/server/config/db";
import userModel from "@/server/models/user";
import { verifyPassword } from "@/server/utils/managePassword";
import { NextRequest, NextResponse } from "next/server";

import jwt from "jsonwebtoken";


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
            const response =  NextResponse.json(user, {status: 200});

            const token = jwt.sign({ ...user }, process.env.JWT_SECRET as string);
            response.cookies.set('connexiaToken', token, { httpOnly: true, sameSite: "strict", maxAge: 1000*60*60*24*10 });


            return response;
        }

    } catch (error) {
        console.log("An error occurred in login route ", error);
        return NextResponse.json({message: "An unexpected error occurred in login route!"}, {status: 500});
    }
}