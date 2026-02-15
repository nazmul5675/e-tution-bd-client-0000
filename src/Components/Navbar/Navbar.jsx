import React, { useContext } from "react";
import { Link, NavLink } from "react-router";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { AuthContext } from "../../Context/AuthContext";
import Swal from "sweetalert2"; // 

const Navbar = () => {
    const { user, signOutUser } = useContext(AuthContext);


    const publicLinks = (
        <>
            <li>
                <NavLink to="/" className={({ isActive }) => (isActive ? "text-primary font-bold" : "")}>
                    Home
                </NavLink>
            </li>
            <li>
                <NavLink to="/tuitions" className={({ isActive }) => (isActive ? "text-primary font-bold" : "")}>
                    Tuitions
                </NavLink>
            </li>
            <li>
                <NavLink to="/tutors" className={({ isActive }) => (isActive ? "text-primary font-bold" : "")}>
                    Tutors
                </NavLink>
            </li>
            <li>
                <NavLink to="/about" className={({ isActive }) => (isActive ? "text-primary font-bold" : "")}>
                    About
                </NavLink>
            </li>
            <li>
                <NavLink to="/contact" className={({ isActive }) => (isActive ? "text-primary font-bold" : "")}>
                    Contact
                </NavLink>
            </li>
            {user?.email && (
                <li>
                    <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "text-primary font-bold" : "")}>
                        Dashboard
                    </NavLink>
                </li>
            )}
        </>
    );


    const handleLogout = async () => {
        try {
            await signOutUser();
            Swal.fire({
                icon: "success",
                title: "Logged out",
                timer: 1200,
                showConfirmButton: false,
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Logout failed",
                text: "Please try again.",
            });
        }
    };

    return (
        <div className="max-w-7xl mx-auto navbar bg-base-100 sticky top-0 z-50 shadow">
            <div className="navbar-start">
                {/* Mobile dropdown */}
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>

                    {/* tabIndex must be 0 (not -1) */}
                    <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow">
                        {publicLinks}



                    </ul>
                </div>

                <Link to="/" className="text-xl text-primary font-black mx-4">
                    eTuitionBd
                </Link>

                <ThemeToggle />
            </div>

            {/* Desktop links */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">{publicLinks}</ul>
            </div>

            {/* Right side */}
            <div className="navbar-end gap-3">

                {!user?.email && (
                    <>
                        <Link to="/login" className="btn text-primary bg-primary/20">
                            Login
                        </Link>
                        <Link to="/register" className="btn btn-primary text-white">
                            Register
                        </Link>
                    </>
                )}


                {user?.email && (
                    <>




                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="User"
                                        src={user?.photoURL || "https://i.ibb.co/2kR2zZy/default-user.png"}
                                    />
                                </div>
                            </label>

                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-56">
                                {/* User info */}
                                <li className="pointer-events-none">
                                    <div className="flex flex-col">
                                        <span className="font-bold">{user?.displayName || "User"}</span>
                                        <span className="text-xs opacity-70">{user?.email}</span>
                                    </div>
                                </li>

                                <div className="divider my-1"></div>

                                <li>
                                    <NavLink to="/dashboard/profile-settings">Profile Settings</NavLink>
                                </li>

                                <div className="divider my-1"></div>


                                <li>
                                    <button onClick={handleLogout} className="text-red-500">
                                        Log Out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;
