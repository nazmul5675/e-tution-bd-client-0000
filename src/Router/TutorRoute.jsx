import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../Context/AuthContext";
import useAxios from "../Hooks/useAxios";
import Loader from "../Components/Loader/Loader";

const TutorRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const axiosSecure = useAxios();
    const location = useLocation();

    const [roleLoading, setRoleLoading] = useState(true);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const loadRole = async () => {
            if (!user?.email) return;
            try {
                const res = await axiosSecure.get(`/users/profile?email=${encodeURIComponent(user.email)}`);
                setRole((res?.data?.role || "student").toLowerCase());
            } finally {
                setRoleLoading(false);
            }
        };
        loadRole();
    }, [user?.email, axiosSecure]);

    if (loading || roleLoading) return <Loader />;

    if (!user?.email) return <Navigate to="/login" state={{ from: location }} replace />;

    if (role !== "tutor") return <Navigate to="/dashboard" replace />;

    return children;
};

export default TutorRoute;
