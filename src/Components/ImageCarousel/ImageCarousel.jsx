import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import LibraryImg from "../../assets/Library-bro.svg";
import MathImg from "../../assets/Mathematics-amico.svg";
import SoftwareImg from "../../assets/software tester-pana.svg";
import teacherStudent from '../../assets/Teacher student-bro.svg'
import { ArrowBigLeftDash, ArrowBigRightDash } from "lucide-react";

const images = [LibraryImg, MathImg, SoftwareImg, teacherStudent];

const ImageCarousel = () => {
    const [current, setCurrent] = useState(0);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="relative w-full max-w-7xl h-[500px] mx-auto overflow-hidden rounded-box border border-base-300 bg-base-300/70 backdrop-blur shadow-lg px-10 flex items-center justify-center mb-32">
            <AnimatePresence initial={false}>
                <motion.img
                    key={current}
                    src={images[current]}
                    alt={`Slide ${current + 1}`}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="absolute w-8/12 left-1/2 -translate-x-1/2 object-contain"
                />
            </AnimatePresence>

            {/* Navigation */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-primary/50 text-white p-2 rounded-full hover:bg-primary transition"
            >
                <ArrowBigLeftDash />
            </button>
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-primary/50 text-white p-2 rounded-full hover:bg-primary transition"
            >
                <ArrowBigRightDash />
            </button>
        </div>
    );
};

export default ImageCarousel;
