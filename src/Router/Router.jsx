import { createBrowserRouter } from "react-router";
import Home from "../Pages/Home/Home";
import HomeLayouts from "../Layouts/HomeLayouts";
import Tuitions from "../Pages/Tuitions/Tuitions";
import Tutor from "../Pages/Tutor/Tutor";
import About from "../Pages/About/About";
import Contact from "../Pages/Contact/Contact";
import Login from "../Pages/Login/Login";
import Registration from "../Pages/Registration/Registration"
import Dashboard from "../Pages/Dashboard/Dashboard";
import DashboardLayout from "../Layouts/DashboardLayout";


export const router = createBrowserRouter([
    {
        path: "/",
        Component: HomeLayouts,
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
                Component: Dashboard
            },
        ]
    }
])