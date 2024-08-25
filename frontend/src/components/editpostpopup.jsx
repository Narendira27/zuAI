import axios from "axios";
import url from "../url";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const EditPostPopup = ({
  editPopup,
  setEditPopup,
  popupData,
  setPopupData,
  fetchPosts,
}) => {
  const updateRequest = async () => {
    const token = Cookies.get("authToken");
    const id = popupData.id;
    await axios.put(
      url + `posts/${id}`,
      { ...popupData },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    closePopup();
    toast("Post Updated");
    fetchPosts();
  };
  const closePopup = () => {
    setEditPopup(false);
  };
  return editPopup ? (
    <div className="fixed z-40 h-full w-full backdrop-blur-sm  grid grid-cols-1 gap-4  justify-center items-center ">
      <div className="flex md:justify-center">
        <div className="w-full flex flex-col justify-center items-center  max-w-xs  md:max-w-screen-md  bg-white rounded-lg p-3 md:p-4">
          <div className="my-2 flex flex-col justify-start items-start w-full">
            <h1 className="text-md my-2">Title</h1>
            <input
              value={popupData.title}
              onChange={(e) => {
                setPopupData((prev) => ({ ...prev, title: e.target.value }));
              }}
              className="  w-full flex-grow border px-1.5 py-1.5 rounded-md"
            />
          </div>
          <div className="my-2 flex flex-col justify-start items-start w-full">
            <h1 className="text-md my-2">description</h1>
            <textarea
              onChange={(e) => {
                setPopupData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }));
              }}
              value={popupData.description}
              className=" w-full flex-grow border px-1.5 py-1.5 rounded-md"
            />
          </div>
          <div className="my-2 flex flex-col justify-start items-start w-full">
            <h1 className="text-md my-2">Category</h1>
            <input
              value={popupData.category}
              onChange={(e) => {
                setPopupData((prev) => ({
                  ...prev,
                  category: e.target.value,
                }));
              }}
              className="  w-full  border flex-grow px-1.5 py-1.5 rounded-md"
            />
          </div>
          <div className="flex  my-4 justify-start w-4/5  md:w-full items-start">
            <button
              onClick={updateRequest}
              className="py-2 px-2 mr-2 text-white rounded-lg bg-dark-violet"
            >
              Update
            </button>
            <button
              onClick={closePopup}
              className="py-2 px-2 mx-2 text-white rounded-lg bg-dark-violet"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default EditPostPopup;
