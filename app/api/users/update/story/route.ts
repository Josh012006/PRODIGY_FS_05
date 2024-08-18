import { NextRequest, NextResponse } from "next/server";


import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import userModel from "@/server/models/user";
import connectDB from "@/server/config/db";



const UPLOAD_DIR = path.resolve("public/users/stories");

export async function POST(req: NextRequest) {
    try {

        await connectDB();
        
        const formData = await req.formData();

        const body = Object.fromEntries(formData);

        const file = (body.file as Blob) || null;

        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            if (!fs.existsSync(UPLOAD_DIR)) {
                fs.mkdirSync(UPLOAD_DIR);
            }
        
            const uniqueFileName = `${uuidv4()}-${(body.file as File).name}`;
            fs.writeFileSync(
                path.resolve(UPLOAD_DIR, uniqueFileName),
                buffer
            );

            console.log(uniqueFileName);

            // update the profile picture name

            const user = await userModel.findByIdAndUpdate(body.userId, { story: uniqueFileName }, { new: true });

            if(user) {
                console.log(user);

                if(body.oldStory) {
                    const pathToFile = path.resolve(UPLOAD_DIR, body.oldStory as string);

                    fs.unlink(pathToFile, (err) => {
                        if (err) {
                            console.error('Error deleting the file:', err);
                            throw Error("An error occurred while deleting user's story");
                        }
                        console.log('File deleted successfully');
                    });
                }

                return NextResponse.json({
                    message: "Story successfully updated"
                }, {status: 200});
            }
            else {
                throw Error("An error occurred while trying to update the story name");
            }

        } else {
            throw Error("File needed");
        }


    } catch (error) {
        console.log("An error occurred in update story route ", error);
        return NextResponse.json({message: "An error occurred in update story route!"}, {status: 500});
    }
}