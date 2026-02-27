import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxios from "../../Hooks/useAxios";

import {
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaFacebookF,
    FaInstagram,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Contact = () => {
    const axiosSecure = useAxios();
    const [sending, setSending] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = async (data) => {
        setSending(true);
        try {
            await axiosSecure.post("/contacts", {
                name: data.name,
                email: data.email,
                message: data.message,
            });

            Swal.fire({
                icon: "success",
                title: "Message Sent!",
                text: "Your message has been saved successfully.",
                confirmButtonColor: "#16a34a",
            });

            reset();
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: err?.response?.data?.message || "Could not send message",
                confirmButtonColor: "#ef4444",
            });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <title>Contact</title>

            {/* Page Title */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-primary mb-4">Contact Us</h1>
                <p className="text-lg max-w-2xl mx-auto text-base-content/80">
                    We are here to help you. Send us a message or reach us through our social channels.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div className="rounded-box border border-base-300 bg-base-300/70 backdrop-blur shadow-lg p-8">
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                        {/* Name */}
                        <div>
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="input input-bordered w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                {...register("name", { required: "Name is required" })}
                            />
                            {errors.name && (
                                <p className="text-error text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="input input-bordered w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email address" },
                                })}
                            />
                            {errors.email && (
                                <p className="text-error text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Message */}
                        <div>
                            <textarea
                                placeholder="Your Message"
                                className="textarea textarea-bordered w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                rows={5}
                                {...register("message", { required: "Message is required" })}
                            />
                            {errors.message && (
                                <p className="text-error text-sm mt-1">{errors.message.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary mt-2 w-full text-primary-content"
                            disabled={sending}
                        >
                            {sending ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col gap-6 justify-center text-base-content">
                    <div className="flex items-center gap-4">
                        <FaPhone className="text-primary text-2xl" />
                        <span className="text-lg">+880 1234 567890</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <FaEnvelope className="text-primary text-2xl" />
                        <span className="text-lg">support@etuitionbd.com</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <FaMapMarkerAlt className="text-primary text-2xl" />
                        <span className="text-lg">Dhaka, Bangladesh</span>
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