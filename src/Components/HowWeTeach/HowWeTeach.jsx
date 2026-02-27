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
        <section className="max-w-7xl mx-auto px-4 pb-24">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-10">
                {teachingSteps.map((step, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2, type: "spring", stiffness: 120 }}
                        className="
              bg-base-300/70 backdrop-blur
              rounded-box border border-base-300
              shadow-lg
              p-8
              flex flex-col items-center
              transition-transform duration-200
              hover:-translate-y-1 hover:scale-[1.02]
              cursor-pointer
              focus-within:ring-2 focus-within:ring-primary
            "
                    >
                        <div className="w-16 h-16 rounded-full bg-primary/15 text-primary ring-1 ring-primary/20 flex items-center justify-center mb-6">
                            {step.icon}
                        </div>

                        <h3 className="text-xl md:text-2xl font-semibold text-base-content mb-3 text-center">
                            {step.title}
                        </h3>

                        <p className="text-base md:text-lg text-center leading-relaxed text-base-content/80">
                            {step.desc}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default HowWeTeach;