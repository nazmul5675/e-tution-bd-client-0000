import React, { useContext, useEffect, useState } from "react";

import { useSearchParams } from "react-router";

import Swal from "sweetalert2";
import useAxios from "../../../Hooks/useAxios";
import { AuthContext } from "../../../Context/AuthContext";

const Payments = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxios();
    const [params] = useSearchParams();

    // existing params
    const applicationId = params.get("applicationId");
    const success = params.get("success");
    const canceled = params.get("canceled");

    //  Stripe sends session_id in success_url
    const sessionId = params.get("session_id");

    const [appDoc, setAppDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);

    //  load application details
    useEffect(() => {
        const load = async () => {
            if (!applicationId) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const res = await axiosSecure.get(`/applications/${applicationId}`);
                setAppDoc(res.data);
            } catch (e) {
                console.error(e);
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: e?.response?.data?.message || "Could not load application",
                });
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [applicationId, axiosSecure]);

    useEffect(() => {
        const afterRedirect = async () => {
            // if user canceled on Stripe checkout
            if (canceled) {
                Swal.fire({
                    icon: "info",
                    title: "Payment Cancelled",
                    text: "You cancelled the payment.",
                });
                return;
            }

            // only run confirm when we have success + sessionId + applicationId
            if (!success || !sessionId || !applicationId) return;

            try {
                setPaying(true);

                //  confirm payment and update DB (replaces webhook)
                await axiosSecure.post("/payments/confirm", {
                    session_id: sessionId,
                    applicationId,
                });

                // refetch application so status becomes "approved" in UI
                const res = await axiosSecure.get(`/applications/${applicationId}`);
                setAppDoc(res.data);

                Swal.fire({
                    icon: "success",
                    title: "Payment Confirmed!",
                    text: "Application approved and transaction saved.",
                });
            } catch (e) {
                console.error(e);
                Swal.fire({
                    icon: "error",
                    title: "Confirm failed",
                    text: e?.response?.data?.message || "Could not confirm payment",
                });
            } finally {
                setPaying(false);
            }
        };

        afterRedirect();
    }, [success, canceled, sessionId, applicationId, axiosSecure]);

    //  create stripe checkout session
    const handlePay = async () => {
        if (!user?.email) {
            Swal.fire({ icon: "warning", title: "Login required" });
            return;
        }
        if (!applicationId) {
            Swal.fire({ icon: "warning", title: "Missing applicationId" });
            return;
        }

        setPaying(true);
        try {
            const res = await axiosSecure.post("/payments/create-checkout-session", {
                applicationId,
                studentEmail: user.email,
            });

            const url = res?.data?.url;
            if (!url) throw new Error("No checkout URL returned from server");

            // redirect to Stripe Checkout
            window.location.href = url;
        } catch (e) {
            console.error(e);
            Swal.fire({
                icon: "error",
                title: "Checkout failed",
                text: e?.response?.data?.message || e.message || "Something went wrong",
            });
        } finally {
            setPaying(false);
        }
    };

    if (!user?.email) {
        return (
            <div className="p-4 lg:p-8">
                <div className="alert alert-warning">
                    <span>Please login to pay.</span>
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

    if (!applicationId) {
        return (
            <div className="p-4 lg:p-8">
                <div className="alert alert-warning">
                    <span>No application selected for payment.</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-8">
            <h1 className="text-2xl font-bold">Payments</h1>
            <p className="opacity-70 mt-1">
                Approve tutor by paying expected salary via Stripe Checkout.
            </p>

            <div className="card bg-base-100 shadow mt-6">
                <div className="card-body">
                    {!appDoc ? (
                        <div className="alert">
                            <span>Application not found.</span>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <p>
                                    <span className="font-semibold">Tutor:</span> {appDoc.tutorName} (
                                    {appDoc.tutorEmail})
                                </p>
                                <p>
                                    <span className="font-semibold">Subject:</span>{" "}
                                    {appDoc?.tuitionSnapshot?.subject || "—"}
                                </p>
                                <p>
                                    <span className="font-semibold">Expected Salary:</span>{" "}
                                    {appDoc.expectedSalary} BDT
                                </p>
                                <p>
                                    <span className="font-semibold">Status:</span> {appDoc.status}
                                </p>
                            </div>

                            <div className="mt-6">
                                <button
                                    className="btn btn-primary"
                                    onClick={handlePay}

                                    // after confirm -> status becomes approved -> button disables automatically
                                    disabled={paying || (appDoc.status || "").toLowerCase() !== "pending"}
                                >
                                    {paying ? "Processing..." : "Pay Now"}
                                </button>

                                {(appDoc.status || "").toLowerCase() !== "pending" && (
                                    <p className="text-sm opacity-70 mt-2">
                                        Only pending applications can be paid/approved.
                                    </p>
                                )}

                                {/* show session info after redirect  */}
                                {success && sessionId && (
                                    <p className="text-xs opacity-60 mt-3">
                                        Payment session: {sessionId}
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Payments;
