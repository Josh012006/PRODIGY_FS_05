import postModel from "@/server/models/post";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest, {params}: {params: {id: string}}) {
    try {
        
        const id = params.id;

        const post = await postModel.findById(id);

        if(!post) {
            return NextResponse.json({message: "No such post!"}, {status: 404});
        }

        return NextResponse.json(post, {status: 200});

    } catch (error) {
        console.log("An error occurred in fetch post by id route ", error);
        return NextResponse.json({ message: "An error occurred in fetch post by id route" }, { status: 500 });
    }
}