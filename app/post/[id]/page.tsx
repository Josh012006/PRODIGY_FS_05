"use client"

import Post from "@/interfaces/post";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";
import User from "@/interfaces/user";
import PostComponent from "@/components/PostComponent";
import { useUser } from "@/components/Layout";



export default function PostPage() {

    const user: User | null = useUser();

    const id = useParams().id;

    const [post, setPost] = useState<Post | null>(null);

    useEffect(() => {
        async function fetchPost() {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/getById/${id}`);

                if (response.status === 200) {
                    setPost(response.data as Post);
                    return;
                }

                else {
                    throw Error(response.data as string);
                }

            } catch (error) {
                console.log("An error occurred in fetch post function!");
                return;
            }
        }

        fetchPost();
    }, [id]);



    return (
        <>
            {post && user && <PostComponent post={post} userId={user?._id as string} />}
        </>
    )
}