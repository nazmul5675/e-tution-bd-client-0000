import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Context/AuthContext";
import useAxios from "../../../Hooks/useAxios";
import axios from "axios";

const fallbackImg = "https://i.ibb.co/2kR2z3F/user.png";

const ProfileSettings = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxios();

    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);

    const [savedProfile, setSavedProfile] = useState({
        name: user?.displayName || "",
        email: user?.email || "",
        phone: "",
        photoURL: user?.photoURL || "",
        updatedAt: null,
    });

    const [filePreview, setFilePreview] = useState("");

    const imgbbKey = import.meta.env.VITE_IMGBB_API_KEY;

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: user?.displayName || "",
            phone: "",
        },
    });

    const watchedName = watch("name");
    const watchedPhone = watch("phone");
    const watchedPhotoFile = watch("photoFile");

    // Load saved profile from DB so phone/name/photo show correctly
    useEffect(() => {
        const loadProfile = async () => {
            if (!user?.email) return;

            setLoadingProfile(true);
            try {
                const res = await axiosSecure.get(
                    `/users/profile?email=${encodeURIComponent(user.email)}`
                );
                const dbUser = res.data;

                setSavedProfile({
                    name: dbUser?.name || user?.displayName || "",
                    email: dbUser?.email || user?.email || "",
                    phone: dbUser?.phone || "",
                    photoURL: dbUser?.photoURL || user?.photoURL || "",
                    updatedAt: dbUser?.updatedAt ? new Date(dbUser.updatedAt) : null,
                });

                reset({
                    name: dbUser?.name || user?.displayName || "",
                    phone: dbUser?.phone || "",
                });
            } catch (err) {
                console.error(err);
                // fallback to firebase user data
                setSavedProfile((p) => ({
                    ...p,
                    name: user?.displayName || p.name,
                    email: user?.email || p.email,
                    photoURL: user?.photoURL || p.photoURL,
                }));
            } finally {
                setLoadingProfile(false);
            }
        };

        loadProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.email]);

    // Local preview when selecting a file (before upload)
    useEffect(() => {
        const file = watchedPhotoFile?.[0];
        if (!file) {
            setFilePreview("");
            return;
        }
        const url = URL.createObjectURL(file);
        setFilePreview(url);
        return () => URL.revokeObjectURL(url);
    }, [watchedPhotoFile]);

    const uploadToImgbb = async (file) => {
        if (!imgbbKey) throw new Error("Missing IMGBB key (VITE_IMGBB_API_KEY) in client .env");

        if (file.size > 2 * 1024 * 1024) {
            throw new Error("Image too large. Please upload max 2MB.");
        }

        const formData = new FormData();
        formData.append("image", file);

        const res = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, formData);

        if (!res.data?.success) throw new Error(res.data?.error?.message || "Upload failed");
        return res.data.data.display_url;
    };

    const onSubmit = async (data) => {
        if (!user?.email) {
            Swal.fire({ icon: "warning", title: "Login required", text: "Please login first." });
            return;
        }

        const result = await Swal.fire({
            title: "Update profile?",
            text: "Name, phone and photo will be updated.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, update",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#16a34a",
            cancelButtonColor: "#6b7280",
        });
        if (!result.isConfirmed) return;

        setSaving(true);
        try {
            let finalPhotoURL = savedProfile.photoURL || user?.photoURL || "";

            const file = data.photoFile?.[0];
            if (file) {
                setUploading(true);
                finalPhotoURL = await uploadToImgbb(file);
                setUploading(false);
            }

            const payload = {
                name: data.name.trim(),
                phone: data.phone.trim(),
                photoURL: finalPhotoURL,
            };

            await axiosSecure.patch(`/users/profile?email=${encodeURIComponent(user.email)}`, payload);

            setSavedProfile({
                name: payload.name,
                email: user.email,
                phone: payload.phone,
                photoURL: payload.photoURL,
                updatedAt: new Date(),
            });

            reset({ name: payload.name, phone: payload.phone });
            setFilePreview("");

            Swal.fire({
                icon: "success",
                title: "Updated!",
                text: "Profile updated successfully.",
                confirmButtonColor: "#16a34a",
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: err?.message || err?.response?.data?.message || "Profile update failed.",
                confirmButtonColor: "#ef4444",
            });
        } finally {
            setUploading(false);
            setSaving(false);
        }
    };

    if (!user?.email) {
        return (
            <div className="p-4 lg:p-8">
                <div className="alert alert-warning">
                    <span>Please login to update profile.</span>
                </div>
            </div>
        );
    }

    const previewPhoto = filePreview || savedProfile.photoURL || user?.photoURL || fallbackImg;

    const panelClass =
        "rounded-box border border-base-300 bg-base-300/70 backdrop-blur shadow-lg transition-all transform hover:scale-[1.02] hover:-translate-y-1";

    return (
        <div className="p-4 lg:p-8">
            <title>Profile Settings</title>
            <div className="max-w-5xl">
                <h1 className="text-2xl font-bold text-base-content">Profile Settings</h1>
                <p className="text-base-content/70 mt-1">
                    Update your name, phone and profile photo
                </p>

                {/* Saved vs Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {/* Saved */}
                    <div className={panelClass}>
                        <div className="p-5">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-lg text-base-content">Saved Profile</h3>
                                <span className="badge badge-success">Saved</span>
                            </div>

                            {loadingProfile ? (
                                <div className="mt-4 space-y-3">
                                    <div className="skeleton h-16 w-16 rounded-full"></div>
                                    <div className="skeleton h-4 w-40"></div>
                                    <div className="skeleton h-4 w-56"></div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 mt-4">
                                    <div className="avatar">
                                        <div className="w-16 rounded-full ring ring-primary/40 ring-offset-base-100 ring-offset-2">
                                            <img src={savedProfile.photoURL || fallbackImg} alt="saved" />
                                        </div>
                                    </div>

                                    <div className="min-w-0">
                                        <p className="font-semibold text-base-content truncate">
                                            {savedProfile.name || "No name"}
                                        </p>
                                        <p className="text-sm text-base-content/70 truncate">
                                            {savedProfile.email}
                                        </p>
                                        <p className="text-sm text-base-content/70 truncate">
                                            {savedProfile.phone || "No phone"}
                                        </p>
                                        {savedProfile.updatedAt && (
                                            <p className="text-xs text-base-content/60 mt-1">
                                                Updated: {savedProfile.updatedAt.toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Preview */}
                    <div className={panelClass}>
                        <div className="p-5">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-lg text-base-content">Live Preview</h3>
                                <span className="badge badge-warning">Preview</span>
                            </div>

                            <div className="flex items-center gap-4 mt-4">
                                <div className="avatar">
                                    <div className="w-16 rounded-full ring ring-secondary/40 ring-offset-base-100 ring-offset-2">
                                        <img src={previewPhoto} alt="preview" />
                                    </div>
                                </div>

                                <div className="min-w-0">
                                    <p className="font-semibold text-base-content truncate">
                                        {watchedName || savedProfile.name || "No name"}
                                    </p>
                                    <p className="text-sm text-base-content/70 truncate">{savedProfile.email}</p>
                                    <p className="text-sm text-base-content/70 truncate">
                                        {watchedPhone || savedProfile.phone || "No phone"}
                                    </p>
                                    {filePreview && (
                                        <p className="text-xs text-base-content/60 mt-1">New photo selected</p>
                                    )}
                                </div>
                            </div>

                            <div className="divider my-4 text-base-content/70">Update Form</div>

                            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
                                {/* Name */}
                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold text-base-content">Name</span>
                                    </label>
                                    <input
                                        className="input input-bordered w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                        placeholder="Your name"
                                        {...register("name", { required: "Name is required" })}
                                    />
                                    {errors.name && (
                                        <p className="text-error text-sm mt-1">{errors.name.message}</p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold text-base-content">Phone</span>
                                    </label>
                                    <input
                                        className="input input-bordered w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                        placeholder="e.g. 01XXXXXXXXX"
                                        {...register("phone", {
                                            required: "Phone is required",
                                            minLength: { value: 10, message: "Phone must be at least 10 digits" },
                                        })}
                                    />
                                    {errors.phone && (
                                        <p className="text-error text-sm mt-1">{errors.phone.message}</p>
                                    )}
                                </div>

                                {/* Upload Photo */}
                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold text-base-content">
                                            Upload New Photo
                                        </span>
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="file-input file-input-bordered w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                        {...register("photoFile")}
                                    />
                                    <p className="text-xs text-base-content/70 mt-1">
                                        Select an image (max 2MB).
                                    </p>
                                </div>

                                <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
                                    {uploading ? "Uploading..." : saving ? "Saving..." : "Save Changes"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfileSettings;