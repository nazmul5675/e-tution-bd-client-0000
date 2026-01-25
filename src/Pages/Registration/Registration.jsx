import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../Context/AuthContext";

const Registration = () => {
    const { registerUserWithEmailPass } = useContext(AuthContext);
    const [role, setRole] = useState("student");

    // Initialize react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const result = await registerUserWithEmailPass(data.email, data.password);
        console.log(result.user);

    };

    return (
        <div className="flex justify-center items-center min-h-screen ">
            <div className="card w-full max-w-md shadow-2xl p-8 rounded-3xl ">
                <h2 className="text-3xl font-bold text-center text-primary mb-6">
                    Create an Account
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    {/* Name */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold">Name</span>
                        </label>
                        <input
                            {...register("name", { required: "Name is required" })}
                            type="text"
                            placeholder="Enter your full name"
                            className="input input-bordered w-full"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold">Email</span>
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
                            className="input input-bordered w-full"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold">Password</span>
                        </label>
                        <input
                            {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                            type="password"
                            placeholder="Enter your password"
                            className="input input-bordered w-full"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    {/* Role Selection */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold">Register As</span>
                        </label>
                        <select
                            {...register("role")}
                            className="select select-bordered w-full"
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
                            <span className="label-text font-semibold">Phone</span>
                        </label>
                        <input
                            {...register("phone", { required: "Phone number is required" })}
                            type="text"
                            placeholder="Enter your phone number"
                            className="input input-bordered w-full"
                        />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                    </div>

                    {/* Register Button */}
                    <div className="form-control mt-4">
                        <button type="submit" className="btn btn-primary w-full text-white">
                            Register
                        </button>
                    </div>
                </form>

                {/* Footer */}
                <p className="text-center mt-4 text-gray-500">
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
