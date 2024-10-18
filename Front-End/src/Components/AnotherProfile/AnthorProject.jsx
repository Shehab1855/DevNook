import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
export default function AnthorProject({ userData }) {
  const token = localStorage.getItem("userToken");
  const { userId } = useParams();
  const [brief, setBrief] = useState("");
  const [file, setFile] = useState(null);
  const [commentSubmitted, setCommnetSubmitted] = useState("");
  const [commentText, setCommentText] = useState("");
  const [projectSubmitted, setProjectSubmitted] = useState(false);
  const [projectCommentsVisibility, setProjectCommentsVisibility] = useState(
    {}
  );
  
  const [projectBookmarked, setProjectBookmarked] = useState(
    JSON.parse(localStorage?.getItem("bookmarkedProjects")));
  const [comments, setComments] = useState([]);
  const [warehouseData, setWarehouseData] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
  });
  const [likedProjects, setLikedProjects] = useState([]);
  const [dislikedProjects, setDisLikedProjects] = useState([]);
  const [Proid, setProid] = useState(null);
 
  const getProooo = async (id) => {
    try {
      const response = await axios.get(
        `https://localhost:7134/api/Project/GetANTHERProjects/string:id?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWarehouseData({
        ...warehouseData,
        results: response.data.reverse(),
        loading: false,
        err: null,
      });
    } catch (err) {
      setWarehouseData({
        ...warehouseData,
        loading: false,
        err: err.response?.data?.err || "Error fetching projects",
      });
    }
  };
  const getComment = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7134/api/Project/GetAllComment",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(response.data);
      console.log(response.data);
    } catch (error) {
      // console.error('Error fetching comments:', error);
    }
  };
  useEffect(() => {
    getComment();
    getProooo(userId);
  }, [userId]);

  const handleLike = async (projectID) => {
    try {
      if (likedProjects.includes(projectID)) {
        await deleteLike(projectID);
      } else {
        await axios.post(
          `https://localhost:7134/api/Project/like/id:int?id=${projectID}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLikedProjects([...likedProjects, projectID]);
        setProjectSubmitted(true);
        getProooo(userId);

      }
    } catch (error) {
      // console.error('Error toggling like:', error);
    }
  };
  const handleDislike = async (projectID) => {
    try {
      if (dislikedProjects.includes(projectID)) {
        await deleteDislike(projectID);
      } else {
        await axios.post(
          `https://localhost:7134/api/Project/dislike/id:int ?id=${projectID}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDisLikedProjects([...dislikedProjects, projectID]);
        setProjectSubmitted(true);
        getProooo(userId);
      }
    } catch (error) {
      console.error("Error disliking project:", error);
    }
  };
  const deleteComment = async (commentID) => {
    try {
      await axios.delete(
        `https://localhost:7134/api/Project/comment/id:int ?ProjectEvent=${commentID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getComment();
      getProooo(userId);
    } catch (error) {
      // console.error('Error deleting comment:', error);
    }
  };
  const deleteLike = async (projectId) => {
    try {
      await axios.delete(
        `https://localhost:7134/api/Project/DeleteLike/id:int ?projectid=${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getProooo(userId);
      // Refresh project data after deleting like
    } catch (error) {
      console.error("Error deleting like:", error);
    }
  };

  const deleteDislike = async (projectId) => {
    try {
      await axios.delete(
        `https://localhost:7134/api/Project/DeleteDisLike/id:int ?projectid=${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getProooo(userId);      // Refresh project data after deleting dislike
    } catch (error) {
      console.error("Error deleting dislike:", error);
    }
  };
  const handleComment = async (projectID, commentSubmitted) => {
    try {
      await axios.post(
        `https://localhost:7134/api/Project/comment?id=${projectID}&Comment=${commentSubmitted}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getComment();
      getProooo(userId);
    } catch (error) {
      // console.error('Error submitting comment:', error);
    }
  };

  const toggleCommentsVisibility = (projectID) => {
    setProjectCommentsVisibility((prevState) => ({
      ...prevState,
      [projectID]: !prevState[projectID] || false,
    }));
  };
  async function toggleProjectBookmarked(projectID) {
    try {
      const isBookmarked = projectBookmarked[projectID] || false;
      if (isBookmarked) {
        await axios.put(
          `https://localhost:7134/api/Project/unBookmark/projectid?projectid=${projectID}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          `https://localhost:7134/api/Project/Bookmark/id ?id=${projectID}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      // Update local storage with the new bookmarked projects
      const updatedBookmarkedProjects = {
        ...projectBookmarked,
        [projectID]: !isBookmarked,
      };
      localStorage.setItem(
        "bookmarkedProjects",
        JSON.stringify(updatedBookmarkedProjects)
      );
      setProjectBookmarked(updatedBookmarkedProjects);
    } catch (error) {
      // console.error('Error toggling project bookmark:', error);
    }
  }
  return (
    <div>
      {warehouseData &&
        warehouseData.results &&
        warehouseData.results.map((project, index) => (
          <div key={index} className="border border-1 rounded-3 w-75 my-3">
            <div className="mx-1 py-1 m-3 position-relative">
              <Link
                to={`/projectDetails/${project.id}`}
                onClick={(e) => {
                  const clickedElement = e.target.tagName.toLowerCase();
                  if (
                    clickedElement !== "button" &&
                    clickedElement !== "input" &&
                    clickedElement !== "a"
                  ) {
                    // Navigate to projectDetails only if the clicked element is not a button or input
                  }
                }}
              >
                <h6 className="ps-1 fw-light">
                  <Link to={`/AnotherProfile/${project.userId}`}>
                    {"< "}
                    {project.userName}
                    {" />"}
                  </Link>
                </h6>
                <h6 className="mt-1 font-monospace fs-5 ps-2">
                  {project.brief}
                </h6>
              </Link>
              <button
                onClick={() => toggleProjectBookmarked(project.id)}
                className="border-0 bg-white position-absolute top-10 start-100"
              >
                {projectBookmarked[project.id] ? (
                  <i className="fa-solid fa-bookmark"></i>
                ) : (
                  <i className="fa-regular fa-bookmark"></i>
                )}
              </button>
              <div className="d-flex">
                <button
                  onClick={() => handleLike(project.id)}
                  className="btn btn-info px-2 mx-2"
                >
                  <i className="fa-solid fa-thumbs-up"></i> {project.totallike}
                </button>
                <button
                  onClick={() => handleDislike(project.id)}
                  className="btn btn-dark px-2"
                >
                  <i className="fa-solid fa-thumbs-down"></i>{" "}
                  {project.totaldislike}
                </button>
                <div className="d-flex w-75">
                  <input
                    onChange={(e) => setCommnetSubmitted(e.target.value)}
                    type="text"
                    className="form-control border border-1 rounded-3 border-info ms-1 me-1"
                    placeholder="comment"
                  />
                  <button
                    onClick={() => handleComment(project.id, commentSubmitted)}
                    className="btn border border-1 rounded-4 btn-outline-info text-black"
                  >
                    submit
                  </button>
                  <button
                    className="bg-white border-0"
                    onClick={() => toggleCommentsVisibility(project.id)}
                  >
                    {projectCommentsVisibility[project.id] ? (
                      <i className="fa-solid fa-chevron-up"></i>
                    ) : (
                      <i className="fa-solid fa-chevron-down"></i>
                    )}
                  </button>
                </div>
              </div>
              {projectCommentsVisibility[project.id] &&
                comments
                  .filter((comment) => comment.projectid === project.id)
                  .map((comment, idx) => (
                    <div key={idx}>
                      <div className="mt-1 mb-0 pb-0 ps-2 pt-1 d-flex">
                        <h6 className="ps-1 fw-light">
                          <Link to={`/AnotherProfile/${comment.userId}`}>
                            {"< "}
                            {comment.userName}
                            {" />"}
                          </Link>
                        </h6>
                        <p className="ms-1">{comment.text}</p>
                        {userData.uid === comment.userid && (
                        <button
                          onClick={() => deleteComment(comment.id)}
                          className="btn p-1 pt-0 mb-2 ms-2"
                        >
                          <i className="fa-solid fa-trash fa-xs"></i>
                        </button>
                         )} 
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        ))}
    </div>
  );
}
