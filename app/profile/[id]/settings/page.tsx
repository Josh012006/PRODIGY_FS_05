"use client"

import ErrorAlert from "@/components/ErrorAlert";
import Loader from "@/components/Loader";
import User from "@/interfaces/user";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import axios from "axios";


import { FilePond, registerPlugin } from 'react-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

// Import the Image EXIF Orientation and Image Preview plugins
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import { verifyPassword } from "@/server/utils/managePassword";
import { useUser } from "@/components/Layout";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType);





export default function SettingsPage() {

    const user: User | null = useUser();

    const [authorized, setAuthorized] = useState(false);

    const [changeProfPic, setChangeProfPic] = useState(false);

    const id = useParams().id;

    const [expandProfPic, setExpandProfPic] = useState(false);


    const [loadingChangeProfPic, setLoadingChangeProfPic] = useState(false);
    const [errorChangeProfPic, setErrorChangeProfPic] = useState("");
    const [file, setFile] = useState<any>([]);


    const [changeBio, setChangeBio] = useState(false);
    const [errorChangeBio, setErrorChangeBio] = useState("");
    const [loadingChangeBio, setLoadingChangeBio] = useState(false);


    const [changeStory, setChangeStory] = useState(false);
    const [loadingChangeStory, setLoadingChangeStory] = useState(false);
    const [errorChangeStory, setErrorChangeStory] = useState("");
    const [file1, setFile1] = useState<any>([]);


    const [changePassword, setChangePassword] = useState(false);
    const [loadingChangePassword, setLoadingChangePassword] = useState(false);
    const [errorChangePassword, setErrorChangePassword] = useState("");

    const [loadingLogout, setLoadingLogout] = useState(false);


    useEffect(() => {
        if(user?._id === id) {
            setAuthorized(true);
        }
        else {
            window.location.href = '/';
        }
    }, [id, user?._id]);

    const handleChangeProfPic = async (e: FormEvent<HTMLFormElement>) => {
        try {
            
            e.preventDefault();

            setErrorChangeProfPic("");
            setLoadingChangeProfPic(true);

            const formData = new FormData();

            formData.append("oldFile", user?.profilePicture?? "");
            formData.append("userId", id as string);
            formData.append("file", file[0]);

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/update/profilePicture`, formData, {headers: {"Content-Type": "multipart/form-data"}, validateStatus: status => status >= 200});

            if(response.status === 200) {
                setLoadingChangeProfPic(false);
                window.location.reload();
            }
            else {
                throw Error(response.data as string);
            }

        } catch (error) {
            console.log("An error occurred in handle Change profile picture function ", error);
            setLoadingChangeProfPic(false);
            setErrorChangeProfPic("An unexpected error occurred! Please try again!");
            return;
        }
    }

    const handleChangeBio = async (e: FormEvent<HTMLFormElement>) => {
        try {
            
            e.preventDefault();

            setErrorChangeBio("");
            setLoadingChangeBio(true);

            const formData = new FormData(e.target as HTMLFormElement);

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/update/bio`, JSON.stringify({bio: formData.get("bio"), userId: user?._id}), {headers: {"Content-Type": "application/json"}, validateStatus: status => status >= 200});

            if(response.status === 200) {
                setLoadingChangeBio(false);
                window.location.reload();
            }
            else {
                throw Error(response.data as string);
            }

        } catch (error) {
            console.log("An error occurred in handle Change bio function ", error);
            setLoadingChangeBio(false);
            setErrorChangeBio("An unexpected error occurred! Please try again!");
            return;
        }
    }

    const handleDeleteStory = async () => {
        try {
            
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/update/story/delete`, JSON.stringify({userId: user?._id, oldStory: user?.story}), {headers: {"Content-Type": "application/json"}, validateStatus: status => status >= 200});

            if(response.status === 200) {
                window.location.reload();
            }

            else {
                throw Error(response.data as string);
            }

        } catch (error) {
            console.log("An error in handle Delete story function ", error);
            window.location.reload();
        }
    }

    const handleChangeStory = async (e: FormEvent<HTMLFormElement>) => {
        try {
            
            e.preventDefault();

            setErrorChangeStory("");
            setLoadingChangeStory(true);

            const formData = new FormData();

            formData.append("oldStory", user?.story?? "");
            formData.append("userId", id as string);
            formData.append("file", file1[0]);

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/update/story`, formData, {headers: {"Content-Type": "multipart/form-data"}, validateStatus: status => status >= 200});

            if(response.status === 200) {
                setLoadingChangeStory(false);
                window.location.reload();
            }
            else {
                throw Error(response.data as string);
            }

        } catch (error) {
            console.log("An error occurred in handle Change story function ", error);
            setLoadingChangeStory(false);
            setErrorChangeStory("An unexpected error occurred! Please try again!");
            return;
        }
    }


    const handleChangePassword = async(e: FormEvent<HTMLFormElement>) => {
        try {
            
            e.preventDefault();

            setErrorChangePassword("");
            setLoadingChangePassword(true);

            const formData = new FormData(e.target as HTMLFormElement);

            if(!(await verifyPassword(formData.get("old-password"), user?.password?? ""))) {
                setLoadingChangePassword(false);
                setErrorChangePassword("Actual password incorrect!");
                return;
            }

            if(formData.get("confirm-password") !== formData.get("new-password")) {
                setLoadingChangePassword(false);
                setErrorChangePassword("Passwords must be the same!");
                return;
            }

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/update/password`, JSON.stringify({userId: user?._id, newPassword: formData.get("new-password")}), {headers: {"Content-Type": "application/json"}, validateStatus: status => status >= 200});

            if(response.status === 200) {
                setLoadingChangePassword(false);
                window.location.reload();
                return;
            }
            else {
                throw Error(response.data as string);
            }
            

        } catch (error) {
            console.log("An error occurred in handle Change password function ", error);
            setLoadingChangePassword(false);
            setErrorChangePassword("An unexpected error occurred! Please try again!");
            return;
        }
    }

    const handleLogout = async () => {
        try {
            
            setLoadingLogout(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/logout`);

            if(response.status === 200) {
                setLoadingLogout(false);
                console.log("User successfully logged out!");
                window.location.reload();
                return;
            }
            else {
                throw Error(response.data as string);
            }


        } catch (error) {
            setLoadingLogout(false);
            console.log("An error in handle logout function ", error);
            window.location.reload();
            return;
        }
    }




    return(
        <>
            {authorized && <div className="p-4 h-full">
                <div className="bg-cover bg-center bg-no-repeat rounded-full w-24 h-24 lg:w-36 lg:h-36 relative cursor-pointer mx-auto z-0" style={{backgroundImage: `url("/users/profile_pictures/${user?.profilePicture?? "unknown.jpg"}")`}} onClick={() => {setExpandProfPic(true)}}>
                    <span className="absolute right-0 bottom-0 z-10 rounded-full h-8 w-8 flex items-center justify-center bg-zinc-800" onClick={(e) => {e.stopPropagation(); setChangeProfPic(true)}}>
                        <i className="fa-solid fa-camera text-lg lg:text-xl"></i>
                    </span>
                </div>
                <div className="text-center p-2 lg:p-4 flex flex-col items-center gap-2">
                    <p className="text-xl lg:text-3xl font-bold">{user?.username}</p>
                    <p className="italic font-bold">{user?.name}</p>
                    <p>{user?.bio}</p>
                    <button type="button" className="mx-5 h-10 w-32 bg-zinc-800 rounded-md" onClick={() => {setChangeBio(true)}}>Change the bio</button>
                </div>
                <br />
                <div className="flex flex-col gap-2 p-2 lg:p-4">
                    <h2 className="text-xl lg:text-2xl text-center">Your story</h2>
                    {user?.story && <video className="w-full" controls>
                        <source src={`/users/stories/${user.story}`} type="video/mp4" />
                    </video>}
                    {!user?.story && <p className="italic text-center my-6">No story!</p>}
                    <div className="flex flex-col gap-1 lg:flex-row items-center justify-around">
                        <button type="button" className="mx-5 h-10 min-w-32 bg-zinc-800 rounded-md" onClick={() => {setChangeStory(true)}}>Change story</button>
                        <button type="button" className="mx-5 h-10 min-w-32 bg-zinc-800 rounded-md" onClick={handleDeleteStory}>No story!</button>
                    </div>
                </div>
                <div className="flex flex-col items-center my-5">
                    <h1 className='font-bold text-xl lg:text-3xl my-3'>Personal information</h1>
                    <p className="my-4"><span className="font-bold">Email:</span> <span className="whitespace-normal">{user?.email}</span></p>
                    <button className="mx-5 min-h-10 w-40 bg-zinc-800 rounded-md" type="button" onClick={() => {setChangePassword(true)}}>Change your password</button>
                </div>
                <div className="py-5 flex flex-col items-center gap-2">
                    <button className="mx-5 h-10 w-32 text-red-500 bg-zinc-800 rounded-md" type="button" onClick={handleLogout}>Logout</button>
                    {loadingLogout && <Loader size={30} color="#eab308" />}
                </div>
                {changeStory && <div className="w-full h-full fixed top-0 left-0 z-10" style={{backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8))"}}>
                    <div className="fixed top-28 lg:top-0 w-full left-0">
                        <i className="fa-solid fa-x mx-4 my-2 cursor-pointer" aria-hidden="true" onClick={() => {setChangeStory(false)}}></i>
                        <form className="rounded-lg bg-neutral-700 w-11/12 sm:w-1/2 flex flex-col p-6 mx-auto my-5 lg:my-10" id="changeStoryForm" onSubmit={handleChangeStory}>
                            {loadingChangeStory && <Loader size={40} color="#eab308" />}
                            {errorChangeStory && <ErrorAlert>{errorChangeStory}</ErrorAlert>}
                            <label htmlFor="media" className="my-2">Media</label>
                            <div className="w-full mx-auto my-1">
                                <FilePond
                                    files={file1}
                                    onupdatefiles={(fileItems) => {
                                        setFile1(fileItems.map((fileItem) => fileItem.file));
                                    }}
                                    allowMultiple={false}
                                    acceptedFileTypes={["video/mp4"]}
                                    maxFiles={1}
                                    required
                                    name="file" /* sets the file input name, it's filepond by default */
                                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                />
                            </div>
                            <button type='submit' form="changeStoryForm" className="bg-yellow-600 hover:bg-yellow-500 w-36 rounded-md min-h-10 mx-auto my-4">Submit</button>
                        </form>
                    </div>
                </div>}
                {expandProfPic && <div className="w-full h-full fixed top-0 left-0 z-10" style={{backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8))"}}>
                    <div className="fixed top-28 lg:top-0 w-full left-0">
                        <i className="fa-solid fa-x mx-4 my-2 cursor-pointer" aria-hidden="true" onClick={() => {setExpandProfPic(false)}}></i>
                        <div className="my-5 lg:my-10 lg:h-full lg:w-9/12 lg:mx-auto flex items-center">
                            <img className="w-full border-y border-gray-700" alt="media" src={`/users/profile_pictures/${user?.profilePicture}`} />
                        </div>
                    </div>
                </div>}
                {changeBio && <div className="w-full h-full fixed top-0 left-0 z-10" style={{backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8))"}}>
                    <div className="fixed top-28 lg:top-0 w-full left-0">
                        <i className="fa-solid fa-x mx-4 my-2 cursor-pointer" aria-hidden="true" onClick={() => {setChangeBio(false)}}></i>
                        <form className="rounded-lg bg-neutral-700 w-11/12 sm:w-1/2 flex flex-col p-6 mx-auto my-5 lg:my-10" id="changeBioForm" onSubmit={handleChangeBio}>
                            {loadingChangeBio && <Loader size={40} color="#eab308" />}
                            {errorChangeBio && <ErrorAlert>{errorChangeBio}</ErrorAlert>}
                            <label htmlFor="bio" className="my-2">Bio</label>
                            <textarea placeholder="A short bio about yourself" className="h-24 rounded-md p-3 bg-transparent text-white border-2 border-white" required name="bio" id="bio" defaultValue={user?.bio} />
                            <button type='submit' form="changeBioForm" className="bg-yellow-600 hover:bg-yellow-500 w-36 rounded-md min-h-10 mx-auto my-4">Submit</button>
                        </form>
                    </div>
                </div>}
                {changePassword && <div className="w-full h-full fixed top-0 left-0 z-10" style={{backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8))"}}>
                    <div className="fixed top-28 lg:top-0 w-full left-0">
                        <i className="fa-solid fa-x mx-4 my-2 cursor-pointer" aria-hidden="true" onClick={() => {setChangePassword(false)}}></i>
                        <form className="rounded-lg bg-neutral-700 w-11/12 sm:w-1/2 flex flex-col p-6 mx-auto my-5 lg:my-10" id="changePasswordForm" onSubmit={handleChangePassword}>
                            {loadingChangePassword && <Loader size={40} color="#eab308" />}
                            {errorChangePassword && <ErrorAlert>{errorChangePassword}</ErrorAlert>}
                            <label htmlFor="old-password" className="my-2">Actual Password</label>
                            <input type="password" placeholder="Your actual password" className="h-11 rounded-md p-3 bg-transparent text-white border-2 border-white" required name="old-password" id="old-password" />
                            <br />
                            <label htmlFor="new-password" className="my-2">New Password</label>
                            <input type="password" placeholder="New password" className="h-11 rounded-md p-3 bg-transparent text-white border-2 border-white" required name="new-password" id="new-password" />
                            <label htmlFor="confirm-password" className="my-2">Confirm new Password</label>
                            <input type="password" placeholder="Confirm password" className="h-11 rounded-md p-3 bg-transparent text-white border-2 border-white" required name="confirm-password" id="confirm-password" />
                            <button type='submit' form="changePasswordForm" className="bg-yellow-600 hover:bg-yellow-500 w-36 rounded-md min-h-10 mx-auto my-4">Submit</button>
                        </form>
                    </div>
                </div>}
                {changeProfPic && <div className="w-full h-full fixed top-0 left-0 z-10" style={{backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8))"}}>
                    <div className="fixed top-28 lg:top-0 w-full left-0">
                        <i className="fa-solid fa-x my-2 mx-4 cursor-pointer" aria-hidden="true" onClick={() => {setChangeProfPic(false)}}></i>
                        <form className="rounded-lg bg-neutral-700 w-11/12 sm:w-1/2 flex flex-col p-6 mx-auto my-5 lg:my-10" id="changeProfPicForm" onSubmit={handleChangeProfPic}>
                            {loadingChangeProfPic && <Loader size={40} color="#eab308" />}
                            {errorChangeProfPic && <ErrorAlert>{errorChangeProfPic}</ErrorAlert>}
                            <label htmlFor="media" className="my-2">Media</label>
                            <div className="w-full mx-auto my-1">
                                <FilePond
                                    files={file}
                                    onupdatefiles={(fileItems) => {
                                        setFile(fileItems.map((fileItem) => fileItem.file));
                                    }}
                                    allowMultiple={false}
                                    acceptedFileTypes={["image/*"]}
                                    maxFiles={1}
                                    required
                                    name="file" /* sets the file input name, it's filepond by default */
                                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                />
                            </div>
                            <button type='submit' form="changeProfPicForm" className="bg-yellow-600 hover:bg-yellow-500 w-36 rounded-md min-h-10 mx-auto my-4">Submit</button>
                        </form>
                    </div>
                </div>}
            </div>}
        </>
    )
}