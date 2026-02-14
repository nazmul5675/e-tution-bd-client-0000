import bgImg from '../../assets/Teacher student-pana.svg';
import ImageCarousel from '../../Components/ImageCarousel/ImageCarousel';
import HowWeTeach from '../../Components/HowWeTeach/HowWeTeach';
import WhyChooseUs from '../../Components/WhyChooseUs/WhyChooseUs';
import HowThePlatformWorks from '../../Components/HowThePlatformWorks/HowThePlatformWorks';
import LatestTuitionPosts from '../../Components/LatestTuitionPosts/LatestTuitionPosts';
import LatestTutors from '../../Components/LatestTutors/LatestTutors';


const Home = () => {
    return (
        <div className='max-w-7xl mx-auto'>
            {/* Hero section */}
            <div className='flex sm:flex-row flex-col-reverse justify-between items-center p-5'>
                <div className='sm:w1/2 w-full'>
                    <h1 className="text-4xl font-bold">Country's <span className="text-primary">#1</span> Tutor Matching &
                        Learning Platform.</h1>
                    <p>Hire a conversant tutor to make your children's learning fun, comprehensive & easier.</p>
                    <button className="mt-5 px-8 py-4 bg-primary text-white rounded-3xl font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-transform">
                        Get Started
                    </button>
                </div>
                <div className='sm:w1/2 w-full flex justify-center'>
                    <img src={bgImg} alt="" />
                </div>
            </div>

            {/* How the Platform Works */}
            <div className=" px-4 py-24 ">

                <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-primary mb-20">
                    How the Platform Works
                </h2>
                <HowThePlatformWorks></HowThePlatformWorks>
            </div>

            {/* Latest Tuition Posts */}
            <div className=" px-4 py-24 ">

                <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-primary mb-20">
                    Latest Tuition Posts
                </h2>
                <LatestTuitionPosts></LatestTuitionPosts>



            </div>
            {/*  Latest Tutors */}
            <div className=" px-4 py-24 ">

                <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-primary mb-20">
                    Latest Tutors
                </h2>
                <LatestTutors></LatestTutors>
            </div>





            {/* Why Choose Us */}
            <div className="px-4 py-24">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-primary mb-20">
                    Why Choose Us
                </h2>

                <WhyChooseUs></WhyChooseUs>
            </div>

            <div className=" px-4 pt-24 ">

                <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-primary">
                    How We Teach Student
                </h2>
                <HowWeTeach></HowWeTeach>
                {/* ImageCarousel */}
                <ImageCarousel></ImageCarousel>
            </div>

        </div>
    );
};

export default Home;