import React, { useContext, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Context/AuthContext";
import useAxios from "../../../Hooks/useAxios";
import { useNavigate } from "react-router";

const badge = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "approved") return "badge badge-success";
    if (s === "rejected") return "badge badge-error";
    return "badge badge-warning";
};

const AppliedTutors = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxios();
    const navigate = useNavigate();

    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rejectingId, setRejectingId] = useState(null);

    const [showOnlyPending, setShowOnlyPending] = useState(false);

    const fetchApps = async () => {
        if (!user?.email) return;
        setLoading(true);
        try {
            const res = await axiosSecure.get(
                `/applications?studentEmail=${encodeURIComponent(user.email)}`
            );
            setApps(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            console.error(e);
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: "Could not load applied tutors.",
                confirmButtonColor: "#ef4444",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApps();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.email]);

    const list = useMemo(() => {
        if (!showOnlyPending) return apps;
        return (apps || []).filter((a) => (a.status || "").toLowerCase() === "pending");
    }, [apps, showOnlyPending]);

    const handleReject = async (appId) => {
        const confirm = await Swal.fire({
            title: "Reject this tutor?",
            text: "This application will be marked as rejected.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, reject",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
        });

        if (!confirm.isConfirmed) return;

        setRejectingId(appId);
        try {
            await axiosSecure.patch(`/applications/${appId}/reject`);
            setApps((prev) =>
                prev.map((a) => (a._id === appId ? { ...a, status: "rejected" } : a))
            );

            Swal.fire({
                icon: "success",
                title: "Rejected!",
                text: "Tutor application rejected successfully.",
                confirmButtonColor: "#16a34a",
            });
        } catch (e) {
            console.error(e);
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: e?.response?.data?.message || "Reject failed.",
                confirmButtonColor: "#ef4444",
            });
        } finally {
            setRejectingId(null);
        }
    };

    const handleApproveAndPay = async (app) => {
        if ((app.status || "").toLowerCase() !== "pending") return;

        const confirm = await Swal.fire({
            title: "Approve & Pay?",
            text: "You will be redirected to payment checkout. Tutor will be approved only after successful payment.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Continue to payment",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#6b7280",
        });

        if (!confirm.isConfirmed) return;

        // Later: call backend to create Stripe session and redirect
        // For now: go to your Payments page with applicationId
        navigate(`/dashboard/payments?applicationId=${app._id}`);
    };

    if (!user?.email) {
        return (
            <div className="p-4 lg:p-8">
                <div className="alert alert-warning">
                    <span>Please login to view applied tutors.</span>
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
                Applied Tutors
            </title>
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold">Applied Tutors</h1>
                    <p className="opacity-70 mt-1">
                        View tutor applications for your posted tuitions. Approve requires payment.
                    </p>
                </div>

                <label className="label cursor-pointer gap-3">
                    <span className="label-text font-semibold">Show only pending</span>
                    <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={showOnlyPending}
                        onChange={(e) => setShowOnlyPending(e.target.checked)}
                    />
                </label>
            </div>

            <div className="card bg-base-100 shadow mt-6">
                <div className="card-body">
                    {list.length === 0 ? (
                        <div className="alert">
                            <span>No applications found{showOnlyPending ? " (pending only)" : ""}.</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>Tutor</th>
                                        <th>Qualifications</th>
                                        <th>Experience</th>
                                        <th>Expected Salary</th>
                                        <th>Status</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.map((a) => {
                                        const isPending = (a.status || "").toLowerCase() === "pending";
                                        return (
                                            <tr key={a._id}>
                                                <td>
                                                    <div className="flex items-center gap-3">
                                                        <div className="avatar">
                                                            <div className="w-10 rounded-full">
                                                                <img
                                                                    src={a.tutorPhoto || "https://i.ibb.co/2kR2z3F/user.png"}
                                                                    alt="tutor"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold">{a.tutorName || "Tutor"}</div>
                                                            <div className="text-sm opacity-70">{a.tutorEmail}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{a.qualifications || "—"}</td>
                                                <td>{a.experience || "—"}</td>
                                                <td>{a.expectedSalary ? `${a.expectedSalary} BDT` : "—"}</td>
                                                <td>
                                                    <span className={badge(a.status)}>{a.status || "pending"}</span>
                                                </td>
                                                <td className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            disabled={!isPending}
                                                            onClick={() => handleApproveAndPay(a)}
                                                        >
                                                            Approve & Pay
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-error text-white"
                                                            disabled={!isPending || rejectingId === a._id}
                                                            onClick={() => handleReject(a._id)}
                                                        >
                                                            {rejectingId === a._id ? "Rejecting..." : "Reject"}
                                                        </button>
                                                    </div>
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

export default AppliedTutors;
