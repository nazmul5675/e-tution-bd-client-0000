import React from 'react';

const Login = () => {
    return (
        <div className="flex justify-center items-center min-h-screen ">
            <div className="card w-full max-w-md shadow-2xl  p-8 rounded-3xl">
                <h2 className="text-3xl font-bold text-center text-primary mb-6">Login to Your Account</h2>

                <form className="space-y-4">
                    {/* Email */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold">Email</span>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="input input-bordered w-full"
                        />
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
                        />
                    </div>

                    {/* Login Button */}
                    <div className="form-control mt-4">
                        <button className="btn btn-primary w-full text-white">Login</button>
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
                    Don't have an account? <a className="text-primary font-semibold" href="/register">Register</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
