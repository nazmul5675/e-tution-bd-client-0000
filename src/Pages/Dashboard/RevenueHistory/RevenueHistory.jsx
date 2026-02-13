import React, { useContext, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Context/AuthContext";
import useAxios from "../../../Hooks/useAxios";

const formatMoney = (amountInSmallestUnit = 0, currency = "usd") => {
    const value = Number(amountInSmallestUnit || 0) / 100; // cents -> dollars
    try {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: (currency || "usd").toUpperCase(),
        }).format(value);
    } catch {
        return `${value.toFixed(2)} ${(currency || "usd").toUpperCase()}`;
    }
};

const RevenueHistory = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxios();

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState("all"); // all | 30 | 7

    useEffect(() => {
        const load = async () => {
            if (!user?.email) return;

            setLoading(true);
            try {
                const res = await axiosSecure.get(
                    `/payments?tutorEmail=${encodeURIComponent(user.email)}`
                );
                setPayments(Array.isArray(res.data) ? res.data : []);
            } catch (e) {
                console.error(e);
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: e?.response?.data?.message || "Could not load revenue history.",
                    confirmButtonColor: "#ef4444",
                });
            } finally {
                setLoading(false);
            }
        };

        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.email]);

    const filtered = useMemo(() => {
        if (range === "all") return payments;

        const days = Number(range);
        const since = Date.now() - days * 24 * 60 * 60 * 1000;

        return (payments || []).filter((p) => {
            const t = new Date(p.createdAt || p.date || 0).getTime();
            return Number.isFinite(t) && t >= since;
        });
    }, [payments, range]);

    const stats = useMemo(() => {
        const total = filtered.reduce((sum, p) => sum + Number(p.amount || 0), 0);
        const count = filtered.length;

        const latest = filtered[0]?.createdAt ? new Date(filtered[0].createdAt) : null;
        return { total, count, latest };
    }, [filtered]);

    if (!user?.email) {
        return (
            <div className="p-4 lg:p-8">
                <div className="alert alert-warning">
                    <span>Please login to view revenue history.</span>
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
                    <h1 className="text-2xl font-bold">Revenue History</h1>
                    <p className="opacity-70 mt-1">Your earnings from approved tuition payments.</p>
                </div>

                <div className="join">
                    <button
                        className={`btn join-item ${range === "all" ? "btn-primary" : "btn-ghost"}`}
                        onClick={() => setRange("all")}
                    >
                        All
                    </button>
                    <button
                        className={`btn join-item ${range === "30" ? "btn-primary" : "btn-ghost"}`}
                        onClick={() => setRange("30")}
                    >
                        Last 30 days
                    </button>
                    <button
                        className={`btn join-item ${range === "7" ? "btn-primary" : "btn-ghost"}`}
                        onClick={() => setRange("7")}
                    >
                        Last 7 days
                    </button>
                </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="card bg-base-100 shadow border">
                    <div className="card-body">
                        <p className="text-sm opacity-70">Total Earnings</p>
                        <p className="text-2xl font-bold">
                            {formatMoney(stats.total, filtered?.[0]?.currency || "usd")}
                        </p>
                    </div>
                </div>

                <div className="card bg-base-100 shadow border">
                    <div className="card-body">
                        <p className="text-sm opacity-70">Transactions</p>
                        <p className="text-2xl font-bold">{stats.count}</p>
                    </div>
                </div>

                <div className="card bg-base-100 shadow border">
                    <div className="card-body">
                        <p className="text-sm opacity-70">Latest Payment</p>
                        <p className="text-base font-semibold">
                            {stats.latest ? stats.latest.toLocaleString() : "—"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="card bg-base-100 shadow mt-6">
                <div className="card-body">
                    {filtered.length === 0 ? (
                        <div className="alert">
                            <span>No payments found.</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Student</th>
                                        <th>Tuition</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Stripe Session</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((p) => (
                                        <tr key={p._id}>
                                            <td>{p.createdAt ? new Date(p.createdAt).toLocaleString() : "—"}</td>
                                            <td>{p.studentEmail || "—"}</td>
                                            <td>{p.tuitionId || "—"}</td>
                                            <td className="font-semibold">
                                                {formatMoney(p.amount, p.currency || "usd")}
                                            </td>
                                            <td>
                                                <span className={`badge ${p.paymentStatus === "paid" ? "badge-success" : "badge-warning"}`}>
                                                    {p.paymentStatus || "unknown"}
                                                </span>
                                            </td>
                                            <td className="text-xs opacity-80">{p.stripeSessionId || "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RevenueHistory;