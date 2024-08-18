"use client"

import { useUser } from "@/components/Layout";
import Loader from "@/components/Loader";
import Post from "@/interfaces/post";
import User from "@/interfaces/user";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function SearchPage() {

    const user: User | null = useUser();

    const [search, setSearch] = useState("");

    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

    const [posts, setPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingPosts, setLoadingPosts] = useState(false);

    const [display, setDisplay] = useState("users");

    useEffect(() => {
        async function fetchPosts() {
            try {
                setLoadingPosts(true);
        
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/getAll`);
        
                if (response.status === 200) {
                    setLoadingPosts(false);
                    setPosts(response.data as Post[]);
                    setFilteredPosts(response.data as Post[]);
                    return;
                }
        
                else {
                    throw Error(response.data as string);
                }
        
            } catch (error) {
                setLoadingPosts(false);
                console.log("An error occurred in fetch posts function!");
                return;
            }
        }
    
        fetchPosts();

        async function fetchUsers() {
            try {
                setLoadingUsers(true);
        
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/getAll`);
        
                if (response.status === 200) {
                    setLoadingUsers(false);
                    setUsers(response.data as User[]);
                    setFilteredUsers(response.data as User[]);
                    return;
                }
        
                else {
                    throw Error(response.data as string);
                }
        
            } catch (error) {
                setLoadingUsers(false);
                console.log("An error occurred in fetch users function!");
                return;
            }
        }

        fetchUsers();
    }, []);



    useEffect(() => {
        if(display === "users") {
            setFilteredUsers(users.filter(user => user.username.toLowerCase().includes(search.toLowerCase())));
        }

        else if(display === "posts") {
            setFilteredPosts(posts.filter(post => post.description.toLowerCase().includes(search.toLowerCase()) || post.tags.some(tag => tag.includes(search.toLowerCase()))));
        }
    }, [search, display, posts, users]);

    return (
        <>
            {(loadingUsers || loadingPosts) && <Loader size={40} color="#eab308" />}
            {(!loadingUsers && !loadingPosts) && <div className="w-full">
                <div className="w-full mx-auto flex justify-center my-2">
                    <input type="text" className="text-white bg-zinc-800 p-3 rounded-lg w-10/12" name="search" value={search} onChange={(e) => {setSearch(e.target.value)}} placeholder="Search a post or a user..." />
                </div>
                <div className="grid grid-cols-2 text-center w-10/12 my-2 gap-2 mx-auto">
                    <p className={`p-3 hover:bg-zinc-900 cursor-pointer rounded-t-lg ${(display === "users")? "border-b bg-zinc-900 border-white": ""}`} onClick={() => {setDisplay("users")}}>Users</p>
                    <p className={`p-3 hover:bg-zinc-900 cursor-pointer rounded-t-lg ${(display === "posts")? "border-b bg-zinc-900 border-white": ""}`} onClick={() => {setDisplay("posts")}}>Posts</p>
                </div>
                {search && display === "users" && <div className="grid grid-cols-1 p-4">
                    {filteredUsers.map((user, index) => {
                        return (
                            <Link key={index} href={`/profile/${user._id}`} className="grid grid-cols-4 border-gray-700 border-y w-full items-center justify-center">
                                <div className="flex items-center col-span-2 justify-center">
                                    <div className={`lg:w-24 lg:h-24 w-16 h-16 rounded-full m-3 bg-no-repeat bg-center bg-cover`} style={{backgroundImage: `url("/users/profile_pictures/${user.profilePicture === "" || typeof user.profilePicture !== "string" ? "unknown.jpg" : user.profilePicture}")`}}></div>
                                    <div>
                                        <h2 className="font-bold ">{user.username}</h2>
                                        <h2 className="text-sm">{user.name}</h2>
                                    </div>
                                </div>
                                <div className="col-span-2 px-4 py-1 border-l border-gray-700 h-4/5 justify-center flex flex-col">
                                    <p>{user.bio}</p>
                                    <p>{user.followers.length} followers | {user.following.length} following</p>
                                </div>
                            </Link>
                        )
                    })}
                </div> }
                {search && display === "posts" && <div className="grid grid-cols-3 p-4">
                    {filteredPosts.map((post, index) => {
                        return (
                            <Link key={index} href={`/post/${post._id}`} className="border-gray-700 border">
                                {post.mediaType === "image" && <img className="w-full" alt="media" src={`/posts/medias/${post.media}`} />}
                                {post.mediaType === "video" && <video className="w-full" controls>
                                    <source src={`/posts/medias/${post.media}`} type="video/mp4" />
                                </video>}
                            </Link>
                        )
                    })}
                </div> }
            </div>}
        </>
    )
}