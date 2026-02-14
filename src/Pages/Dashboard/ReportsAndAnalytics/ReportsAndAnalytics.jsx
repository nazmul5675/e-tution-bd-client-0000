import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import useAxios from "../../../Hooks/useAxios";

//  Recharts imports
import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from "recharts";

//  Existing helper 
const money = (amountSmallestUnit, currency = "usd") => {
    const n = Number(amountSmallestUnit || 0);
    const major = n / 100;
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: String(currency).toUpperCase(),
    }).format(major);
};

//  helper for chart values that are already in MAJOR units (e.g. 1200.50 BDT)
const moneyMajor = (amountMajor, currency = "usd") => {
    const major = Number(amountMajor || 0);
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: String(currency).toUpperCase(),
        maximumFractionDigits: 2,
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

        const currency = (paid[0]?.currency || payments[0]?.currency || "usd").toUpperCase();

        return {
            totalAmount,
            totalPaidCount: paid.length,
            totalCount: payments.length,
            uniqueTutors: tutors.size,
            uniqueStudents: students.size,
            currency,
        };
    }, [payments]);

    //  chart data (based on PAID payments only)
    const paidPayments = useMemo(() => {
        return payments.filter((p) => (p.paymentStatus || "").toLowerCase() === "paid");
    }, [payments]);

    //  Earnings over time (group by date)
    const earningsByDay = useMemo(() => {
        // Map YYYY-MM-DD -> sumMajor
        const map = new Map();

        for (const p of paidPayments) {
            const dt = p.createdAt ? new Date(p.createdAt) : null;
            if (!dt || Number.isNaN(dt.getTime())) continue;

            const dayKey = dt.toISOString().slice(0, 10); // YYYY-MM-DD
            const major = Number(p.amount || 0) / 100; // amount is in smallest unit
            map.set(dayKey, (map.get(dayKey) || 0) + major);
        }

        // Sort by day ASC for chart
        return Array.from(map.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([day, totalMajor]) => ({
                day,
                totalMajor: Number(totalMajor.toFixed(2)),
            }));
    }, [paidPayments]);

    //  Payment status breakdown (count)
    const statusBreakdown = useMemo(() => {
        const map = new Map(); // status -> count
        for (const p of payments) {
            const st = (p.paymentStatus || "unknown").toLowerCase();
            map.set(st, (map.get(st) || 0) + 1);
        }
        return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
    }, [payments]);

    //  Top tutors by earnings (paid only)
    const topTutors = useMemo(() => {
        const map = new Map(); // tutorEmail -> totalMajor
        for (const p of paidPayments) {
            const email = p.tutorEmail || "unknown";
            const major = Number(p.amount || 0) / 100;
            map.set(email, (map.get(email) || 0) + major);
        }

        return Array.from(map.entries())
            .map(([tutorEmail, totalMajor]) => ({
                tutorEmail,
                totalMajor: Number(totalMajor.toFixed(2)),
            }))
            .sort((a, b) => b.totalMajor - a.totalMajor)
            .slice(0, 7); // top 7
    }, [paidPayments]);

    //  simple colors for pie slices (using daisyUI-ish palette)
    const pieColors = ["#22c55e", "#f59e0b", "#ef4444", "#3b82f6", "#a855f7", "#14b8a6"];

    //  custom tooltip for money display
    const MoneyTooltip = ({ active, payload, label, currency }) => {
        if (!active || !payload?.length) return null;
        const val = payload[0]?.value ?? 0;
        return (
            <div className="bg-base-100 border shadow rounded p-2 text-sm">
                <div className="font-semibold">{label}</div>
                <div>{moneyMajor(val, currency)}</div>
            </div>
        );
    };

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

                <button className="btn btn-primary" onClick={fetchPayments}>
                    Refresh
                </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="stats bg-white/60 p-4 rounded-3xl shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all relative">
                    <div className="stat">
                        <div className="stat-title">Total Earnings</div>
                        <div className="stat-value text-primary">
                            {money(summary.totalAmount, summary.currency)}
                        </div>
                        <div className="stat-desc">Paid only</div>
                    </div>
                </div>

                <div className="stats bg-white/60 p-4 rounded-3xl shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all relative">
                    <div className="stat">
                        <div className="stat-title">Successful Payments</div>
                        <div className="stat-value">{summary.totalPaidCount}</div>
                        <div className="stat-desc">paymentStatus = paid</div>
                    </div>
                </div>

                <div className="stats bg-white/60 p-4 rounded-3xl shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all relative">
                    <div className="stat">
                        <div className="stat-title">Unique Tutors Paid</div>
                        <div className="stat-value">{summary.uniqueTutors}</div>
                        <div className="stat-desc">Based on tutorEmail</div>
                    </div>
                </div>

                <div className="stats bg-white/60 p-4 rounded-3xl shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all relative">
                    <div className="stat">
                        <div className="stat-title">Unique Paying Students</div>
                        <div className="stat-value">{summary.uniqueStudents}</div>
                        <div className="stat-desc">Based on studentEmail</div>
                    </div>
                </div>
            </div>

            {/*  Charts section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-6">
                {/* Earnings over time */}
                <div className="bg-white/60 p-4 rounded-3xl shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all relative xl:col-span-2">
                    <div className="card-body">
                        <h2 className="card-title">Earnings Over Time</h2>
                        <p className="text-sm opacity-70">
                            Sum of <span className="font-semibold">paid</span> transactions by day.
                        </p>

                        {earningsByDay.length < 2 ? (
                            <div className="alert mt-4">
                                <span>Not enough paid data to draw a trend chart.</span>
                            </div>
                        ) : (
                            <div className="w-full h-[280px] mt-3">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={earningsByDay}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip content={<MoneyTooltip currency={summary.currency} />} />
                                        <Legend />
                                        <Line type="monotone" dataKey="totalMajor" name="Earnings" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </div>

                {/* Payment status breakdown */}
                <div className="bg-white/60 p-4 rounded-3xl shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all relative">
                    <div className="card-body">
                        <h2 className="card-title">Payment Status</h2>
                        <p className="text-sm opacity-70">Distribution of all transactions.</p>

                        {statusBreakdown.length === 0 ? (
                            <div className="alert mt-4">
                                <span>No payments found.</span>
                            </div>
                        ) : (
                            <div className="w-full h-[280px] mt-3">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Tooltip />
                                        <Legend />
                                        <Pie
                                            data={statusBreakdown}
                                            dataKey="value"
                                            nameKey="name"
                                            outerRadius={95}
                                            label
                                        >
                                            {statusBreakdown.map((_, i) => (
                                                <Cell key={i} fill={pieColors[i % pieColors.length]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </div>

                {/* Top tutors */}
                <div className="bg-white/60 p-4 rounded-3xl shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all relative xl:col-span-3">
                    <div className="card-body">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                                <h2 className="card-title">Top Tutors by Earnings</h2>
                                <p className="text-sm opacity-70">Paid totals (top 7).</p>
                            </div>
                            <div className="text-sm opacity-70">
                                Currency: <span className="font-semibold">{summary.currency}</span>
                            </div>
                        </div>

                        {topTutors.length === 0 ? (
                            <div className="alert mt-4">
                                <span>No paid transactions yet.</span>
                            </div>
                        ) : (
                            <div className="w-full h-[260px] mt-3">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={topTutors}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="tutorEmail"
                                            tick={{ fontSize: 12 }}
                                            interval={0}
                                            angle={-12}
                                            height={60}
                                        />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip content={<MoneyTooltip currency={summary.currency} />} />
                                        <Legend />
                                        <Bar dataKey="totalMajor" name="Earnings" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white/60 p-4 rounded-3xl shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all relative mt-6">
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
