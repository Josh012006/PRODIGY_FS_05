"use client"

import Comment from "@/interfaces/comment";
import Post from "@/interfaces/post";
import User from "@/interfaces/user";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import CommentDisplay from "./CommentDisplay";



function PostMin({post, userId}: {post: Post, userId: string}) {

    const [poster, setPoster] = useState<User | null>(null);
    const [following, setFollowing] = useState<boolean>(false);
    const [liked, setLiked] = useState(false);


    const [displayComments, setDisplayComments] = useState(false);
    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState<Comment[]>([]);


    const [newComment, setNewComment] = useState("");
    const [loadingAddComment, setLoadingAddComment] = useState(false);




    useEffect(() => {
        async function fetchPoster() {
            try {
                
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/fetchUserById/${post.userId}`);

                if(response.status === 200) {
                    setPoster(response.data as User);
                    return;
                }

                else {
                    throw Error(response.data as string);
                }

            } catch (error) {
                console.log("An error in fetch poster function!");
                return;
            }
        }

        fetchPoster();

    }, [post.userId]);

    useEffect(() => {
        if(poster) {
            setFollowing(poster.followers.includes(userId));
            setLiked(post.likes.includes(userId));
            setLikes(post.likes.length);
        }
    }, [poster, userId]);

    useEffect(() => {
        async function fetchComments() {
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/comments/getFromTab`, JSON.stringify({commentsTab: post.comments}), {headers: {"Content-Type": "application/json"}, validateStatus: status => status >= 200});

                setComments(response.data as Comment[]);

            } catch (error) {
                console.log("An error in fetch comments function in post with id ", post._id);
            }
        }

        fetchComments();

    }, [post]);


    const handleFollow = async () => {
        try {
            
            const num = (following)? 0 : 1;

            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/posts/follow?num=${num}`, JSON.stringify({userId: userId, toFollowId: post.userId}), {headers: {"Content-Type": "application/json"}, validateStatus: status => status >= 200});

            if(response.status === 200) {
                console.log("Update successful");
                setFollowing(!following);
            }
            else {
                throw Error(response.data as string);
            }

        } catch (error) {
            console.log("An error occurred in handleFollow function for post with id ", post._id);
        }
    }

    const handleLike = async () => {
        try {

            const num = (liked)? 0 : 1;

            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/posts/like?num=${num}`, JSON.stringify({userId: userId, postId: post._id}), {headers: {"Content-Type": "application/json"}, validateStatus: status => status >= 200});

            if(response.status === 200) {
                console.log("Update successful");
                setLiked(!liked);

                if(num === 0) {
                    setLikes(likes - 1);
                } else {
                    setLikes(likes + 1);
                }
            }
            else {
                throw Error(response.data as string);
            }

        } catch (error) {
            console.log("An error occurred in handleLike function for post with id ", post._id);
        }
    }

    const handleAddComment = async () => {
        try {
            setLoadingAddComment(true);

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/comments/add`, JSON.stringify({comment: newComment, postId: post._id, issuer: userId }), { headers: { "Content-Type": "application/json" }, validateStatus: status => status >= 200 });

            if(response.status === 200) {
                console.log("Comment added successfully!");
                setLoadingAddComment(false);
                setComments([...comments, response.data as Comment]);
            }
            else {
                throw Error(response.data as string);
            }

        } catch (error) {
            console.log("An error occurred in handleAddComment function for post with id ", post._id);
            setLoadingAddComment(false);
        }
    }



    return(
        <>
            {poster && <div className="bg-zinc-900 rounded-md m-6 lg:w-1/2 lg:mx-auto py-2">
                <div className="grid grid-cols-2 items-center border-gray-700 border-b">
                    {/* // ! Manage story and link to direct to user's profile on click */}
                    <div className="flex items-center">
                        <div className="lg:w-24 lg:h-24 w-16 h-16 rounded-full m-3 bg-no-repeat bg-center bg-cover" style={{backgroundImage: `url("/users/profile_pictures/${post.userProfile === "" || typeof post.userProfile !== "string" ? "unknown.png" : post.userProfile}")`}}></div>
                        <h2>{post.userName}</h2>
                    </div>
                    {(poster._id !== userId) && <button className="mx-5 h-10 w-32 bg-zinc-800 rounded-md" onClick={handleFollow}>{(following)? "Following": "Follow"}</button>}
                </div>
                <div>
                    {post.mediaType === "image" && <img className="w-full border-y border-gray-700" alt="media" src={`/posts/medias/${post.media}`} />}
                    {post.mediaType === "video" && <video className="w-full border-y border-gray-700" controls>
                        <source src={`/posts/medias/${post.media}`} type="video/mp4" />
                    </video>}
                </div>
                <div className="flex items-center">
                    <p className="m-2">
                        <i className={`${liked? "fa-solid text-red-500" : "fa-regular text-white"} fa-heart m-1 cursor-pointer`} aria-hidden="true" onClick={handleLike}></i> {likes} 
                    </p>
                    <p className="m-2">
                        <i className={`fa-regular fa-comment m-1 cursor-pointer`} aria-hidden="true" onClick={() => {setDisplayComments(!displayComments)}}></i> {comments.length?? 0}
                    </p>
                </div>
                <div className="p-3">
                    <p className="my-1">
                        {post.tags.map((tag, index) => {return <span key={index} className="mx-1">#{tag}</span>})}
                    </p>
                    <p className="m-1">
                        {post.description}
                    </p>
                </div>
                {displayComments && comments && <div>
                    <div className="w-full p-2 grid grid-cols-6 items-center">
                        <input name="comment" id="comment" placeholder="Add a new comment..." className="rounded-full h-9 p-3 mx-1 col-span-5 text-white bg-zinc-800" value={newComment} onChange={(e) => {setNewComment(e.target.value)}} />
                        {!loadingAddComment && <button className="mx-1 h-9 bg-zinc-800 rounded-md" onClick={handleAddComment}>Add</button>}
                        {loadingAddComment && <div className="col-span-1">
                            <Loader size={20} color="#eab308" />
                        </div>}
                    </div>
                    <div>
                        <div>
                            <>
                                {comments && comments.map((comment) => {
                                    return <CommentDisplay key={comment._id} comment={comment} userId={userId} />
                                })}
                            </>
                        </div>
                    </div>
                </div>}
            </div>}
        </>
    )
}


export default PostMin;