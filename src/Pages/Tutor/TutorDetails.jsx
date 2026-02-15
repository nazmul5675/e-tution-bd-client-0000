import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import Swal from "sweetalert2";
import useAxios from "../../Hooks/useAxios";

const TutorDetails = () => {
    const { id } = useParams();
    const axiosSecure = useAxios();

    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await axiosSecure.get(`/users/${id}`);
                setTutor(res.data);
            } catch (e) {
                console.error(e);
                Swal.fire({
                    icon: "error",
                    title: "Failed",

                    text: e?.response?.data?.message || "Could not load tutor details",
                });
            } finally {
                setLoading(false);
            }
        };

        if (id) load();
    }, [id, axiosSecure]);

    if (loading) {
        return (
            <div className="p-4 lg:p-8">
                <div className="min-h-[50vh] grid place-items-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            </div>
        );
    }

    if (!tutor) {
        return (
            <div className="p-4 lg:p-8">
                <div className="alert alert-warning">
                    <span>Tutor not found.</span>
                </div>
                <Link to="/tutors" className="btn btn-link mt-4">Back</Link>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-8 max-w-4xl mx-auto">
            <Link to="/tutors" className="btn btn-sm btn-primary">← Back</Link>

            <div className="bg-white/60 p-5 rounded-3xl shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all relative mt-5">
                <div className="card-body">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="avatar">
                            <div className="w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img
                                    src={tutor?.photoURL || "https://i.ibb.co/7QpKsCX/user.png"}
                                    alt="Tutor"
                                />
                            </div>
                        </div>

                        <div className="flex-1">
                            <h1 className="text-2xl font-bold">{tutor?.name || "Tutor"}</h1>
                            <p className="opacity-70 mt-1">{tutor?.email}</p>

                            <div className="mt-3 flex flex-wrap gap-2">
                                <span className="badge badge-primary badge-outline">
                                    {(tutor?.role || "tutor").toUpperCase()}
                                </span>
                                {tutor?.status && (
                                    <span className="badge badge-ghost">{tutor.status}</span>
                                )}
                                {tutor?.isVerified && (
                                    <span className="badge badge-success">Verified</span>
                                )}
                            </div>

                            <div className="divider my-4" />

                            <div className="space-y-2 text-sm">
                                <p>
                                    <span className="font-semibold">Phone:</span>{" "}
                                    {tutor?.phone || "Not provided"}
                                </p>
                                <p>
                                    <span className="font-semibold">Joined:</span>{" "}
                                    {tutor?.createdAt ? new Date(tutor.createdAt).toLocaleString() : "—"}
                                </p>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-2">
                                <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                        Swal.fire({
                                            icon: "info",
                                            title: "Contact Tutor",
                                            html: `
                        <div style="text-align:left">
                          <p><b>Email:</b> ${tutor?.email || "N/A"}</p>
                          <p><b>Phone:</b> ${tutor?.phone || "N/A"}</p>
                        </div>
                      `,
                                            confirmButtonText: "OK",
                                            confirmButtonColor: "#7cb138",
                                        })
                                    }
                                >
                                    Contact
                                </button>


                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default TutorDetails;
