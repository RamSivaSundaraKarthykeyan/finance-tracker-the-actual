import NavBar from "@/components/NavBar";
import Link from "next/link";
import { GoGraph } from "react-icons/go";
import { FaHandshake } from "react-icons/fa";
import { FaGlobeAmericas } from "react-icons/fa";

const home = () => {
  return (
    <div className="px-6 md:px-12 lg:px-24">
      <p className="font-extrabold text-black text-4xl md:text-5xl lg:text-6xl pt-12 md:pt-24">
        Take Control of your
        <span className="block mt-2 md:mt-6">Money, Effortlessly</span>
      </p>
      <p className="text-[#7c7c7c] pt-6 md:pt-8 text-base md:text-lg max-w-2xl">
        Whether you’re managing your personal expenses or family budget,
        <span className="block mt-1">
          our tracker gives you clarity and control. Stop guessing—start{" "}
        </span>
        <span className="block mt-0.5"> growing</span>
      </p>
      <div className="mt-8 md:mt-12">
        <Link
          href="/signup"
          className="inline-block text-white bg-lightBlue px-6 py-3 rounded-full hover:bg-darkBlue transition duration-300 shadow-md"
        >
          Get Started
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 mt-16 md:mt-26 pb-12">
        <div className="bg-darkBlue w-full lg:w-1/3 min-h-[250px] shadow-lg rounded-lg p-6 md:p-8">
          <div className="flex items-center gap-4 mb-4">
            <GoGraph color="#4286f2" size="50" className="md:size-[70px]" />
            <p className="font-extrabold text-xl md:text-2xl text-white">
              Financial <span className="block md:inline lg:block">Analysis</span>
            </p>
          </div>
          <div className="text-white/80 text-sm md:text-base">
            Gain deep insights into your financial performance with real-time
            analytics. Our advanced tools help you track income and expenses
          </div>
        </div>
        <div className="bg-darkBlue w-full lg:w-1/3 min-h-[250px] shadow-lg rounded-lg p-6 md:p-8">
          <div className="flex items-center gap-4 mb-4">
            <FaHandshake color="#4286f2" size="50" className="md:size-[70px]" />
            <p className="font-extrabold text-xl md:text-2xl text-white">
              Trusted <span className="block md:inline lg:block">Partnership</span>
            </p>
          </div>
          <div className="text-white/80 text-sm md:text-base">
            We believe in building long-term relationships based on trust,
            transparency, and integrity.
          </div>
        </div>
        <div className="bg-darkBlue w-full lg:w-1/3 min-h-[250px] shadow-lg rounded-lg p-6 md:p-8">
          <div className="flex items-center gap-4 mb-4">
            <FaGlobeAmericas color="#4286f2" size="50" className="md:size-[70px]" />
            <p className="font-extrabold text-xl md:text-2xl text-white">
              Global <span className="block md:inline lg:block">Experience</span>
            </p>
          </div>
          <div className="text-white/80 text-sm md:text-base">
            Whether you&apos;re growing a business or managing personal
            investments, our webservice keeps in control of your finances.
          </div>
        </div>
      </div>
    </div>
  );
};

export default home;
