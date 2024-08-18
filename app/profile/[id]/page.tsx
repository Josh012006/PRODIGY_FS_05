"use client"

import { useUser } from "@/components/Layout";
import Loader from "@/components/Loader";
import Post from "@/interfaces/post";
import User from "@/interfaces/user";
import axios from "axios";
import { set } from "mongoose";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";





function ProfilePage() {

    const user: User | null = useUser();

    const id = useParams().id;

    const [watched, setWatched] = useState<User | null>(null);


    const [posts, setPosts] = useState<Post[]>([]);

    const [watchedLoading, setWatchedLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(true);

    const [displayStory, setDisplayStory] = useState(false);

    const [followersNum, setFollowersNum] = useState<number>(0);
    const [followingNum, setFollowingNum] = useState<number>(0);



    const [following, setFollowing] = useState<boolean>(false);



    useEffect(() => {
        async function fetchWatched() {
            try {
                
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/fetchUserById/${id}`);

                if(response.status === 200) {
                    setWatched(response.data as User);
                    setWatchedLoading(false);
                }

                else {
                    throw Error(response.data as string);
                }

            } catch (error) {
                console.log("An error occurred in fetch Watched function ", error);
                setWatchedLoading(false);
                return;
            }
        }

        fetchWatched();

        async function fetchPosts() {
            try {
                
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/getPosts/${id}`);

                if(response.status === 200) {
                    setPostsLoading(false);
                    setPosts(response.data as Post[]);
                }

                else {
                    throw Error(response.data as string);
                }

            } catch (error) {
                setPostsLoading(false);
                console.log("An error in fetchPost function ", error);
                return;
            }
        }

        fetchPosts();
        
    }, [id]);

    useEffect(() => {
        if(watched) {
            setFollowersNum(watched.followers.length);
            setFollowingNum(watched.following.length);
            setFollowing(watched.followers.includes(user?._id as string));
        }
    }, [watched]);

    

    const handleFollow = async () => {
        try {
            
            const num = (following)? 0 : 1;

            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/posts/follow?num=${num}`, JSON.stringify({userId: user?._id, toFollowId: id}), {headers: {"Content-Type": "application/json"}, validateStatus: status => status >= 200});

            if(response.status === 200) {
                console.log("Update successful");
                setFollowing(!following);

                if(num === 1) {
                    setFollowersNum(followersNum + 1);
                }

                else {
                    setFollowersNum(followersNum - 1);
                }
            }
            else {
                throw Error(response.data as string);
            }

        } catch (error) {
            console.log("An error occurred in handleFollow function for user with id ", id);
        }
    }


    return(
        <>
            {user && !watchedLoading && watched && <div className="w-full">
                {(user._id === id) && <div className="p-3 flex justify-end items-center">
                    <Link href = {`/profile/${watched._id}/settings`}><i className="fa-solid fa-gear m-1 cursor-pointer"></i></Link>
                </div>}
                <div className="border-b border-gray-700">
                    <div className="grid grid-cols-4 items-center">
                        <div onClick={() => {if(watched.story) setDisplayStory(true)}} className={`col-span-1 lg:w-32 lg:h-32 w-20 h-20 rounded-full m-3 bg-no-repeat bg-center bg-cover ${(watched.story) && "cursor-pointer border-white border-2 mx-auto"}`} style={{backgroundImage: `url("/users/profile_pictures/${watched.profilePicture === "" || typeof watched.profilePicture !== "string" ? "unknown.jpg" : watched.profilePicture}")`}}></div>
                        <div className="p-3 grid grid-cols-3 items-center justify-center col-span-3">
                            <div className="col-span-2">
                                <div className="gap-1 my-2">
                                    <h2 className="font-bold text-xl lg:text-3xl">{watched.username}</h2>
                                    <h3 className="italic">{watched.name}</h3>
                                    <p>{watched.bio}</p>
                                </div>
                                <p className="py-1"><Link href={`/profile/${watched._id}/followers`}>{followersNum} followers</Link> | <Link href={`/profile/${watched._id}/following`}>{followingNum} following</Link></p>
                            </div>
                            {(user._id !== id) && <button className="mx-1 lg:mx-5 h-10 w-24 lg:w-32 bg-zinc-800 rounded-md" onClick={handleFollow}>{(following)? "Following": "Follow"}</button>}
                        </div>
                    </div>
                    {displayStory && <div className="w-full h-full absolute top-28 lg:top-0 left-0 z-10" style={{backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8))"}}>
                        <i className="fa-solid fa-x m-4 cursor-pointer" aria-hidden="true" onClick={() => {setDisplayStory(false)}}></i>
                        <div className="my-20 lg:my-10 flex items-center">
                            <video className="w-full border-y border-gray-700" controls>
                                <source src={`/users/stories/${watched.story}`} type="video/mp4" />
                            </video>
                        </div>
                    </div>}
                </div>
                {postsLoading && <Loader size={40} color="#eab308" />}
                {!postsLoading && posts && <>
                    {posts.length > 0 && <div className="grid grid-cols-3">
                        {posts.map((post, index) => {
                            return (
                                <Link key={index} href={`/post/${post._id}`} className="border-gray-700 border">
                                    {post.mediaType === "image" && <img className="w-full" alt="media" src={`/posts/medias/${post.media}`} />}
                                    {post.mediaType === "video" && <video className="w-full" controls>
                                        <source src={`/posts/medias/${post.media}`} type="video/mp4" />
                                    </video>}
                                </Link>
                            )
                        })}
                    </div>}
                    {!postsLoading && posts.length === 0 && <p className="text-center my-28 italic">This user doesn&apos;t have any post yet!</p>}
                </>}
            </div>}
            {!watchedLoading && !watched && <p className="text-center my-40 italic">No such user found!</p>}
        </>
    )
}


export default ProfilePage;