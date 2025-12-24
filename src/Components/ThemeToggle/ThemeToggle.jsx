import React, { useState, useEffect } from "react";
import { MdNightlight } from "react-icons/md";
import { IoSunnySharp } from "react-icons/io5";
const ThemeToggle = () => {
    const [theme, setTheme] = useState(() => {
        // Initialize state from localStorage or default to 'light'
        return localStorage.getItem("theme") || "light";
    });

    // Sync theme with document and localStorage whenever it changes
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    // Toggle between light and dark themes
    const toggleTheme = () => {
        setTheme(prev => (prev === "light" ? "dark" : "light"));
    };

    return (
        <div className="">
            <button
                className="btn btn-sm bg-primary/20 px-4 rounded-full"
                onClick={toggleTheme}
            >
                {theme === "light" ? <IoSunnySharp /> : <MdNightlight />}
            </button>
        </div>
    );
};

export default ThemeToggle;
