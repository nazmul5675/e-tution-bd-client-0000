import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { AuthContext } from "../../../Context/AuthContext";
import useAxios from "../../../Hooks/useAxios";
import Swal from "sweetalert2";

const PostNewTuition = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxios();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

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

    const onSubmit = async (data) => {
        if (!user?.email) {
            Swal.fire({
                icon: "warning",
                title: "Login required",
                text: "Please login to post a tuition.",
                confirmButtonColor: "#16a34a",
            });
            return;
        }

        const payload = {
            subject: data.subject.trim(),
            classLevel: data.classLevel.trim(),
            location: data.location.trim(),
            schedule: data.schedule.trim(),
            daysPerWeek: Number(data.daysPerWeek || 0),
            budget: Number(data.budget || 0),
            preferredTutorGender: data.preferredTutorGender || "Any",
            note: data.note || "",
            studentName: user?.displayName || "",
            studentEmail: user?.email,
            studentPhoto: user?.photoURL || "",
        };

        //  Confirm before posting
        const result = await Swal.fire({
            title: "Post this tuition?",
            text: "It will be saved as Pending until admin approves.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, post it",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#16a34a", // green
            cancelButtonColor: "#ef4444",  // red
        });

        if (!result.isConfirmed) return;

        setSubmitting(true);
        try {
            const res = await axiosSecure.post("/tuitions", payload);

            if (res?.data?.insertedId) {
                reset();


                Swal.fire({
                    icon: "success",
                    title: "Posted!",
                    text: "Your tuition is now Pending for admin approval.",
                    confirmButtonColor: "#16a34a",
                });

                navigate("/dashboard/my-tuitions");
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: "Posted, but server didn't return insertedId.",
                    confirmButtonColor: "#ef4444",
                });
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Failed to post",
                text: err?.response?.data?.message || "Something went wrong.",
                confirmButtonColor: "#ef4444",
            });
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className="p-4 lg:p-8">
            <div className="max-w-3xl">
                <h1 className="text-2xl font-bold">Post New Tuition</h1>
                <p className="opacity-70 mt-1">
                    Your tuition will be saved as <span className="font-semibold">Pending</span> until admin approves.
                </p>

                <div className="card bg-base-100 shadow mt-6">
                    <div className="card-body">
                        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Subject */}
                            <div className="md:col-span-2">
                                <label className="label">
                                    <span className="label-text font-semibold">Subject</span>
                                </label>
                                <input
                                    className="input input-bordered w-full"
                                    placeholder="e.g. Math"
                                    {...register("subject", { required: "Subject is required" })}
                                />
                                {errors.subject && <p className="text-error text-sm mt-1">{errors.subject.message}</p>}
                            </div>

                            {/* Class */}
                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold">Class</span>
                                </label>
                                <input
                                    className="input input-bordered w-full"
                                    placeholder="e.g. Class 8"
                                    {...register("classLevel", { required: "Class is required" })}
                                />
                                {errors.classLevel && <p className="text-error text-sm mt-1">{errors.classLevel.message}</p>}
                            </div>

                            {/* Location */}
                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold">Location</span>
                                </label>
                                <input
                                    className="input input-bordered w-full"
                                    placeholder="e.g. Mirpur, Dhaka"
                                    {...register("location", { required: "Location is required" })}
                                />
                                {errors.location && <p className="text-error text-sm mt-1">{errors.location.message}</p>}
                            </div>

                            {/* Schedule */}
                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold">Schedule</span>
                                </label>
                                <input
                                    className="input input-bordered w-full"
                                    placeholder="e.g. Sun/Tue/Thu 6-8pm"
                                    {...register("schedule", { required: "Schedule is required" })}
                                />
                                {errors.schedule && <p className="text-error text-sm mt-1">{errors.schedule.message}</p>}
                            </div>

                            {/* Days/week */}
                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold">Days / Week</span>
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    max={7}
                                    className="input input-bordered w-full"
                                    {...register("daysPerWeek", { valueAsNumber: true })}
                                />
                            </div>

                            {/* Budget */}
                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold">Budget (BDT)</span>
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    className="input input-bordered w-full"
                                    placeholder="e.g. 5000"
                                    {...register("budget", {
                                        required: "Budget is required",
                                        valueAsNumber: true,
                                        validate: (v) => (Number(v) > 0 ? true : "Budget must be greater than 0"),
                                    })}
                                />
                                {errors.budget && <p className="text-error text-sm mt-1">{errors.budget.message}</p>}
                            </div>

                            {/* Preferred Tutor Gender */}
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

                            {/* Note */}
                            <div className="md:col-span-2">
                                <label className="label">
                                    <span className="label-text font-semibold">Note (optional)</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    rows={4}
                                    placeholder="Any extra details..."
                                    {...register("note")}
                                />
                            </div>

                            <div className="md:col-span-2 flex justify-end gap-3">
                                <button type="button" className="btn" disabled={submitting} onClick={() => reset()}>
                                    Reset
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? "Posting..." : "Post Tuition"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PostNewTuition;
