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

    // Live preview values
    const watchedName = watch("name");
    const watchedPhone = watch("phone");
    const watchedPhotoFile = watch("photoFile");

    // Load saved profile from DB so phone/name/photo show correctly
    useEffect(() => {
        const loadProfile = async () => {
            if (!user?.email) return;

            setLoadingProfile(true);
            try {
                const res = await axiosSecure.get(`/users/profile?email=${encodeURIComponent(user.email)}`);
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

        // optional: file size check (2MB)
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

            // if user selected file, upload to imgbb
            const file = data.photoFile?.[0];
            if (file) {
                setUploading(true);
                finalPhotoURL = await uploadToImgbb(file);
                setUploading(false);
            }

            const payload = {
                name: data.name.trim(),
                phone: data.phone.trim(),
                photoURL: finalPhotoURL, // keep old if no new file
            };

            await axiosSecure.patch(`/users/profile?email=${encodeURIComponent(user.email)}`, payload);

            //  update saved card instantly
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

    return (
        <div className="p-4 lg:p-8">
            <div className="max-w-5xl">
                <h1 className="text-2xl font-bold">Profile Settings</h1>
                <p className="opacity-70 mt-1">Update your name, phone and profile photo </p>

                {/*  Saved vs Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {/* Saved */}
                    <div className="card bg-base-100 shadow border">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-lg">Saved Profile</h3>
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
                                        <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                            <img src={savedProfile.photoURL || fallbackImg} alt="saved" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-semibold">{savedProfile.name || "No name"}</p>
                                        <p className="text-sm opacity-70">{savedProfile.email}</p>
                                        <p className="text-sm opacity-70">{savedProfile.phone || "No phone"}</p>
                                        {savedProfile.updatedAt && (
                                            <p className="text-xs opacity-60 mt-1">
                                                Updated: {savedProfile.updatedAt.toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="card bg-base-100 shadow border">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-lg">Live Preview</h3>
                                <span className="badge badge-warning">Preview</span>
                            </div>

                            <div className="flex items-center gap-4 mt-4">
                                <div className="avatar">
                                    <div className="w-16 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
                                        <img src={previewPhoto} alt="preview" />
                                    </div>
                                </div>
                                <div>
                                    <p className="font-semibold">{watchedName || savedProfile.name || "No name"}</p>
                                    <p className="text-sm opacity-70">{savedProfile.email}</p>
                                    <p className="text-sm opacity-70">{watchedPhone || savedProfile.phone || "No phone"}</p>
                                    {filePreview && <p className="text-xs opacity-60 mt-1">New photo selected</p>}
                                </div>
                            </div>

                            <div className="divider my-3">Update Form</div>

                            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
                                {/* Name */}
                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold">Name</span>
                                    </label>
                                    <input
                                        className="input input-bordered w-full"
                                        placeholder="Your name"
                                        {...register("name", { required: "Name is required" })}
                                    />
                                    {errors.name && <p className="text-error text-sm mt-1">{errors.name.message}</p>}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold">Phone</span>
                                    </label>
                                    <input
                                        className="input input-bordered w-full"
                                        placeholder="e.g. 01XXXXXXXXX"
                                        {...register("phone", {
                                            required: "Phone is required",
                                            minLength: { value: 10, message: "Phone must be at least 10 digits" },
                                        })}
                                    />
                                    {errors.phone && <p className="text-error text-sm mt-1">{errors.phone.message}</p>}
                                </div>

                                {/* Upload Photo */}
                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold">Upload New Photo</span>
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="file-input file-input-bordered w-full"
                                        {...register("photoFile")}
                                    />
                                    <p className="text-xs opacity-70 mt-1">
                                        Select an image (max 2MB). It will be uploaded to imgbb.
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
