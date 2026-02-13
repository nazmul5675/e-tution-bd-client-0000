import { FaBookOpen, FaChartLine, FaClipboardCheck, FaClipboardList, FaHome, FaMoneyCheckAlt, FaTasks, FaUserCheck, FaUserCog, FaUsersCog } from "react-icons/fa";
import { MdAnalytics, MdAssignment, MdPostAdd } from "react-icons/md";
import { Link, NavLink, Outlet } from "react-router";


const DashboardLayout = () => {
    return (
        <div>
            <div>
                <div className="drawer lg:drawer-open">
                    <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content">
                        {/* Navbar */}
                        <nav className="navbar w-full bg-base-300">
                            <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
                                {/* Sidebar toggle icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
                            </label>
                            <Link to="/" className="text-xl text-primary font-black mx-4">eTuitionBd</Link>
                        </nav>
                        {/* Page content here */}
                        <Outlet></Outlet>
                    </div>

                    <div className="drawer-side is-drawer-close:overflow-visible">
                        <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
                            {/* Sidebar content here */}
                            <ul className="menu w-full grow">
                                {/* List item */}


                                <li>
                                    <NavLink to="/dashboard" end className={({ isActive }) =>
                                        `is-drawer-close:tooltip is-drawer-close:tooltip-right ${isActive ? "bg-primary font-bold text-white" : "font-bold"
                                        }`
                                    } data-tip="Homepage">

                                        <FaHome />
                                        <span className="is-drawer-close:hidden">Homepage</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/my-tuitions" end className={({ isActive }) =>
                                        `is-drawer-close:tooltip is-drawer-close:tooltip-right ${isActive ? "bg-primary font-bold text-white" : "font-bold"
                                        }`
                                    } data-tip="My Tuitions">

                                        <FaClipboardList />
                                        <span className="is-drawer-close:hidden">My Tuitions</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/applied-tutors" end className={({ isActive }) =>
                                        `is-drawer-close:tooltip is-drawer-close:tooltip-right ${isActive ? "bg-primary font-bold text-white" : "font-bold"
                                        }`
                                    } data-tip="Applied Tutors">

                                        <FaUserCheck />
                                        <span className="is-drawer-close:hidden">Applied Tutors</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/payments" end className={({ isActive }) =>
                                        `is-drawer-close:tooltip is-drawer-close:tooltip-right ${isActive ? "bg-primary font-bold text-white" : "font-bold"
                                        }`
                                    } data-tip="Payments">

                                        <FaMoneyCheckAlt />
                                        <span className="is-drawer-close:hidden">Payments</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/post-tuition" end className={({ isActive }) =>
                                        `is-drawer-close:tooltip is-drawer-close:tooltip-right ${isActive ? "bg-primary font-bold text-white" : "font-bold"
                                        }`
                                    } data-tip="Post New Tuition">

                                        <MdPostAdd />
                                        <span className="is-drawer-close:hidden">Post New Tuition</span>
                                    </NavLink>
                                </li>



                                {/* tutor part start  */}
                                <li>
                                    <NavLink to="/dashboard/my-applications" end className={({ isActive }) =>
                                        `is-drawer-close:tooltip is-drawer-close:tooltip-right ${isActive ? "bg-primary font-bold text-white" : "font-bold"
                                        }`
                                    } data-tip="My Applications">

                                        <MdAssignment />
                                        <span className="is-drawer-close:hidden">My Applications</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/tutor-ongoing-tuitions" end className={({ isActive }) =>
                                        `is-drawer-close:tooltip is-drawer-close:tooltip-right ${isActive ? "bg-primary font-bold text-white" : "font-bold"
                                        }`
                                    } data-tip="Tutor Ongoing Tuitions">

                                        <FaTasks />
                                        <span className="is-drawer-close:hidden">Tutor Ongoing Tuitions</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/revenue-history" end className={({ isActive }) =>
                                        `is-drawer-close:tooltip is-drawer-close:tooltip-right ${isActive ? "bg-primary font-bold text-white" : "font-bold"
                                        }`
                                    } data-tip="Revenue History">

                                        <FaChartLine />
                                        <span className="is-drawer-close:hidden">Revenue History</span>
                                    </NavLink>
                                </li>
                                {/* Admin page  */}
                                <li>
                                    <NavLink to="/dashboard/user-management" end className={({ isActive }) =>
                                        `is-drawer-close:tooltip is-drawer-close:tooltip-right ${isActive ? "bg-primary font-bold text-white" : "font-bold"
                                        }`
                                    } data-tip="User Management">

                                        <FaUsersCog />
                                        <span className="is-drawer-close:hidden">User Management</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/tuition-management" end className={({ isActive }) =>
                                        `is-drawer-close:tooltip is-drawer-close:tooltip-right ${isActive ? "bg-primary font-bold text-white" : "font-bold"
                                        }`
                                    } data-tip="Tuition Management">

                                        <FaClipboardCheck />
                                        <span className="is-drawer-close:hidden">Tuition Management</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/reports-analytics" end className={({ isActive }) =>
                                        `is-drawer-close:tooltip is-drawer-close:tooltip-right ${isActive ? "bg-primary font-bold text-white" : "font-bold"
                                        }`
                                    } data-tip="Reports & Analytics">

                                        <MdAnalytics />
                                        <span className="is-drawer-close:hidden">Reports & Analytics</span>
                                    </NavLink>
                                </li>
                                {/* Profile setting for all */}
                                <li>
                                    <NavLink to="/dashboard/profile-settings" end className={({ isActive }) =>
                                        `is-drawer-close:tooltip is-drawer-close:tooltip-right ${isActive ? "bg-primary font-bold text-white" : "font-bold"
                                        }`
                                    } data-tip="Profile Settings">

                                        <FaUserCog />
                                        <span className="is-drawer-close:hidden">Profile Settings</span>
                                    </NavLink>
                                </li>


                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DashboardLayout;