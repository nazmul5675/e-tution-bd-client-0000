import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import useAxios from "../../Hooks/useAxios";
import { Link } from "react-router";

const Tuitions = () => {
    const axiosSecure = useAxios();

    const [tuitions, setTuitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                // public approved jobs
                const res = await axiosSecure.get("/tuitions?status=approved");
                setTuitions(Array.isArray(res.data) ? res.data : []);
            } catch (e) {
                console.error(e);
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: e?.response?.data?.message || "Could not load tuitions",
                });
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [axiosSecure]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return tuitions;

        return (tuitions || []).filter((t) => {
            return (
                (t.subject || "").toLowerCase().includes(q) ||
                (t.location || "").toLowerCase().includes(q) ||
                (t.classLevel || "").toLowerCase().includes(q)
            );
        });
    }, [tuitions, search]);

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
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold">All Approved Tuitions</h1>
                    <p className="opacity-70 mt-1">
                        Browse approved tuition posts. Tutors can apply from details page.
                    </p>
                </div>

                <input
                    className="input input-bordered w-full max-w-xs"
                    placeholder="Search by subject / location / class..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {filtered.length === 0 ? (
                <div className="card bg-base-100 shadow mt-6">
                    <div className="card-body">
                        <div className="alert">
                            <span>No approved tuitions found.</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
                    {filtered.map((t) => (
                        <div key={t._id} className="bg-white/60 p-4 rounded-3xl shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all relative">
                            <div className="card-body">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="card-title">{t.subject}</h2>
                                        <p className="text-sm opacity-70">Class: {t.classLevel}</p>
                                    </div>
                                    <span className="badge badge-success">Approved</span>
                                </div>

                                <div className="divider my-2"></div>

                                <div className="space-y-2 text-sm">
                                    <p><span className="font-semibold">Location:</span> {t.location}</p>
                                    <p><span className="font-semibold">Schedule:</span> {t.schedule}</p>
                                    <p><span className="font-semibold">Budget:</span> {t.budget} BDT</p>
                                </div>

                                <div className="mt-4">
                                    <Link className="btn btn-sm btn-primary" to={`/tuitions/${t._id}`}>
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Tuitions;
