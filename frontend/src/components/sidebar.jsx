import { IoMdHome, IoMdAddCircle, IoIosLogOut } from "react-icons/io";
import { AiOutlineProfile } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SideBar = ({ authStatus }) => {
  const [currentPath, setCurrentPath] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.pathname === "/") setCurrentPath("Home");
    if (location.pathname === "/create") setCurrentPath("Create");
    if (location.pathname === "/view") setCurrentPath("View");
  }, [location]);
  const changePath = (path) => {
    if (path !== "home") navigate("/" + path);
    else navigate("/");
  };
  return (
    <div className="  px-2 py-4 md:px-6 md:py-6 flex flex-col ">
      <div className="flex flex-col h-full  items-center">
        <div className="flex flex-col">
          <div
            onClick={() => {
              changePath("home");
            }}
            className={`flex justify-center cursor-pointer px-2 py-2 md:p-2 my-4 rounded-xl hover:bg-dark-violet/50  ${
              currentPath === "Home" ? "bg-dark-violet" : null
            } `}
          >
            <IoMdHome
              className={`text-md md:text-lg lg:text-xl xl:text-2xl  ${
                currentPath === "Home" ? "text-white" : "text-black"
              }  `}
            />
          </div>
          <div
            onClick={() => {
              changePath("create");
            }}
            className={`flex justify-center cursor-pointer px-2 py-2 md:p-2 my-4 rounded-xl hover:bg-dark-violet/50  ${
              currentPath === "Create" ? "bg-dark-violet" : null
            } `}
          >
            <IoMdAddCircle
              className={`text-md md:text-lg lg:text-xl xl:text-2xl   ${
                currentPath === "Create" ? "text-white" : "text-black"
              }  `}
            />
          </div>
          <div
            onClick={() => {
              changePath("view");
            }}
            className={`flex justify-center cursor-pointer px-2 py-2 md:p-2 my-4 rounded-xl hover:bg-dark-violet/50  ${
              currentPath === "View" ? "bg-dark-violet" : null
            } `}
          >
            <AiOutlineProfile
              className={`text-md md:text-lg lg:text-xl xl:text-2xl ${
                currentPath === "View" ? "text-white" : "text-black"
              }  `}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
