import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
import GoogleLogin from "../../Components/SocialMediaLogin/GoogleLogin";
import { Eye, EyeOff } from "lucide-react";
const Login = () => {

    const { signInUser, showToast } = useContext(AuthContext);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const from = location.state?.from?.pathname || "/";

    const onSubmit = async (data) => {
        try {
            await signInUser(data.email, data.password);
            showToast("Login Successful 🎉", "success");
            setTimeout(() => {
                navigate(from, { replace: true });
            }, 100);
        } catch (err) {
            showToast("Invalid Email or Password ❌", "error");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-base-100 text-base-content">
            {/* NOTE: keeping your <title> as you requested */}
            <title>Login</title>

            <div className="w-full max-w-md rounded-box border border-base-300 bg-base-300/70 backdrop-blur shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center text-primary mb-6">
                    Login to Your Account
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    {/* Email */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold text-base-content">
                                Email
                            </span>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="input input-bordered w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            {...register("email", {
                                required: "Email is required",
                                pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
                            })}
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
                                {...register("password", { required: "Password is required" })}
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

                    {/* Login Button */}
                    <div className="form-control mt-4">
                        <button type="submit" className="btn btn-primary w-full text-primary-content">
                            Login
                        </button>
                    </div>
                </form>

                <div className="divider text-base-content/70">OR</div>

                <div className="flex flex-col gap-3">
                    <GoogleLogin />
                </div>

                <p className="text-center mt-4 text-base-content/70">
                    Don&apos;t have an account?{" "}
                    <Link className="text-primary font-semibold" to="/register">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;