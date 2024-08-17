import { NextRequest, NextResponse } from "next/server";



export async function GET(req:NextRequest) {
    try {
        
        const response = NextResponse.json({message: "User successfully logged out!"}, {status: 200});

        response.cookies.delete("connexiaToken");

        return response;

    } catch (error) {
        console.log("An error occurred in logout route ", error);
        return NextResponse.json({message: "An unexpected error occurred in logout route!"}, {status: 500});
    }
}