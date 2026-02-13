import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import useAxios from "../../../Hooks/useAxios";

const money = (amountSmallestUnit, currency = "usd") => {
    // Stripe gives amount_total in smallest unit (ex: cents)
    const n = Number(amountSmallestUnit || 0);
    const major = n / 100;
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currency.toUpperCase(),
    }).format(major);
};

const ReportsAndAnalytics = () => {
    const axiosSecure = useAxios();

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [q, setQ] = useState("");
    const [status, setStatus] = useState("all"); // all | paid | unpaid | ...
    const [sort, setSort] = useState("newest"); // newest | oldest | amountHigh | amountLow

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const res = await axiosSecure.get("/payments"); // admin = all
            setPayments(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            console.error(e);
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: e?.response?.data?.message || "Could not load payments",
                confirmButtonColor: "#ef4444",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filtered = useMemo(() => {
        const text = q.trim().toLowerCase();

        let arr = [...payments];

        if (status !== "all") {
            arr = arr.filter((p) => (p.paymentStatus || "").toLowerCase() === status);
        }

        if (text) {
            arr = arr.filter((p) => {
                const sEmail = (p.studentEmail || "").toLowerCase();
                const tEmail = (p.tutorEmail || "").toLowerCase();
                const currency = (p.currency || "").toLowerCase();
                const sid = (p.stripeSessionId || "").toLowerCase();
                return (
                    sEmail.includes(text) ||
                    tEmail.includes(text) ||
                    currency.includes(text) ||
                    sid.includes(text)
                );
            });
        }

        // sort
        if (sort === "newest") arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (sort === "oldest") arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        if (sort === "amountHigh") arr.sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0));
        if (sort === "amountLow") arr.sort((a, b) => Number(a.amount || 0) - Number(b.amount || 0));

        return arr;
    }, [payments, q, status, sort]);

    const summary = useMemo(() => {
        const paid = payments.filter((p) => (p.paymentStatus || "").toLowerCase() === "paid");
        const totalAmount = paid.reduce((sum, p) => sum + Number(p.amount || 0), 0);

        const tutors = new Set(paid.map((p) => p.tutorEmail).filter(Boolean));
        const students = new Set(paid.map((p) => p.studentEmail).filter(Boolean));

        // assume same currency (your current code uses "usd")
        const currency = (paid[0]?.currency || "usd").toUpperCase();

        return {
            totalAmount,
            totalPaidCount: paid.length,
            totalCount: payments.length,
            uniqueTutors: tutors.size,
            uniqueStudents: students.size,
            currency,
        };
    }, [payments]);

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
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Reports & Analytics</h1>
                    <p className="opacity-70 mt-1">
                        Platform earnings and transaction history (successful Stripe payments).
                    </p>
                </div>

                <button className="btn btn-outline" onClick={fetchPayments}>
                    Refresh
                </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="stats shadow bg-base-100 border">
                    <div className="stat">
                        <div className="stat-title">Total Earnings</div>
                        <div className="stat-value text-primary">
                            {money(summary.totalAmount, summary.currency)}
                        </div>
                        <div className="stat-desc">Paid only</div>
                    </div>
                </div>

                <div className="stats shadow bg-base-100 border">
                    <div className="stat">
                        <div className="stat-title">Successful Payments</div>
                        <div className="stat-value">{summary.totalPaidCount}</div>
                        <div className="stat-desc">paymentStatus = paid</div>
                    </div>
                </div>

                <div className="stats shadow bg-base-100 border">
                    <div className="stat">
                        <div className="stat-title">Unique Tutors Paid</div>
                        <div className="stat-value">{summary.uniqueTutors}</div>
                        <div className="stat-desc">Based on tutorEmail</div>
                    </div>
                </div>

                <div className="stats shadow bg-base-100 border">
                    <div className="stat">
                        <div className="stat-title">Unique Paying Students</div>
                        <div className="stat-value">{summary.uniqueStudents}</div>
                        <div className="stat-desc">Based on studentEmail</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="card bg-base-100 shadow border mt-6">
                <div className="card-body">
                    <div className="flex flex-wrap gap-3 items-center justify-between">
                        <div className="flex flex-wrap gap-3 items-center">
                            <input
                                className="input input-bordered w-full md:w-80"
                                placeholder="Search by student/tutor email, currency, session id..."
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                            />

                            <select
                                className="select select-bordered"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="all">All statuses</option>
                                <option value="paid">Paid</option>
                                <option value="unpaid">Unpaid</option>
                                <option value="no_payment_required">No payment required</option>
                            </select>

                            <select
                                className="select select-bordered"
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                            >
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                                <option value="amountHigh">Amount: High → Low</option>
                                <option value="amountLow">Amount: Low → High</option>
                            </select>
                        </div>

                        <div className="text-sm opacity-70">
                            Showing <span className="font-semibold">{filtered.length}</span> of{" "}
                            <span className="font-semibold">{payments.length}</span>
                        </div>
                    </div>

                    <div className="divider my-3"></div>

                    {filtered.length === 0 ? (
                        <div className="alert">
                            <span>No transactions found.</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Student</th>
                                        <th>Tutor</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Stripe Session</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((p) => {
                                        const st = (p.paymentStatus || "").toLowerCase();
                                        const badgeClass =
                                            st === "paid"
                                                ? "badge badge-success"
                                                : st
                                                    ? "badge badge-warning"
                                                    : "badge";

                                        return (
                                            <tr key={p._id}>
                                                <td className="whitespace-nowrap">
                                                    {p.createdAt ? new Date(p.createdAt).toLocaleString() : "—"}
                                                </td>
                                                <td className="max-w-[220px] truncate">{p.studentEmail || "—"}</td>
                                                <td className="max-w-[220px] truncate">{p.tutorEmail || "—"}</td>
                                                <td className="whitespace-nowrap">
                                                    {money(p.amount, p.currency || "usd")}
                                                </td>
                                                <td>
                                                    <span className={badgeClass}>{p.paymentStatus || "—"}</span>
                                                </td>
                                                <td className="max-w-[260px] truncate">
                                                    {p.stripeSessionId || "—"}
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

export default ReportsAndAnalytics;