import React from "react";
import { useEffect, useState } from "react";
import "./AnotherProfile.css";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import UserProfile from "../UserPorfile/UserProfile";
import NotFound from "../NotFound/NotFound2";
import { toast } from "react-toastify";
import { BsThreeDotsVertical, BsDownload, BsShieldSlash } from "react-icons/bs";
import { FaUserAltSlash } from "react-icons/fa";
import PathNotExist from "../PathNotExist/PathNotExist";
import Comment from "../Comment/Comment";
import SharePost from "../SharePost/SharePost";
import Question from "../Question/Question";
import AnthorPosts from "../AnotherProfile/AnthorPosts";
import Sidebar from "../Sidebar/Sidebar";
import AnthorProject from "./AnthorProject";
import AnthorQuestion from "./AnthorQuestion";
import Chat from "../Chat/Chat";

const AnotherProfile = ({}) => {
  const token = localStorage?.getItem("userToken");
  const textToShow = "  ";
  const { userId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState("");
  const [isToggled, setIsToggled] = useState(false);
  const [posts, setposts] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [photo, setphoto] = useState(null);
  const [toggleDislike, setToggleDislike] = useState(true);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [value, setValue] = useState("");
  const [toggleLike, setToggleLike] = useState(true);
  const [status, setStatus] = useState("");
  const [cvName, setCVName] = useState("");
  const [Info, setInfo] = useState([]);
  const [selectedPost, setSelectedPost] = useState({});
  const [messages, setMessages] = useState([]);
  const [warehouseData, setWarehouseData] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
  });
  console.log(userId);
  const handleTabClick = (tab) => {
    setWarehouseData({ ...warehouseData, activeTab: tab });
  };
  const getAnotherProfile = async (id) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://localhost:7134/api/profile/getUser/string:userId?userId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data);
      // setIsPrivate(response.data.isPrivate);
      statusProfile(userId);
      setIsLoading(false);
      setphoto(response.data.imgeurl);
      setInfo(response.data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoading(false);
    }
  };
  const fetchUserPosts = async (id) => {
    try {
      setIsToggled(!isToggled);
      setIsLoading(true);
      const response = await axios.get(
        `https://localhost:7134/api/post/GetAllPostForAnotherUser /string:id?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setposts(response.data);
      console.log(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setIsLoading(false);
    }
  };
  const handleUnFriend = async (id) => {
    try {
      setIsLoading(true);
      await axios.delete(
        `https://localhost:7134/api/friend/unfriend/id:string ?SenderID=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Request was canceled successfully!");
      getstatus(userId);
      getAnotherProfile(userId)
    } catch (error) {
      console.error("Error canceling request:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleAcceptRequest = async (id) => {
    try {
      setIsToggled(isToggled);
      setIsLoading(true);
      const res = await axios.put(
        `https://localhost:7134/api/friend/AcceptRequest/id:string ?SenderID=${id}`,
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      getstatus(userId);
      getAnotherProfile(userId)
      console.log("Request was sent successfully!");
    } catch (error) {
      console.log("Error sending request:", error.response.data);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleRefuseRequest = async (id) => {
    try {
      setIsLoading(true);
      const res = await axios.delete(
        `https://localhost:7134/api/friend/RefuseRequest/id:string ?SenderID=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      getstatus(userId);
      getAnotherProfile(userId)
      console.log("Request was sent successfully!");
    } catch (error) {
      console.log("Error sending request:", error.response.data);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCancelRequest = async (id) => {
    try {
      setIsToggled(!isToggled);
      setIsLoading(true);
      await axios.delete(
        `https://localhost:7134/api/friend/unRequest/id:string ?SenderID=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Request was canceled successfully!");
      getAnotherProfile(userId)
      getstatus(userId);
   
    } catch (error) {
      console.error("Error canceling request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRequest = async (id) => {
    try {
      setIsToggled(!isToggled);
      setIsLoading(true);
      await axios.post(
        `https://localhost:7134/api/friend/sendRequest/id:string ?receiverID=${userId}`,
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Request was sent successfully!");
      getAnotherProfile(userId)
      getstatus(userId);
    } catch (error) {
      console.log("Error sending request:", error.response.data);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const statusProfile = async (userId) => {
    try {
      setIsToggled(!isToggled);
      setIsLoading(true);
      const response = await axios.get(
        `https://localhost:7134/api/friend/check-statusssssssss?user2Id=${userId}`,
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setValue(response.data);

      // console.log(res.data);
    } catch (error) {
      console.log("Error Status :", error.response.data);
      setValue(error.response.data);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const getstatus = async (userId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://localhost:7134/api/friend/check-status?user2Id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStatus(response.data);
      // console.log(response.data);
    } catch (error) {
      console.log("Error getting account status:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleBlockUser = async (userId) => {
    try {
      // Make a request to your backend API to block the user
      await axios.put(
        `https://localhost:7134/api/friend/blockuser/id:string ?yourid=${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getAnotherProfile(userId)
      getstatus(userId);
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };
  const downloadCV = async (userId) => {
    try {
      // Assuming userInfo.id is valid here
      const response = await axios.get(
        `https://localhost:7134/api/profile/downloadCV?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Ensure response is treated as blob
        }
      );

      if (!response || !response.data || response.data.size === 0) {
        toast.error("No CV uploaded for this user.");
        return;
      }

      const blob = new Blob([response.data], { type: "application/pdf" });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Setting filename correctly
      link.setAttribute("download", cvName);

      link.style.display = "none";
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
      console.log(userId);
      toast.success("CV downloaded successfully");
       getAnotherProfile(userId);
       getstatus(userId);
    } catch (error) {
      console.error("Error downloading CV:", error.message);
      toast.error("Failed to download CV. Please try again later.");
    }
  };
  const getMessages = async (receiverId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://localhost:7134/api/Chat/get?receiverId=${receiverId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages(response.data);
      console.log(response.data);
    } catch (error) {
      console.log("Error getting messages:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getMessages(userId);
    statusProfile(userId);
    getAnotherProfile(userId);
    fetchUserPosts(userId);
    getstatus(userId);
  }, [userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <link
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
        rel="stylesheet"
      />

      {status === "You blocked this user." ? (
        <div className="blocked-message">
          {/* <p>You blocked this user</p> */}
          <PathNotExist />
        </div>
      ) : status === "This user blocked you." ? (
        <div className="blocked-message">
          {/* <p>This user blocked you</p> */}
          <PathNotExist />
        </div>
      ) : status ===
        "You sent a request to this user, and their account is private." ? (
        <div className="private-account-message">
          <div className="profile" style={{ borderRadius: 30 }}>
            <div className="profile-header">
              <i class="fa-solid fa-pen-circle"></i>
              <div className="profile-header-cover">
                <div className="dropdown" style={{ float: "right" }}>
                  <button
                    style={{
                      backgroundColor: "transparent",
                      marginTop: "2px",
                      color: "white",
                    }}
                    className="btn btn "
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    More...
                  </button>
                  <ul className="dropdown-menu">
                    <li
                      onClick={() => handleBlockUser(data.id)}
                      style={{ marginLeft: "16px" }}
                    >
                      {" "}
                      <a href="">
                        <FaUserAltSlash /> Block User
                      </a>
                    </li>
                    <li
                      onClick={() => downloadCV(userId)}
                      style={{ marginLeft: "16px" }}
                    >
                      {" "}
                      <a href="">
                        {" "}
                        <BsDownload />
                        Download CV{" "}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="profile-header-content">
                <div className="profile-header-img">
                  {data.imgeurl ? (
                    <img src={`/imgs/${data.imgeurl}`} alt="Profile" />
                  ) : (
                    <img src="./download.png" alt="Profile" />
                  )}
                </div>

                <div className="profile-header-info">
                  <h4 className="m-t-10 m-b-5">
                    {data.fname} {data.lname}

                  </h4>
                  <p className="m-b-10">{data.userName}</p>
                  <p className="m-b-10">{data.birthdate}</p>
                  <p className="m-b-10">{data.bio}</p>
                  <p className="m-b-10">{data.ginder}</p>
                  <p className="m-b-10">{data.phoneNumber}</p>

                  <button
                    onClick={() => handleCancelRequest(userId)}
                    className="btn btn-primary AddBtn"
                    // style={{ position: "absolute", top: 5, right: 0 }}
                  >
                    cancel request
                  </button>

                
                </div>
              </div>
            </div>
          </div>
          <NotFound
              textToShow={textToShow}
              className="justify-content-center text-center ml-5"
                />
        </div>
      ) : status ===
        "You received a request from this user, and their account is private." ? (
        <div className="private-account-message">
          <div className="profile" style={{ borderRadius: 30 }}>
            <div className="profile-header">
              <i class="fa-solid fa-pen-circle"></i>
              <div className="profile-header-cover">
                <div className="dropdown" style={{ float: "right" }}>
                  <button
                    style={{
                      backgroundColor: "transparent",
                      marginTop: "2px",
                      color: "white",
                    }}
                    className="btn btn "
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    More...
                  </button>
                  <ul className="dropdown-menu">
                    <li
                      onClick={() => handleBlockUser(userId)}
                      style={{ marginLeft: "16px" }}
                    >
                      {" "}
                      <a href="">
                        <FaUserAltSlash /> Block User
                      </a>
                    </li>
                    <li
                      onClick={() => downloadCV(data.id)}
                      style={{ marginLeft: "16px" }}
                    >
                      {" "}
                      <a href="">
                        {" "}
                        <BsDownload />
                        Download CV{" "}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="profile-header-content">
                <div className="profile-header-img">
                  {data.imgeurl ? (
                    <img src={`/imgs/${data.imgeurl}`} alt="Profile" />
                  ) : (
                    <img src="./download.png" alt="Profile" />
                  )}
                </div>

                <div className="profile-header-info">
                  <h4 className="m-t-10 m-b-5">
                    {data.fname} {data.lname}
                  </h4>
                  <p className="m-b-10">{data.userName}</p>
                  <p className="m-b-10">{data.birthdate}</p>
                  <p className="m-b-10">{data.bio}</p>
                  <p className="m-b-10">{data.ginder}</p>
                  <p className="m-b-10">{data.phoneNumber}</p>

                  <button
                    onClick={() => handleAcceptRequest(userId)}
                    className="btn btn-primary AddBtn"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRefuseRequest(userId)}
                    className="btn btn-primary AddBtn"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : status === "This user's account is private." ? (
        <div className="private-account-message">
          <div className="private-account-message">
            <div className="profile" style={{ borderRadius: 30 }}>
              <div className="profile-header">
                <i class="fa-solid fa-pen-circle"></i>
                <div className="profile-header-cover">
                  <div className="dropdown" style={{ float: "right" }}>
                    <button
                      style={{
                        backgroundColor: "transparent",
                        marginTop: "2px",
                        color: "white",
                      }}
                      className="btn btn "
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      More...
                    </button>
                    <ul className="dropdown-menu">
                      <li
                        onClick={() => handleBlockUser(data.id)}
                        style={{ marginLeft: "16px" }}
                      >
                        {" "}
                        <a href="">
                          <FaUserAltSlash /> Block User
                        </a>
                      </li>
                      <li
                        onClick={() => downloadCV(userId)}
                        style={{ marginLeft: "16px" }}
                      >
                        {" "}
                        <a href="">
                          {" "}
                          <BsDownload />
                          Download CV{" "}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="profile-header-content">
                  <div className="profile-header-img">
                    {data.imgeurl ? (
                      <img src={`/imgs/${data.imgeurl}`} alt="Profile" />
                    ) : (
                      <img src="./download.png" alt="Profile" />
                    )}
                  </div>

                  <div className="profile-header-info">
                    <h4 className="m-t-10 m-b-5">
                      {data.fname} {data.lname}
                    </h4>
                    <p className="m-b-10">{data.userName}</p>
                    <p className="m-b-10">{data.birthdate}</p>
                    <p className="m-b-10">{data.bio}</p>
                    <p className="m-b-10">{data.ginder}</p>
                    <p className="m-b-10">{data.phoneNumber}</p>

                    <button
                      onClick={() => handleAddRequest(userId)}
                      className="btn btn-primary AddBtn"
                    >
                      Add Friend
                    </button>
                  
                  </div>
                
                </div>
              </div>
            </div>
          </div>
          <NotFound
              textToShow={textToShow}
              className="justify-content-center text-center ml-5"
                />
        </div>
      ) : status === "This user's account is public." ? (
        <div className="profile-content">
          <div className="private-account-message">
            <div className="profile" style={{ borderRadius: 30 }}>
              <div className="profile-header">
                <i class="fa-solid fa-pen-circle"></i>
                <div className="profile-header-cover">
                  <div className="dropdown" style={{ float: "right" }}>
                    <button
                      style={{
                        backgroundColor: "transparent",
                        marginTop: "2px",
                        color: "white",
                      }}
                      className="btn btn "
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      More...
                    </button>
                    <ul className="dropdown-menu">
                      <li
                        onClick={() => handleBlockUser(data.id)}
                        style={{ marginLeft: "16px" }}
                      >
                        <FaUserAltSlash /> Block User
                      </li>
                      <li
                        onClick={() => downloadCV(userId)}
                        style={{ marginLeft: "16px" }}
                      >
                       
                          <BsDownload />
                          Download CV
                       
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="profile-header-content">
                  <div className="profile-header-img">
                    {data.imgeurl ? (
                      <img src={`/imgs/${data.imgeurl}`} alt="Profile" />
                    ) : (
                      <img src="./download.png" alt="Profile" />
                    )}
                  </div>

                  <div className="profile-header-info">
                    <h4 className="m-t-10 m-b-5">
                      {data.fname} {data.lname}
                    </h4>
                    <p className="m-b-10">{data.userName}</p>
                    <p className="m-b-10">{data.birthdate}</p>
                    <p className="m-b-10">{data.bio}</p>
                    <p className="m-b-10">{data.ginder}</p>
                    <p className="m-b-10">{data.phoneNumber}</p>
                    <Link to={`/Chat/${userId}`}>
                      <button
                        onClick={() => getMessages(userId)}
                        className="btn btn-primary AddBtn"
                      >
                        Message
                      </button>
                    </Link>
                    <button
                      onClick={() => handleAddRequest(userId)}
                      className="btn btn-primary AddBtn"
                    >
                      Add Friend
                    </button>
                  </div>
                </div>
                <ul className="profile-header-tab nav nav-tabs">
                  <li className="nav-item activities" role="presentation">
                    <button
                      className={`nav-link px-4 ${
                        warehouseData.activeTab === "projects" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("projects")}
                    >
                      <span className="d-block d-sm-none activities">
                        <i className=" "></i>
                      </span>
                      <button className="d-none d-sm-block btn">
                        Projects
                      </button>
                    </button>
                  </li>
                  <li className="nav-item activities" role="presentation">
                    <button
                      className={`nav-link px-4 ${
                        warehouseData.activeTab === "Question" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("Question")}
                    >
                      <span className="d-block d-sm-none activities">
                        <i className=" "></i>
                      </span>
                      <button className="d-none d-sm-block btn">
                        Questions
                      </button>
                    </button>
                  </li>
                  <li className="nav-item activities" role="presentation">
                    <button
                      className={`nav-link px-4 mb-0 ${
                        warehouseData.activeTab === "posts" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("posts")}
                    >
                      <span className="d-block d-sm-none ">
                        <i className="mdi mdi-account-group-outline "></i>
                      </span>
                      <button className="d-none d-sm-block btn">Posts</button>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="tab-content">
            {warehouseData.activeTab === "projects" && (
                <div className="card-body">
                  <AnthorProject />
                </div>
              )}
              {warehouseData.activeTab === "Question" && (
                <div className="card-body">
                  <AnthorQuestion />
                </div>
              )}
              {warehouseData.activeTab === "posts" && (
                <div className="card-body">
                  <AnthorPosts />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : status ===
        "You sent a request to this user, and their account is public." ? (
        <div className="profile-content">
          <div className="private-account-message">
            <div className="profile" style={{ borderRadius: 30 }}>
              <div className="profile-header">
                <i class="fa-solid fa-pen-circle"></i>
                <div className="profile-header-cover">
                  <div className="dropdown" style={{ float: "right" }}>
                    <button
                      style={{
                        backgroundColor: "transparent",
                        marginTop: "2px",
                        color: "white",
                      }}
                      className="btn btn "
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      More...
                    </button>
                    <ul className="dropdown-menu">
                      <li
                        onClick={() => handleBlockUser(userId)}
                        style={{ marginLeft: "16px" }}
                      >
                        {" "}
                        <a href="">
                          <FaUserAltSlash /> Block User
                        </a>
                      </li>
                      <li
                        onClick={() => downloadCV(data.id)}
                        style={{ marginLeft: "16px" }}
                      >
                        {" "}
                        <a href="">
                          {" "}
                          <BsDownload />
                          Download CV{" "}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="profile-header-content">
                  <div className="profile-header-img">
                    {data.imgeurl ? (
                      <img src={`/imgs/${data.imgeurl}`} alt="Profile" />
                    ) : (
                      <img src="./download.png" alt="Profile" />
                    )}
                  </div>

                  <div className="profile-header-info">
                    <h4 className="m-t-10 m-b-5">
                      {data.fname} {data.lname}
                    </h4>
                    <p className="m-b-10">{data.userName}</p>
                    <p className="m-b-10">{data.birthdate}</p>
                    <p className="m-b-10">{data.bio}</p>
                    <p className="m-b-10">{data.ginder}</p>
                    <p className="m-b-10">{data.phoneNumber}</p>

                    <button
                      onClick={() => handleCancelRequest(userId)}
                      className="btn btn-primary AddBtn"
                    >
                      cancel request
                    </button>
                  </div>
                </div>
                <ul className="profile-header-tab nav nav-tabs">
                  <li className="nav-item activities" role="presentation">
                    <button
                      className={`nav-link px-4 ${
                        warehouseData.activeTab === "projects" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("projects")}
                    >
                      <span className="d-block d-sm-none activities">
                        <i className=" "></i>
                      </span>
                      <button className="d-none d-sm-block btn">
                        Projects
                      </button>
                    </button>
                  </li>
                  <li className="nav-item activities" role="presentation">
                    <button
                      className={`nav-link px-4 ${
                        warehouseData.activeTab === "Question" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("Question")}
                    >
                      <span className="d-block d-sm-none activities">
                        <i className=" "></i>
                      </span>
                      <button className="d-none d-sm-block btn">
                        Questions
                      </button>
                    </button>
                  </li>
                  <li className="nav-item activities" role="presentation">
                    <button
                      className={`nav-link px-4 mb-0 ${
                        warehouseData.activeTab === "posts" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("posts")}
                    >
                      <span className="d-block d-sm-none ">
                        <i className="mdi mdi-account-group-outline "></i>
                      </span>
                      <button className="d-none d-sm-block btn">Posts</button>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="tab-content">
          {warehouseData.activeTab === "projects" && (
                <div className="card-body">
                  <AnthorProject />
                </div>
              )}
              {warehouseData.activeTab === "Question" && (
                <div className="card-body">
                  <AnthorQuestion />
                </div>
              )}
            {warehouseData.activeTab === "posts" && (
              <div className="card-body">
                <AnthorPosts />
              </div>
            )}
          </div>
        </div>
      ) : status ===
        "You received a request from this user, and their account is public." ? (
        <div className="profile-content">
          <div className="private-account-message">
            <div className="profile" style={{ borderRadius: 30 }}>
              <div className="profile-header">
                <i class="fa-solid fa-pen-circle"></i>
                <div className="profile-header-cover">
                  <div className="dropdown" style={{ float: "right" }}>
                    <button
                      style={{
                        backgroundColor: "transparent",
                        marginTop: "2px",
                        color: "white",
                      }}
                      className="btn btn "
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      More...
                    </button>
                    <ul className="dropdown-menu">
                      <li
                        onClick={() => handleBlockUser(data.id)}
                        style={{ marginLeft: "16px" }}
                      >
                        {" "}
                        <a href="">
                          <FaUserAltSlash /> Block User
                        </a>
                      </li>
                      <li
                        onClick={() => downloadCV(userId)}
                        style={{ marginLeft: "16px" }}
                      >
                        {" "}
                        <a href="">
                          {" "}
                          <BsDownload />
                          Download CV{" "}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="profile-header-content">
                  <div className="profile-header-img">
                    {data.imgeurl ? (
                      <img src={`/imgs/${data.imgeurl}`} alt="Profile" />
                    ) : (
                      <img src="./download.png" alt="Profile" />
                    )}
                  </div>

                  <div className="profile-header-info">
                    <h4 className="m-t-10 m-b-5">
                      {data.fname} {data.lname}
                    </h4>
                    <p className="m-b-10">{data.userName}</p>
                    <p className="m-b-10">{data.birthdate}</p>
                    <p className="m-b-10">{data.bio}</p>
                    <p className="m-b-10">{data.ginder}</p>
                    <p className="m-b-10">{data.phoneNumber}</p>

                    <button
                      onClick={() => handleAcceptRequest(userId)}
                      className="btn btn-primary AddBtn"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleRefuseRequest(userId)}
                      className="btn btn-primary AddBtn"
                    >
                      Reject
                    </button>
                  </div>
                </div>
                <ul className="profile-header-tab nav nav-tabs">
                  <li className="nav-item activities" role="presentation">
                    <button
                      className={`nav-link px-4 ${
                        warehouseData.activeTab === "projects" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("projects")}
                    >
                      <span className="d-block d-sm-none activities">
                        <i className=" "></i>
                      </span>
                      <button className="d-none d-sm-block btn">
                        Projects
                      </button>
                    </button>
                  </li>
                  <li className="nav-item activities" role="presentation">
                    <button
                      className={`nav-link px-4 ${
                        warehouseData.activeTab === "Question" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("Question")}
                    >
                      <span className="d-block d-sm-none activities">
                        <i className=" "></i>
                      </span>
                      <button className="d-none d-sm-block btn">
                        Questions
                      </button>
                    </button>
                  </li>
                  <li className="nav-item activities" role="presentation">
                    <button
                      className={`nav-link px-4 mb-0 ${
                        warehouseData.activeTab === "posts" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("posts")}
                    >
                      <span className="d-block d-sm-none ">
                        <i className="mdi mdi-account-group-outline "></i>
                      </span>
                      <button className="d-none d-sm-block btn">Posts</button>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="tab-content">
          {warehouseData.activeTab === "projects" && (
                <div className="card-body">
                  <AnthorProject />
                </div>
              )}
              {warehouseData.activeTab === "Question" && (
                <div className="card-body">
                  <AnthorQuestion />
                </div>
              )}
            {warehouseData.activeTab === "posts" && (
              <div className="card-body">
                <AnthorPosts />
              </div>
            )}
          </div>
          <NotFound
              textToShow={textToShow}
              className="justify-content-center text-center ml-5"
                />
        </div>
      ) : status === "Friends." ? (
        <>
          <div className="profile-content">
            <div className="private-account-message">
              <div className="profile" style={{ borderRadius: 30 }}>
                <div className="profile-header">
                  <i class="fa-solid fa-pen-circle"></i>
                  <div className="profile-header-cover">
                    <div className="dropdown" style={{ float: "right" }}>
                      <button
                        style={{
                          backgroundColor: "transparent",
                          marginTop: "2px",
                          color: "white",
                        }}
                        className="btn  "
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        More...
                      </button>
                      <ul className="dropdown-menu">
                        <li
                          onClick={() => handleBlockUser(data.id)}
                          style={{ marginLeft: "16px" }}
                        >
                          {" "}
                          <a href="">
                            <FaUserAltSlash /> Block User
                          </a>
                        </li>
                        <li
                        onClick={() => downloadCV(userId)}
                        style={{ marginLeft: "16px" }}
                      >
                       
                          <BsDownload />
                          Download CV
                       
                      </li>
                      </ul>
                    </div>
                  </div>
                  <div className="profile-header-content">
                    <div className="profile-header-img">
                      {data.imgeurl ? (
                        <img src={`/imgs/${data.imgeurl}`} alt="Profile" />
                      ) : (
                        <img src="./download.png" alt="Profile" />
                      )}
                    </div>

                    <div className="profile-header-info">
                      <h4 className="m-t-10 m-b-5">
                        {data.fname} {data.lname}
                      </h4>
                      <p className="m-b-10">{data.userName}</p>
                      <p className="m-b-10">{data.birthdate}</p>
                      <p className="m-b-10">{data.bio}</p>
                      <p className="m-b-10">{data.ginder}</p>
                      <p className="m-b-10">{data.phoneNumber}</p>
                      <Link to={`/Chat/${userId}`}>
                        <button
                          onClick={() => getMessages(userId)}
                          className="btn btn-primary AddBtn"
                        >
                          Message
                        </button>
                      </Link>
                      <button
                        onClick={() => handleUnFriend(userId)}
                        className="btn btn-primary AddBtn"
                      >
                        UnFriend
                      </button>
                    </div>
                  </div>
                  <ul className="profile-header-tab nav nav-tabs">
                    <li className="nav-item activities" role="presentation">
                      <button
                        className={`nav-link px-4 ${
                          warehouseData.activeTab === "projects" ? "active" : ""
                        }`}
                        onClick={() => handleTabClick("projects")}
                      >
                        <span className="d-block d-sm-none activities">
                          <i className=" "></i>
                        </span>
                        <button className="d-none d-sm-block btn">
                          Projects
                        </button>
                      </button>
                    </li>
                    <li className="nav-item activities" role="presentation">
                      <button
                        className={`nav-link px-4 ${
                          warehouseData.activeTab === "Question" ? "active" : ""
                        }`}
                        onClick={() => handleTabClick("Question")}
                      >
                        <span className="d-block d-sm-none activities">
                          <i className=" "></i>
                        </span>
                        <button className="d-none d-sm-block btn">
                          Questions
                        </button>
                      </button>
                    </li>
                    <li className="nav-item activities" role="presentation">
                      <button
                        className={`nav-link px-4 mb-0 ${
                          warehouseData.activeTab === "posts" ? "active" : ""
                        }`}
                        onClick={() => handleTabClick("posts")}
                      >
                        <span className="d-block d-sm-none ">
                          <i className="mdi mdi-account-group-outline "></i>
                        </span>
                        <button className="d-none d-sm-block btn">Posts</button>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="tab-content">
              {warehouseData.activeTab === "projects" && (
                <div className="card-body">
                  <AnthorProject />
                </div>
              )}
              {warehouseData.activeTab === "Question" && (
                <div className="card-body">
                  <AnthorQuestion />
                </div>
              )}
              {warehouseData.activeTab === "posts" && (
                <div className="card-body">
                  <AnthorPosts />
                </div>
              )}
            </div>
          </div>
        </>
      ) : status === "Two user IDs are the same." ? (
        <>
          <UserProfile />
        </>
      ) : (
        <div className="profile-content">
          <div className="tab-content p-0">
            <div className="tab-pane fade active show" id="profile-post">
              {/* Render profile content */}
            </div>
          </div>
        </div>
      )}
      <SharePost selectedPost={selectedPost} />
      <Sidebar userId={userId} />
    </>
  );
};
export default AnotherProfile;
