import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Cookies from "js-cookie";
import url from "../url";
import axios from "axios";

const Home = () => {
  const [searchInput, setSearchInput] = useState("");
  const [details, setDetails] = useState([]);
  const [authStatus, setAuthStatus] = useState(false);
  const [filteredResult, setFilteredResult] = useState([]);
  useEffect(() => {
    const token = Cookies.get("authToken");
    axios
      .get(url + "posts", { headers: { Authorization: `Bearer ${token}` } })
      .then((data) => {
        setDetails(data.data.data);
      });
  }, []);
  useEffect(() => {
    const token = Cookies.get("authToken");
    axios
      .get(url + "me", { headers: { Authorization: `Bearer ${token}` } })
      .then((data) => {
        localStorage.setItem("userId", data.data.id);
        setAuthStatus(true);
      });
  }, []);
  const onSearch = (value) => {
    setSearchInput(value);
    const filterArr = details.filter(
      (each) =>
        each.title.toLowerCase().includes(searchInput.toLowerCase()) ||
        each.description.toLowerCase().includes(searchInput)
    );
    setFilteredResult(filterArr);
  };
  let renderData = {};
  if (searchInput.length === 0) {
    renderData = details;
  } else {
    renderData = filteredResult;
  }
  return authStatus ? (
    <div className="flex flex-col w-full items-center ">
      <div className="flex flex-col justify-center w-full items-center max-w-screen-md mb-4 ">
        <div className=" cursor-pointer px-2 flex bg-white rounded-lg w-full items-center">
          <input
            value={searchInput}
            onChange={(e) => {
              onSearch(e.target.value);
            }}
            className="bg-transparent px-2 py-2 flex-grow w-full outline-none"
            type="search"
          />
          <FaSearch className="text-lg mx-4" />
        </div>
      </div>
      <div className="my-4 grid  grid-cols-1  md:grid-cols-2 lg:grid-cols-3  gap-4 w-full">
        {renderData.length !== 0 ? (
          renderData.map((each) => <PostCards key={each.id} data={each} />)
        ) : (
          <div className="col-span-3 mt-5 ">
            <h1 className="text-center text-xl text-blue-500">
              No Posts Found
            </h1>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div>
      <h1 className="text-red-400 text-xl text-center">
        Please Login to Continue
      </h1>
    </div>
  );
};

const PostCards = ({ data }) => {
  return (
    <div className=" flex flex-col justify-between  bg-white border p-5 my-5 rounded-lg md:max-w-lg w-full">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold my-2 ">{data.title}</h1>
        <p className="text-lg font-semibold my-2 text-slate-600/50">
          {data.description.slice(0, 150)}....
        </p>
      </div>
      <div>
        <p className="text-sm bg-slate-200/50 text-blue-800/80 w-fit px-4 py-0.5 rounded-lg font-semibold mt-4 ">
          {data.category}
        </p>
      </div>
    </div>
  );
};

export default Home;
