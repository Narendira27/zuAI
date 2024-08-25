import { AuthPopUp, Navbar, SideBar } from "./components";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import { CreatePost, Home, ViewPost } from "./pages";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import url from "./url";
import axios from "axios";

function App() {
  const [popup, setPopup] = useState({ active: true, type: "login" });
  const [authStatus, setAuthStatus] = useState(false);
  useEffect(() => {
    const token = Cookies.get("authToken");
    axios
      .get(url + "me", { headers: { Authorization: `Bearer ${token}` } })
      .then((data) => {
        localStorage.setItem("userId", data.data.id);
        setAuthStatus(true);
        setPopup((prev) => ({ ...prev, active: false }));
      });
  }, []);
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen min-w-screen">
        <Navbar authStatus={authStatus} setPopup={setPopup} />
        <AuthPopUp
          popup={popup}
          setPopup={setPopup}
          setAuthStatus={setAuthStatus}
        />
        <main className="flex grow h-full w-full">
          <SideBar authStatus={authStatus} />
          <div className="grow rounded-tl-xl px-4  py-8 md:py-12 md:px-8 bg-light-blue flex flex-col  ">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/view" element={<ViewPost />} />
            </Routes>
          </div>
        </main>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition:Bounce
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
