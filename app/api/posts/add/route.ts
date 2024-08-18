import { NextRequest, NextResponse } from "next/server";

import fs from "fs";
import path from "path";
import postModel from "@/server/models/post";

import { v4 as uuidv4 } from "uuid";
import userModel from "@/server/models/user";
import connectDB from "@/server/config/db";


const UPLOAD_DIR = path.resolve("public/posts/medias");

export async function POST(req: NextRequest) {
    try {

        await connectDB();
        
        const formData = await req.formData();

        const body = Object.fromEntries(formData);

        const media = (body.media as Blob) || null;

        if (media) {
            const buffer = Buffer.from(await media.arrayBuffer());
            if (!fs.existsSync(UPLOAD_DIR)) {
                fs.mkdirSync(UPLOAD_DIR);
            }
        
            const uniqueFileName = `${uuidv4()}-${(body.media as File).name}`;
            fs.writeFileSync(
                path.resolve(UPLOAD_DIR, uniqueFileName),
                buffer
            );

            console.log(uniqueFileName);

            const newPost = new postModel({
                userName: body.userName,
                userId: body.userId,
                userProfile: body.userProfile,
                media: uniqueFileName,
                mediaType: body.mediaType,
                description: body.description,
                tags: (JSON.parse(body.tags as string))?? []
            });

            const post = await newPost.save();

            if(!post) {
                throw Error("An error occured while trying to add post!");
            }

            const user = await userModel.findById(body.userId);

            
            if(!user) {
                throw Error("An error occured while trying to add post id to user posts tab!");
            }

            user.posts.push(post._id);

            await user.save();

            return NextResponse.json(post, {status: 201});

        } else {
            throw Error("File needed!");
        }

    } catch (error) {
        console.log("An error occurred in add post route ", error);
        return NextResponse.json({message: "An error occurred in add post route!"}, {status: 500});
    }
}