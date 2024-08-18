import connectDB from "@/server/config/db";
import { NextRequest, NextResponse } from "next/server";

import fs from "fs";
import path from "path";
import userModel from "@/server/models/user";


const UPLOAD_DIR = path.resolve("public/users/stories");

export async function POST(req: NextRequest) {
    try {

        const {userId, oldStory} = await req.json();

        await connectDB();

        if(oldStory) {
            const pathToFile = path.resolve(UPLOAD_DIR, oldStory as string);

            fs.unlink(pathToFile, (err) => {
                if (err) {
                    console.error('Error deleting the file:', err);
                    throw Error("An error occurred while deleting user's story");
                }
                console.log('File deleted successfully');
            });
        }

        const user = await userModel.findByIdAndUpdate(userId, {story: ""}, {new: true});

        if(!user) {
            throw Error("No such user!");
        }

        return NextResponse.json({message: "Story successfully deleted!"}, {status: 200});

    } catch (error) {
        console.log("An error occurred in update story delete user's story ", error);
        return NextResponse.json({message: "An error occurred in update story delete user's story!"}, {status: 500});
    }
}