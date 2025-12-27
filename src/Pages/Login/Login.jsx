import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log("Login Data:", data);

    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="card w-full max-w-md shadow-2xl p-8 rounded-3xl">
                <h2 className="text-3xl font-bold text-center text-primary mb-6">
                    Login to Your Account
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    {/* Email */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold">Email</span>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="input input-bordered w-full"
                            {...register("email", {
                                required: "Email is required",
                                pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" }
                            })}
                        />
                        {errors.email && <p className="text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold">Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="input input-bordered w-full"
                            {...register("password", { required: "Password is required" })}
                        />
                        {errors.password && <p className="text-red-500 mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Login Button */}
                    <div className="form-control mt-4">
                        <button type="submit" className="btn btn-primary w-full text-white">
                            Login
                        </button>
                    </div>
                </form>

                {/* Divider */}
                <div className="divider">OR</div>

                {/* Social Login */}
                <div className="flex flex-col gap-3">
                    <button className="btn btn-outline btn-primary w-full">
                        Login with Google
                    </button>
                </div>

                {/* Footer */}
                <p className="text-center mt-4 text-gray-500">
                    Don't have an account?{" "}
                    <Link className="text-primary font-semibold" href="/register">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
