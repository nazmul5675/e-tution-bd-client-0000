import React from "react";
import { FaChalkboardTeacher, FaUsers, FaDollarSign } from "react-icons/fa";

const About = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <title>About</title>

            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-primary mb-4">About eTuitionBd</h1>
                <p className="text-lg md:text-xl max-w-2xl mx-auto text-base-content/80">
                    eTuitionBd is a modern platform that connects students with qualified tutors,
                    enabling seamless tuition management, secure payments, and structured communication.
                </p>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                <div className="p-6 rounded-box border border-base-300 bg-base-300/70 backdrop-blur shadow-lg transition-transform hover:scale-[1.02]">
                    <FaChalkboardTeacher className="text-4xl text-primary mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2 text-base-content">Find Qualified Tutors</h2>
                    <p className="text-base-content/80">
                        Browse verified tutors for any subject and class. Easy matching for students.
                    </p>
                </div>

                <div className="p-6 rounded-box border border-base-300 bg-base-300/70 backdrop-blur shadow-lg transition-transform hover:scale-[1.02]">
                    <FaUsers className="text-4xl text-primary mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2 text-base-content">Student-Tutor Connection</h2>
                    <p className="text-base-content/80">
                        Automated workflows reduce friction and improve communication between students and tutors.
                    </p>
                </div>

                <div className="p-6 rounded-box border border-base-300 bg-base-300/70 backdrop-blur shadow-lg transition-transform hover:scale-[1.02]">
                    <FaDollarSign className="text-4xl text-primary mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2 text-base-content">Transparent Payments</h2>
                    <p className="text-base-content/80">
                        Secure payment tracking for every tuition. Only approved tutors get paid.
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="mt-20 text-center">
                <h2 className="text-3xl font-bold text-primary mb-6">Our Mission</h2>
                <p className="text-lg max-w-3xl mx-auto text-base-content/80">
                    Our mission is to make quality education accessible and trustworthy for every student.
                    We ensure verified tutors, transparent tuition processes, and a seamless learning experience.
                </p>
            </div>
        </div>
    );
};

export default About;