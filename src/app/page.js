import NavBar from "@/components/NavBar";
import Link from "next/link";
import { GoGraph } from "react-icons/go";
import { FaHandshake } from "react-icons/fa";
import { FaGlobeAmericas } from "react-icons/fa";

const home = () => {
  return (
    <div className="pl-24">
      <p className="font-extrabold text-black text-6xl pt-24">
        Take Control of your
        <span className="block mt-6">Money, Effortlessly</span>
      </p>
      <p className="text-[#7c7c7c] pt-8 text-lg">
        Whether you’re managing your personal expenses or family budget,
        <span className="block mt-1">
          our tracker gives you clarity and control. Stop guessing—start{" "}
        </span>
        <sapn className="block mt-0.5"> growing</sapn>
      </p>
      <div className="mt-12 ">
        <Link
          href="/signup"
          className="text-white bg-lightBlue px-6 py-3 rounded-full hover:bg-darkBlue transition duration-300 shadow-md/50"
        >
          Get Started
        </Link>
      </div>

      <div className="flex gap-8">
        <div className="mt-26 bg-darkBlue w-110 h-75 shadow-md/50 rounded-lg">
          <div className="pt-10 pl-8 flex items-center gap-4">
            <GoGraph color="#4286f2" size="70" className="" />
            <p className="font-extrabold text-2xl">
              Financial <span className="block">Analysis</span>
            </p>
          </div>
          <div className="pl-30 pt-4 pr-10">
            Gain deep insights into your financial performance with real-time
            analytics. Our advanced tools help you track income and expenses
          </div>
        </div>
        <div className="mt-26 bg-darkBlue w-100 h-75 shadow-md/50 rounded-lg">
          <div className="pt-10 pl-8 flex items-center gap-4">
            <FaHandshake color="#4286f2" size="70" className="" />
            <p className="font-extrabold text-2xl">
              Trusted <span className="block">Partnership</span>
            </p>
          </div>
          <div className="pl-30 pt-4 pr-10">
            We believe in building long-term relationships based on trust,
            transparency, and integrity.
          </div>
        </div>
        <div className="mt-26 bg-darkBlue w-100 h-75 shadow-md/50 rounded-lg">
          <div className="pt-10 pl-8 flex items-center gap-4">
            <FaGlobeAmericas color="#4286f2" size="70" className="" />
            <p className="font-extrabold text-2xl">
              Global <span className="block">Partnership</span>
            </p>
          </div>
          <div className="pl-30 pt-4 pr-10">
            Whether you&apos;re growing a business or managing personal
            investments, our webservice keeps in control of your finances.
          </div>
        </div>
      </div>
    </div>
  );
};

export default home;
