import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Contact = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            {/* Page Title */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-primary mb-4">Contact Us</h1>
                <p className="text-lg max-w-2xl mx-auto">
                    We are here to help you. Send us a message or reach us through our social channels.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div className="bg-base-100 p-8 rounded-lg shadow-lg">
                    <form className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="input input-bordered w-full "
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            className="input input-bordered w-full "
                        />
                        <textarea
                            placeholder="Your Message"
                            className="textarea textarea-bordered w-full"
                            rows={5}
                        ></textarea>
                        <button className="btn btn-primary mt-4">Send Message</button>
                    </form>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col gap-6 justify-center">
                    <div className="flex items-center gap-4">
                        <FaPhone className="text-primary text-2xl" />
                        <span className=" text-lg">+880 1234 567890</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <FaEnvelope className="text-primary text-2xl" />
                        <span className=" text-lg">support@etuitionbd.com</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <FaMapMarkerAlt className="text-primary text-2xl" />
                        <span className=" text-lg">Dhaka, Bangladesh</span>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-4 mt-6">
                        <a href="#" className="text-primary text-2xl hover:brightness-90 transition-all">
                            <FaFacebookF />
                        </a>
                        <a href="#" className="text-primary text-2xl hover:brightness-90 transition-all">
                            <FaInstagram />
                        </a>
                        <a href="#" className="text-primary text-2xl hover:brightness-90 transition-all">
                            <FaXTwitter />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
