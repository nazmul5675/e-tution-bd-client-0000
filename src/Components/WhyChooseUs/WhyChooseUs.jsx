import { CreditCard, Star, Zap } from "lucide-react";
import React from "react";

const WhyChooseUs = () => {
    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
                {/* Feature 1 */}
                <div className="bg-base-300/70 backdrop-blur p-8 rounded-box border border-base-300 shadow-lg transform hover:scale-[1.02] hover:-translate-y-1 transition-all relative">
                    <div className="absolute -top-5 -left-5 w-20 h-20 bg-primary/10 rounded-full"></div>

                    <div className="w-16 h-16 bg-primary/15 text-primary ring-1 ring-primary/20 flex items-center justify-center rounded-full mb-6 text-3xl">
                        <Star />
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-base-content mb-3">
                        Verified Tutors
                    </h3>

                    <p className="text-base md:text-lg text-base-content/80">
                        Only qualified and verified tutors ensure quality learning.
                    </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-base-300/70 backdrop-blur p-8 rounded-box border border-base-300 shadow-lg transform hover:scale-[1.02] hover:-translate-y-1 transition-all relative">
                    <div className="absolute -bottom-5 -right-5 w-20 h-20 bg-primary/10 rounded-full"></div>

                    <div className="w-16 h-16 bg-primary/15 text-primary ring-1 ring-primary/20 flex items-center justify-center rounded-full mb-6 text-3xl">
                        <CreditCard />
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-base-content mb-3">
                        Secure Payments
                    </h3>

                    <p className="text-base md:text-lg text-base-content/80">
                        Transparent payment process. Tutors get paid only after approval.
                    </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-base-300/70 backdrop-blur p-8 rounded-box border border-base-300 shadow-lg transform hover:scale-[1.02] hover:-translate-y-1 transition-all relative">
                    <div className="absolute -top-5 -right-5 w-20 h-20 bg-primary/10 rounded-full"></div>

                    <div className="w-16 h-16 bg-primary/15 text-primary ring-1 ring-primary/20 flex items-center justify-center rounded-full mb-6 text-3xl">
                        <Zap />
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-base-content mb-3">
                        Fast Matching
                    </h3>

                    <p className="text-base md:text-lg text-base-content/80">
                        Students and tutors are matched quickly based on requirements and preferences.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WhyChooseUs;