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
                element: <MyTuitions></MyTuitions>
            },
            {
                path: 'applied-tutors',
                element: <AppliedTutors></AppliedTutors>
            },
            {
                path: 'payments',
                element: <Payments></Payments>
            },
            {
                path: 'post-tuition',
                element: <PostNewTuition></PostNewTuition>
            },
            {
                path: 'profile-settings',
                element: <ProfileSettings></ProfileSettings>
            },
            //tutor page
            {
                path: "my-applications",
                element: <MyApplications></MyApplications>
            },
            {
                path: "tutor-ongoing-tuitions",
                element: <TutorOngoingTuitions></TutorOngoingTuitions>
            },
            {
                path: "revenue-history",
                element: <RevenueHistory></RevenueHistory>
            },
            //Admin Page
            {
                path: "user-management",
                element: <UserManagement></UserManagement>
            },
            {
                path: "tuition-management",
                element: <TuitionManagement></TuitionManagement>
            },
            {
                path: "reports-analytics",
                element: <ReportsAndAnalytics></ReportsAndAnalytics>
            }
        ]
    }
])