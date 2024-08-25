import { useEffect, useState } from "react";
import url from "../url";
import Cookies from "js-cookie";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import { EditPostPopup } from "../components";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

const ViewPost = () => {
  const [authStatus, setAuthStatus] = useState(false);
  const [postDetails, setPostDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editPopup, setEditPopup] = useState(false);
  const [popupData, setPopupData] = useState();
  const fetchPosts = () => {
    const token = Cookies.get("authToken");
    axios
      .get(url + "posts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((data) => {
        const id = localStorage.getItem("userId");
        const filteredData = data.data.data.filter(
          (obj) => obj.authorId === id
        );
        setPostDetails(filteredData);
        setLoading(false);
      });
  };
  useEffect(() => {
    if (authStatus) {
      setLoading(true);
      fetchPosts();
    }
  }, [authStatus]);
  useEffect(() => {
    const token = Cookies.get("authToken");
    axios
      .get(url + "me", { headers: { Authorization: `Bearer ${token}` } })
      .then((data) => {
        localStorage.setItem("userId", data.data.id);
        setAuthStatus(true);
      });
  }, []);

  const onClickEditPost = (data) => {
    setPopupData(data);
    setEditPopup(true);
  };

  const onClickDeletePost = async (id) => {
    const token = Cookies.get("authToken");
    await axios.delete(url + "posts/" + id, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast("Deleted Successfully");
    fetchPosts();
  };

  return authStatus ? (
    <div className="flex flex-col h-full">
      <EditPostPopup
        editPopup={editPopup}
        popupData={popupData}
        setPopupData={setPopupData}
        setEditPopup={setEditPopup}
        fetchPosts={fetchPosts}
      />
      <h1 className="text-3xl font-bold text-center mb-4">Your Posts</h1>
      {!loading ? (
        <div className="grid grid-flow-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {postDetails.map((each) => (
            <PostCards
              key={each.id}
              data={each}
              onClickEditPost={onClickEditPost}
              onClickDeletePost={onClickDeletePost}
            />
          ))}
        </div>
      ) : (
        <div className="h-full flex flex-col justify-center">
          <Loader />
        </div>
      )}
    </div>
  ) : (
    <div>
      <p className="text-red-500 text-xl text-center">Please Login</p>
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

const PostCards = ({ data, onClickEditPost, onClickDeletePost }) => {
  return (
    <div className=" flex flex-col justify-between my-4 bg-white rounded-lg p-4">
      <div className="flex flex-col">
        <h1 className="text-md font-bold my-2">
          <span className="text-slate-500 text-md font-semibold">Title :</span>{" "}
          {data.title}
        </h1>
        <p className="text-md my-2">
          {" "}
          <span className=" text-slate-500 font-semibold">
            Description :
          </span>{" "}
          {data.description.slice(0, 150)} ....
        </p>
        <p className="text-md my-2">
          {" "}
          <span className=" text-slate-500 font-semibold"> Category : </span>
          {data.category}
        </p>
      </div>
      <div className="flex my-2 ">
        <FaEdit
          onClick={() => onClickEditPost(data)}
          className="mr-2 cursor-pointer text-2xl"
        />
        <MdDelete
          onClick={() => onClickDeletePost(data.id)}
          className="mx-2 cursor-pointer text-2xl"
        />
      </div>
    </div>
  );
};

export default ViewPost;
