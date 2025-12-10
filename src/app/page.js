import NavBar from "@/components/NavBar";
import Link from "next/link";
import { GoGraph } from "react-icons/go";

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
        <div className="mt-26 bg-darkBlue w-100 h-75 shadow-md/50">
          <div className="pt-10 pl-8 flex items-center gap-4">
            <GoGraph color="#4286f2" size="70" className="" />
            <p className="font-extrabold text-2xl">
              Financial <span className="block">Analysis</span>
            </p>
          </div>
          <div className="pl-30 pt-4">
            High transaction frequency detected in shopping categor xhchsc
            dsddgguhdjd djhdjsdhkhddmdhhkhdkdn jhdggjdhbdbddndb jahshddoiojmnjh.
          </div>
        </div>
        <div className="mt-26 bg-darkBlue w-100 h-75 shadow-md/50">
          <div className="pt-10 pl-8 flex items-center gap-4">
            <GoGraph color="#4286f2" size="70" className="" />
            <p className="font-extrabold text-2xl">
              Financial <span className="block">Analysis</span>
            </p>
          </div>
          <div className="pl-30 pt-4">
            High transaction frequency detected in shopping categor xhchsc
            dsddgguhdjd djhdjsdhkhddmdhhkhdkdn jhdggjdhbdbddndb jahshddoiojmnjh.
          </div>
        </div>
        <div className="mt-26 bg-darkBlue w-100 h-75 shadow-md/50">
          <div className="pt-10 pl-8 flex items-center gap-4">
            <GoGraph color="#4286f2" size="70" className="" />
            <p className="font-extrabold text-2xl">
              Financial <span className="block">Analysis</span>
            </p>
          </div>
          <div className="pl-30 pt-4">
            High transaction frequency detected in shopping categor xhchsc
            dsddgguhdjd djhdjsdhkhddmdhhkhdkdn jhdggjdhbdbddndb jahshddoiojmnjh.
          </div>
        </div>
      </div>
    </div>
  );
};

export default home;
