import { CircleCheckBig, GraduationCap, Pin } from 'lucide-react';
import React from 'react';

const HowThePlatformWorks = () => {
    return (
        <div>

            <div className="flex flex-col sm:flex-row gap-12">
                {/* Step 1 */}
                <div className="bg-white p-10 rounded-3xl shadow-2xl transform hover:-translate-y-4 hover:rotate-1 transition-all relative flex-1">
                    <div className="w-16 h-16 bg-primary to-secondary flex items-center justify-center rounded-full mb-6 text-3xl text-white">
                        <Pin />
                    </div>
                    <h3 className="text-2xl font-bold text-secondary mb-4">Post Tuition</h3>
                    <p className="text-lg dark:text-secondary">
                        Students post tuition requirements with class, subject, location, and budget.
                    </p>
                    <div className="absolute -top-5 -right-5 w-16 h-16 bg-secondary rounded-full opacity-10"></div>
                </div>

                {/* Step 2 */}
                <div className="bg-white p-10 rounded-3xl shadow-2xl transform hover:-translate-y-4 hover:-rotate-1 transition-all relative flex-1">
                    <div className="w-16 h-16 bg-primary to-secondary flex items-center justify-center rounded-full mb-6 text-3xl text-white">
                        <GraduationCap />
                    </div>
                    <h3 className="text-2xl font-bold text-secondary mb-4">Tutor Applications</h3>
                    <p className=" text-lg dark:text-secondary">
                        Tutors browse posts and apply with qualifications, experience, and expected salary.
                    </p>
                    <div className="absolute -bottom-5 -left-5 w-16 h-16 bg-secondary rounded-full opacity-10"></div>
                </div>

                {/* Step 3 */}
                <div className="bg-white p-10 rounded-3xl shadow-2xl transform hover:-translate-y-4 hover:rotate-2 transition-all relative flex-1">
                    <div className="w-16 h-16 bg-primary to-secondary  flex items-center justify-center rounded-full mb-6 text-3xl text-white">
                        <CircleCheckBig />
                    </div>
                    <h3 className="text-2xl font-bold text-secondary mb-4">Approval & Payment</h3>
                    <p className="text-lg dark:text-secondary">
                        Admin verifies tutors & posts. Students approve tutors and complete payments.
                    </p>
                    <div className="absolute -top-5 -left-5 w-16 h-16 bg-secondary rounded-full opacity-10"></div>
                </div>
            </div>
        </div>
    );
};

export default HowThePlatformWorks;