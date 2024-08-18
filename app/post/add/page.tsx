"use client"

import ErrorAlert from "@/components/ErrorAlert";
import Loader from "@/components/Loader";
import User from "@/interfaces/user";
import { FormEvent, useEffect, useState } from "react";



import { FilePond, registerPlugin } from 'react-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

// Import the Image EXIF Orientation and Image Preview plugins
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import axios from "axios";
import Post from "@/interfaces/post";
import { useUser } from "@/components/Layout";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType);




function AddPost() {

    const user: User | null = useUser();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [file, setFile] = useState<any>([]);

    const [mediaType, setMediaType] = useState("image");

    const [tags, setTags] = useState<string[]>([]);
    const [tag, setTag] = useState("");


    const handleAddTag = () => {
        let tab = tags;

        tab.push(tag);
        setTags(tab);

        setTag("");
    }

    useEffect(() => {
        console.log("user in add post", user);
    }, [user]);


    const handleAddPost = async (e: FormEvent<HTMLFormElement>) => {
        try {
            
            e.preventDefault();
            setError("");
            setLoading(true);

            window.scrollTo(0, 0);

            const formData = new FormData(e.target as HTMLFormElement);

            formData.append("mediaType", mediaType);
            formData.append("media", file[0]);
            formData.append("tags", JSON.stringify(tags));
            formData.append("userName", user?.username?? "");
            formData.append("userId", user?._id as string);
            formData.append("userProfile", user?.profilePicture?? "");

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/posts/add`, formData, {headers: {"Content-Type": "multipart/form-data"}, validateStatus: status => status >= 200});

            if(response.status === 201) {
                setLoading(false);
                console.log("Post added successfully!");
                window.location.href = `/post/${(response.data as Post)._id}`;
            }

            else {
                throw Error(response.data as string);
            }

        } catch (error) {
            console.log("An error occurred in Add post function!", error);
            setLoading(false);
            setError("An unexpected error occurred! Please try again!");
        }
    }

    return(
        <div>
            <h1 className="text-center text-xl lg:text-3xl my-4">Add post</h1>
            {loading && <Loader size={40} color="#eab308" />}
            {error && <ErrorAlert>{error}</ErrorAlert>}
            <form className="rounded-lg bg-neutral-700 w-11/12 sm:w-1/2 flex flex-col p-6 mx-auto my-4" id="addPostForm" onSubmit={handleAddPost}>
                <label htmlFor="mediaType" className="my-2">Media&apos;s type</label>
                <div className="flex items-center justify-around">
                    <button className={`mx-5 h-10 w-32 hover:bg-zinc-800 rounded-md ${(mediaType === "image")? "bg-zinc-800" : "bg-black"}`} onClick={() => {setMediaType("image")}} type="button">Image</button>
                    <button className={`mx-5 h-10 w-32 hover:bg-zinc-800 rounded-md ${(mediaType === "video")? "bg-zinc-800" : "bg-black"}`} onClick={() => {setMediaType("video")}} type="button">Video</button>
                </div>
                <label htmlFor="media" className="my-2">Media</label>
                <div className="w-full mx-auto my-5">
                    <FilePond
                        files={file}
                        onupdatefiles={(fileItems) => {
                            setFile(fileItems.map((fileItem) => fileItem.file));
                        }}
                        allowMultiple={false}
                        acceptedFileTypes={[(mediaType === "image")? "image/*" : "video/mp4"]}
                        maxFiles={1}
                        required
                        name="file" /* sets the file input name, it's filepond by default */
                        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                    />
                </div>
                <label htmlFor="description" className="my-2">Description</label>
                <textarea placeholder="A description of your post" className="h-24 rounded-md p-3 bg-transparent text-white border-2 border-white" required name="description" id="description" />
                <label htmlFor="tags" className="my-2">Tags</label>
                <div className="grid grid-cols-4 my-2 items-center gap-2">
                    <input type="text" placeholder="Type here your new tag..." className="h-11 rounded-md p-3 bg-transparent text-white border-2 border-white col-span-3" name="tags" id="tags" value={tag} onChange={(e) => setTag(e.target.value)} />
                    <button type="button" className="mx-1 h-9 bg-zinc-800 rounded-md" onClick={handleAddTag}>Add</button>
                </div>
                <div className="p-2">
                    {tags && tags.map((tag, index) => {
                        return <span key={index} className="m-2 py-2 px-3 inline-block rounded bg-zinc-800">{tag} <i className="cursor-pointer fa-solid fa-x m-1" aria-hidden="true" onClick={() => {setTags(tags.filter((t) => {t !== tag}))}}></i></span>
                    })}
                </div>
                <button type='submit' form="addPostForm" className="bg-yellow-600 hover:bg-yellow-500 w-36 rounded-md min-h-10 mx-auto my-4">Add Post</button>
            </form>
        </div>
    )
}


export default AddPost;