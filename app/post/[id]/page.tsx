"use client"

import Post from "@/interfaces/post";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";
import User from "@/interfaces/user";
import PostComponent from "@/components/PostComponent";



export default function PostPage() {

    const id = useParams().id;

    const [post, setPost] = useState<Post | null>(null);

    const [user, setUser] = useState<User | null>(null);

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

    useEffect(() => {
        async function fetchInfos() {
            try {
                
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/fetchInfos`);
        
                if(response.status === 200) {
                    setUser(response.data as User);
                    return;
                }
        
                else {
                    throw Error(response.data as string);
                }
        
            } catch (error) {
                console.log("An error occurred in fetch infos function!");
                return;
            }
        }
    
        fetchInfos();
    }, [])



    return (
        <>
            {post && user && <div>
                <header className="border-b border-gray-700 fixed bg-black top-0 left-0 w-full lg:hidden">
                    <div className="flex items-center justify-center my-3 rounded-t-lg">
                        <Image src="/logo.png" alt="Connexia Logo" width={34} height={34} className="m-2" />
                        <h1 className="text-yellow-500 text-2xl">Connexia</h1>
                    </div>
                    <p className="italic text-center my-2">The new Gen Social Media Platform</p>
                </header>
                {/* Sidebar for large screens */}
                <div className="fixed w-1/5 p-3 hidden lg:block border-r border-gray-700 top-0 h-screen left-0">
                    <div className="border-b border-gray-700">
                        <div className="flex items-center justify-center my-3 rounded-t-lg">
                            <Image src="/logo.png" alt="Connexia Logo" width={34} height={34} className="m-2" />
                            <h1 className="text-yellow-500 text-2xl">Connexia</h1>
                        </div>
                        <p className="italic text-center my-2">The new Gen Social Media Platform</p>
                    </div>
                    <nav className="flex flex-col">
                        <Link href="/" className="p-2 hover:bg-zinc-900 my-2 rounded-lg">
                            <i className="fa-solid fa-home text-2xl m-2" aria-hidden="true"></i>
                            Home
                        </Link>
                        <Link href="/post/add" className="p-2 hover:bg-zinc-900 my-2 rounded-lg">
                            <i className="fa-solid fa-square-plus text-2xl m-2" aria-hidden="true"></i>
                            New Post
                        </Link>
                        <Link href="/search" className="p-2 hover:bg-zinc-900 my-2 rounded-lg">
                            <i className="fa-solid fa-magnifying-glass text-2xl m-2" aria-hidden="true"></i>
                            Search
                        </Link>
                        <Link href={`/profile/${user?._id}`} className="p-2 hover:bg-zinc-900 my-2 rounded-lg">
                            <i className="fa-solid fa-user text-2xl m-2" aria-hidden="true"></i>
                            Profile
                        </Link>
                    </nav>
                </div>


                <main className="my-32 lg:py-10 lg:my-0 lg:w-4/5 lg:absolute lg:-right-0">
                    <PostComponent post={post} userId={user?._id as string} />
                </main>

                <footer className="grid grid-cols-4 fixed left-0 -bottom-0 bg-black border-t rounded-lg border-gray-700 w-full lg:hidden min-h-16 items-center text-center">
                    <Link href="/">
                        <i className="fa-solid fa-home text-2xl" aria-hidden="true"></i>
                    </Link>
                    <Link href="/post/add">
                        <i className="fa-solid fa-square-plus text-2xl" aria-hidden="true"></i>
                    </Link>
                    <Link href="/search">
                        <i className="fa-solid fa-magnifying-glass text-2xl" aria-hidden="true"></i>
                    </Link>
                    <Link href={`/profile/${user?._id}`}>
                        <i className="fa-solid fa-user text-2xl" aria-hidden="true"></i>
                    </Link>
                </footer>

            </div>}
        </>
    )
}