import React, { useContext, useEffect, useMemo, useState } from "react";
import {
    FaChartLine,
    FaClipboardCheck,
    FaClipboardList,
    FaHome,
    FaMoneyCheckAlt,
    FaTasks,
    FaUserCheck,
    FaUserCog,
    FaUsersCog,
} from "react-icons/fa";
import { MdAnalytics, MdAssignment, MdPostAdd } from "react-icons/md";


import { Link, NavLink, Outlet } from "react-router";

import Swal from "sweetalert2";
import useAxios from "../Hooks/useAxios";
import { AuthContext } from "../Context/AuthContext";

const DashboardLayout = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxios();

    const [role, setRole] = useState(null);
    const [loadingRole, setLoadingRole] = useState(true);

    // load role from DB
    useEffect(() => {
        const loadRole = async () => {
            if (!user?.email) {
                setRole(null);
                setLoadingRole(false);
                return;
            }

            setLoadingRole(true);
            try {
                const res = await axiosSecure.get(
                    `/users/profile?email=${encodeURIComponent(user.email)}`
                );
                setRole((res?.data?.role || "student").toLowerCase());
            } catch (e) {
                console.error(e);
                Swal.fire({
                    icon: "error",
                    title: "Role load failed",
                    text: e?.response?.data?.message || "Could not load user role",
                });
                setRole("student"); // fallback
            } finally {
                setLoadingRole(false);
            }
        };

        loadRole();
    }, [user?.email, axiosSecure]);

    //  menu config 
    const menuItems = useMemo(() => {
        const common = [
            {
                to: "/dashboard",
                label: "Homepage",
                icon: <FaHome />,
                tip: "Homepage",
                roles: ["student", "tutor", "admin"],
            },
            {
                to: "/dashboard/profile-settings",
                label: "Profile Settings",
                icon: <FaUserCog />,
                tip: "Profile Settings",
                roles: ["student", "tutor", "admin"],
            },
        ];

        const student = [
            {
                to: "/dashboard/my-tuitions",
                label: "My Tuitions",
                icon: <FaClipboardList />,
                tip: "My Tuitions",
                roles: ["student"],
            },
            {
                to: "/dashboard/applied-tutors",
                label: "Applied Tutors",
                icon: <FaUserCheck />,
                tip: "Applied Tutors",
                roles: ["student"],
            },
            {
                to: "/dashboard/payments",
                label: "Payments",
                icon: <FaMoneyCheckAlt />,
                tip: "Payments",
                roles: ["student"],
            },
            {
                to: "/dashboard/post-tuition",
                label: "Post New Tuition",
                icon: <MdPostAdd />,
                tip: "Post New Tuition",
                roles: ["student"],
            },
        ];

        const tutor = [
            {
                to: "/dashboard/my-applications",
                label: "My Applications",
                icon: <MdAssignment />,
                tip: "My Applications",
                roles: ["tutor"],
            },
            {
                to: "/dashboard/tutor-ongoing-tuitions",
                label: "Tutor Ongoing Tuitions",
                icon: <FaTasks />,
                tip: "Tutor Ongoing Tuitions",
                roles: ["tutor"],
            },
            {
                to: "/dashboard/revenue-history",
                label: "Revenue History",
                icon: <FaChartLine />,
                tip: "Revenue History",
                roles: ["tutor"],
            },
        ];

        const admin = [
            {
                to: "/dashboard/user-management",
                label: "User Management",
                icon: <FaUsersCog />,
                tip: "User Management",
                roles: ["admin"],
            },
            {
                to: "/dashboard/tuition-management",
                label: "Tuition Management",
                icon: <FaClipboardCheck />,
                tip: "Tuition Management",
                roles: ["admin"],
            },
            {
                to: "/dashboard/reports-analytics",
                label: "Reports & Analytics",
                icon: <MdAnalytics />,
                tip: "Reports & Analytics",
                roles: ["admin"],
            },
        ];

        return [...common, ...student, ...tutor, ...admin];
    }, []);

    //  filter menu by role
    const filteredMenu = useMemo(() => {
        const r = (role || "student").toLowerCase();
        return menuItems.filter((item) => item.roles.includes(r));
    }, [menuItems, role]);

    //  show spinner until role loads (prevents flash of wrong menu)
    if (loadingRole) {
        return (
            <div className="p-4 lg:p-8">
                <div className="min-h-[40vh] grid place-items-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            </div>
        );
    }

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content">
                {/* Navbar */}
                <nav className="navbar w-full bg-base-300">
                    <label
                        htmlFor="my-drawer-4"
                        aria-label="open sidebar"
                        className="btn btn-square btn-ghost"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2"
                            fill="none"
                            stroke="currentColor"
                            className="my-1.5 inline-block size-4"
                        >
                            <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                            <path d="M9 4v16"></path>
                            <path d="M14 10l2 2l-2 2"></path>
                        </svg>
                    </label>

                    <Link to="/" className="text-xl text-primary font-black mx-4">
                        eTuitionBd
                    </Link>

                    {/* show current role on navbar */}
                    <div className="ml-auto mr-4 opacity-70 text-sm">
                        Role: <span className="font-semibold capitalize">{role || "student"}</span>
                    </div>
                </nav>

                {/* Page content here */}
                <Outlet />
            </div>

            <div className="drawer-side is-drawer-close:overflow-visible">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>

                <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
                    <ul className="menu w-full grow">
                        {/*  render filtered menu */}
                        {filteredMenu.map((item) => (
                            <li key={item.to}>
                                <NavLink
                                    to={item.to}
                                    end
                                    className={({ isActive }) =>
                                        `is-drawer-close:tooltip is-drawer-close:tooltip-right ${isActive ? "bg-primary font-bold text-white" : "font-bold"
                                        }`
                                    }
                                    data-tip={item.tip}
                                >
                                    {item.icon}
                                    <span className="is-drawer-close:hidden">{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
