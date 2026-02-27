import React, { useContext, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Context/AuthContext";
import useAxios from "../../../Hooks/useAxios";

const formatMoney = (amountInSmallestUnit = 0, currency = "usd") => {
    const value = Number(amountInSmallestUnit || 0) / 100;
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

    const panelClass =
        "rounded-box border border-base-300 bg-base-300/70 backdrop-blur shadow-lg transition-all transform hover:scale-[1.02] hover:-translate-y-1";

    return (
        <div className="p-4 lg:p-8">
            <title>Revenue History</title>

            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-base-content">Revenue History</h1>
                    <p className="text-base-content/70 mt-1">
                        Your earnings from approved tuition payments.
                    </p>
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
                <div className={panelClass}>
                    <div className="p-5">
                        <p className="text-sm text-base-content/70">Total Earnings</p>
                        <p className="text-2xl font-bold text-base-content mt-1">
                            {formatMoney(stats.total, filtered?.[0]?.currency || "usd")}
                        </p>
                    </div>
                </div>

                <div className={panelClass}>
                    <div className="p-5">
                        <p className="text-sm text-base-content/70">Transactions</p>
                        <p className="text-2xl font-bold text-base-content mt-1">{stats.count}</p>
                    </div>
                </div>

                <div className={panelClass}>
                    <div className="p-5">
                        <p className="text-sm text-base-content/70">Latest Payment</p>
                        <p className="text-base font-semibold text-base-content mt-1">
                            {stats.latest ? stats.latest.toLocaleString() : "—"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="mt-6 rounded-box border border-base-300 bg-base-300/70 backdrop-blur shadow-lg">
                <div className="p-5">
                    {filtered.length === 0 ? (
                        <div className="alert">
                            <span>No payments found.</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100/60">
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
                                            <td className="whitespace-nowrap">
                                                {p.createdAt ? new Date(p.createdAt).toLocaleString() : "—"}
                                            </td>
                                            <td className="max-w-[220px] truncate">{p.studentEmail || "—"}</td>
                                            <td className="max-w-[220px] truncate">{p.tuitionId || "—"}</td>
                                            <td className="font-semibold whitespace-nowrap">
                                                {formatMoney(p.amount, p.currency || "usd")}
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge ${p.paymentStatus === "paid" ? "badge-success" : "badge-warning"
                                                        }`}
                                                >
                                                    {p.paymentStatus || "unknown"}
                                                </span>
                                            </td>
                                            <td className="text-xs text-base-content/80 max-w-[260px] truncate">
                                                {p.stripeSessionId || "—"}
                                            </td>
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