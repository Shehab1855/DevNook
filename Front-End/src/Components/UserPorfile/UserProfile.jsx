import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./UserProfile.css";
import Posts from "../Post/Post";
import Friends from "../Friends/Friends";
import { FaAt, FaHeart, FaPenAlt } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import Question from "../Question/Question";
import Projects from "../Projects/Projects";
import ProjectCard from "../ProjectCard/ProjectCard";
import QuestionCard from "../QuestionCard/QuestionCard";
import { toast, ToastContainer } from "react-toastify";
const Warehouse = () => {
  const token = localStorage?.getItem("userToken");
  const user = jwtDecode(token);
  const [warehouse, setWarehouse] = useState({
    loading: true,
    results: {},
    err: null,
    reload: 0,
    activeTab: "projects",
  });
  const inputRef = useRef(null);
  const myObject = warehouse.results;
  const [infoudi, setinfoudi] = useState(null);
  const handleTabClick = (tab) => {
    setWarehouse({ ...warehouse, activeTab: tab });
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `https://localhost:7134/api/profile/getUserLogin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setinfoudi(response.data.id);
      console.log(response.data);
      setWarehouse({
        ...warehouse,
        results: response.data,
        loading: false,
        err: null,
      });
    } catch (error) {
      setWarehouse({
        ...warehouse,
        loading: false,
        err: error.response.data.err,
      });
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    console.log(formData);
    try {
      const response = await axios.post(
        `https://localhost:7134/api/profile/uploadProfilePicture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data); // Log the response for debugging

      const imgeurl = response.data.imgeurl; // Fix the variable name

      setWarehouse({
        ...warehouse,
        results: { ...myObject, imgeurl },
      });
      toast.success("photo uploaded successfully");
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  const handleClickProfilePhoto = () => {
    inputRef.current.click(); // Trigger click on the file input
  };
  useEffect(() => {
    fetchUserData();
  }, [warehouse.reload, token]);

  return (
    <>
      <link
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
        rel="stylesheet"
      />

      <div className="profile">
        <div className="profile-header">
          <div className="profile-header-cover"></div>

          <div className="profile-header-content">
            <Link to="/editprofile">
              <button
                className="btn btn-sm btn-info"
                style={{ float: "right" }}
              >
                <FaPenAlt />
              </button>
            </Link>

            <div
              className="profile-header-img"
              style={{
                width: "140px",
                height: "140px",
                marginRight: 15,
                borderRadius: "50%",
                cursor: "pointer",
              }}
              onClick={handleClickProfilePhoto} // Add onClick handler to trigger file input click
            >
              {myObject.imgeurl ? (
                <img src={`/imgs/${myObject.imgeurl}`} alt="Profile" />
              ) : (
                <img src="./download.png" alt="Profile" />
              )}
              <input
                type="file"
                onChange={handleImageChange}
                ref={inputRef}
                style={{ display: "none" }}
              />
            </div>

            <div className="profile-header-info">
              <h4 className="m-t-10 m-b-5">
                {myObject.fname} {myObject.lname}
              </h4>
              <p className="m-b-10">{myObject.userName}</p>
              <p className="m-b-10">{myObject.birthdate}</p>
              <p className="m-b-10">{myObject.bio}</p>
              <p className="m-b-10">{myObject.phoneNumber}</p>
              <p className="m-b-10">{myObject.gender}</p>
              {/*  */}
            </div>
          </div>
          <ul className="profile-header-tab nav nav-tabs">
            <li className="nav-item activities" role="presentation">
              <button
                className={`nav-link px-4 ${
                  warehouse.activeTab === "projects" ? "active" : ""
                }`}
                onClick={() => handleTabClick("projects")}
              >
                <span className="d-block d-sm-none activities">
                  <i className=" "></i>
                </span>
                <button className="d-none d-sm-block btn">Projects</button>
              </button>
            </li>
            <li className="nav-item activities" role="presentation">
              <button
                className={`nav-link px-4 ${
                  warehouse.activeTab === "Question" ? "active" : ""
                }`}
                onClick={() => handleTabClick("Question")}
              >
                <span className="d-block d-sm-none activities">
                  <i className=" "></i>
                </span>
                <button className="d-none d-sm-block btn">Questions</button>
              </button>
            </li>
            <li className="nav-item activities" role="presentation">
              <button
                className={`nav-link px-4 mb-0 ${
                  warehouse.activeTab === "posts" ? "active" : ""
                }`}
                onClick={() => handleTabClick("posts")}
              >
                <span className="d-block d-sm-none ">
                  <i className="mdi mdi-account-group-outline "></i>
                </span>
                <button className="d-none d-sm-block btn">Posts</button>
              </button>
            </li>

            <li className="nav-item activities" role="presentation">
              <button
                className={`nav-link px-4 mb-0 ${
                  warehouse.activeTab === "friends" ? "active" : ""
                }`}
                onClick={() => handleTabClick("friends")}
              >
                <span className="d-block d-sm-none ">
                  <i className="mdi mdi-account-group-outline "></i>
                </span>
                <button className="d-none d-sm-block btn">Friends</button>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="profile-content">
        <div className="card">
          <div className="tab-content">
            {warehouse.activeTab === "projects" && (
              <div className="card-body">
                {/* Display projects content here */}
                <ProjectCard />
              </div>
            )}
            {warehouse.activeTab === "Question" && (
              <div className="card-body">
                <QuestionCard name={myObject.userName} />
              </div>
            )}
            {warehouse.activeTab === "posts" && (
              <div className="card-body">
                <Posts name={myObject.userName} />
              </div>
            )}

            {warehouse.activeTab === "friends" && (
              <div className="card-body">
                <Friends name={myObject.userName} />
              </div>
            )}
          </div>
        </div>
        
        <ToastContainer />
      </div>
    </>
  );
};

export default Warehouse;
