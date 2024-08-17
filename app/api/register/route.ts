import { NextRequest, NextResponse } from "next/server";

import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import userModel from "@/server/models/user";
import connectDB from "@/server/config/db";
import { hashPassword } from "@/server/utils/managePassword";

import jwt from "jsonwebtoken";


const UPLOAD_DIR = path.resolve("public/users/profile_pictures");


export async function POST (req: NextRequest) {
    try {

        await connectDB();
        
        const formData = await req.formData();

        const body = Object.fromEntries(formData);
        const file = (body.file as Blob) || null;

        console.log(file);

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

            const newUser = new userModel({
                name: body.name,
                username: body.username,
                bio: body.bio,
                profilePicture: uniqueFileName,
                email: body.email,
                password: await hashPassword(body.password as string),
            });

            const user = await newUser.save();

            if(!user) {
                throw Error("An error occured while trying to add user!");
            }

            console.log("Successfully registered in!");
            const response =  NextResponse.json(user, {status: 200});

            const token = jwt.sign({ ...user }, process.env.JWT_SECRET as string);
            response.cookies.set('connexiaToken', token, { httpOnly: true, sameSite: "strict", maxAge: 1000*60*60*24*10 });

            return response;

        } else {
            throw Error("File needed!");
        }


    } catch (error) {
        console.log("An error occurred in registration route ", error);
        return NextResponse.json({message: "An error occurred in registration route!"}, {status: 500});
    }
}