import { CircleCheckBig, GraduationCap, Pin } from "lucide-react";
import React from "react";

const HowThePlatformWorks = () => {
    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-8 lg:gap-12">
                {/* Step 1 */}
                <div className="bg-base-300/70 backdrop-blur p-8 rounded-box border border-base-300 shadow-lg transform hover:-translate-y-2 hover:rotate-1 transition-all relative flex-1">
                    <div className="w-16 h-16 bg-primary/15 text-primary flex items-center justify-center rounded-full mb-6 text-3xl ring-1 ring-primary/20">
                        <Pin />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-base-content mb-3">
                        Post Tuition
                    </h3>
                    <p className="text-base md:text-lg text-base-content/80">
                        Students post tuition requirements with class, subject, location, and budget.
                    </p>
                    <div className="absolute -top-5 -right-5 w-16 h-16 bg-secondary/10 rounded-full"></div>
                </div>

                {/* Step 2 */}
                <div className="bg-base-300/70 backdrop-blur p-8 rounded-box border border-base-300 shadow-lg transform hover:-translate-y-2 hover:-rotate-1 transition-all relative flex-1">
                    <div className="w-16 h-16 bg-primary/15 text-primary flex items-center justify-center rounded-full mb-6 text-3xl ring-1 ring-primary/20">
                        <GraduationCap />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-base-content mb-3">
                        Tutor Applications
                    </h3>
                    <p className="text-base md:text-lg text-base-content/80">
                        Tutors browse posts and apply with qualifications, experience, and expected salary.
                    </p>
                    <div className="absolute -bottom-5 -left-5 w-16 h-16 bg-secondary/10 rounded-full"></div>
                </div>

                {/* Step 3 */}
                <div className="bg-base-300/70 backdrop-blur p-8 rounded-box border border-base-300 shadow-lg transform hover:-translate-y-2 hover:rotate-2 transition-all relative flex-1">
                    <div className="w-16 h-16 bg-primary/15 text-primary flex items-center justify-center rounded-full mb-6 text-3xl ring-1 ring-primary/20">
                        <CircleCheckBig />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-base-content mb-3">
                        Approval &amp; Payment
                    </h3>
                    <p className="text-base md:text-lg text-base-content/80">
                        Admin verifies tutors &amp; posts. Students approve tutors and complete payments.
                    </p>
                    <div className="absolute -top-5 -left-5 w-16 h-16 bg-secondary/10 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default HowThePlatformWorks;