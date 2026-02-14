import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";
import useAxios from "../../Hooks/useAxios";

const LatestTutors = () => {
    const axiosSecure = useAxios();

    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {

                const res = await axiosSecure.get("/users");
                const users = Array.isArray(res.data) ? res.data : [];

                //  filter only tutors
                const onlyTutors = users.filter(
                    (u) => (u.role || "").toLowerCase() === "tutor"
                );

                // latest first 
                const sorted = [...onlyTutors].sort((a, b) => {
                    const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return db - da;
                });

                //  show only 3 tutors
                setTutors(sorted.slice(0, 3));
            } catch (e) {
                console.error(e);
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: e?.response?.data?.message || "Could not load latest tutors",
                });
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [axiosSecure]);

    if (loading) {
        return (
            <div className="min-h-[180px] grid place-items-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <section className="mt-10">
            {/*  Header */}
            <div className="flex items-end justify-between gap-3 flex-wrap">
                <div>
                    <h2 className="text-2xl font-bold">Latest Tutors</h2>
                    <p className="opacity-70 mt-1">
                        Recently joined tutors you can explore.
                    </p>
                </div>

                {/* link to all tutors page */}
                <Link to="/tutors" className="btn btn-outline btn-sm">
                    View All
                </Link>
            </div>

            {/*  Empty */}
            {tutors.length === 0 ? (
                <div className="card bg-base-100 shadow border mt-6">
                    <div className="card-body">
                        <div className="alert">
                            <span>No tutors found yet.</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
                    {tutors.map((t) => (
                        <div key={t._id || t.email} className="bg-white/60 p-4 rounded-3xl shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all relative">
                            <div className="card-body">
                                <div className="flex items-center gap-3">
                                    <div className="avatar">
                                        <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                            <img
                                                src={
                                                    t.photoURL ||
                                                    "https://i.ibb.co/2S1pQ7q/user.png"
                                                }
                                                alt={t.name || "Tutor"}
                                            />
                                        </div>
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="font-bold text-lg truncate">
                                            {t.name || "Unnamed Tutor"}
                                        </h3>
                                        <p className="text-sm opacity-70 truncate">{t.email || "—"}</p>
                                    </div>
                                </div>

                                <div className="divider my-2" />

                                <div className="space-y-2 text-sm">
                                    <p>
                                        <span className="font-semibold">Phone:</span>{" "}
                                        {t.phone || "—"}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Role:</span>{" "}
                                        <span className="badge badge-outline capitalize">
                                            {t.role || "tutor"}
                                        </span>
                                    </p>
                                </div>

                                <div className="mt-4 flex justify-end">

                                    <Link
                                        to={t._id ? `/tutors/${t._id}` : "/tutors"}
                                        className="btn btn-primary btn-sm"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default LatestTutors;
