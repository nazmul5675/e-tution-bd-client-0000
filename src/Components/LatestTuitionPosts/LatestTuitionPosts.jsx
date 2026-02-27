import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";
import useAxios from "../../Hooks/useAxios";
import TuitionCardSkeleton from "../Skeletons/TuitionCardSkeleton";


const LatestTuitionPosts = () => {
    const axiosSecure = useAxios();

    const [tuitions, setTuitions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                // only approved tuitions should be public
                const res = await axiosSecure.get("/tuitions?status=approved");

                const arr = Array.isArray(res.data) ? res.data : [];

                // show latest first + only 3 items
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

    return (
        <section className="mt-10">
            {/* Header */}
            <div className="flex items-end justify-between gap-3 flex-wrap">
                <div>
                    <p className="text-base-content/70 mt-1">
                        Recently approved tuition requests from students.
                    </p>
                </div>

                <Link to="/tuitions" className="btn btn-outline btn-sm">
                    View All
                </Link>
            </div>

            {/* Loading: use reusable skeleton cards */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    <TuitionCardSkeleton />
                    <TuitionCardSkeleton />
                    <TuitionCardSkeleton />
                </div>
            ) : tuitions.length === 0 ? (
                /* Empty State */
                <div className="mt-6 rounded-box border border-base-300 bg-base-300/70 backdrop-blur shadow-lg">
                    <div className="p-5">
                        <div className="alert">
                            <span>No approved tuitions found yet.</span>
                        </div>
                    </div>
                </div>
            ) : (
                /* Cards Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {tuitions.map((t) => (
                        <div
                            key={t._id}
                            className="rounded-box border border-base-300 bg-base-300/70 backdrop-blur shadow-lg transform hover:scale-[1.02] hover:-translate-y-1 transition-all"
                        >
                            <div className="p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-lg text-base-content line-clamp-1">
                                            {t.subject || "Tuition"}
                                        </h3>
                                        <p className="text-sm text-base-content/70 mt-1">
                                            Class: {t.classLevel || "—"}
                                        </p>
                                    </div>

                                    <span className="badge badge-success capitalize">
                                        {t.status || "approved"}
                                    </span>
                                </div>

                                <div className="divider my-3" />

                                <div className="space-y-2 text-sm text-base-content/80">
                                    <p>
                                        <span className="font-semibold text-base-content">
                                            Location:
                                        </span>{" "}
                                        {t.location || "—"}
                                    </p>
                                    <p>
                                        <span className="font-semibold text-base-content">
                                            Schedule:
                                        </span>{" "}
                                        {t.schedule || "—"}
                                    </p>
                                    <p>
                                        <span className="font-semibold text-base-content">
                                            Budget:
                                        </span>{" "}
                                        {t.budget ? `${t.budget} BDT` : "—"}
                                    </p>
                                    <p className="text-base-content/70">
                                        Posted by: {t.studentName || "Student"}
                                    </p>
                                </div>

                                <div className="mt-5 flex justify-end">
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