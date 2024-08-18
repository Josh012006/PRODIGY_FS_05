"use client"

import Loader from "@/components/Loader";
import User from "@/interfaces/user";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";





export default function FollowingPage({user} : {user: User}) {

    const [following, setFollowing] = useState<User[]>([]);

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        async function fetchFollowing() {
            try {
                
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/getFollowing`, JSON.stringify({followingTab: user.following}), {headers: {"Content-Type": "application/json"}, validateStatus: status => status >= 200});

                if(response.status === 200) {
                    setFollowing(response.data as User[]);
                    setLoading(false);
                }
                else {
                    throw Error(response.data as string);
                }

            } catch (error) {
                setLoading(false);
                console.log("An error occurred in fetch following function ", error);
                return;
            }
        }

        fetchFollowing();
        
    }, [user]);

    return(
        <>
            {loading && <Loader size={40} color="#eab308" />}
            {!loading && following.length === 0 && <p className="italic text-center my-20">Not following anyone.</p>}
            {!loading && following.length > 0 && <div className="grid grid-cols-1">
                {following.map((user, index) => {
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
            </div>}
        </>
    )
}