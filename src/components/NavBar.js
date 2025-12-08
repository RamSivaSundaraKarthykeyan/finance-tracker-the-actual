const NavBar = () => {
  return (
    <div>
      <div className="bg-darkBlue flex justify-between items-center h-20">
        <h2 className="font-bold text-xl pl-12"> Finance Tracker</h2>
        <div className="flex justify-center gap-18 ">
          <ul>Dashboard</ul>
          <ul>Income</ul>
          <ul>Expense</ul>
        </div>

        <div className="flex gap-10 justify-end pr-12">
          <button className="bg-lightBlue py-1 px-6 rounded-md">Login</button>
          <button className="bg-lightBlue py-1 px-6 rounded-md">Sign up</button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
