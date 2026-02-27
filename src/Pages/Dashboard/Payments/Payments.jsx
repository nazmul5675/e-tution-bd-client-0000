import React, { useContext, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import Swal from "sweetalert2";
import useAxios from "../../../Hooks/useAxios";
import { AuthContext } from "../../../Context/AuthContext";

const money = (amountSmallestUnit, currency = "bdt") => {
    const n = Number(amountSmallestUnit || 0);
    const major = n / 100;
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: String(currency).toUpperCase(),
    }).format(major);
};

const Payments = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxios();

    const [params, setParams] = useSearchParams();

    const applicationIdFromUrl = params.get("applicationId");
    const success = params.get("success");
    const canceled = params.get("canceled");
    const sessionId = params.get("session_id");

    const [payments, setPayments] = useState([]);
    const [pendingApps, setPendingApps] = useState([]);

    const [selectedAppId, setSelectedAppId] = useState(applicationIdFromUrl || "");
    const [selectedApp, setSelectedApp] = useState(null);

    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);

    const confirmOnceRef = useRef(false);

    const panelClass =
        "mt-6 rounded-box border border-base-300 bg-base-300/70 backdrop-blur shadow-lg";
    const panelInner = "p-5";

    const fetchPayments = async () => {
        if (!user?.email) return;
        const res = await axiosSecure.get(
            `/payments?studentEmail=${encodeURIComponent(user.email)}`
        );
        setPayments(Array.isArray(res.data) ? res.data : []);
    };

    /** fetch pending applications (not paid yet) */
    const fetchPendingApps = async () => {
        if (!user?.email) return;
        const res = await axiosSecure.get(
            `/applications?studentEmail=${encodeURIComponent(user.email)}&status=pending`
        );
        setPendingApps(Array.isArray(res.data) ? res.data : []);
    };

    /** load selected application details */
    const loadSelectedApplication = async (appId) => {
        if (!appId) {
            setSelectedApp(null);
            return;
        }
        const res = await axiosSecure.get(`/applications/${appId}`);
        setSelectedApp(res.data);
    };

    /** history + pending + (optional) selected application */
    useEffect(() => {
        const init = async () => {
            if (!user?.email) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                await Promise.all([fetchPayments(), fetchPendingApps()]);

                if (applicationIdFromUrl) {
                    setSelectedAppId(applicationIdFromUrl);
                    await loadSelectedApplication(applicationIdFromUrl);
                }
            } catch (e) {
                console.error(e);
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: e?.response?.data?.message || "Could not load payment data",
                    confirmButtonColor: "#ef4444",
                });
            } finally {
                setLoading(false);
            }
        };

        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.email]);

    useEffect(() => {
        const afterRedirect = async () => {
            if (canceled) {
                Swal.fire({
                    icon: "info",
                    title: "Payment Cancelled",
                    text: "You cancelled the payment.",
                    confirmButtonColor: "#f59e0b",
                });
                return;
            }

            if (!success || !sessionId || !applicationIdFromUrl) return;

            if (confirmOnceRef.current) return;
            confirmOnceRef.current = true;

            try {
                setPaying(true);

                await axiosSecure.post("/payments/confirm", {
                    session_id: sessionId,
                    applicationId: applicationIdFromUrl,
                });

                Swal.fire({
                    icon: "success",
                    title: "Payment Confirmed!",
                    text: "Application approved and transaction saved.",
                    confirmButtonColor: "#16a34a",
                });

                await Promise.all([fetchPayments(), fetchPendingApps()]);
                await loadSelectedApplication(applicationIdFromUrl);

                const next = new URLSearchParams(params);
                next.delete("success");
                next.delete("session_id");
                next.delete("canceled");
                setParams(next);
            } catch (e) {
                console.error(e);
                Swal.fire({
                    icon: "error",
                    title: "Confirm failed",
                    text: e?.response?.data?.message || "Could not confirm payment",
                    confirmButtonColor: "#ef4444",
                });
            } finally {
                setPaying(false);
            }
        };

        afterRedirect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success, canceled, sessionId, applicationIdFromUrl]);

    const handlePay = async (appId) => {
        if (!user?.email) {
            Swal.fire({ icon: "warning", title: "Login required", confirmButtonColor: "#f59e0b" });
            return;
        }
        if (!appId) {
            Swal.fire({ icon: "warning", title: "Missing applicationId", confirmButtonColor: "#f59e0b" });
            return;
        }

        setPaying(true);
        try {
            const res = await axiosSecure.post("/payments/create-checkout-session", {
                applicationId: appId,
                studentEmail: user.email,
            });

            const url = res?.data?.url;
            if (!url) throw new Error("No checkout URL returned from server");

            window.location.href = url;
        } catch (e) {
            console.error(e);
            Swal.fire({
                icon: "error",
                title: "Checkout failed",
                text: e?.response?.data?.message || e.message || "Something went wrong",
                confirmButtonColor: "#ef4444",
            });
        } finally {
            setPaying(false);
        }
    };

    const historyCount = payments.length;

    if (!user?.email) {
        return (
            <div className="p-4 lg:p-8">
                <div className="alert alert-warning">
                    <span>Please login to view payments.</span>
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
            <title>Payments</title>

            <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-base-content">Payments</h1>
                    <p className="text-base-content/70 mt-1">
                        Pay tutors (pending applications) and view your payment history.
                    </p>
                </div>

                <button
                    className="btn btn-outline"
                    onClick={async () => {
                        setLoading(true);
                        try {
                            await Promise.all([fetchPayments(), fetchPendingApps()]);
                            if (selectedAppId) await loadSelectedApplication(selectedAppId);
                        } finally {
                            setLoading(false);
                        }
                    }}
                >
                    Refresh
                </button>
            </div>

            {/* Pending Applications */}
            <div className={panelClass}>
                <div className={panelInner}>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <h2 className="text-lg font-bold text-base-content">
                            Pending Applications (Need Payment)
                        </h2>
                        <span className="text-sm text-base-content/70">
                            Pending: <span className="font-semibold text-base-content">{pendingApps.length}</span>
                        </span>
                    </div>

                    {pendingApps.length === 0 ? (
                        <div className="alert mt-3">
                            <span>No pending applications right now.</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                            {pendingApps.map((app) => (
                                <div
                                    key={app._id}
                                    className="rounded-box border border-base-300 bg-base-100/60 backdrop-blur shadow-lg"
                                >
                                    <div className="p-5">
                                        <h3 className="font-bold text-base-content">
                                            {app?.tuitionSnapshot?.subject || "Tuition"}
                                        </h3>

                                        <p className="text-sm text-base-content/70 mt-1">
                                            Tutor: <span className="font-semibold text-base-content">{app.tutorName}</span>
                                        </p>
                                        <p className="text-sm text-base-content/70 truncate">
                                            Email: {app.tutorEmail}
                                        </p>

                                        <p className="text-sm text-base-content/80 mt-2">
                                            Expected Salary:{" "}
                                            <span className="font-semibold text-base-content">
                                                {app.expectedSalary} BDT
                                            </span>
                                        </p>

                                        <div className="mt-4 flex gap-2">
                                            <button
                                                className="btn btn-sm btn-outline"
                                                onClick={async () => {
                                                    setSelectedAppId(app._id);
                                                    await loadSelectedApplication(app._id);
                                                }}
                                            >
                                                Details
                                            </button>

                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => handlePay(app._id)}
                                                disabled={paying}
                                            >
                                                {paying ? "Processing..." : "Pay Now"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Selected Application Details */}
            {selectedAppId && (
                <div className={panelClass}>
                    <div className={panelInner}>
                        <h2 className="text-lg font-bold text-base-content">Selected Application Details</h2>

                        {!selectedApp ? (
                            <div className="alert mt-3">
                                <span>Select an application to see details.</span>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-2 mt-3 text-sm text-base-content/80">
                                    <p>
                                        <span className="font-semibold text-base-content">Tutor:</span>{" "}
                                        {selectedApp.tutorName} ({selectedApp.tutorEmail})
                                    </p>
                                    <p>
                                        <span className="font-semibold text-base-content">Subject:</span>{" "}
                                        {selectedApp?.tuitionSnapshot?.subject || "—"}
                                    </p>
                                    <p>
                                        <span className="font-semibold text-base-content">Expected Salary:</span>{" "}
                                        {selectedApp.expectedSalary} BDT
                                    </p>
                                    <p>
                                        <span className="font-semibold text-base-content">Status:</span>{" "}
                                        {selectedApp.status}
                                    </p>
                                </div>

                                <div className="mt-5">
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handlePay(selectedAppId)}
                                        disabled={paying || (selectedApp.status || "").toLowerCase() !== "pending"}
                                    >
                                        {paying ? "Processing..." : "Pay Now"}
                                    </button>

                                    {(selectedApp.status || "").toLowerCase() !== "pending" && (
                                        <p className="text-sm text-base-content/70 mt-2">
                                            Only pending applications can be paid/approved.
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Payment History */}
            <div className={panelClass}>
                <div className={panelInner}>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <h2 className="text-lg font-bold text-base-content">Payment History</h2>
                        <span className="text-sm text-base-content/70">
                            Total: <span className="font-semibold text-base-content">{historyCount}</span>
                        </span>
                    </div>

                    {payments.length === 0 ? (
                        <div className="alert mt-3">
                            <span>No payment history yet.</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto mt-4 rounded-box border border-base-300 bg-base-100/60">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Tutor</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Stripe Session</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map((p) => {
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
                                                <td className="max-w-[220px] truncate">{p.tutorEmail || "—"}</td>
                                                <td className="whitespace-nowrap">
                                                    {money(p.amount, p.currency || "bdt")}
                                                </td>
                                                <td>
                                                    <span className={badgeClass}>{p.paymentStatus || "—"}</span>
                                                </td>
                                                <td className="max-w-[260px] truncate">{p.stripeSessionId || "—"}</td>
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

export default Payments;