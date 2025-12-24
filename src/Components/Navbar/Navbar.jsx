import React from 'react';
import { NavLink } from 'react-router';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

const Navbar = () => {
    const link = <>
        <li>
            <NavLink to="/" className={({ isActive }) => isActive ? "text-primary font-bold" : ""}>
                Home
            </NavLink>
        </li>
        <li>
            <NavLink to="/tuitions" className={({ isActive }) => isActive ? "text-primary font-bold" : ""}>
                Tuitions
            </NavLink>
        </li>
        <li>
            <NavLink to="/tutors" className={({ isActive }) => isActive ? "text-primary font-bold" : ""}>
                Tutors
            </NavLink>
        </li>
        <li>
            <NavLink to="/about" className={({ isActive }) => isActive ? "text-primary font-bold" : ""}>
                About
            </NavLink>
        </li>
        <li>
            <NavLink to="/contact" className={({ isActive }) => isActive ? "text-primary font-bold" : ""}>
                Contact
            </NavLink>
        </li>
    </>

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {link}
                    </ul>
                </div>
                <a className="btn btn-ghost text-xl text-primary font-black">eTuitionBd</a>
                <ThemeToggle></ThemeToggle>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {link}
                </ul>
            </div>
            <div className="navbar-end">
                <a className="btn text-primary bg-primary/20">Login</a>
            </div>
        </div>
    );
};

export default Navbar;