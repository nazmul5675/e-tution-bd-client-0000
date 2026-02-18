import React, { useContext, useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router";
import Swal from "sweetalert2";
import useAxios from "../../../Hooks/useAxios";
import { AuthContext } from "../../../Context/AuthContext";

const roleCards = {
    student: [
        { to: "/dashboard/my-tuitions", title: "My Tuitions", desc: "See your approved/ongoing tuitions." },
        { to: "/dashboard/post-tuition", title: "Post New Tuition", desc: "Create a new tuition post for admin approval." },
        { to: "/dashboard/applied-tutors", title: "Applied Tutors", desc: "Review tutor applications and approve with payment." },
        { to: "/dashboard/payments", title: "Payments", desc: "View your payment history." },
        { to: "/dashboard/profile-settings", title: "Profile Settings", desc: "Update your name/photo/phone." },
    ],
    tutor: [
        { to: "/dashboard/my-applications", title: "My Applications", desc: "Track your application status." },
        { to: "/dashboard/tutor-ongoing-tuitions", title: "Ongoing Tuitions", desc: "Tuitions where you are approved." },
        { to: "/dashboard/revenue-history", title: "Revenue History", desc: "View your earnings & transactions." },
        { to: "/dashboard/profile-settings", title: "Profile Settings", desc: "Update your profile info." },
    ],
    admin: [
        { to: "/dashboard/user-management", title: "User Management", desc: "Manage users, roles, and accounts." },
        { to: "/dashboard/tuition-management", title: "Tuition Management", desc: "Approve/reject tuition posts." },
        { to: "/dashboard/reports-analytics", title: "Reports & Analytics", desc: "View platform earnings and transactions." },

    ],
};

const DashboardHome = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxios();

    const [role, setRole] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);


    const [contactMessages, setContactMessages] = useState([]);
    const [newMsgCount, setNewMsgCount] = useState(0);

    const cards = useMemo(() => {
        const r = (role || "student").toLowerCase();
        return roleCards[r] || roleCards.student;
    }, [role]);

    useEffect(() => {
        const load = async () => {
            if (!user?.email) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {

                const profileRes = await axiosSecure.get(
                    `/users/profile?email=${encodeURIComponent(user.email)}`
                );
                const dbRole = (profileRes?.data?.role || "student").toLowerCase();
                setRole(dbRole);


                if (dbRole === "student") {
                    const [tuitionsRes, appsRes, paysRes] = await Promise.all([
                        axiosSecure.get(`/tuitions?studentEmail=${encodeURIComponent(user.email)}&status=approved`),
                        axiosSecure.get(`/applications?studentEmail=${encodeURIComponent(user.email)}`),
                        axiosSecure.get(`/payments?studentEmail=${encodeURIComponent(user.email)}`),
                    ]);

                    setStats({
                        a: { label: "Approved Tuitions", value: (tuitionsRes.data || []).length },
                        b: { label: "Applications Received", value: (appsRes.data || []).length },
                        c: { label: "Payments", value: (paysRes.data || []).length },
                    });

                    setContactMessages([]);
                    setNewMsgCount(0);
                }


                if (dbRole === "tutor") {
                    const [appsRes, paysRes] = await Promise.all([
                        axiosSecure.get(`/applications?tutorEmail=${encodeURIComponent(user.email)}`),
                        axiosSecure.get(`/payments?tutorEmail=${encodeURIComponent(user.email)}`),
                    ]);

                    setStats({
                        a: { label: "My Applications", value: (appsRes.data || []).length },
                        b: { label: "Payments Received", value: (paysRes.data || []).length },
                        c: { label: "Ongoing Tuitions", value: "API needed" },
                    });

                    setContactMessages([]);
                    setNewMsgCount(0);
                }


                if (dbRole === "admin") {
                    const [usersRes, tuitionsRes, paysRes, newContactsRes, latestContactsRes] = await Promise.all([
                        axiosSecure.get(`/users`),
                        axiosSecure.get(`/tuitions`),
                        axiosSecure.get(`/payments`),


                        axiosSecure.get(`/contacts?status=new&limit=9999`),


                        axiosSecure.get(`/contacts?limit=5`),
                    ]);

                    setStats({
                        a: { label: "Total Users", value: (usersRes.data || []).length },
                        b: { label: "Total Tuitions", value: (tuitionsRes.data || []).length },
                        c: { label: "Transactions", value: (paysRes.data || []).length },


                        d: { label: "New Messages", value: (newContactsRes.data || []).length },
                    });

                    setNewMsgCount((newContactsRes.data || []).length);
                    setContactMessages(Array.isArray(latestContactsRes.data) ? latestContactsRes.data : []);
                }
            } catch (e) {
                console.error(e);
                Swal.fire({
                    icon: "error",
                    title: "Dashboard failed",
                    text: e?.response?.data?.message || "Could not load dashboard info.",
                });
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [user?.email, axiosSecure]);

    //  mark a message as "seen"
    const markSeen = async (id) => {
        try {
            await axiosSecure.patch(`/contacts/${id}/status`, { status: "seen" });

            // update UI instantly
            setContactMessages((prev) =>
                prev.map((m) => (m._id === id ? { ...m, status: "seen" } : m))
            );
            setNewMsgCount((prev) => Math.max(0, prev - 1));

            Swal.fire({
                icon: "success",
                title: "Marked as seen",
                confirmButtonColor: "#16a34a",
            });
        } catch (e) {
            console.error(e);
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: e?.response?.data?.message || "Could not update message",
                confirmButtonColor: "#ef4444",
            });
        }
    };

    if (!user?.email) {
        return (
            <div className="p-4 lg:p-8">
                <div className="alert alert-warning">
                    <span>Please login to view dashboard.</span>
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
            <title>
                Dashboard Home
            </title>
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">Welcome, {user?.displayName || "User"} 👋</h1>
                <p className="opacity-70">
                    Role: <span className="font-semibold capitalize">{role || "student"}</span>
                </p>
            </div>

            {/*  Stats cards */}
            {stats && (
                <div className={`grid grid-cols-1 md:grid-cols-3 ${role === "admin" ? "xl:grid-cols-4" : ""} gap-4 mt-6`}>
                    {Object.values(stats).map((s, idx) => (
                        <div key={idx} className="card bg-base-100 shadow">
                            <div className="card-body">
                                <p className="text-sm opacity-70">{s.label}</p>
                                <p className="text-3xl font-bold mt-1">{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Role cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
                {cards.map((c) => (
                    <NavLink key={c.to} to={c.to} className="card bg-base-100 shadow hover:shadow-lg transition">
                        <div className="card-body">
                            <h2 className="card-title">{c.title}</h2>
                            <p className="opacity-70">{c.desc}</p>
                            <div className="mt-3">
                                <span className="btn btn-sm btn-primary">Open</span>
                            </div>
                        </div>
                    </NavLink>
                ))}
            </div>


            {role === "admin" && (
                <div className="card bg-base-100 shadow mt-8">
                    <div className="card-body">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <h2 className="text-xl font-bold">
                                Latest Contact Messages{" "}
                                {newMsgCount > 0 && <span className="badge badge-success ml-2">{newMsgCount} new</span>}
                            </h2>


                        </div>

                        {contactMessages.length === 0 ? (
                            <div className="alert mt-3">
                                <span>No contact messages yet.</span>
                            </div>
                        ) : (
                            <div className="overflow-x-auto mt-3">
                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Message</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contactMessages.map((m) => (
                                            <tr key={m._id}>
                                                <td className="whitespace-nowrap">
                                                    {m.createdAt ? new Date(m.createdAt).toLocaleString() : "—"}
                                                </td>
                                                <td className="max-w-[160px] truncate">{m.name}</td>
                                                <td className="max-w-[220px] truncate">{m.email}</td>
                                                <td className="max-w-[360px] truncate">{m.message}</td>
                                                <td>
                                                    <span className={`badge ${m.status === "new" ? "badge-success" : "badge-ghost"}`}>
                                                        {m.status || "—"}
                                                    </span>
                                                </td>
                                                <td>
                                                    {m.status === "new" ? (
                                                        <button className="btn btn-xs btn-success" onClick={() => markSeen(m._id)}>
                                                            Mark Seen
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs opacity-60">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardHome;
