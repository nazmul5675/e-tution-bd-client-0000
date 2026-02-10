import React, { useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../Context/AuthContext";
import useAxios from "../../../Hooks/useAxios";
import Swal from "sweetalert2";

const statusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "approved") return "badge badge-success";
    if (s === "rejected") return "badge badge-error";
    return "badge badge-warning";
};

const MyTuitions = () => {
    const axiosSecure = useAxios();
    const { user } = useContext(AuthContext);

    const [tuitions, setTuitions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // Optional toggle: show only approved tuitions (requirement says view approved tuitions)
    const [showOnlyApproved, setShowOnlyApproved] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            subject: "",
            classLevel: "",
            location: "",
            schedule: "",
            daysPerWeek: 3,
            budget: "",
            preferredTutorGender: "Any",
            note: "",
        },
    });

    const fetchMyTuitions = async () => {
        if (!user?.email) return;
        setLoading(true);
        try {
            const res = await axiosSecure.get(`/tuitions?studentEmail=${encodeURIComponent(user.email)}`);
            setTuitions(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
            alert("Failed to load your tuitions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyTuitions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.email]);

    const list = useMemo(() => {
        if (!showOnlyApproved) return tuitions;
        return (tuitions || []).filter((t) => (t.status || "").toLowerCase() === "approved");
    }, [tuitions, showOnlyApproved]);

    // When opening edit modal, prefill form with default values
    const openEdit = (tuition) => {
        setEditing(tuition);
        reset({
            subject: tuition.subject || "",
            classLevel: tuition.classLevel || "",
            location: tuition.location || "",
            schedule: tuition.schedule || "",
            daysPerWeek: tuition.daysPerWeek ?? 3,
            budget: tuition.budget ?? "",
            preferredTutorGender: tuition.preferredTutorGender || "Any",
            note: tuition.note || "",
        });
        document.getElementById("edit_tuition_modal")?.showModal?.();
    };

    const closeModal = () => {
        document.getElementById("edit_tuition_modal")?.close?.();
        setEditing(null);
        reset();
    };

    const onUpdate = async (data) => {
        if (!editing?._id) return;
        setSaving(true);
        try {
            const payload = {
                subject: data.subject.trim(),
                classLevel: data.classLevel.trim(),
                location: data.location.trim(),
                schedule: data.schedule.trim(),
                daysPerWeek: Number(data.daysPerWeek || 0),
                budget: Number(data.budget || 0),
                preferredTutorGender: data.preferredTutorGender || "Any",
                note: data.note || "",
            };

            await axiosSecure.patch(`/tuitions/${editing._id}`, payload);
            alert("Tuition updated successfully!");
            closeModal();
            fetchMyTuitions();
        } catch (err) {
            console.error(err);
            alert(err?.response?.data?.message || "Failed to update tuition.");
        } finally {
            setSaving(false);
        }
    };

    const onDelete = async (id) => {
        if (!id) return;

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This tuition post will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#ef4444", // red
            cancelButtonColor: "#6b7280",  // gray
        });

        if (!result.isConfirmed) return;

        setDeletingId(id);
        try {
            await axiosSecure.delete(`/tuitions/${id}`);
            setTuitions((prev) => prev.filter((t) => t._id !== id));

            Swal.fire({
                title: "Deleted!",
                text: "Your tuition post has been deleted.",
                icon: "success",
                confirmButtonColor: "#16a34a",
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: "Failed!",
                text: err?.response?.data?.message || "Failed to delete tuition.",
                icon: "error",
                confirmButtonColor: "#ef4444",
            });
        } finally {
            setDeletingId(null);
        }
    };


    if (!user?.email) {
        return (
            <div className="p-4 lg:p-8">
                <div className="alert alert-warning">
                    <span>Please login to see your tuitions.</span>
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
                    <h1 className="text-2xl font-bold">My Tuitions</h1>
                    <p className="opacity-70 mt-1">View your posted tuition requests. You can edit or delete them.</p>
                </div>

                <label className="label cursor-pointer gap-3">
                    <span className="label-text font-semibold">Show only approved</span>
                    <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={showOnlyApproved}
                        onChange={(e) => setShowOnlyApproved(e.target.checked)}
                    />
                </label>
            </div>

            <div className="card bg-base-100 shadow mt-6">
                <div className="card-body">
                    {list.length === 0 ? (
                        <div className="alert">
                            <span>No tuition found{showOnlyApproved ? " (approved only)" : ""}.</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Class</th>
                                        <th>Location</th>
                                        <th>Budget</th>
                                        <th>Status</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.map((t) => (
                                        <tr key={t._id}>
                                            <td className="font-semibold">{t.subject || "—"}</td>
                                            <td>{t.classLevel || "—"}</td>
                                            <td>{t.location || "—"}</td>
                                            <td>{typeof t.budget === "number" ? `${t.budget} BDT` : t.budget || "—"}</td>
                                            <td>
                                                <span className={statusBadge(t.status)}>{t.status || "pending"}</span>
                                            </td>
                                            <td className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="btn btn-sm" onClick={() => openEdit(t)}>
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-error text-white"
                                                        onClick={() => onDelete(t._id)}
                                                        disabled={deletingId === t._id}
                                                    >
                                                        {deletingId === t._id ? "Deleting..." : "Delete"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* EDIT MODAL */}
            <dialog id="edit_tuition_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Edit Tuition</h3>
                    <p className="text-sm opacity-70 mt-1">Saved values are shown by default.</p>

                    <form onSubmit={handleSubmit(onUpdate)} className="mt-4 grid grid-cols-1 gap-3">
                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">Subject</span>
                            </label>
                            <input className="input input-bordered w-full" {...register("subject", { required: "Subject is required" })} />
                            {errors.subject && <p className="text-error text-sm mt-1">{errors.subject.message}</p>}
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">Class</span>
                            </label>
                            <input className="input input-bordered w-full" {...register("classLevel", { required: "Class is required" })} />
                            {errors.classLevel && <p className="text-error text-sm mt-1">{errors.classLevel.message}</p>}
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">Location</span>
                            </label>
                            <input className="input input-bordered w-full" {...register("location", { required: "Location is required" })} />
                            {errors.location && <p className="text-error text-sm mt-1">{errors.location.message}</p>}
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">Schedule</span>
                            </label>
                            <input className="input input-bordered w-full" {...register("schedule", { required: "Schedule is required" })} />
                            {errors.schedule && <p className="text-error text-sm mt-1">{errors.schedule.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold">Days / Week</span>
                                </label>
                                <input type="number" min={1} max={7} className="input input-bordered w-full" {...register("daysPerWeek", { valueAsNumber: true })} />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold">Budget (BDT)</span>
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    className="input input-bordered w-full"
                                    {...register("budget", {
                                        required: "Budget is required",
                                        valueAsNumber: true,
                                        validate: (v) => (Number(v) > 0 ? true : "Budget must be greater than 0"),
                                    })}
                                />
                                {errors.budget && <p className="text-error text-sm mt-1">{errors.budget.message}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">Preferred Tutor Gender</span>
                            </label>
                            <select className="select select-bordered w-full" {...register("preferredTutorGender")}>
                                <option value="Any">Any</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">Note</span>
                            </label>
                            <textarea className="textarea textarea-bordered w-full" rows={3} {...register("note")} />
                        </div>

                        <div className="modal-action">
                            <button type="button" className="btn" onClick={closeModal}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={closeModal}>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default MyTuitions;
