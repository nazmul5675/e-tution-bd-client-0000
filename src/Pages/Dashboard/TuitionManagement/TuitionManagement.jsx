import React, { useContext, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import useAxios from "../../../Hooks/useAxios";
import { AuthContext } from "../../../Context/AuthContext";

const badgeCls = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "approved") return "badge badge-success";
    if (s === "rejected") return "badge badge-error";
    return "badge badge-warning";
};

const TuitionManagement = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxios();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("pending"); // default: pending review
    const [updatingId, setUpdatingId] = useState(null);

    const fetchTuitions = async () => {
        setLoading(true);
        try {
            const qs = filterStatus === "all" ? "" : `?status=${encodeURIComponent(filterStatus)}`;
            const res = await axiosSecure.get(`/tuitions${qs}`);
            setItems(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: err?.response?.data?.message || "Could not load tuitions",
                confirmButtonColor: "#ef4444",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTuitions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStatus, user?.email]);

    const counts = useMemo(() => {
        const c = { all: items.length, pending: 0, approved: 0, rejected: 0 };
        items.forEach((t) => {
            const s = (t.status || "pending").toLowerCase();
            if (s === "approved") c.approved += 1;
            else if (s === "rejected") c.rejected += 1;
            else c.pending += 1;
        });
        return c;
    }, [items]);

    const updateStatus = async (tuitionId, nextStatus) => {
        const confirm = await Swal.fire({
            title: `${nextStatus === "approved" ? "Approve" : "Reject"} this tuition?`,
            text:
                nextStatus === "approved"
                    ? "This tuition will be visible to tutors for application."
                    : "This tuition will be marked as rejected and won’t be shown to tutors.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: `Yes, ${nextStatus}`,
            cancelButtonText: "Cancel",
            confirmButtonColor: nextStatus === "approved" ? "#16a34a" : "#ef4444",
            cancelButtonColor: "#6b7280",
        });

        if (!confirm.isConfirmed) return;

        setUpdatingId(tuitionId);
        try {
            await axiosSecure.patch(`/tuitions/${tuitionId}/status`, { status: nextStatus });

            //  update UI instantly
            setItems((prev) =>
                prev.map((t) =>
                    t._id === tuitionId ? { ...t, status: nextStatus, updatedAt: new Date().toISOString() } : t
                )
            );

            Swal.fire({
                icon: "success",
                title: "Updated!",
                text: `Tuition status changed to ${nextStatus}.`,
                confirmButtonColor: "#16a34a",
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: err?.response?.data?.message || "Status update failed",
                confirmButtonColor: "#ef4444",
            });
        } finally {
            setUpdatingId(null);
        }
    };

    if (!user?.email) {
        return (
            <div className="p-4 lg:p-8">
                <div className="alert alert-warning">
                    <span>Please login.</span>
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
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold">Tuition Management</h1>
                    <p className="opacity-70 mt-1">Approve or reject tuition posts before tutors can see them.</p>
                </div>

                <div className="flex items-center gap-3">


                    <select
                        className="select select-bordered"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <button className="btn btn-primary" onClick={fetchTuitions}>
                        Refresh
                    </button>
                </div>
            </div>
            <div className="stats shadow hidden w-full my-5 md:inline-flex">
                <div className="stat">
                    <div className="stat-title">Total</div>
                    <div className="stat-value text-lg">{counts.all}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Pending</div>
                    <div className="stat-value text-lg">{counts.pending}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Approved</div>
                    <div className="stat-value text-lg">{counts.approved}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Rejected</div>
                    <div className="stat-value text-lg">{counts.rejected}</div>
                </div>
            </div>
            <div className="card bg-base-100 shadow mt-6">
                <div className="card-body">
                    {items.length === 0 ? (
                        <div className="alert">
                            <span>No tuition posts found.</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Class</th>
                                        <th>Location</th>
                                        <th>Schedule</th>
                                        <th>Budget</th>
                                        <th>Student</th>
                                        <th>Status</th>
                                        <th className="text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((t) => {
                                        const status = (t.status || "pending").toLowerCase();
                                        const isPending = status === "pending";

                                        return (
                                            <tr key={t._id}>
                                                <td className="font-semibold">{t.subject || "—"}</td>
                                                <td>{t.classLevel || "—"}</td>
                                                <td>{t.location || "—"}</td>
                                                <td>{t.schedule || "—"}</td>
                                                <td>{t.budget ? `${t.budget} BDT` : "—"}</td>
                                                <td className="text-sm">{t.studentEmail || "—"}</td>
                                                <td>
                                                    <span className={badgeCls(t.status)}>{status}</span>
                                                </td>
                                                <td className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            className="btn btn-sm btn-success text-white"
                                                            disabled={!isPending || updatingId === t._id}
                                                            onClick={() => updateStatus(t._id, "approved")}
                                                        >
                                                            {updatingId === t._id ? "Updating..." : "Approve"}
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-error text-white"
                                                            disabled={!isPending || updatingId === t._id}
                                                            onClick={() => updateStatus(t._id, "rejected")}
                                                        >
                                                            {updatingId === t._id ? "Updating..." : "Reject"}
                                                        </button>
                                                    </div>

                                                    {!isPending && (
                                                        <p className="text-xs opacity-60 mt-1">
                                                            Only pending posts can be reviewed.
                                                        </p>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default TuitionManagement;