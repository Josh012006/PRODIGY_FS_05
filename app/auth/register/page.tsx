"use client"


import ErrorAlert from "@/components/ErrorAlert";
import Loader from "@/components/Loader";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";

import { FilePond, registerPlugin } from 'react-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

// Import the Image EXIF Orientation and Image Preview plugins
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType);

import axios from "axios";
import Link from "next/link";


function RegisterPage() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [file, setFile] = useState<any>([]);
    const [usernames, setUsernames] = useState<string[]>([]);
    const [username, setUsername] = useState("");

    const [okay, setOkay] = useState(true);


    useEffect(() => {
        if(usernames.includes(username)) {
            setOkay(false);
        }
        else {
            setOkay(true);
        }
    }, [username, usernames]);




    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            
            window.scrollTo(0, 0);

            const formData = new FormData(e.target as HTMLFormElement);

            formData.append("file", file[0]);

            if(formData.get("password") !== formData.get("confirm-password")) {
                setLoading(false);
                setError("The passwords must be the same!");
                console.log("password: " + formData.get("password") + " confirmation password: " +  formData.get("confirm-password"));
                return;
            }
            if(!okay) {
                setLoading(false);
                setError("Invalid username!");
                console.log(username);
                return;
            }

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, formData, { headers: {"Content-Type": "multipart/form-data"}, validateStatus: status => status >= 200 });

            if(response.status === 200) {
                console.log("Registration successful");
                setLoading(false);
                window.location.href = "/";
                return;
            }
            else {
                throw Error(response.data as string);
            }


        } catch (error) {
            console.log("An unexpected error occurred in registration form ", error);
            setLoading(false);
            setError("An unexpected error occurred! Please try again!");
            return;
        }
    }

    useEffect(() => {
        async function fetchUsernames() {
            try {
                
                const usernames = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/fetchUsernames`);

                if(usernames.status === 200) {
                    setUsernames(usernames.data as string[]);
                }

                else {
                    throw Error("An error in the route!");
                }

            } catch (error) {
                window.location.reload();
            }
        }

        fetchUsernames();
    }, []);


    return(
        <div className="py-16">
            <Image src="/logo.png" alt="Connexia Logo" width={34} height={34} className="mx-auto mt-20" />
            <h1 className="text-xl lg:text-3xl text-center my-11">Create a profile</h1>
            {loading && <Loader size={40} color="#eab308" />}
            {error && <ErrorAlert>{error}</ErrorAlert>}
            <form className="rounded-lg bg-neutral-700 w-11/12 sm:w-1/4 flex flex-col p-6 my-4 mx-auto" id="registerForm" onSubmit={handleRegister}>
                <label htmlFor="name" className="my-2">Your name</label>
                <input type="text" placeholder="John Doe" className="h-11 rounded-md p-3 bg-transparent text-white border-2 border-white" required name="name" id="name" />
                <label htmlFor="username" className="my-2">Your username</label>
                <p className="italic my-1">It will be what others will mainly see!</p>
                <input type="text" placeholder="Jonny" className="h-11 rounded-md p-3 bg-transparent text-white border-2 border-white" required name="username" id="username" value={username} onChange={(e) => {setUsername(e.target.value)}} />
                {username && okay && <p className="text-green-500 my-1">Ok!</p>}
                {username && !okay && <p className="text-red-500 my-1">This one is already in use!</p>}
                <br />
                <label htmlFor="email" className="my-2">Email</label>
                <input type="email" placeholder="example@gmail.com" className="h-11 rounded-md p-3 bg-transparent text-white border-2 border-white" required name="email" id="email" />
                <label htmlFor="password" className="my-2">Password</label>
                <input type="password" placeholder="Your password" className="h-11 rounded-md p-3 bg-transparent text-white border-2 border-white" required name="password" id="password" />
                <label htmlFor="confirm-password" className="my-2">Confirm Password</label>
                <input type="password" placeholder="Confirm password" className="h-11 rounded-md p-3 bg-transparent text-white border-2 border-white" required name="confirm-password" id="confirm-password" />
                <br />
                <label htmlFor="bio" className="my-2">Bio</label>
                <textarea placeholder="A short bio about yourself" className="h-24 rounded-md p-3 bg-transparent text-white border-2 border-white" required name="bio" id="bio" />
                <label htmlFor="profile-picture" className="my-2">Profile Picture</label>
                <div className="w-full mx-auto my-5">
                    <FilePond
                        files={file}
                        onupdatefiles={(fileItems) => {
                            setFile(fileItems.map((fileItem) => fileItem.file));
                        }}
                        allowMultiple={false}
                        acceptedFileTypes={['image/*']}
                        maxFiles={1}
                        required
                        name="file" /* sets the file input name, it's filepond by default */
                        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                    />
                </div>
                <button type='submit' form="registerForm" className="bg-yellow-600 hover:bg-yellow-500 w-36 rounded-md min-h-10 mx-auto my-4">Dive in</button>
                <Link href="/auth/login">Already have an account? <span className="text-yellow-500">Login!</span></Link>
            </form>
        </div>
    )
}


export default RegisterPage;