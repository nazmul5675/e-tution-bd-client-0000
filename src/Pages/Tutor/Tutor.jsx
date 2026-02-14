import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import useAxios from "../../Hooks/useAxios";
import { NavLink } from "react-router";

const Tutor = () => {
    const axiosSecure = useAxios();

    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");


    useEffect(() => {
        const loadTutors = async () => {
            setLoading(true);
            try {
                const res = await axiosSecure.get("/users");
                const users = Array.isArray(res.data) ? res.data : [];


                const onlyTutors = users.filter(
                    (u) => (u?.role || "").toLowerCase() === "tutor"
                );

                setTutors(onlyTutors);
            } catch (e) {
                console.error(e);
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: e?.response?.data?.message || "Could not load tutors",
                });
            } finally {
                setLoading(false);
            }
        };

        loadTutors();
    }, [axiosSecure]);


    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return tutors;

        return tutors.filter((t) => {
            const name = (t?.name || "").toLowerCase();
            const email = (t?.email || "").toLowerCase();
            const phone = (t?.phone || "").toLowerCase();
            return name.includes(q) || email.includes(q) || phone.includes(q);
        });
    }, [tutors, search]);

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
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold">Tutors</h1>
                    <p className="opacity-70 mt-1">
                        Browse available tutors on the platform.
                    </p>
                </div>

                <input
                    className="input input-bordered w-full max-w-xs"
                    placeholder="Search by name / email / phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {filtered.length === 0 ? (
                <div className="card bg-base-100 shadow mt-6">
                    <div className="card-body">
                        <div className="alert">
                            <span>No tutors found.</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
                    {filtered.map((t) => (
                        <div key={t._id} className="bg-white/60 p-4 rounded-3xl shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all relative">
                            <div className="card-body">
                                <div className="flex items-start gap-4">
                                    <div className="avatar">
                                        <div className="w-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                            <img
                                                src={
                                                    t?.photoURL ||
                                                    "https://i.ibb.co/7QpKsCX/user.png"
                                                }
                                                alt="Tutor"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h2 className="font-bold text-lg">{t?.name || "Tutor"}</h2>
                                        <p className="text-sm opacity-70">{t?.email}</p>
                                        {t?.phone && (
                                            <p className="text-sm opacity-70">Phone: {t.phone}</p>
                                        )}
                                        <div className="mt-2">
                                            <span className="badge badge-primary badge-outline">
                                                Tutor
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="divider my-3" />


                                <div className="flex justify-end">
                                    <NavLink to={`/tutors/${t._id}`} className="btn btn-sm btn-primary">
                                        View Details
                                    </NavLink>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Tutor;
