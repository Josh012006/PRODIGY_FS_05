"use client"


import ErrorAlert from "@/components/ErrorAlert";
import Loader from "@/components/Loader";
import Image from "next/image";
import { FormEvent, useState } from "react";

import axios from "axios";
import Link from "next/link";




function LoginPage() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();

            window.scrollTo(0, 0);
            
            setError('');
            setLoading(true);


            const form = e.target;
            const formData = new FormData(form as HTMLFormElement);
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;


            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, JSON.stringify({email, password}), { headers: { "Content-Type": "application/json" }, validateStatus: status => status >= 200 });

            if(response.status === 200) {
                console.log("Login successful");
                setLoading(false);
                window.location.href="/";
            }
            else if(response.status === 404) {
                console.log("This user doesn't exist!");
                setLoading(false);
                setError("This user doesn't exist!");
            }
            else if(response.status === 401) {
                console.log("Invalid credentials");
                setLoading(false);
                setError("Invalid credentials!");
            }
            else {
                throw Error(response.data as string);
            }


        } catch (error) {
            console.log("An error occurred while submitting form ", error);
            setLoading(false);
            setError("An unexpected error occurred! Please try again!");
        }
    }
    
    return(
        <div className="py-16">
            <Image src="/logo.png" alt="Connexia Logo" width={34} height={34} className="mx-auto mt-20" />
            <h1 className="text-xl lg:text-3xl text-center my-11">Re Dive</h1>
            {loading && <Loader size={40} color="#eab308" />}
            {error && <ErrorAlert>{error}</ErrorAlert>}
            <form className="rounded-lg bg-neutral-700 w-11/12 sm:w-1/4 flex flex-col my-4 p-6 mx-auto" id="loginForm" onSubmit={handleLogin}>
                <label htmlFor="email" className="my-2">Email</label>
                <input type="email" placeholder="example@gmail.com" className="h-11 rounded-md p-3 bg-transparent text-white border-2 border-white" required name="email" id="email" />
                <label htmlFor="password" className="my-2">Password</label>
                <input type="password" placeholder="Your password" className="h-11 rounded-md p-3 bg-transparent text-white border-2 border-white" required name="password" id="password" />
                <button type='submit' form="loginForm" className="bg-yellow-600 hover:bg-yellow-500 w-36 rounded-md min-h-10 mx-auto my-4">Login</button>
                <Link href="/auth/register">Doesn&apos;t have an account yet? <span className="text-yellow-500">Register!</span></Link>
            </form>
        </div>
    )
}


export default LoginPage;