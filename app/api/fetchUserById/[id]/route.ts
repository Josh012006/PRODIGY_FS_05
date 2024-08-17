import connectDB from "@/server/config/db";
import userModel from "@/server/models/user";
import { NextRequest, NextResponse } from "next/server";





export async function GET(req: NextRequest, {params}: {params: {id: string}}) {
    try {
        
        await connectDB();
        const id = params.id;    

        const user = await userModel.findById(id);

        if(!user) {
            console.log("This user doesn't exist!");
            return NextResponse.json({message: "This user doesn't exist!"}, {status: 404});
        }


        return NextResponse.json(user, {status: 200});


    } catch (error) {
        console.log("An error occurred in fetch user by id route ", error);
        return NextResponse.json({message: "An error occurred in fetch user by id route!"}, {status: 500});
    }
}