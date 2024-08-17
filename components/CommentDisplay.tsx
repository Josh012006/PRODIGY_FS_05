"use client"

import Comment from "@/interfaces/comment";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";




function CommentDisplay({comment, userId} : {comment: Comment, userId: string}) {

    const [likes, setLikes] = useState(0);
    const [disLikes, setDisLikes] = useState(0);

    const [liked, setLiked] = useState(false);
    const [disLiked, setDisLiked] = useState(false);

    useEffect(() => {
        if(comment) {
            setLikes(comment.likes.length);
            setDisLikes(comment.dislikes.length);

            setLiked(comment.likes.includes(userId));
            setDisLiked(comment.dislikes.includes(userId));
        }
    }, [comment]);

    useEffect(() => {
        if (liked) {
            setDisLiked(false);
            if(disLiked) {
                setDisLikes(disLikes - 1);
            }
        }
    }, [liked]);

    useEffect(() => {
        if (disLiked) {
            setLiked(false);
            if(liked) {
                setLikes(likes - 1);
            }
        }
    }, [disLiked]);


    const handleLike = async () => {
        try {

            const num = (liked)? 0 : 1;

            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/comments/like?num=${num}`, JSON.stringify({userId: userId, commentId: comment._id}), {headers: {"Content-Type": "application/json"}, validateStatus: status => status >= 200});

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
            console.log("An error occurred in handleLike function for comment with id ", comment._id);
        }
    }

    const handleDisLike = async () => {
        try {

            const num = (disLiked)? 0 : 1;

            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/comments/dislike?num=${num}`, JSON.stringify({userId: userId, commentId: comment._id}), {headers: {"Content-Type": "application/json"}, validateStatus: status => status >= 200});

            if(response.status === 200) {
                console.log("Update successful");
                setDisLiked(!disLiked);
                

                if(num === 0) {
                    setDisLikes(disLikes - 1);
                } else {
                    setDisLikes(disLikes + 1);
                }
            }
            else {
                throw Error(response.data as string);
            }

        } catch (error) {
            console.log("An error occurred in handleDisLike function for comment with id ", comment._id);
        }
    }


    return (
        <div className="bg-zinc-800 m-4 rounded-xl p-2">
            <Link href={`/profile/${comment.issuer}`} className="text-sm font-bold">{comment.issuerUsername}</Link>
            <p className="my-1">
                {comment.content}
            </p>
            <div className="flex items-center justify-end">
                <p className="mx-2"><i className={`mx-1 fa-thumbs-up ${(liked)? "text-blue-500 fa-solid": "text-white fa-regular"} cursor-pointer`} onClick={handleLike}></i> {likes}</p>
                <p className="mx-2"><i className={`mx-1 fa-thumbs-down ${(disLiked)? "text-blue-500 fa-solid": "text-white fa-regular"} cursor-pointer`} onClick={handleDisLike}></i> {disLikes}</p>
            </div>
        </div>
    )
}


export default CommentDisplay;