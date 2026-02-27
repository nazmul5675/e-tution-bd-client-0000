import bgImg from "../../assets/Teacher student-pana.svg";
import ImageCarousel from "../../Components/ImageCarousel/ImageCarousel";
import HowWeTeach from "../../Components/HowWeTeach/HowWeTeach";
import WhyChooseUs from "../../Components/WhyChooseUs/WhyChooseUs";
import HowThePlatformWorks from "../../Components/HowThePlatformWorks/HowThePlatformWorks";
import LatestTuitionPosts from "../../Components/LatestTuitionPosts/LatestTuitionPosts";
import LatestTutors from "../../Components/LatestTutors/LatestTutors";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { Link } from "react-router";

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="max-w-7xl mx-auto bg-base-100 text-base-content">
            <title>Home</title>

            {/* Hero section */}
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center p-5 gap-6">
                <div className="sm:w-1/2 w-full">
                    <h1 className="text-4xl font-bold text-base-content">
                        Country&apos;s <span className="text-primary">#1</span> Tutor Matching &amp; Learning Platform.
                    </h1>
                    <p className="mt-3 text-base-content/80">
                        Hire a conversant tutor to make your children&apos;s learning fun, comprehensive &amp; easier.
                    </p>

                    <Link to={user ? "/dashboard" : "/register"}>
                        <button className="mt-5 px-8 py-4 bg-primary text-primary-content rounded-btn font-semibold shadow-lg hover:scale-[1.02] transition-transform">
                            Get Started
                        </button>
                    </Link>
                </div>

                <div className="sm:w-1/2 w-full flex justify-center">
                    <img src={bgImg} alt="Teacher and student illustration" className="max-w-full" />
                </div>
            </div>

            {/* How the Platform Works */}
            <div className="px-4 py-24">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-primary mb-12 md:mb-16">
                    How the Platform Works
                </h2>
                <HowThePlatformWorks />
            </div>

            {/* Latest Tuition Posts */}
            <div className="px-4 py-24">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-primary mb-12 md:mb-16">
                    Latest Tuition Posts
                </h2>
                <LatestTuitionPosts />
            </div>

            {/* Latest Tutors */}
            <div className="px-4 py-24">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-primary mb-12 md:mb-16">
                    Latest Tutors
                </h2>
                <LatestTutors />
            </div>

            {/* Why Choose Us */}
            <div className="px-4 py-24">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-primary mb-12 md:mb-16">
                    Why Choose Us
                </h2>
                <WhyChooseUs />
            </div>

            {/* How We Teach + Carousel */}
            <div className="px-4 pt-24">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-primary mb-12 md:mb-16">
                    How We Teach Student
                </h2>

                <HowWeTeach />
                <ImageCarousel />
            </div>
        </div>
    );
};

export default Home;