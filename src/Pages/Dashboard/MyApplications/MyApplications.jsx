import React, { useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Context/AuthContext";
import useAxios from "../../../Hooks/useAxios";

const badge = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "approved") return "badge badge-success";
    if (s === "rejected") return "badge badge-error";
    return "badge badge-warning";
};

const MyApplications = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxios();

    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: { qualifications: "", experience: "", expectedSalary: "" },
    });

    const fetchApps = async () => {
        if (!user?.email) return;
        setLoading(true);
        try {
            const res = await axiosSecure.get(`/applications?tutorEmail=${encodeURIComponent(user.email)}`);
            setApps(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            console.error(e);
            Swal.fire({ icon: "error", title: "Failed", text: "Could not load applications" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchApps(); /* eslint-disable-next-line */ }, [user?.email]);

    const list = useMemo(() => apps || [], [apps]);

    const openEdit = (app) => {
        setEditing(app);
        reset({
            qualifications: app.qualifications || "",
            experience: app.experience || "",
            expectedSalary: app.expectedSalary ?? "",
        });
        document.getElementById("edit_app_modal")?.showModal?.();
    };

    const closeEdit = () => {
        document.getElementById("edit_app_modal")?.close?.();
        setEditing(null);
        reset();
    };

    const onUpdate = async (data) => {
        if (!editing?._id) return;

        const confirm = await Swal.fire({
            title: "Update application?",
            text: "You can update only while status is Pending.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, update",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#16a34a",
            cancelButtonColor: "#6b7280",
        });
        if (!confirm.isConfirmed) return;

        setSaving(true);
        try {
            await axiosSecure.patch(`/applications/${editing._id}`, {
                qualifications: data.qualifications,
                experience: data.experience,
                expectedSalary: Number(data.expectedSalary),
            });

            closeEdit();
            await fetchApps();

            Swal.fire({ icon: "success", title: "Updated!", confirmButtonColor: "#16a34a" });
        } catch (e) {
            console.error(e);
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: e?.response?.data?.message || "Update failed",
                confirmButtonColor: "#ef4444",
            });
        } finally {
            setSaving(false);
        }
    };

    const onDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Delete application?",
            text: "This cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
        });
        if (!confirm.isConfirmed) return;

        setDeletingId(id);
        try {
            await axiosSecure.delete(`/applications/${id}`);
            setApps((prev) => prev.filter((a) => a._id !== id));
            Swal.fire({ icon: "success", title: "Deleted!", confirmButtonColor: "#16a34a" });
        } catch (e) {
            console.error(e);
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: e?.response?.data?.message || "Delete failed",
                confirmButtonColor: "#ef4444",
            });
        } finally {
            setDeletingId(null);
        }
    };

    if (!user?.email) {
        return (
            <div className="p-4 lg:p-8">
                <div className="alert alert-warning"><span>Please login first.</span></div>
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
            <h1 className="text-2xl font-bold">My Applications</h1>
            <p className="opacity-70 mt-1">Track your tuition applications. </p>
            <div className="card bg-base-100 shadow mt-6">
                <div className="card-body">
                    {list.length === 0 ? (
                        <div className="alert"><span>No applications found.</span></div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>Tuition</th>
                                        <th>Location</th>
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
                                                <td className="font-semibold">
                                                    {a?.tuitionSnapshot?.subject || "Tuition"} — {a?.tuitionSnapshot?.classLevel || ""}
                                                </td>
                                                <td>{a?.tuitionSnapshot?.location || "—"}</td>
                                                <td>{a.expectedSalary ? `${a.expectedSalary} BDT` : "—"}</td>
                                                <td><span className={badge(a.status)}>{a.status || "pending"}</span></td>
                                                <td className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button className="btn btn-sm" onClick={() => openEdit(a)} disabled={!isPending}>
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-error text-white"
                                                            onClick={() => onDelete(a._id)}
                                                            disabled={!isPending || deletingId === a._id}
                                                        >
                                                            {deletingId === a._id ? "Deleting..." : "Delete"}
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

            {/* Edit modal */}
            <dialog id="edit_app_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Edit Application</h3>
                    <p className="text-sm opacity-70 mt-1">Allowed only when status is Pending.</p>

                    <form onSubmit={handleSubmit(onUpdate)} className="mt-4 grid gap-3">
                        <div>
                            <label className="label"><span className="label-text font-semibold">Qualifications</span></label>
                            <input className="input input-bordered w-full"
                                {...register("qualifications", { required: "Qualifications required" })}
                            />
                            {errors.qualifications && <p className="text-error text-sm mt-1">{errors.qualifications.message}</p>}
                        </div>

                        <div>
                            <label className="label"><span className="label-text font-semibold">Experience</span></label>
                            <input className="input input-bordered w-full"
                                {...register("experience", { required: "Experience required" })}
                            />
                            {errors.experience && <p className="text-error text-sm mt-1">{errors.experience.message}</p>}
                        </div>

                        <div>
                            <label className="label"><span className="label-text font-semibold">Expected Salary (BDT)</span></label>
                            <input type="number" min={1} className="input input-bordered w-full"
                                {...register("expectedSalary", {
                                    required: "Expected salary required",
                                    valueAsNumber: true,
                                    validate: (v) => (Number(v) > 0 ? true : "Must be > 0"),
                                })}
                            />
                            {errors.expectedSalary && <p className="text-error text-sm mt-1">{errors.expectedSalary.message}</p>}
                        </div>

                        <div className="modal-action">
                            <button type="button" className="btn" onClick={closeEdit}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={closeEdit}>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default MyApplications;
