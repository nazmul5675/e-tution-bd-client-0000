import React, { useContext, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import useAxios from "../../../Hooks/useAxios";
import { AuthContext } from "../../../Context/AuthContext";

const TutorOngoingTuitions = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxios();

    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const load = async () => {
            if (!user?.email) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const res = await axiosSecure.get(
                    `/applications?tutorEmail=${encodeURIComponent(user.email)}&status=approved`
                );
                setApps(Array.isArray(res.data) ? res.data : []);
            } catch (e) {
                console.error(e);
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: e?.response?.data?.message || "Could not load ongoing tuitions",
                    confirmButtonColor: "#ef4444",
                });
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [user?.email, axiosSecure]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return apps;
        return (apps || []).filter((a) => {
            const subject = a?.tuitionSnapshot?.subject || "";
            const location = a?.tuitionSnapshot?.location || "";
            const classLevel = a?.tuitionSnapshot?.classLevel || "";
            const studentName = a?.studentName || "";
            return (
                subject.toLowerCase().includes(q) ||
                location.toLowerCase().includes(q) ||
                classLevel.toLowerCase().includes(q) ||
                studentName.toLowerCase().includes(q)
            );
        });
    }, [apps, search]);

    if (!user?.email) {
        return (
            <div className="p-4 lg:p-8">
                <div className="alert alert-warning">
                    <span>Please login to view ongoing tuitions.</span>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="p-4 lg:p-8">
                <div className="min-h-[50vh] grid place-items-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-8">
            <title>Tutor Ongoing Tuitions</title>

            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-base-content">Tutor Ongoing Tuitions</h1>
                    <p className="text-base-content/70 mt-1">
                        These are the tuitions approved by students (after successful payment).
                    </p>
                </div>

                <input
                    className="input input-bordered w-full max-w-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder="Search by subject / location / class / student..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {filtered.length === 0 ? (
                <div className="mt-6 rounded-box border border-base-300 bg-base-300/70 backdrop-blur shadow-lg">
                    <div className="p-5">
                        <div className="alert">
                            <span>No ongoing tuitions found.</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {filtered.map((a) => {
                        const t = a?.tuitionSnapshot || {};
                        return (
                            <div
                                key={a._id}
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
                                        <span className="badge badge-success">Approved</span>
                                    </div>

                                    <div className="divider my-3"></div>

                                    <div className="space-y-2 text-sm text-base-content/80">
                                        <p>
                                            <span className="font-semibold text-base-content">Location:</span>{" "}
                                            {t.location || "—"}
                                        </p>
                                        <p>
                                            <span className="font-semibold text-base-content">Schedule:</span>{" "}
                                            {t.schedule || "—"}
                                        </p>
                                        <p>
                                            <span className="font-semibold text-base-content">Budget:</span>{" "}
                                            {t.budget ? `${t.budget} BDT` : "—"}
                                        </p>
                                        <p>
                                            <span className="font-semibold text-base-content">Student:</span>{" "}
                                            {a.studentName || "—"} ({a.studentEmail || "—"})
                                        </p>
                                        <p>
                                            <span className="font-semibold text-base-content">Your Salary:</span>{" "}
                                            {a.expectedSalary ? `${a.expectedSalary} BDT` : "—"}
                                        </p>
                                    </div>

                                    <div className="mt-5 flex gap-2 justify-end">
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() =>
                                                Swal.fire({
                                                    icon: "info",
                                                    title: "Contact",
                                                    text: `Email: ${a.studentEmail || "N/A"}`,
                                                })
                                            }
                                        >
                                            Contact Student
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TutorOngoingTuitions;