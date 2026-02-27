import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate, useLocation } from "react-router";
import useAxios from "../../Hooks/useAxios";
import { Eye, EyeOff } from "lucide-react";
const Registration = () => {
    const { registerUserWithEmailPass, updateUser, showToast } = useContext(AuthContext);
    const [role, setRole] = useState("student");
    const axiosSecure = useAxios();
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const from = location.state?.from?.pathname || "/";

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            await registerUserWithEmailPass(data.email, data.password);
            await updateUser({ displayName: data.name });

            const userInfo = {
                name: data.name,
                email: data.email,
                role: data.role,
                phone: data.phone,
                createdAt: new Date().toISOString(),
            };

            await axiosSecure.post("/users", userInfo);

            showToast("Registration Successful 🎉", "success");

            setTimeout(() => {
                navigate(from, { replace: true });
            }, 800);
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                showToast("Email already registered ❌", "error");
            } else {
                showToast("Registration Failed ❌", "error");
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-base-100 text-base-content">
            <title>Registration</title>

            <div className="w-full max-w-md rounded-box border border-base-300 bg-base-300/70 backdrop-blur shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center text-primary mb-6">
                    Create an Account
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    {/* Name */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold text-base-content">Name</span>
                        </label>
                        <input
                            {...register("name", { required: "Name is required" })}
                            type="text"
                            placeholder="Enter your full name"
                            className="input input-bordered w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        />
                        {errors.name && (
                            <p className="text-error text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold text-base-content">Email</span>
                        </label>
                        <input
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: "Invalid email address",
                                },
                            })}
                            type="email"
                            placeholder="Enter your email"
                            className="input input-bordered w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        />
                        {errors.email && (
                            <p className="text-error text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold text-base-content">
                                Password
                            </span>
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="input input-bordered w-full pr-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                                })}
                            />
                            {/* Eye Toggle Button */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/70 hover:text-primary transition"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {errors.password && (
                            <p className="text-error text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Role Selection */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold text-base-content">Register As</span>
                        </label>
                        <select
                            {...register("role")}
                            className="select select-bordered w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="student">Student</option>
                            <option value="tutor">Tutor</option>
                        </select>
                    </div>

                    {/* Phone */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold text-base-content">Phone</span>
                        </label>
                        <input
                            {...register("phone", { required: "Phone number is required" })}
                            type="text"
                            placeholder="Enter your phone number"
                            className="input input-bordered w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        />
                        {errors.phone && (
                            <p className="text-error text-sm mt-1">{errors.phone.message}</p>
                        )}
                    </div>

                    {/* Register Button */}
                    <div className="form-control mt-4">
                        <button type="submit" className="btn btn-primary w-full text-primary-content">
                            Register
                        </button>
                    </div>
                </form>

                {/* Footer */}
                <p className="text-center mt-4 text-base-content/70">
                    Already have an account?{" "}
                    <a className="text-primary font-semibold" href="/login">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Registration;