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
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/income">Income</Link>
          <Link href="/expense">Expense</Link>
        </div>

        <div className="flex gap-10 justify-end pr-12">
          <Link href="/login" className="bg-lightBlue py-1 px-6 rounded-md">
            Login
          </Link>
          <Link href="/signup" className="bg-lightBlue py-1 px-6 rounded-md">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
