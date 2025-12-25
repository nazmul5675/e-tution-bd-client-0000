import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Lightbulb, Monitor } from "lucide-react";

const teachingSteps = [
    {
        icon: <BookOpen size={32} />,
        title: "Structured Curriculum",
        desc: "We design step-by-step lessons for each subject, ensuring students grasp concepts fully before moving forward.",
    },
    {
        icon: <Lightbulb size={32} />,
        title: "Interactive Learning",
        desc: "Our tutors use quizzes, discussions, and practical exercises to make learning engaging and retainable.",
    },
    {
        icon: <Monitor size={32} />,
        title: "Digital Tracking",
        desc: "Students progress is tracked via our platform, with personalized reports and feedback from tutors.",
    },
];

const HowWeTeach = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 py-28 ">

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                {teachingSteps.map((step, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.3, type: "spring", stiffness: 120 }}
                        className=" backdrop-blur-lg rounded-3xl shadow-2xl p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-3xl transition-all cursor-pointer"
                    >
                        <div className="w-16 h-16 rounded-full bg-primary to-secondary flex items-center justify-center mb-6 text-white ">
                            {step.icon}
                        </div>
                        <h3 className="text-2xl font-semibold  mb-3">{step.title}</h3>
                        <p className=" text-lg leading-relaxed">{step.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default HowWeTeach;
