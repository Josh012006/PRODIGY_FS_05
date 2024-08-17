"use client"

import Loader from "@/components/Loader";
import PostComponent from "@/components/PostComponent";
import Post from "@/interfaces/post";
import User from "@/interfaces/user";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home({user} : {user: User}) {

  const [posts, setPosts] = useState<Post[]>([]);

  const [loading, setLoading] = useState(false);


  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/getAll`);

        if (response.status === 200) {
          setLoading(false);
          setPosts(response.data as Post[]);
          return;
        }

        else {
          throw Error(response.data as string);
        }

      } catch (error) {
        setLoading(false);
        console.log("An error occurred in fetch posts function!");
        return;
      }
    }

    fetchPosts();
  }, []);


  return (
    <>
      {/* // ! Manage the display of the post depending of the position on the page */}
        {posts && posts.map((post) => {
          return <PostComponent key={post._id} post={post} userId={user?._id as string} />
        })}
        {loading && <Loader size={40} color="#eab308" />}
    </>
  );
}
