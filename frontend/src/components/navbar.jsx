import logo from "/logo.png";
import Cookies from "js-cookie";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Navbar = ({ authStatus, setPopup }) => {
  const navigate = useNavigate();
  return (
    <nav className="w-full sticky top-0 z-48 bg-white flex justify-between py-4 px-2 md:px-8 lg:px-10 ">
      <div className="flex items-center justify-center cursor-pointer">
        <img className=" h-6 md:h-8  md:w-auto " src={logo} />
      </div>
      <div className="flex justify-center items-center">
        {!authStatus ? (
          <>
            <button
              onClick={() =>
                setPopup((prev) => ({ ...prev, active: true, type: "login" }))
              }
              className="mx-1 md:mx-2 border text-slate-500 font-semibold py-2 px-4  md:px-6  lg:px-8 text-xs md:text-md lg:text-lg rounded-full  "
            >
              Login
            </button>
            <button
              onClick={() =>
                setPopup((prev) => ({
                  ...prev,
                  active: true,
                  type: "register",
                }))
              }
              className="mx-1 md:mx-2 bg-dark-violet py-2 px-4  md:px-6  lg:px-8  hover:bg-dark-violet/70   text-xs md:text-md lg:text-lg rounded-full text-white"
            >
              Join Now
            </button>
          </>
        ) : (
          <IoIosLogOut
            onClick={() => {
              Cookies.remove("authToken");
              navigate(0);
            }}
            className=" text-2xl md:text-3xl cursor-pointer text-red-600 hover:text-red-600/50 "
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
