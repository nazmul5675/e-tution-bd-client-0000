import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";
import useAxios from "../../Hooks/useAxios";

const LatestTuitionPosts = () => {
    const axiosSecure = useAxios();

    const [tuitions, setTuitions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                //  only approved tuitions should be public
                const res = await axiosSecure.get("/tuitions?status=approved");

                const arr = Array.isArray(res.data) ? res.data : [];

                //  show latest first + only 3 items
                const latest3 = arr
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 3);

                setTuitions(latest3);
            } catch (e) {
                console.error(e);
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: e?.response?.data?.message || "Could not load latest tuitions",
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
                    <h2 className="text-2xl font-bold">Latest Tuition Posts</h2>
                    <p className="opacity-70 mt-1">
                        Recently approved tuition requests from students.
                    </p>
                </div>

                {/*  CHANGE: link to all tuitions page */}
                <Link to="/tuitions" className="btn btn-outline btn-sm">
                    View All
                </Link>
            </div>

            {/* Empty State */}
            {tuitions.length === 0 ? (
                <div className="bg-white/60 p-4 rounded-3xl shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all relative mt-6">
                    <div className="card-body">
                        <div className="alert">
                            <span>No approved tuitions found yet.</span>
                        </div>
                    </div>
                </div>
            ) : (
                // Cards Grid
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {tuitions.map((t) => (
                        <div key={t._id} className="bg-white/60 p-4 rounded-3xl shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all relative mt-6">
                            <div className="card-body">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="font-bold text-lg line-clamp-1">
                                            {t.subject || "Tuition"}
                                        </h3>
                                        <p className="text-sm opacity-70 mt-1">
                                            Class: {t.classLevel || "—"}
                                        </p>
                                    </div>
                                    <span className="badge badge-success capitalize">
                                        {t.status || "approved"}
                                    </span>
                                </div>

                                <div className="divider my-2" />

                                <div className="space-y-2 text-sm">
                                    <p>
                                        <span className="font-semibold">Location:</span>{" "}
                                        {t.location || "—"}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Schedule:</span>{" "}
                                        {t.schedule || "—"}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Budget:</span>{" "}
                                        {t.budget ? `${t.budget} BDT` : "—"}
                                    </p>
                                    <p className="opacity-70">
                                        Posted by: {t.studentName || "Student"}
                                    </p>
                                </div>

                                <div className="mt-4 flex justify-end">

                                    <Link to={`/tuitions/${t._id}`} className="btn btn-primary btn-sm">
                                        View Details
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

export default LatestTuitionPosts;
