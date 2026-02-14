import { createBrowserRouter } from "react-router";
import Home from "../Pages/Home/Home";
import HomeLayouts from "../Layouts/HomeLayouts";
import Tuitions from "../Pages/Tuitions/Tuitions";
import Tutor from "../Pages/Tutor/Tutor";
import About from "../Pages/About/About";
import Contact from "../Pages/Contact/Contact";
import Login from "../Pages/Login/Login";
import Registration from "../Pages/Registration/Registration"
import DashboardLayout from "../Layouts/DashboardLayout";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import DashboardHome from "../Pages/Dashboard/DashboardHome/DashboardHome";
import MyTuitions from "../Pages/Dashboard/MyTuitions/MyTuitions";
import AppliedTutors from "../Pages/Dashboard/AppliedTutors/AppliedTutors";
import Payments from "../Pages/Dashboard/Payments/Payments";
import PostNewTuition from "../Pages/Dashboard/PostNewTuition/PostNewTuition";
import ProfileSettings from "../Pages/Dashboard/ProfileSettings/ProfileSettings";
import MyApplications from "../Pages/Dashboard/MyApplications/MyApplications";
import TutorOngoingTuitions from "../Pages/Dashboard/TutorOngoingTuitions/TutorOngoingTuitions";
import RevenueHistory from "../Pages/Dashboard/RevenueHistory/RevenueHistory";
import UserManagement from "../Pages/Dashboard/UserManagement/UserManagement";
import TuitionManagement from "../Pages/Dashboard/TuitionManagement/TuitionManagement";
import ReportsAndAnalytics from "../Pages/Dashboard/ReportsAndAnalytics/ReportsAndAnalytics";
import TuitionDetails from "../Pages/Tuitions/TuitionDetails";
import TutorDetails from "../Pages/Tutor/TutorDetails";
import PrivateRoute from "./PrivateRoute";
import StudentRoute from "./StudentRoute";
import TutorRoute from "./TutorRoute";


export const router = createBrowserRouter([
    {
        path: "/",
        Component: HomeLayouts,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: "tuitions",
                element: <Tuitions></Tuitions>
            },
            {
                path: "tuitions/:id",
                element: <TuitionDetails />
            },
            {
                path: "tutors",
                element: <Tutor></Tutor>
            },
            {
                path: "tutors/:id",
                element: <TutorDetails />,
            },
            {
                path: "about",
                element: <About></About>
            },
            {
                path: "contact",
                element: <Contact></Contact>
            },
            {
                path: 'login',
                element: <Login></Login>
            },
            {
                path: 'register',
                element: <Registration></Registration>
            }
        ]

    },
    {
        path: "/dashboard",
        Component: DashboardLayout,
        children: [
            {
                index: true,
                Component: DashboardHome
            },
            // student page 
            {
                path: 'my-tuitions',
                element: <PrivateRoute>
                    <StudentRoute>
                        <MyTuitions></MyTuitions>
                    </StudentRoute>
                </PrivateRoute>
            },
            {
                path: 'applied-tutors',
                element: <PrivateRoute>
                    <StudentRoute>
                        <AppliedTutors></AppliedTutors>
                    </StudentRoute>
                </PrivateRoute>
            },
            {
                path: 'payments',
                element: <PrivateRoute>
                    <StudentRoute>
                        <Payments></Payments>
                    </StudentRoute>
                </PrivateRoute>
            },
            {
                path: 'post-tuition',
                element: <PrivateRoute>
                    <StudentRoute>
                        <PostNewTuition></PostNewTuition>
                    </StudentRoute>
                </PrivateRoute>
            },
            {
                path: 'profile-settings',
                element: <PrivateRoute><ProfileSettings></ProfileSettings></PrivateRoute>
            },
            //tutor page
            {
                path: "my-applications",
                element: <PrivateRoute>
                    <TutorRoute>
                        <MyApplications></MyApplications>
                    </TutorRoute>

                </PrivateRoute>
            },
            {
                path: "tutor-ongoing-tuitions",
                element: <PrivateRoute>
                    <TutorRoute>
                        <TutorOngoingTuitions></TutorOngoingTuitions>
                    </TutorRoute>
                </PrivateRoute>
            },
            {
                path: "revenue-history",
                element: <PrivateRoute>
                    <TutorRoute>
                        <RevenueHistory></RevenueHistory>
                    </TutorRoute>
                </PrivateRoute>
            },
            //Admin Page
            {
                path: "user-management",
                element: <PrivateRoute>

                    <UserManagement></UserManagement>
                </PrivateRoute>
            },
            {
                path: "tuition-management",
                element: <PrivateRoute><TuitionManagement></TuitionManagement></PrivateRoute>
            },
            {
                path: "reports-analytics",
                element: <PrivateRoute><ReportsAndAnalytics></ReportsAndAnalytics></PrivateRoute>
            }
        ]
    }
])