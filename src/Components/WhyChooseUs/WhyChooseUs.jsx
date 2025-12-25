import { CreditCard, Star, Zap } from 'lucide-react';
import React from 'react';

const WhyChooseUs = () => {
    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
                {/* Feature 1 */}
                <div className="bg-white p-10 rounded-3xl shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all relative">
                    <div className="absolute -top-5 -left-5 w-20 h-20 bg-primary opacity-10 rounded-full"></div>
                    <div className="w-16 h-16 bg-primary to-secondary text-white flex items-center justify-center rounded-full mb-6 text-3xl">
                        <Star />
                    </div>
                    <h3 className="text-2xl font-bold text-secondary mb-4">Verified Tutors</h3>
                    <p className="text- dark:text-secondary">
                        Only qualified and verified tutors ensure quality learning.
                    </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-white p-10 rounded-3xl shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all relative">
                    <div className="absolute -bottom-5 -right-5 w-20 h-20 bg-primary opacity-10 rounded-full"></div>
                    <div className="w-16 h-16 bg-primary to-secondary text-white flex items-center justify-center rounded-full mb-6 text-3xl">
                        <CreditCard />
                    </div>
                    <h3 className="text-2xl font-bold text-secondary mb-4">Secure Payments</h3>
                    <p className=" text- dark:text-secondary">
                        Transparent payment process. Tutors get paid only after approval.
                    </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-white p-10 rounded-3xl shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all relative">
                    <div className="absolute -top-5 -right-5 w-20 h-20 bg-primary opacity-10 rounded-full"></div>
                    <div className="w-16 h-16 bg-primary to-secondary text-white flex items-center justify-center rounded-full mb-6 text-3xl">
                        <Zap />
                    </div>
                    <h3 className="text-2xl font-bold text-secondary mb-4">Fast Matching</h3>
                    <p className=" text-lg dark:text-secondary">
                        Students and tutors are matched quickly based on requirements and preferences.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WhyChooseUs;