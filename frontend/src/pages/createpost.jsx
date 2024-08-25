import { useEffect, useState } from "react";
import url from "../url";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [authStatus, setAuthStatus] = useState(false);
  const [postDetails, setPostDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const token = Cookies.get("authToken");
    axios
      .get(url + "me", { headers: { Authorization: `Bearer ${token}` } })
      .then((data) => {
        localStorage.setItem("userId", data.data.id);
        setAuthStatus(true);
      });
  }, []);

  const createPostRequest = async () => {
    setLoading(true);
    const token = Cookies.get("authToken");
    try {
      const request = await axios.post(
        url + "posts",
        { ...postDetails },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast("Post Created");
      navigate(0);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast(e.message);
    }
  };
  return authStatus ? (
    <div className="flex flex-col justify-center items-center w-full">
      <h1 className="text-2xl font-bold text-center mb-8 ">Create Post</h1>

      <div className="flex flex-col max-w-screen-md w-full">
        <div className="w-full flex flex-col my-4 ">
          <p className="text-lg my-1 font-semibold">Title </p>
          <input
            onChange={(e) => {
              setPostDetails((prev) => ({ ...prev, title: e.target.value }));
            }}
            value={postDetails.title}
            className="flex-grow px-2 py-1.5 rounded-lg"
            type="text"
            placeholder="title"
          />
        </div>
        <div className="w-full flex flex-col my-4">
          <p className="text-lg my-1 font-semibold">Description </p>
          <textarea
            value={postDetails.description}
            onChange={(e) => {
              setPostDetails((prev) => ({
                ...prev,
                description: e.target.value,
              }));
            }}
            className="flex-grow  px-2 py-1.5 rounded-lg"
            rows={10}
            placeholder="description"
          ></textarea>
        </div>
        <div className="w-full flex flex-col my-4 ">
          <p className="text-lg my-1 font-semibold">Category </p>
          <input
            onChange={(e) => {
              setPostDetails((prev) => ({ ...prev, category: e.target.value }));
            }}
            value={postDetails.category}
            className="flex-grow px-2 py-1.5 rounded-lg"
            type="text"
            placeholder="category"
          />
        </div>
        <div className="flex  flex-col items-start my-4">
          <button
            onClick={createPostRequest}
            className="bg-dark-violet hover:bg-dark-violet/80 text-white py-2 px-4 rounded-lg"
          >
            {!loading ? "Create" : <Loader />}
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <h1 className="text-xl text-center  text-red-500 ">Please Login </h1>
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

export default CreatePost;
