import React, { useContext } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { AuthContext } from '../../Context/AuthContext';
import useAxios from '../../Hooks/useAxios';

const GoogleLogin = () => {
    const { GoogleLogin } = useContext(AuthContext);
    const axiosSecure = useAxios();
    const logInWithGoogle = (e) => {
        e.preventDefault();
        GoogleLogin()
            .then((result) => {
                console.log(result);
                const userInfo = {
                    name: result.user.displayName,
                    email: result.user.email,
                    photoURL: result.user.photoURL,
                    role: "student", //  default for Google
                };

                axiosSecure.post('/users', userInfo)
                    .then(res => {
                        if (res.data.insertedId) {
                            alert('user created in successfully', "success");
                        }
                    })

            }).catch((error) => {
                console.log(error);
            });


    }
    return (
        <button onClick={logInWithGoogle} className="btn btn-outline btn-primary w-full">
            <FcGoogle size={22} /> Login with Google
        </button>
    );
};

export default GoogleLogin;