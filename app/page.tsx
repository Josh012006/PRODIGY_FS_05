"use client"

import { useUser } from "@/components/Layout";
import Loader from "@/components/Loader";
import PostComponent from "@/components/PostComponent";
import Post from "@/interfaces/post";
import User from "@/interfaces/user";
import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";

export default function Home() {

  const user: User | null = useUser();

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
          const initialVisibility = (response.data as Post[]).reduce((acc: any, post: Post) => {
              acc[post._id as string] = false;
              return acc;
          }, {});
          setVisiblePosts(initialVisibility);
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
    if (posts.length > 0) {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // Utiliser un timeout pour attendre que les posts soient complètement rendus
        const timeoutId = setTimeout(() => {
            observerRef.current = new IntersectionObserver(observerCallback, {
                root: null,
                rootMargin: '0px',
                threshold: 0.1,
            });

            posts.forEach(post => {
                const postElement = document.querySelector(`[data-id="${post._id}"]`);
                if (postElement) {
                    observerRef.current?.observe(postElement);
                }
            });
        }, 1500);

        return () => {
            clearTimeout(timeoutId); // Nettoyage du timeout
            observerRef.current?.disconnect();
        };
    }
  }, [posts, observerCallback]);

  useEffect(() => {
    console.log(visiblePosts);
  }, [visiblePosts]);



  return (
    <>
      {/* // ! Manage the display of the post depending of the position on the page */}
        {posts && posts.map((post) => {
            return (
                <PostComponent
                    style={{
                        transition: "opacity 0.5s ease-in-out",
                        opacity: visiblePosts[post._id as string] ? 1 : 0
                    }}
                    key={post._id}
                    post={post}
                    userId={user?._id as string}
                />
            );
        })}
        {loading && <Loader size={40} color="#eab308" />}
    </>
  );
}
