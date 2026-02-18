import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import useAxios from "../../Hooks/useAxios";
import { Link } from "react-router";

const Tuitions = () => {
    const axiosSecure = useAxios();

    const [tuitions, setTuitions] = useState([]);
    const [loading, setLoading] = useState(true);

    // existing search
    const [search, setSearch] = useState("");

    // filter UI selections (not applied yet)
    const [subjectSel, setSubjectSel] = useState("all");
    const [classSel, setClassSel] = useState("all");
    const [locationSel, setLocationSel] = useState("all");

    // applied filters (used in actual filtering)
    const [appliedFilters, setAppliedFilters] = useState({
        subject: "all",
        classLevel: "all",
        location: "all",
    });

    const [page, setPage] = useState(1);
    const perPage = 9;

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await axiosSecure.get("/tuitions?status=approved");
                setTuitions(Array.isArray(res.data) ? res.data : []);
            } catch (e) {
                console.error(e);
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: e?.response?.data?.message || "Could not load tuitions",
                });
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [axiosSecure]);

    // Build dropdown options from loaded data (unique values)
    const filterOptions = useMemo(() => {
        const uniq = (arr) => [...new Set(arr.filter(Boolean))];

        return {
            subjects: uniq((tuitions || []).map((t) => t.subject?.trim())),
            classes: uniq((tuitions || []).map((t) => t.classLevel?.trim())),
            locations: uniq((tuitions || []).map((t) => t.location?.trim())),
        };
    }, [tuitions]);

    // Filtering (search + applied filters)
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        return (tuitions || []).filter((t) => {
            // applied dropdown filters (exact match)
            if (appliedFilters.subject !== "all" && t.subject !== appliedFilters.subject) return false;
            if (appliedFilters.classLevel !== "all" && t.classLevel !== appliedFilters.classLevel)
                return false;
            if (appliedFilters.location !== "all" && t.location !== appliedFilters.location) return false;

            // text search (subject/location/class)
            if (!q) return true;

            return (
                (t.subject || "").toLowerCase().includes(q) ||
                (t.location || "").toLowerCase().includes(q) ||
                (t.classLevel || "").toLowerCase().includes(q)
            );
        });
    }, [tuitions, search, appliedFilters]);

    const totalPages = Math.ceil(filtered.length / perPage) || 1;

    const paginated = useMemo(() => {
        const start = (page - 1) * perPage;
        return filtered.slice(start, start + perPage);
    }, [filtered, page]);

    const goToPage = (p) => {
        const next = Math.min(Math.max(p, 1), totalPages);
        setPage(next);
    };

    const handleApply = () => {
        setAppliedFilters({
            subject: subjectSel,
            classLevel: classSel,
            location: locationSel,
        });
        setPage(1);
    };

    const handleReset = () => {
        setSubjectSel("all");
        setClassSel("all");
        setLocationSel("all");
        setAppliedFilters({ subject: "all", classLevel: "all", location: "all" });
        setSearch("");
        setPage(1);
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
        <div className="p-4 lg:p-8 max-w-7xl mx-auto px-4 py-16">
            <title>
                Tuitions
            </title>
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold">All Approved Tuitions</h1>
                </div>

                <input
                    className="input input-bordered w-full max-w-xs"
                    placeholder="Search by subject / location / class..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                />
            </div>


            <div className="mt-5 flex flex-wrap gap-3 items-end">
                <div className="form-control w-full max-w-xs">
                    <label className="label">
                        <span className="label-text">Subject</span>
                    </label>
                    <select
                        className="select select-bordered"
                        value={subjectSel}
                        onChange={(e) => setSubjectSel(e.target.value)}
                    >
                        <option value="all">All Subjects</option>
                        {filterOptions.subjects.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-control w-full max-w-xs">
                    <label className="label">
                        <span className="label-text">Class</span>
                    </label>
                    <select
                        className="select select-bordered"
                        value={classSel}
                        onChange={(e) => setClassSel(e.target.value)}
                    >
                        <option value="all">All Classes</option>
                        {filterOptions.classes.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-control w-full max-w-xs">
                    <label className="label">
                        <span className="label-text">Location</span>
                    </label>
                    <select
                        className="select select-bordered"
                        value={locationSel}
                        onChange={(e) => setLocationSel(e.target.value)}
                    >
                        <option value="all">All Locations</option>
                        {filterOptions.locations.map((l) => (
                            <option key={l} value={l}>
                                {l}
                            </option>
                        ))}
                    </select>
                </div>

                <button className="btn btn-primary" onClick={handleApply}>
                    Apply
                </button>
                <button className="btn btn-ghost" onClick={handleReset}>
                    Reset
                </button>
            </div>

            <p className="text-sm opacity-70 mt-4">
                Showing <span className="font-semibold">{paginated.length}</span> of{" "}
                <span className="font-semibold">{filtered.length}</span> results
            </p>

            {filtered.length === 0 ? (
                <div className="card bg-base-100 shadow mt-6">
                    <div className="card-body">
                        <div className="alert">
                            <span>No approved tuitions found.</span>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
                        {paginated.map((t) => (
                            <div
                                key={t._id}
                                className="bg-white/60 p-4 rounded-3xl shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all relative"
                            >
                                <div className="card-body">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h2 className="card-title">{t.subject}</h2>
                                            <p className="text-sm opacity-70">Class: {t.classLevel}</p>
                                        </div>
                                        <span className="badge badge-success">Approved</span>
                                    </div>

                                    <div className="divider my-2"></div>

                                    <div className="space-y-2 text-sm">
                                        <p>
                                            <span className="font-semibold">Location:</span> {t.location}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Schedule:</span> {t.schedule}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Budget:</span> {t.budget} BDT
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <Link className="btn btn-sm btn-primary" to={`/tuitions/${t._id}`}>
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
                            <button className="btn btn-sm" onClick={() => goToPage(page - 1)} disabled={page === 1}>
                                Prev
                            </button>

                            {Array.from({ length: totalPages }).map((_, idx) => {
                                const p = idx + 1;
                                return (
                                    <button
                                        key={p}
                                        className={`btn btn-sm ${p === page ? "btn-primary text-white" : ""}`}
                                        onClick={() => goToPage(p)}
                                    >
                                        {p}
                                    </button>
                                );
                            })}

                            <button
                                className="btn btn-sm"
                                onClick={() => goToPage(page + 1)}
                                disabled={page === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Tuitions;
