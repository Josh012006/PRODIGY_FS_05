"use client"

import Loader from "@/components/Loader";
import PostComponent from "@/components/PostComponent";
import Post from "@/interfaces/post";
import User from "@/interfaces/user";
import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";

export default function Home({user} : {user: User}) {

  const [posts, setPosts] = useState<Post[]>([]);
  const [visiblePosts, setVisiblePosts] = useState<{[key: string]: boolean}>({});

  const observerRef = useRef<IntersectionObserver | null>(null);

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


  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              setVisiblePosts(prevVisiblePosts => ({
                  ...prevVisiblePosts,
                  [String(entry.target.getAttribute('data-id'))]: true,
              }));
          }
      });
  }, []);

  useEffect(() => {
      observerRef.current = new IntersectionObserver(observerCallback, {
          root: null, // viewport
          rootMargin: '0px',
          threshold: 0.1, // Trigger when 10% of the post is visible
      });

      posts.forEach(post => {
          const postElement = document.querySelector(`[data-id="${post._id}"]`);
          if (postElement) {
              observerRef.current?.observe(postElement);
          }
      });

      return () => {
          observerRef.current?.disconnect();
      };
  }, [observerCallback, posts]);



  return (
    <>
      {/* // ! Manage the display of the post depending of the position on the page */}
        {posts && posts.map((post) => {
          return <PostComponent style={{display: visiblePosts[post._id as string] ? "block" : "none"}} key={post._id} post={post} userId={user?._id as string} />
        })}
        {loading && <Loader size={40} color="#eab308" />}
    </>
  );
}
