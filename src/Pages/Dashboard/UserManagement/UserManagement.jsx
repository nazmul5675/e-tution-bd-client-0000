import React, { useContext, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import useAxios from "../../../Hooks/useAxios";
import { AuthContext } from "../../../Context/AuthContext";

const fallbackImg = "https://i.ibb.co/2kR2z3F/user.png";

const UserManagement = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxios();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axiosSecure.get("/users");
            setUsers(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            console.error(e);
            Swal.fire({ icon: "error", title: "Failed", text: "Could not load users" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return (users || [])
            .filter((u) => (roleFilter === "all" ? true : (u.role || "student") === roleFilter))
            .filter((u) => {
                if (!q) return true;
                return (
                    (u.name || "").toLowerCase().includes(q) ||
                    (u.email || "").toLowerCase().includes(q) ||
                    (u.phone || "").toLowerCase().includes(q)
                );
            });
    }, [users, search, roleFilter]);

    const openEdit = (u) => {
        setEditing({
            ...u,
            name: u?.name || "",
            phone: u?.phone || "",
            photoURL: u?.photoURL || "",
            role: u?.role || "student",
            status: u?.status || "active",
            isVerified: !!u?.isVerified,
        });
    };

    const saveEdit = async () => {
        if (!editing?._id) return;

        setSaving(true);
        try {
            const payload = {
                name: editing.name,
                phone: editing.phone,
                photoURL: editing.photoURL,
                role: editing.role,
                status: editing.status,
                isVerified: editing.isVerified,
            };

            await axiosSecure.patch(`/users/${editing._id}`, payload);

            setUsers((prev) =>
                prev.map((u) => (u._id === editing._id ? { ...u, ...payload } : u))
            );

            setEditing(null);
            Swal.fire({ icon: "success", title: "Updated", text: "User updated successfully." });
        } catch (e) {
            console.error(e);
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: e?.response?.data?.message || "Update failed",
            });
        } finally {
            setSaving(false);
        }
    };

    const deleteUser = async (u) => {
        const confirm = await Swal.fire({
            title: "Delete this user?",
            text: `${u?.email} will be removed permanently.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete",
            confirmButtonColor: "#ef4444",
        });

        if (!confirm.isConfirmed) return;

        try {
            await axiosSecure.delete(`/users/${u._id}`);
            setUsers((prev) => prev.filter((x) => x._id !== u._id));
            Swal.fire({ icon: "success", title: "Deleted" });
        } catch (e) {
            console.error(e);
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: e?.response?.data?.message || "Delete failed",
            });
        }
    };

    if (!user?.email) {
        return (
            <div className="p-4 lg:p-8">
                <div className="alert alert-warning">
                    <span>Please login.</span>
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
                    <h1 className="text-2xl font-bold">User Management</h1>
                    <p className="opacity-70 mt-1">
                        Manage user profiles, roles, verification and account status.
                    </p>
                </div>

                <button className="btn btn-outline" onClick={fetchUsers}>
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
                <input
                    className="input input-bordered w-full"
                    placeholder="Search by name/email/phone"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="select select-bordered w-full"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="all">All roles</option>
                    <option value="student">Student</option>
                    <option value="tutor">Tutor</option>
                    <option value="admin">Admin</option>
                </select>

                <div className="card bg-base-100 border">
                    <div className="card-body py-3">
                        <p className="font-semibold">Total users: {filtered.length}</p>
                    </div>
                </div>
            </div>

            <div className="card bg-base-100 shadow mt-6">
                <div className="card-body">
                    {filtered.length === 0 ? (
                        <div className="alert">
                            <span>No users found.</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Verified</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((u) => (
                                        <tr key={u._id}>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="w-10 rounded-full">
                                                            <img src={u.photoURL || fallbackImg} alt="user" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold">{u.name || "No name"}</div>
                                                        <div className="text-sm opacity-70">{u.email}</div>
                                                        <div className="text-xs opacity-60">{u.phone || ""}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <span className="badge badge-outline">{u.role || "student"}</span>
                                            </td>

                                            <td>
                                                <span className={`badge ${u.status === "blocked" ? "badge-error" : "badge-success"}`}>
                                                    {u.status || "active"}
                                                </span>
                                            </td>

                                            <td>
                                                <span className={`badge ${u.isVerified ? "badge-info" : "badge-ghost"}`}>
                                                    {u.isVerified ? "verified" : "not verified"}
                                                </span>
                                            </td>

                                            <td className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="btn btn-sm btn-primary" onClick={() => openEdit(u)}>
                                                        Edit
                                                    </button>
                                                    <button className="btn btn-sm btn-error text-white" onClick={() => deleteUser(u)}>
                                                        Delete
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

            {/* Edit modal */}
            {editing && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Edit User</h3>

                        <div className="mt-4 space-y-3">
                            <div>
                                <label className="label"><span className="label-text font-semibold">Name</span></label>
                                <input
                                    className="input input-bordered w-full"
                                    value={editing.name}
                                    onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value }))}
                                />
                            </div>

                            <div>
                                <label className="label"><span className="label-text font-semibold">Phone</span></label>
                                <input
                                    className="input input-bordered w-full"
                                    value={editing.phone}
                                    onChange={(e) => setEditing((p) => ({ ...p, phone: e.target.value }))}
                                />
                            </div>

                            <div>
                                <label className="label"><span className="label-text font-semibold">Photo URL</span></label>
                                <input
                                    className="input input-bordered w-full"
                                    value={editing.photoURL}
                                    onChange={(e) => setEditing((p) => ({ ...p, photoURL: e.target.value }))}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="label"><span className="label-text font-semibold">Role</span></label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={editing.role}
                                        onChange={(e) => setEditing((p) => ({ ...p, role: e.target.value }))}
                                    >
                                        <option value="student">Student</option>
                                        <option value="tutor">Tutor</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="label"><span className="label-text font-semibold">Status</span></label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={editing.status}
                                        onChange={(e) => setEditing((p) => ({ ...p, status: e.target.value }))}
                                    >
                                        <option value="active">Active</option>
                                        <option value="blocked">Blocked</option>
                                    </select>
                                </div>
                            </div>

                            <label className="label cursor-pointer gap-3 justify-start">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary"
                                    checked={editing.isVerified}
                                    onChange={(e) => setEditing((p) => ({ ...p, isVerified: e.target.checked }))}
                                />
                                <span className="label-text font-semibold">Verified</span>
                            </label>
                        </div>

                        <div className="modal-action">
                            <button className="btn" onClick={() => setEditing(null)} disabled={saving}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={saveEdit} disabled={saving}>
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>

                    <div className="modal-backdrop" onClick={() => !saving && setEditing(null)} />
                </div>
            )}
        </div>
    );
};

export default UserManagement;