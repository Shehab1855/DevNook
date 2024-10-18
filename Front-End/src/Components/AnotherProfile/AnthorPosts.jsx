import React from "react";
import { useEffect, useState } from "react";
import "./AnotherProfile.css";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import UserProfile from "../UserPorfile/UserProfile";
import NotFound from "../NotFound/NotFound";
import Comment from "../Comment/Comment";
import SharePost from "../SharePost/SharePost";
import Likes from "../Likes/Likes";
import DisLikes from "../Dislikes/Dislikes";
import { toast, ToastContainer } from "react-toastify";
const AnthorPosts = ({}) => {
  const token = localStorage?.getItem("userToken");
  const textToShow = "NotFound ";
  const { userId } = useParams();
  const [likesList, setLikesList] = useState([]);
  const [DislikesList, setDisLikesList] = useState([]);
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
  const [Info, setInfo] = useState(null);
  const [selectedPost, setSelectedPost] = useState({});
  const [messages, setMessages] = useState([]);
  const [warehouseData, setWarehouseData] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
    activeTab: "projects",
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
      console.log(response.data.imgeurl);
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
  const handleLike = async (postId) => {
    try {
      const response = await axios.post(
        `https://localhost:7134/api/post/like/id ?id=${postId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUserPosts(userId);
      setToggleLike(false);
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };
  const handleUnlike = async (postId) => {
    try {
      await axios.put(
        `https://localhost:7134/api/post/unlike/id:int ?postid=${postId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUserPosts(userId);
      setToggleLike(true);
    } catch (error) {
      console.error("Error updating unlike:", error);
    }
  };
  const handleDislike = async (postId) => {
    try {
      const response = await axios.post(
        `https://localhost:7134/api/post/dislike/id:int ?id=${postId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUserPosts(userId);
      setToggleDislike(false);
    } catch (error) {
      console.error("Error updating dislike:", error);
    }
  };
  const handleUnDislike = async (postId) => {
    try {
      const response = await axios.put(
        `https://localhost:7134/api/post/undislike/id:int ?postid=${postId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUserPosts(userId);
      setToggleDislike(true);
    } catch (error) {
      console.error("Error updating undislike:", error);
    }
  };
  const handleComment = async (postId) => {
    try {
      await axios.post(
        `https://localhost:7134/api/post/comment?id=${postId}`,
        { taxt: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch data again to get updated comments
      setWarehouseData((prev) => ({ ...prev, reload: (prev.reload += 1) }));
      setCommentText(""); // Clear the comment text input
    } catch (error) {
      console.error("Error posting comment:", error);
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
  const handleSavePost = async (postId) => {
    try {
      const response = await axios.post(
        `https://localhost:7134/api/post/Bookmark/id ?id=${postId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Post saved successfully!");
      } else if (response.status === 400) {
        toast.error("This post has already been saved.");
      }
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };
  const handleReportPost = async (postId) => {
    try {
      // Send a request to your backend API to report the post
      const response = await axios.post(
        `https://localhost:7134/api/post/report/id ?id=${postId}`,
        { postId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle any necessary UI updates or notifications
      toast.success("Post reported successfully!");
    } catch (error) {
      // Handle errors appropriately
      console.error("Error reporting post:", error);
      toast.error("You are already done");
    }
  };
  useEffect(() => {
    getAnotherProfile(userId);
    fetchUserPosts(userId);
    statusProfile(userId);
  }, []);
  return (
    <>
      <div className="tab-content p-0">
        <div className="tab-pane fade active show" id="profile-post">
          {posts.length < 1 ? (
            <NotFound
              textToShow={textToShow}
              className="justify-content-center text-center ml-5"
            />
          ) : (
            posts.map((post) =>
              post.share ? (
                <ul key={post.id} className="timeline">
                  <li>
                    <div className="timeline-time">
                      <span className="date">{post.createdDate}</span>
                    </div>

                    <div className="timeline-icon">
                      <a>&nbsp;</a>
                    </div>
                    <div className="timeline-body">
                    
                      <div className="timeline-header">
                        <span className="userimage">
                          <img
                            src={`/imgs/${post.userimage}`}
                            className="img-circle avatar"
                            style={{ width: "50px", height: "50px" }}
                            alt="Avatar"
                          />
                        </span>
                        <span className="username">
                          <Link to={`/AnotherProfile/${userId}`}>
                            <b>{data.userName}</b>
                            <small></small>
                          </Link>
                        </span>
                        <div className="dropdown" style={{ float: "right" }}>
                          <button
                            className="btn btn-ellipsis "
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="fas fa-ellipsis-v"></i>
                          </button>
                          <ul className="dropdown-menu">
                            <li onClick={() => handleSavePost(post.id)}>
                              <a className="dropdown-item">
                                <i className="fas fa-save"></i> Save Post
                              </a>
                            </li>

                            <li onClick={() => handleReportPost(post.id)}>
                              <a className="dropdown-item">
                                <i className="fas fa-flag"></i> Report
                              </a>
                            </li>
                          </ul>
                        </div>
                      
                      </div>
                     
                      <div className="timeline-content" style={{ maxWidth: "100%", overflowWrap: "break-word" }}>
                        <p>{post.contant}</p>
                      </div>
                      {post.postimage ? (
                        <img
                          src={`/Postimags/${post.postimage}`}
                          className="img-circle avatar"
                          style={{ width: "100%", height: "auto" }}
                        />
                      ) : (
                        " "
                      )}
                      <div className="buttonss" style={{ display: "flex" }}>
                        <button
                          type="button"
                          className="d-block mutualBtn btn-btn-primary likes-btn"
                          data-bs-toggle="modal"
                          data-bs-target="#showLikesOnPost"
                          onClick={() => getLikesList(post.id)}
                        >
                          {" "}
                          <span className="fa-stack fa-fw stats-icon">
                            <i className="fa-solid fa-heart"></i>
                          </span>
                          {post.likesList} {""}
                          Likes
                        </button>
                        <button
                          type="button"
                          className="d-block mutualBtn btn-btn-primary likes-btn"
                          data-bs-toggle="modal"
                          data-bs-target="#DisshowLikesOnPost"
                          onClick={() => getdisLikes(post.id)}
                        >
                          {" "}
                          <span className="fa-stack fa-fw stats-icon">
                            <i className="fa-sharp fa-solid fa-heart-crack"></i>
                          </span>
                          {post.DislikesList} {""}
                          disLikes
                        </button>
                      </div>
                      <div className="timeline-likes"></div>
                      <div className="timeline-footer">
                        {!post.like ? (
                          <button
                            className="m-r-15 text-inverse-lighter postButtons"
                            onClick={() => handleLike(post.id)}
                          >
                            <i className="fa fa-thumbs-up fa-fw fa-lg m-r-3"></i>{" "}
                            {post.totallike} Like
                          </button>
                        ) : (
                          <button
                            className="m-r-15 text-inverse- lighter foot-btn"
                            onClick={() => handleUnlike(post.id)}
                          >
                            <i className="fa fa-thumbs-up fa-fw fa-lg m-r-3"></i>{" "}
                            {post.totallike} unLike
                          </button>
                        )}
                        {!post.dislike ? (
                          <button
                            className="m-r-15 text-inverse-lighter postButtons"
                            onClick={() => handleDislike(post.id)}
                          >
                            <i className="fa fa-thumbs-down fa-fw fa-lg m-r-3"></i>{" "}
                            {post.totaldislike} Dislike
                          </button>
                        ) : (
                          <button
                            className="m-r-15 text-inverse-lighter postButtons"
                            onClick={() => handleUnDislike(post.id)}
                            style={{ color: "blue" }}
                          >
                            <i className="fa fa-thumbs-down fa-fw fa-lg m-r-3"></i>{" "}
                            {post.totaldislike} Undislike
                          </button>
                        )}

                        <button
                          className="m-r-15 text-inverse-lighter postButtons"
                          onClick={() => setShowCommentInput(!showCommentInput)}
                        >
                          <i className="fa fa-comments fa-fw fa-lg m-r-3"></i>{" "}
                          {post.totalcomment} Comment
                        </button>
                        <button
                          style={{ display: "inline-block" }}
                          className="m-r-15 text-inverse- lighter foot-btn"
                          data-bs-toggle="modal"
                          data-bs-target="#sharePost"
                          onClick={() =>
                            setSelectedPost({
                              ...post,
                              name: post.username,
                            })
                          }
                        >
                          <i className="fa-solid fa-share"></i>{" "}
                          {post.totalshare} Share
                        </button>
                      </div>
                      {showCommentInput && (
                        <div className="timeline-comment-box">
                          <Comment postId={post.id} />
                          <div>
                          <img  src={`/imgs/${post.imgeurl}`}
                          
                       class="avatar rounded-circle" alt="user profile image" />
                       </div>
                          <div className="input">
                            <input
                              type="text"
                              className="form-control rounded-corner"
                              placeholder="Write a comment..."
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                            />
                            <button
                              className="btn btn-primary btn-rounded btn-sm mt-4"
                              onClick={() => handleComment(post.id)}
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                </ul>
              ) : (
                <>
                  <ul key={post.id} className="timeline">
                    <li>
                      <div className="timeline-time">
                        <span className="date">{post.createdDate}</span>
                      </div>

                      <div className="timeline-icon">
                        <a>&nbsp;</a>
                      </div>
                      <div className="timeline-body">
                        <div className="timeline-header">
                          <span className="userimage">
                            <img
                              src={`/imgs/${post.userimage}`}
                              className="img-circle avatar"
                              style={{ width: "50px", height: "50px" }}
                              alt="Avatar"
                            />
                          </span>
                          <span className="username">
                            <Link to={`/AnotherProfile/${userId}`}>
                              <b>{data.userName}</b>
                              <small></small>
                            </Link>
                          </span>
                          <div className="dropdown" style={{ float: "right" }}>
                            <button
                              className="btn btn-ellipsis "
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i className="fas fa-ellipsis-v"></i>
                            </button>
                            <ul className="dropdown-menu">
                              <li onClick={() => handleSavePost(post.id)}>
                                <a className="dropdown-item">
                                  <i className="fas fa-save"></i> Save Post
                                </a>
                              </li>

                              <li onClick={() => handleReportPost(post.id)}>
                                <a className="dropdown-item">
                                  <i className="fas fa-flag"></i> Report
                                </a>
                              </li>
                            </ul>
                          </div>
                         
                        </div>

                        <div className="timeline-content">
                          <p>{post.contant}</p>
                        </div>
                        {post.postimage ? (
                          <img
                            src={`/Postimags/${post.postimage}`}
                            className="img-circle avatar"
                            style={{ width: "100%", height: "auto" }}
                          />
                        ) : (
                          " "
                        )}
                        <div className="buttonss" style={{ display: "flex" }}>
                          <button
                            type="button"
                            className="d-block mutualBtn btn-btn-primary likes-btn"
                            data-bs-toggle="modal"
                            data-bs-target="#showLikesOnPost"
                            onClick={() => getLikesList(post.id)}
                          >
                            {" "}
                            <span className="fa-stack fa-fw stats-icon">
                              <i className="fa-solid fa-heart"></i>
                            </span>
                            {post.likesList} {""}
                            Likes
                          </button>
                          <button
                            type="button"
                            className="d-block mutualBtn btn-btn-primary likes-btn"
                            data-bs-toggle="modal"
                            data-bs-target="#DisshowLikesOnPost"
                            onClick={() => getdisLikes(post.id)}
                          >
                            {" "}
                            <span className="fa-stack fa-fw stats-icon">
                              <i className="fa-sharp fa-solid fa-heart-crack"></i>
                            </span>
                            {post.DislikesList} {""}
                            disLikes
                          </button>
                        </div>
                        <div className="timeline-likes"></div>
                        <div className="timeline-footer">
                          {!post.like ? (
                            <button
                              className="m-r-15 text-inverse-lighter postButtons"
                              onClick={() => handleLike(post.id)}
                            >
                              <i className="fa fa-thumbs-up fa-fw fa-lg m-r-3"></i>{" "}
                              {post.totallike} Like
                            </button>
                          ) : (
                            <button
                              className="m-r-15 text-inverse- lighter foot-btn"
                              onClick={() => handleUnlike(post.id)}
                            >
                              <i className="fa fa-thumbs-up fa-fw fa-lg m-r-3"></i>{" "}
                              {post.totallike} unLike
                            </button>
                          )}
                          {!post.dislike ? (
                            <button
                              className="m-r-15 text-inverse-lighter postButtons"
                              onClick={() => handleDislike(post.id)}
                            >
                              <i className="fa fa-thumbs-down fa-fw fa-lg m-r-3"></i>{" "}
                              {post.totaldislike} Dislike
                            </button>
                          ) : (
                            <button
                              className="m-r-15 text-inverse-lighter postButtons"
                              onClick={() => handleUnDislike(post.id)}
                              style={{ color: "blue" }}
                            >
                              <i className="fa fa-thumbs-down fa-fw fa-lg m-r-3"></i>{" "}
                              {post.totaldislike} Undislike
                            </button>
                          )}

                          <button
                            className="m-r-15 text-inverse-lighter postButtons"
                            onClick={() =>
                              setShowCommentInput(!showCommentInput)
                            }
                          >
                            <i className="fa fa-comments fa-fw fa-lg m-r-3"></i>{" "}
                            {post.totalcomment} Comment
                          </button>
                          <button
                            style={{ display: "inline-block" }}
                            className="m-r-15 text-inverse- lighter foot-btn"
                            data-bs-toggle="modal"
                            data-bs-target="#sharePost"
                            onClick={() =>
                              setSelectedPost({
                                ...post,
                                name: post.username,
                              })
                            }
                          >
                            <i className="fa-solid fa-share"></i>{" "}
                            {post.totalshare} Share
                          </button>
                        </div>
                        {showCommentInput && (
                          <div className="timeline-comment-box">
                            <Comment postId={post.id} />
                            <div className="user">
                            <img  src={`/imgs/${post.imgeurl}`}
                       class="avatar rounded-circle" alt="user profile image" />
                            </div>
                            <div className="input">
                              <input
                                type="text"
                                className="form-control rounded-corner"
                                placeholder="Write a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                              />
                              <button
                                className="btn btn-primary btn-rounded btn-sm mt-4"
                                onClick={() => handleComment(post.id)}
                              >
                                Post
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </li>
                  </ul>
                </>
              )
            )
          )}
        </div>

        <Likes likesList={likesList} />
        <DisLikes DislikesList={DislikesList} />
        <ToastContainer />
      </div>
    </>
  );
};
export default AnthorPosts;
