import React from "react";

const Loader = ({ text = "Loading..." }) => {
    return (
        <div className="min-h-screen w-full grid place-items-center bg-base-200">
            <div className="flex flex-col items-center gap-3">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="text-sm opacity-70">{text}</p>
            </div>
        </div>
    );
};

export default Loader;
