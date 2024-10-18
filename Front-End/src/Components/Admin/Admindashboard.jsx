import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Admindashboard.css";
import "./Admin.css";
import { Link } from "react-router-dom";
import Questions from "./Questions";
import Users from "./User";
import Pending from "./Pending";
import Approved from "./Approved";
import Likes from "../Likes/Likes";
import DisLikes from "../Dislikes/Dislikes";
const Admindashboard = ({}) => {
  const token = localStorage.getItem("userToken");
  const [warehouseData, setWarehouseData] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
  });
  const myObject = warehouseData.results;
  console.log(myObject);
  const [activeTab, setActiveTab] = useState("completed");
  const [isLoading, setIsLoading] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [totalProjects, setTotalProjects] = useState(0);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [pendingProjects, setPendingProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [Total, SetTotal] = useState([]);
  const [likesList, setLikesList] = useState([]);
  const [DislikesList, setDisLikesList] = useState([]);
  const getTotal = async () => {
    try {
      const response = await axios.get(
        `https://localhost:7134/api/AdminDashboard/GetTotal`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      SetTotal(response.data);
    } catch (err) {
      console.error("Error fetching total projects:", err);
    }
  };
  const getPro = async () => {
    setWarehouseData((prevData) => ({ ...prevData, loading: true }));
    try {
      const response = await axios.get(
        `https://localhost:7134/api/Project/GetAllFiles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTotalProjects(response.data);
      setWarehouseData((prevData) => ({
        ...prevData,
        results: response.data.reverse(), // Reverse the data if needed
        loading: false,
        err: null,
      }));
    } catch (err) {
      setWarehouseData((prevData) => ({
        ...prevData,
        loading: false,
        err: err.response?.data?.err || "Error fetching projects", // Corrected error message
      }));
    }
  };
  const getpendingProjects = async () => {
    setWarehouseData((prevData) => ({ ...prevData, loading: true }));
    try {
      const response = await axios.get(
        `https://localhost:7134/api/Project/GetPendingProject`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPendingProjects(response.data);
      setWarehouseData((prevData) => ({
        ...prevData,
        results: response.data.reverse(), // Reverse the data if needed
        loading: false,
        err: null,
      }));
    } catch (err) {
      setWarehouseData((prevData) => ({
        ...prevData,
        loading: false,
        err: err.response?.data?.err || "Error fetching projects", // Corrected error message
      }));
    }
  };
  const getApprovedProjects = async () => {
    setWarehouseData((prevData) => ({ ...prevData, loading: true }));
    try {
      const response = await axios.get(
        `https://localhost:7134/api/Project/GetApprovedProjects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCompletedProjects(response.data);
      setWarehouseData((prevData) => ({
        ...prevData,
        results: response.data.reverse(), // Reverse the data if needed
        loading: false,
        err: null,
      }));
    } catch (err) {
      setWarehouseData((prevData) => ({
        ...prevData,
        loading: false,
        err: err.response?.data?.err || "Error fetching projects", // Corrected error message
      }));
    }
  };
  const getAlllPosts = async () => {
    setWarehouseData((prevData) => ({ ...prevData, loading: true }));
    try {
      const response = await axios.get(
        `https://localhost:7134/api/AdminDashboard/GetAllpost`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts(response.data);
      setWarehouseData((prevData) => ({
        ...prevData,
        results: response.data.reverse(), // Reverse the data if needed
        loading: false,
        err: null,
      }));
    } catch (err) {
      setWarehouseData((prevData) => ({
        ...prevData,
        loading: false,
        err: err.response?.data?.err || "Error fetching projects", // Corrected error message
      }));
    }
  };
  const getLikesList = async (id) => {
    try {
      const response = await axios.get(
        `https://localhost:7134/api/post/Getlikes/id:int ?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setLikesList(response.data);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };
  const getdisLikes = async (id) => {
    try {
      const response = await axios.get(
        `https://localhost:7134/api/post/Getdislikes/id:int ?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setDisLikesList(response.data);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };
  const Deletepost = async (projectId) => {
    try {
      await axios.delete(
        `https://localhost:7134/api/AdminDashboard/Deletepost/id:int ?id=${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getAlllPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  useEffect(() => {
    getTotal();
    getPro();
    getpendingProjects();
    getApprovedProjects();
    getAlllPosts();
  }, []);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <link
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
        rel="stylesheet"
      />
      <div className="container">
        <div className="row">
          <div className="col-xl-3 col-md-6">
            <div
              className={`card bg-pattern${
                activeTab === "Total" ? " active" : ""
              }`}
              onClick={() => setActiveTab("Total")}
            >
              <div className="card-body">
                <div className="float-right">
                  <i className="fa fa-archive text-primary h4 ml-3"></i>
                </div>
                <h5 className="font-size-20 mt-0 pt-1">
                  {Total.totalProjects}
                </h5>
                <p className="text-muted mb-0">Total Projects</p>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div
              className={`card bg-pattern${
                activeTab === "completed" ? " active" : ""
              }`}
              onClick={() => setActiveTab("completed")}
            >
              <div className="card-body">
                <div className="float-right">
                  <i className="fa fa-th text-primary h4 ml-3"></i>
                </div>
                <h5 className="font-size-20 mt-0 pt-1">
                  {Total.totalApprovedProjects}
                </h5>
                <p className="text-muted mb-0">Completed Projects</p>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div
              className={`card bg-pattern${
                activeTab === "pending" ? " active" : ""
              }`}
              onClick={() => setActiveTab("pending")}
            >
              <div className="card-body">
                <div className="float-right">
                  <i class="fa-sharp fa-regular fa-hourglass-half h4 ml-3"></i>
                </div>
                <h5 className="font-size-20 mt-0 pt-1">
                  {Total.totalPendingProjects}
                </h5>
                <p className="text-muted mb-0">Pending Projects</p>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div
              className={`card bg-pattern${
                activeTab === "User" ? " active" : ""
              }`}
              onClick={() => setActiveTab("User")}
            >
              <div className="card-body">
                <div className="float-right">
                  <i class="fa-solid fa-users h4 ml-3"></i>
                </div>
                <h5 className="font-size-20 mt-0 pt-1">{Total.totalUser}</h5>
                <p className="text-muted mb-0">Users</p>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div
              className={`card bg-pattern${
                activeTab === "Questions" ? " active" : ""
              }`}
              onClick={() => setActiveTab("Questions")}
            >
              <div className="card-body">
                <div className="float-right">
                  <i class="fa-solid fa-circle-question h4 ml-3"></i>
                </div>
                <h5 className="font-size-20 mt-0 pt-1">{Total.totalRecipes}</h5>
                <p className="text-muted mb-0">Questions </p>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div
              className={`card bg-pattern${
                activeTab === "posts" ? " active" : ""
              }`}
              onClick={() => setActiveTab("posts")}
            >
              <div className="card-body">
                <div className="float-right">
                  <i class="fa-solid fa-message-text"></i>
                </div>
                <h5 className="font-size-20 mt-0 pt-1">{Total.totalPosts}</h5>
                <p className="text-muted mb-0">Posts </p>
              </div>
            </div>
          </div>
        </div>

        {/* Display total projects */}
        {activeTab === "Total" && (
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive project-list">
                    <table className="table project-table table-centered table-nowrap">
                      <Pending />
                      <Approved />
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Display pending projects */}
        {activeTab === "pending" && (
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive project-list">
                    <Pending />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Display completed projects */}
        {activeTab === "completed" && (
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive project-list">
                    <Approved />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "User" && (
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive project-list">
                    <table className="table project-table table-centered table-nowrap">
                      <Users />
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "Questions" && (
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive project-list">
                    <Questions />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "posts" && (
          <div className="row">
            {Array.isArray(warehouseData.results) &&
              warehouseData.results.map((post) => (
                <ul key={post.id} className="timeline">
                  <li>
                    <div className="timeline-time">
                      <span className="date">{post.createdDate}</span>
                    </div>

                    <div className="timeline-icon">
                      <a>&nbsp;</a>
                    </div>
                    <div className="timeline-body">
                      <div
                        className="timeline-header"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span className="userimage">
                            <img
                              src={`/imgs/${post.userimage}`}
                              className="img-circle avatar"
                              style={{
                                width: "50px",
                                height: "50px",
                                marginRight: "10px",
                              }}
                              alt="Avatar"
                            />
                          </span>
                          <span
                            className="username"
                            style={{ marginLeft: "10px" }}
                          >
                            <Link to={`/AnotherProfile/${post.userid}`}>
                              {post.username}
                            </Link>
                          </span>
                        </div>

                        <span style={{ float: "right" }}>
                          <i
                            className="fas fa-trash-alt"
                            onClick={() => Deletepost(post.id)}
                          ></i>
                        </span>
                      </div>
                      <br />
                      <div
                        className="timeline-content"
                        style={{
                          maxWidth: "100%",
                          overflowWrap: "break-word",
                          marginTop: "10px",
                        }}
                      >
                        <p>{post.contant}</p>
                      </div>
                      {post.postimage ? (
                        <img
                          src={`/Postimages/${post.postimage}`}
                          className="img-circle avatar"
                          style={{ width: "100%", height: "auto" }}
                          alt="Post"
                        />
                      ) : (
                        " "
                      )}
                      <div
                        className="buttonss"
                        style={{ display: "flex", marginTop: "10px" }}
                      >
                        <button
                          type="button"
                          className="d-block mutualBtn btn-btn-primary likes-btn"
                          data-bs-toggle="modal"
                          data-bs-target="#showLikesOnPost"
                          onClick={() => getLikesList(post.id)}
                        >
                          <span className="fa-stack fa-fw stats-icon">
                            <i className="fa-solid fa-heart"></i>
                          </span>
                          {post.likesList} Likes
                        </button>
                        <button
                          type="button"
                          className="d-block mutualBtn btn-btn-primary likes-btn"
                          data-bs-toggle="modal"
                          data-bs-target="#DisshowLikesOnPost"
                          onClick={() => getdisLikes(post.id)}
                        >
                          <span className="fa-stack fa-fw stats-icon">
                            <i className="fa-sharp fa-solid fa-heart-crack"></i>
                          </span>
                          {post.DislikesList} disLikes
                        </button>
                      </div>
                    </div>
                  </li>
                </ul>
              ))}
          </div>
        )}
        <Likes likesList={likesList} />
        <DisLikes DislikesList={DislikesList} />
      </div>
    </>
  );
};

export default Admindashboard;
