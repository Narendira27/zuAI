import axios from "axios";
import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import url from "../url";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

const AuthPopUp = ({ popup, setPopup, setAuthStatus }) => {
  const navigate = useNavigate();
  const [authDetails, setAuthDetails] = useState({});
  const closePopup = () => {
    setPopup((prev) => ({ ...prev, active: false }));
  };
  const ChangeAuth = () => {
    setAuthStatus(true);
    navigate(0);
  };
  return popup.active ? (
    <div className="absolute backdrop-blur-sm w-full h-full flex flex-col justify-center items-center">
      <div className="bg-white border max-w-xs md:max-w-md w-full rounded-lg p-4 flex flex-col">
        <div className="flex justify-end ">
          <IoIosClose
            onClick={closePopup}
            className="text-2xl  cursor-pointer rounded-lg  hover:bg-red-400  "
          />
        </div>
        {popup.type === "register" ? (
          <RegisterForm
            setAuthDetails={setAuthDetails}
            authDetails={authDetails}
            closePopup={closePopup}
            ChangeAuth={ChangeAuth}
          />
        ) : (
          <LoginForm
            setAuthDetails={setAuthDetails}
            authDetails={authDetails}
            closePopup={closePopup}
            ChangeAuth={ChangeAuth}
          />
        )}
      </div>
    </div>
  ) : null;
};

const RegisterForm = ({ setAuthDetails, authDetails, closePopup }) => {
  const [loading, setLoading] = useState(false);
  const notify = (data) => toast(data);
  const registerClick = async () => {
    if (authDetails.name && authDetails.email && authDetails.password) {
      setLoading(true);
      try {
        const response = await axios.post(url + "register", { ...authDetails });
        setLoading(false);
        notify(response.data.msg);
        setAuthDetails({});
        closePopup();
      } catch (e) {
        setLoading(false);
        notify(e.response.data.msg);
      }
    }
  };
  return (
    <div className="w-full flex flex-col p-0.5 md:p-4">
      <h1 className="text-2xl font-bold text-center ">Join Now</h1>
      <div className="flex flex-col my-2">
        <p className="px-1 my-1 font-semibold text-md">Name</p>
        <input
          onChange={(e) => {
            setAuthDetails((prev) => ({ ...prev, name: e.target.value }));
          }}
          value={authDetails.name}
          className="border rounded-lg w-full text-md px-2 py-2"
          placeholder="name"
        />
      </div>
      <div className="flex flex-col my-2">
        <p className="px-1 my-1 font-semibold text-md">Email</p>
        <input
          onChange={(e) => {
            setAuthDetails((prev) => ({ ...prev, email: e.target.value }));
          }}
          value={authDetails.email}
          className="border rounded-lg w-full text-md px-2 py-2"
          placeholder="email"
        />
      </div>
      <div className="flex flex-col my-2">
        <p className="px-1 my-1 font-semibold text-md">Password</p>
        <input
          onChange={(e) => {
            setAuthDetails((prev) => ({ ...prev, password: e.target.value }));
          }}
          value={authDetails.password}
          className="border rounded-lg w-full text-md px-2 py-2"
          placeholder="password"
          type="password"
        />
      </div>
      <button
        onClick={registerClick}
        className="text-white text-center bg-dark-violet rounded-lg text-lg py-2 my-2 mb-2 hover:bg-dark-violet/80 "
      >
        {!loading ? "Join" : <Loader />}
      </button>
    </div>
  );
};

const LoginForm = ({ setAuthDetails, authDetails, closePopup, ChangeAuth }) => {
  const [loading, setLoading] = useState(false);
  const notify = (data) => toast(data);
  const loginClick = async () => {
    if (authDetails.email && authDetails.password) {
      try {
        setLoading(true);
        const response = await axios.post(url + "login", { ...authDetails });
        setLoading(false);
        Cookies.set("authToken", response.data.token);
        setAuthDetails({});
        closePopup();
        ChangeAuth();
        notify("Success");
      } catch (e) {
        notify(e.response.data);
        setLoading(false);
      }
    }
  };
  return (
    <div className="w-full flex flex-col p-0.5 md:p-4">
      <h1 className="text-2xl font-bold text-center ">Login</h1>
      <div className="flex flex-col my-2">
        <p className="px-1 my-1 font-semibold text-md">Email</p>
        <input
          onChange={(e) => {
            setAuthDetails((prev) => ({ ...prev, email: e.target.value }));
          }}
          value={authDetails.email}
          className="border rounded-lg w-full text-md px-2 py-2"
          placeholder="email"
        />
      </div>
      <div className="flex flex-col my-2">
        <p className="px-1 my-1 font-semibold text-md">Password</p>
        <input
          onChange={(e) => {
            setAuthDetails((prev) => ({ ...prev, password: e.target.value }));
          }}
          value={authDetails.password}
          className="border rounded-lg w-full text-md px-2 py-2"
          placeholder="password"
          type="password"
        />
      </div>
      <button
        onClick={loginClick}
        className="text-white bg-dark-violet text-center rounded-lg text-lg py-2 my-2 mb-2 hover:bg-dark-violet/80 "
      >
        {!loading ? "Login" : <Loader />}
      </button>
    </div>
  );
};

const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <ThreeDots
        visible={true}
        height="30"
        width="40"
        color="#ffffff"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default AuthPopUp;
