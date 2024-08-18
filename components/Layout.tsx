"use client"

import User from "@/interfaces/user";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode, useEffect, useState, createContext, useContext } from "react";
import Loader from "./Loader";

const test: User = {
    _id: "66c15c1ab1b409188cfd13f3",
    name: "Max Beth",
    username: "Maximus🚀",
    bio: "A great fan of space and the galaxy.",
    profilePicture: "c871d161-109c-4dab-9a94-5c2aa81d5bd9-wallpaperbetter.com_1920x1080 (3).jpg",
    story: "",
    email: "maxbeth@gmail.com",
    password: "$2a$10$s3ke3D52ypC5wvVt2cbtCOxZBPq1wDGzLPMp3TUcZXuF5VXe8GsbK",
    posts: [],
    followers: [],
    following: [],
    createdAt: new Date("2024-08-18T02:27:38.579Z"),
    updatedAt: new Date("2024-08-18T02:27:38.579Z"),
    __v: 0
}

const UserContext = createContext<User | null>(null);



export default function Layout({children}: {children: ReactNode}) {
    const url = usePathname();


    const [user, setUser] = useState<User | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchInfos() {
            try {
            
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/fetchInfos`);
        
                if(response.status === 200) {
                    setLoading(false);
                    setUser(response.data as User);
                    return;
                }
        
                else {
                    throw Error(response.data as string);
                }
    
            } catch (error) {
                console.log("An error occurred in fetch infos function ", error);
                setLoading(false);  
                return;
            }
        }
    
        fetchInfos();
    }, []);

    useEffect(() => {
        console.log(user);
    }, [user, children]);

    if(url === "/auth/login" || url === "/auth/register") {
        return (
            <>
                {children}
            </>
        )
    }

    else {
        return (
            <>
                <header className="border-b border-gray-700 fixed bg-black top-0 left-0 w-full lg:hidden z-20">
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

                {/* The main component */}
                <main className="my-32 lg:py-10 lg:my-0 lg:w-4/5 lg:absolute lg:-right-0">
                    {loading && <Loader size={40} color="#eab308" />}
                    <UserContext.Provider value={user}>
                        {user && children}
                    </UserContext.Provider>
                </main>



                <footer className="grid z-20 grid-cols-4 fixed left-0 -bottom-0 bg-black border-t rounded-lg border-gray-700 w-full lg:hidden min-h-16 items-center text-center">
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
            </>
        )
    }
}







export function useUser() {
    return useContext(UserContext);
}
