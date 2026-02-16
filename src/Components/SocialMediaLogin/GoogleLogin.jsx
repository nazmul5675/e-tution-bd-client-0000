import { useContext } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate, useLocation } from 'react-router';
import { AuthContext } from '../../Context/AuthContext';
import useAxios from '../../Hooks/useAxios';

const GoogleLogin = () => {
    const { GoogleLogin } = useContext(AuthContext);
    const axiosSecure = useAxios();

    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const logInWithGoogle = async (e) => {
        e.preventDefault();
        try {
            const result = await GoogleLogin();
            console.log(result);

            const userInfo = {
                name: result.user.displayName,
                email: result.user.email,
                photoURL: result.user.photoURL,
                role: "student",
            };

            // save user to database
            await axiosSecure.post('/users', userInfo);
            navigate(from, { replace: true });

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <button onClick={logInWithGoogle} className="btn btn-outline btn-primary w-full">
            <FcGoogle size={22} /> Login with Google
        </button>
    );
};

export default GoogleLogin;
