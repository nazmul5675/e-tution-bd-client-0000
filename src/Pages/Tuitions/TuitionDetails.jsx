import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import Swal from "sweetalert2";
import useAxios from "../../Hooks/useAxios";
import { AuthContext } from "../../Context/AuthContext";

const TuitionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxios();
    const { user } = useContext(AuthContext);

    const modalRef = useRef(null);

    const [tuition, setTuition] = useState(null);
    const [loading, setLoading] = useState(true);

    const [role, setRole] = useState(null);
    const [alreadyApplied, setAlreadyApplied] = useState(false);

    const [qualifications, setQualifications] = useState("");
    const [experience, setExperience] = useState("");
    const [expectedSalary, setExpectedSalary] = useState("");

    const isTutor = (role || "").toLowerCase() === "tutor";

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await axiosSecure.get(`/tuitions/${id}`);
                setTuition(res.data);
            } catch (e) {
                console.error(e);
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: e?.response?.data?.message || "Could not load tuition details",
                });
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [axiosSecure, id]);

    // load role + check already applied (only if logged in)
    useEffect(() => {
        const loadRoleAndApplied = async () => {
            if (!user?.email) return;

            try {
                const profileRes = await axiosSecure.get(
                    `/users/profile?email=${encodeURIComponent(user.email)}`
                );
                const dbRole = (profileRes?.data?.role || "").toLowerCase();
                setRole(dbRole);

                if (dbRole === "tutor") {
                    const appsRes = await axiosSecure.get(
                        `/applications?tutorEmail=${encodeURIComponent(user.email)}&tuitionId=${encodeURIComponent(id)}`
                    );
                    setAlreadyApplied(Array.isArray(appsRes.data) && appsRes.data.length > 0);
                }
            } catch (e) {
                console.error(e);
            }
        };

        loadRoleAndApplied();
    }, [user?.email, axiosSecure, id]);

    const openApply = () => {
        if (!user?.email) {
            Swal.fire({
                icon: "info",
                title: "Login required",
                text: "Please login as a tutor to apply.",
                confirmButtonText: "Go to Login",
            }).then(() => navigate("/login"));
            return;
        }

        if (!isTutor) {
            Swal.fire({
                icon: "warning",
                title: "Tutor only",
                text: "Only tutor accounts can apply to tuitions.",
            });
            return;
        }

        if (alreadyApplied) {
            Swal.fire({
                icon: "info",
                title: "Already applied",
                text: "You already applied to this tuition.",
            });
            return;
        }

        modalRef.current?.showModal();
    };

    const handleApply = async (e) => {
        e.preventDefault();

        if (!qualifications.trim() || !experience.trim() || !String(expectedSalary).trim()) {
            Swal.fire({ icon: "warning", title: "All fields are required" });
            return;
        }

        try {
            const payload = {
                tuitionId: id,
                tutorEmail: user.email,
                tutorName: user.displayName || "Tutor",
                tutorPhoto: user.photoURL || "",
                qualifications: qualifications.trim(),
                experience: experience.trim(),
                expectedSalary: Number(expectedSalary),
            };

            const res = await axiosSecure.post("/applications", payload);

            if (res?.data?.insertedId) {
                setAlreadyApplied(true);
                modalRef.current?.close();
                Swal.fire({
                    icon: "success",
                    title: "Applied!",
                    text: "Your application is submitted. Status is pending until student approves & pays.",
                });
            }
        } catch (e2) {
            console.error(e2);
            Swal.fire({
                icon: "error",
                title: "Apply failed",
                text: e2?.response?.data?.message || "Could not apply",
            });
        }
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

    if (!tuition?._id) {
        return (
            <div className="p-4 lg:p-8">
                <div className="alert alert-warning">
                    <span>Tuition not found.</span>
                </div>
                <div className="mt-4">
                    <Link className="btn btn-sm" to="/tuitions">Back</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-8">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold">{tuition.subject}</h1>
                    <p className="opacity-70 mt-1">Class: {tuition.classLevel}</p>
                </div>

                <button className="btn btn-primary" onClick={openApply} disabled={alreadyApplied}>
                    {alreadyApplied ? "Already Applied" : "Apply"}
                </button>
            </div>

            <div className="bg-white/60 p-5 rounded-3xl shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all relative mt-10">
                <div className="card-body space-y-2 text-sm">
                    <p><span className="font-semibold">Location:</span> {tuition.location}</p>
                    <p><span className="font-semibold">Schedule:</span> {tuition.schedule}</p>
                    <p><span className="font-semibold">Days/Week:</span> {tuition.daysPerWeek || "—"}</p>
                    <p><span className="font-semibold">Budget:</span> {tuition.budget} BDT</p>
                    <p><span className="font-semibold">Preferred Tutor Gender:</span> {tuition.preferredTutorGender || "Any"}</p>
                    <p><span className="font-semibold">Note:</span> {tuition.note || "—"}</p>

                    <div className="divider"></div>

                    <p><span className="font-semibold">Student:</span> {tuition.studentName || "—"} ({tuition.studentEmail})</p>
                    <p><span className="font-semibold">Status:</span> {tuition.status}</p>
                </div>
            </div>

            {/* Apply Modal */}
            <dialog ref={modalRef} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Apply for this Tuition</h3>
                    <p className="opacity-70 text-sm mt-1">
                        Name & Email are read-only. Fill qualifications, experience, expected salary.
                    </p>

                    <form className="mt-4 space-y-3" onSubmit={handleApply}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="label"><span className="label-text">Name</span></label>
                                <input className="input input-bordered w-full" readOnly value={user?.displayName || "Tutor"} />
                            </div>
                            <div>
                                <label className="label"><span className="label-text">Email</span></label>
                                <input className="input input-bordered w-full" readOnly value={user?.email || ""} />
                            </div>
                        </div>

                        <div>
                            <label className="label"><span className="label-text">Qualifications</span></label>
                            <input
                                className="input input-bordered w-full"
                                value={qualifications}
                                onChange={(e) => setQualifications(e.target.value)}
                                placeholder="e.g. BSc in Math"
                            />
                        </div>

                        <div>
                            <label className="label"><span className="label-text">Experience</span></label>
                            <input
                                className="input input-bordered w-full"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                placeholder="e.g. 2 years teaching"
                            />
                        </div>

                        <div>
                            <label className="label"><span className="label-text">Expected Salary (BDT)</span></label>
                            <input
                                type="number"
                                className="input input-bordered w-full"
                                value={expectedSalary}
                                onChange={(e) => setExpectedSalary(e.target.value)}
                                placeholder="e.g. 3000"
                            />
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={() => modalRef.current?.close()}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Submit Application
                            </button>
                        </div>
                    </form>
                </div>

                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default TuitionDetails;
