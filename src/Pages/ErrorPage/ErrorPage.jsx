import React from "react";
import { Link, useNavigate, useRouteError } from "react-router";

const ErrorPage = () => {
    const navigate = useNavigate();
    const error = useRouteError();

    const status = error?.status || 404;
    const title =
        error?.statusText || (status === 404 ? "Page Not Found" : "Something went wrong");
    const message =
        error?.data?.message ||
        error?.message ||
        "The page you’re looking for doesn’t exist or may have been moved.";

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
            <div className="w-full max-w-3xl">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body p-6 md:p-10">
                        {/* Top */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium opacity-70">Oops!</p>
                                <h1 className="text-3xl md:text-4xl font-bold mt-1">{title}</h1>
                                <p className="mt-3 opacity-80 leading-relaxed">{message}</p>
                            </div>

                            {/* Big status */}
                            <div className="text-center md:text-right">
                                <p className="text-7xl md:text-8xl font-extrabold text-primary">
                                    {status}
                                </p>
                                <p className="text-sm opacity-70 -mt-2">Error Code</p>
                            </div>
                        </div>

                        <div className="divider my-6" />

                        {/* Helpful tips */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="rounded-2xl bg-base-200 p-4">
                                <h3 className="font-semibold">Try this:</h3>
                                <ul className="list-disc list-inside mt-2 space-y-1 opacity-80 text-sm">
                                    <li>Check the URL for typing mistakes</li>
                                    <li>Go back to the previous page</li>
                                    <li>Return to the homepage and navigate again</li>
                                </ul>
                            </div>

                            {/* Debug block (only show if error exists) */}
                            <div className="rounded-2xl bg-base-200 p-4">
                                <h3 className="font-semibold">Technical details</h3>
                                <div className="mt-2 text-sm opacity-80">
                                    <p>
                                        <span className="font-medium">Status:</span> {status}
                                    </p>
                                    {error?.stack ? (
                                        <details className="mt-2">

                                            {import.meta.env.DEV && error?.stack && (
                                                <details className="mt-2">
                                                    <summary className="cursor-pointer font-medium">
                                                        View error stack (dev only)
                                                    </summary>

                                                    <pre className="mt-2 p-3 rounded-xl bg-base-100 overflow-auto text-xs">
                                                        {error.stack}
                                                    </pre>
                                                </details>
                                            )}

                                        </details>
                                    ) : (
                                        <p className="mt-2">No extra details available.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="card-actions mt-6 flex flex-col sm:flex-row sm:justify-between gap-3">
                            <button
                                onClick={() => navigate(-1)}
                                className="btn btn-outline w-full sm:w-auto"
                            >
                                ← Go Back
                            </button>

                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <Link to="/contact" className="btn btn-ghost w-full sm:w-auto">
                                    Contact Support
                                </Link>
                                <Link to="/" className="btn btn-primary w-full sm:w-auto">
                                    Back to Home
                                </Link>
                            </div>
                        </div>

                        {/* Footer note */}
                        <p className="mt-6 text-center text-xs opacity-60">
                            If this keeps happening, please report the issue from the Contact page.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
