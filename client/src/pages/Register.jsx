import { useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { ChatState } from "../store/ChatProvider";



function Register() {
    const {API} = ChatState();

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    });

    const formHandler = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setUser({
            ...user,
            [name]: value,
        })
    }
    const submit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            })
            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                localStorage.setItem("token", data.token);
                setUser({
                    name: "",
                    email: "",
                    password: "",
                })

            } else {
                // console.log(data);
                toast.error(data.message ? data.message : "error response")
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div class="bg-white py-6 sm:py-8 lg:py-12">
                <div class="mx-auto max-w-screen-2xl px-4 md:px-8">
                    <h2 class="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-8 lg:text-3xl">Register</h2>

                    <form
                        onSubmit={(e) => { submit(e) }}
                        class="mx-auto max-w-lg rounded-lg border">
                        <div class="flex flex-col gap-4 p-4 md:p-8">
                            <div>
                                <label for="name" class="mb-2 inline-block text-sm text-gray-800 sm:text-base">Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    value={user.name}
                                    onChange={(e) => { formHandler(e) }}
                                    class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                            </div>

                            <div>
                                <label for="email" class="mb-2 inline-block text-sm text-gray-800 sm:text-base">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={user.email}
                                    onChange={(e) => { formHandler(e) }}
                                    class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                            </div>

                            <div>
                                <label for="password" class="mb-2 inline-block text-sm text-gray-800 sm:text-base">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    value={user.password}
                                    onChange={(e) => { formHandler(e) }}
                                    class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                            </div>

                            {/* <div>
                                <label for="pic" class="mb-2 inline-block text-sm text-gray-800 sm:text-base">Upload your Picture</label>
                                <input name="pic" type="file" p={1.5} accept="image/*" class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                            </div> */}

                            <button class="block rounded-lg bg-gray-800 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base">Sign up</button>


                        </div>

                        <div class="flex items-center justify-center bg-gray-100 p-4">
                            <p class="text-center text-sm text-gray-500">Already have an account? <NavLink to="/" className="text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700">Login</NavLink></p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Register;