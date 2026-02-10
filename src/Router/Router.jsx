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
                path: 'myTuitions',
                element: <MyTuitions></MyTuitions>
            },
            {
                path: 'appliedTutors',
                element: <AppliedTutors></AppliedTutors>
            },
            {
                path: 'payments',
                element: <Payments></Payments>
            },
            {
                path: 'postNewTuition',
                element: <PostNewTuition></PostNewTuition>
            },
            {
                path: 'profileSettings',
                element: <ProfileSettings></ProfileSettings>
            },
            //tutor page
            {
                path: "myApplications",
                element: <MyApplications></MyApplications>
            },
            {
                path: "tutorOngoingTuitions",
                element: <TutorOngoingTuitions></TutorOngoingTuitions>
            },
            {
                path: "revenueHistory",
                element: <RevenueHistory></RevenueHistory>
            },
            //Admin Page
            {
                path: "userManagement",
                element: <UserManagement></UserManagement>
            },
            {
                path: "tuitionManagement",
                element: <TuitionManagement></TuitionManagement>
            },
            {
                path: "reportsAndAnalytics",
                element: <ReportsAndAnalytics></ReportsAndAnalytics>
            }
        ]
    }
])