import Link from "next/link";

const NavBar = () => {
  return (
    <div>
      <div className="bg-darkBlue flex justify-between items-center h-20">
        <Link href="/" className="font-bold text-xl pl-12">
          {" "}
          Finance Tracker
        </Link>
        <div className="flex justify-center gap-18 ">
          <Link
            href="/dashboard"
            className="hover:text-lightBlue transition duration-300"
          >
            Dashboard
          </Link>
          <Link
            href="/income"
            className="hover:text-lightBlue transition duration-300"
          >
            Income
          </Link>
          <Link
            href="/expense"
            className="hover:text-lightBlue transition duration-300"
          >
            Expense
          </Link>
        </div>

        <div className="flex gap-10 justify-end pr-12">
          <Link
            href="/login"
            className="bg-lightBlue py-1 px-6 rounded-md hover:mt-2 transition duration-300"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-lightBlue py-1 px-6 rounded-md hover:mt-2 transition duration-300"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
