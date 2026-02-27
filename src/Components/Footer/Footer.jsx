import React from "react";
import { NavLink } from "react-router";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { SiX } from "react-icons/si";

const Footer = () => {
    const link = (
        <>
            <li>
                <NavLink to="/" className={({ isActive }) => (isActive ? "text-primary font-bold" : "text-base-content/80 hover:text-primary")}>
                    Home
                </NavLink>
            </li>
            <li>
                <NavLink to="/tuitions" className={({ isActive }) => (isActive ? "text-primary font-bold" : "text-base-content/80 hover:text-primary")}>
                    Tuitions
                </NavLink>
            </li>
            <li>
                <NavLink to="/tutors" className={({ isActive }) => (isActive ? "text-primary font-bold" : "text-base-content/80 hover:text-primary")}>
                    Tutors
                </NavLink>
            </li>
            <li>
                <NavLink to="/about" className={({ isActive }) => (isActive ? "text-primary font-bold" : "text-base-content/80 hover:text-primary")}>
                    About
                </NavLink>
            </li>
            <li>
                <NavLink to="/contact" className={({ isActive }) => (isActive ? "text-primary font-bold" : "text-base-content/80 hover:text-primary")}>
                    Contact
                </NavLink>
            </li>
        </>
    );

    return (
        <footer className="mt-10 border-t border-base-300 bg-base-300/70 backdrop-blur text-base-content">
            <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* About Section */}
                <div>
                    <h2 className="text-xl font-bold text-primary mb-4">About eTuitionBd</h2>
                    <p className="text-sm text-base-content/80">
                        eTuitionBd is a platform connecting students and qualified tutors.
                        Find tuitions easily, track payments, and manage classes with transparency.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h2 className="text-xl font-bold text-primary mb-4">Quick Links</h2>
                    <ul className="space-y-2">{link}</ul>
                </div>

                {/* Contact & Social Media */}
                <div>
                    <h2 className="text-xl font-bold text-primary mb-4">Contact Us</h2>
                    <p className="text-sm text-base-content/80">Email: support@etuitionbd.com</p>
                    <p className="text-sm text-base-content/80">Phone: +880 1234 567890</p>

                    <div className="flex mt-4 space-x-4 text-base-content/70">
                        <a href="#" className="hover:text-primary transition-colors">
                            <SiX size={22} />
                        </a>
                        <a href="#" className="hover:text-primary transition-colors">
                            <FaFacebookF size={20} />
                        </a>
                        <a href="#" className="hover:text-primary transition-colors">
                            <FaInstagram size={20} />
                        </a>
                        <a href="#" className="hover:text-primary transition-colors">
                            <FaLinkedinIn size={20} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-base-300 text-center text-sm py-4 text-base-content/70">
                &copy; {new Date().getFullYear()} eTuitionBd. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;