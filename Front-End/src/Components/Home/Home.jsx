import React, { useState, useRef, useEffect } from "react";
import { FaLocationArrow } from "react-icons/fa";
import axios from "axios";
import Comment from "../Comment/Comment";
import Likes from "../Likes/Likes";
import DisLikes from "../Dislikes/Dislikes";
import SharePosts from "../SharePost/SharePost";
import { toast, ToastContainer } from "react-toastify";
import "./Home.css";
import { Link, useParams } from "react-router-dom";
import EditPosts from "./EditPosts";
import { BiLock } from "react-icons/bi";
const Home = ({}) => {
  const token = localStorage.getItem("userToken");
  const [commentText, setCommentText] = useState("");
  const [PostText, setPostText] = useState("");
  const [toggleLike, setToggleLike] = useState(true);
  const [toggleDislike, setToggleDislike] = useState(true);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [selectedPost, setSelectedPost] = useState({});
  const [likesList, setLikesList] = useState([]);
  const [DislikesList, setDisLikesList] = useState([]);
  const EditPost = useState({ reload: 0 });
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [infoudi, setinfoudi] = useState(null);

  const [warehouseData, setWarehouseData] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
  });
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
   
      setDisLikesList(response.data);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };
  const getPosts = async () => {
    setWarehouseData({ ...warehouseData, loading: true });
    axios
      .get("https://localhost:7134/api/post/GetAllPostsForSameUser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        setWarehouseData({
          ...warehouseData,
          results: resp.data.reverse(),
          loading: false,
          err: null,
        });
      })
      .catch((err) => {
        setWarehouseData({
          ...warehouseData,
          loading: false,
          err: err.response.data.err,
        });
      });
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
      setinfoudi(response.data);
   
      setWarehouseData({
        ...warehouseData,
        results: response.data,
        loading: false,
        err: null,
      });
    } catch (error) {
      setWarehouseData({
        ...warehouseData,
        loading: false,
        err: error.response.data.err,
      });
    }
  };
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    inputRef.current.click(); // Update selectedFile state with the selected file
  };
  const createPost = async () => {
    try {
      const formData = new FormData();
      if (PostText.trim() !== "") {
        formData.append("contant", PostText);
      }
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const response = await axios.post(
        `https://localhost:7134/api/post?contant=${PostText}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWarehouseData((prev) => ({ ...prev, reload: (prev.reload += 1) }));
      getPosts();
      setPostText("");
      setSelectedFile(null);
      setWarehouseData({
        loading: false,
        results: response.data,
        err: null,
        reload: 0,
      });
      toast.success("Post uploaded successfully!");
    } catch (err) {
      setWarehouseData({
        loading: false,
        results: [],
        err: err.response?.data?.err || "Error fetching posts",
        reload: 0,
      });
    }
  };
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(
        `https://localhost:7134/api/post/id:int ?id=${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Reload posts after deletion
      getPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
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
      getPosts();
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
      getPosts();
      setToggleDislike(true);
    } catch (error) {
      console.error("Error updating undislike:", error);
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
      getPosts();
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
      getPosts();
      setToggleLike(true);
    } catch (error) {
      console.error("Error updating unlike:", error);
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
      setCommentText("");
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error("Error posting comment:", error);
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
  const handleCameraClick = () => {
    inputRef.current.click(); // Trigger click event on file input
  };
  useEffect(() => {
    getPosts();
    fetchUserData();
  }, [toggleLike, toggleDislike, EditPost[0].reload]);

  return (
    <>
      <link
        rel="stylesheet"
        type="text/css"
        href="//netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css"
      />
      <div className="main">
        <div
          className="well well-sm well-social-post row-form"
          style={{ width: "700px" }}
        >
          <form>
            <ul className="list-inline" id="list_PostActions">
              <textarea
                value={PostText}
                onChange={(e) => setPostText(e.target.value)}
                className="form-control"
                placeholder="What's in your mind?"
              ></textarea>
              <li className="active">
                <div>
                  <a href="#" onClick={handleCameraClick}>
                    <i className="fa-solid fa-camera"></i>
                  </a>
                  <input
                    type="file"
                    ref={inputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </div>
              </li>
              <Link
                className="btn btn-primary btn-xs"
                style={{
                  padding: "10px 15px",
                  borderRadius: "10px",
                  float: "right",
                }}
                onClick={() => createPost()}
              >
                Post
              </Link>
              {/* <button className="btn btn-primary" onClick={createPost}>post</button> */}
            </ul>
          </form>
        </div>

        {Array.isArray(warehouseData.results) &&
          warehouseData.results.map((post) =>
            post.share ? (
              <div className=" col-10">
                <div className="panel panel-white post panel-shadow post-p">
                  <div className="post-heading">
                    <div className="pull-left meta">
                      <span className="username">
                        <div className="pull-left image">
                          <img
                            src={`/imgs/${post.userimage}`}
                            className="img-circle avatar"
                            style={{ width: "50px", height: "50px" }}
                            alt="Avatar"
                          />
                        </div>
                        <div className="pull-left meta">
                          <span className="username">
                            <div className="title h5">
                              <a href="#">
                                <Link
                                  to={
                                    infoudi.id === post.userid
                                      ? `/Profile`
                                      : `/AnotherProfile/${post.userid}`
                                  }
                                >
                                  <b>{post.username}</b>
                                </Link>
                              </a>
                              <span
                                style={{
                                  fontSize: "15px",
                                  display: "block",
                                  whiteSpace: "nowrap",
                                  color: "gray",
                                  textShadow:
                                    "1px 1px 2px rgba(190,255,247,0.3)",
                                }}
                              >
                                {post.isfrind === true
                                  ? "frind "
                                  : "recommended for you"}
                              </span>
                            </div>
                          </span>
                        </div>
                        <span className="time" style={{ float: "right" }}>
                          {post.createdDate}
                        </span>
                      </span>
                    </div>

                    <div>
                      <div className="dropdown" style={{ float: "right" }}>
                        <button
                          className="btn btn-default dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        ></button>
                        <ul className="dropdown-menu">
                          <li onClick={() => handleDeletePost(post.id)}>
                            <a className="dropdown-item">DeletePost</a>
                          </li>

                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#editPost"
                            id="dropdown-p"
                            onClick={() =>
                              EditPost[1]({
                                ...EditPost[0],
                                ...post,
                                name: post.username,
                              })
                            }
                          >
                            <a className="dropdown-item">EditPost</a>
                          </li>
                          <li onClick={() => handleSavePost(post.id)}>
                            <a className="dropdown-item">SavePost</a>
                          </li>
                          <li onClick={() => handleReportPost(post.id)}>
                            <a className="dropdown-item">Report</a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="post-description">
                    <div
                      style={{ maxWidth: "100%", overflowWrap: "break-word" }}
                    >
                      <p> {post.contant}</p>
                    </div>
                    <div className="col-8">
                      <div className="panel panel-white post panel-shadow">
                        <div className="post-heading">
                          <div className="pull-left image">
                            {post.postimage ? (
                              <img
                                src={`/Postimags/${post.postimage}`}
                                className="img-circle avatar"
                                style={{
                                  width: "65%",
                                  height: "auto",
                                  position: "relative",
                                  marginLeft: "60px",
                                }}
                              />
                            ) : (
                              " "
                            )}
                          </div>
                          <div className="pull-left image">
                            <img
                              src={`/imgs/${post.userimage}`}
                              className="img-circle avatar"
                              style={{ width: "50px", height: "50px" }}
                              alt="Avatar"
                            />
                          </div>
                          <div className="pull-left meta">
                            <div className="title h5">
                              <a href="#">
                                <b>{post.oraginalPost.username} </b>
                              </a>
                              <span
                                style={{
                                  fontSize: "15px",
                                  display: "block",
                                  whiteSpace: "nowrap",
                                  color: "gray",
                                  textShadow:
                                    "1px 1px 2px rgba(190,255,247,0.3)",
                                }}
                              >
                                {post.isfrind === true
                                  ? "frind "
                                  : "recommended for you"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="post-description"  
                        style={{ maxWidth: "100%", overflowWrap: "break-word" }}>
                          <p> {post.oraginalPost.contant}</p>
                          {post.oraginalPost.postimage && (
                            <img
                              src={`/Postimages/${post.oraginalPost.postimage}`}
                              className="img-circle avatar"
                              style={{
                                width: "250px",
                                height: "250px",
                                textAlign: "center",
                              }}
                              alt="Avatar"
                            />
                          )}
                        </div>
                      </div>
                      <div
                        className="buttonsOfPost"
                        style={{
                          display: "flex",
                          float: "right",
                          marginTop: "4px",
                        }}
                      >
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
                    </div>

                    <div className="stats">
                      {!post.like ? (
                        <button
                          className="m-r-15 text-inverse- lighter foot-btn"
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
                          {post.totallike} Unlike
                        </button>
                      )}
                      {!post.dislike ? (
                        <button
                          href="javascript:;"
                          className="m-r-15 text-inverse- lighter foot-btn"
                          onClick={() => handleDislike(post.id)}
                        >
                          <i className="fa fa-thumbs-down fa-fw fa-lg m-r-3"></i>{" "}
                          {post.totaldislike} Dislike
                        </button>
                      ) : (
                        <button
                          href="javascript:;"
                          className="m-r-15 text-inverse- lighter foot-btn"
                          onClick={() => handleUnDislike(post.id)}
                          style={{ color: "black" }}
                        >
                          <i className="fa fa-thumbs-down fa-fw fa-lg m-r-3"></i>{" "}
                          {post.totaldislike} UnDislike
                        </button>
                      )}
                      <button
                        href="javascript:;"
                        className="m-r-15 text-inverse- lighter foot-btn"
                        onClick={() => setShowCommentInput(!showCommentInput)}
                      >
                        <i className="fa fa-comments fa-fw fa-lg m-r-3"></i>{" "}
                        {post.totalcomment} Comment
                      </button>
                      <button
                        className="m-r-15 text-inverse- lighter"
                        data-bs-toggle="modal"
                        data-bs-target="#sharePost"
                        onClick={() =>
                          setSelectedPost({ ...post, name: post.username })
                        }
                      >
                        <i className="fa-solid fa-share"></i> {post.totalshare}{" "}
                        Share
                      </button>
                    </div>
                  </div>

                  {showCommentInput && (
                    <div className="post-footer">
                      <Comment postId={post.id} />
                      <div className="input-group">
                        <input
                          className="form-control"
                          placeholder="Add a comment"
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        />
                        <div className="input-group-addon">
                          <button
                            onClick={() => handleComment(post.id)}
                            style={{
                              backgroundColor: "rgb(77, 159, 85",
                              padding: "8px",
                              margin: "7px",
                              borderRadius: "5px",
                            }}
                          >
                            <FaLocationArrow />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div
                className="col-sm-9"
                key={post.id}
                style={{ position: "relative" }}
              >
                <div
                  className="panel panel-white post panel-shadow post-p "
                  style={{ borderRadius: "10px", margin: "50px" }}
                  key={post.id}
                >
                  <div className="post-heading">
                    <div className="pull-left image">
                      <img
                        src={`/imgs/${post.userimage}`}
                        className="img-circle avatar"
                        style={{ width: "50px", height: "50px" }}
                        alt="Avatar"
                      />
                    </div>
                    <div className="pull-left meta">
                      <span className="username">
                        <div className="title h5">
                          <a href="#">
                            <Link
                              to={
                                infoudi.id === post.userid
                                  ? `/Profile`
                                  : `/AnotherProfile/${post.userid}`
                              }
                            >
                              <b>{post.username}</b>
                            </Link>
                          </a>
                          <span
                            style={{
                              fontSize: "15px",
                              display: "block",
                              whiteSpace: "nowrap",
                              color: "gray",
                              textShadow: "1px 1px 2px rgba(190,255,247,0.3)",
                            }}
                          >
                            {post.isfrind === true
                              ? "frind "
                              : "recommended for you"}
                          </span>
                        </div>

                        <span className="time" style={{ float: "right" }}>
                          {post.createdDate}
                        </span>
                      </span>
                    </div>

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
                        {infoudi.id === post.userid && (
                          <>
                            <li onClick={() => handleDeletePost(post.id)}>
                              <a className="dropdown-item">
                                <i className="fas fa-trash-alt"></i> Delete Post
                              </a>
                            </li>
                            <li
                              data-bs-toggle="modal"
                              data-bs-target="#editPost"
                              id="dropdown-p"
                              onClick={() =>
                                EditPost[1]({
                                  ...EditPost[0],
                                  ...post,
                                  name: post.username,
                                })
                              }
                            >
                              <a className="dropdown-item">
                                <i className="fas fa-edit"></i> Edit Post
                              </a>
                            </li>
                          </>
                        )}
                        {!(infoudi.id === post.userid_) && (
                          <>
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
                          </>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="post-description">
                    <div
                      style={{ maxWidth: "100%", overflowWrap: "break-word" }}
                    >
                      <p> {post.contant}</p>
                    </div>
                    <div className="pull-left image">
                      {post.postimage ? (
                        <img
                          src={`/Postimages/${post.postimage}`}
                          className="img-circle avatar"
                          style={{
                            width: "65%",
                            height: "auto",
                            position: "relative",
                            marginLeft: "60px",
                          }}
                        />
                      ) : (
                        " "
                      )}
                    </div>
                  </div>
                  <div
                    className="buttonss"
                    style={{ display: "flex", float: "right" }}
                  >
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

                  <hr />
                  <div
                    className="buttonsOfPost"
                    style={{ display: "flex", float: "right" }}
                  >
                    <div className="stats">
                      {!post.like ? (
                        <button
                          style={{ display: "inline-block" }}
                          className="m-r-15 text-inverse-lighter foot-btn active"
                          onClick={() => handleLike(post.id)}
                        >
                          <i className="fa fa-thumbs-up fa-fw fa-lg m-r-3"></i>{" "}
                          {post.totallike} Like
                        </button>
                      ) : (
                        <button
                          style={{ display: "inline-block" }}
                          className="m-r-15 text-inverse-lighter foot-btn"
                          onClick={() => handleUnlike(post.id)}
                        >
                          <i className="fa fa-thumbs-up fa-fw fa-lg m-r-3"></i>{" "}
                          {post.totallike} Unlike
                        </button>
                      )}
                      {!post.dislike ? (
                        <button
                          href="javascript:;"
                          className="m-r-15 text-inverse- lighter foot-btn active"
                          onClick={() => handleDislike(post.id)}
                        >
                          <i className="fa fa-thumbs-down fa-fw fa-lg m-r-3"></i>{" "}
                          {post.totaldislike} Dislike
                        </button>
                      ) : (
                        <button
                          href="javascript:;"
                          className="m-r-15 text-inverse- lighter foot-btn"
                          onClick={() => handleUnDislike(post.id)}
                          style={{ color: "black", display: "inline-block" }}
                        >
                          <i className="fa fa-thumbs-down fa-fw fa-lg m-r-3"></i>{" "}
                          {post.totaldislike} UnDislike
                        </button>
                      )}
                      <button
                        style={{ display: "inline-block" }}
                        href="javascript:;"
                        className="m-r-15 text-inverse- lighter foot-btn"
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
                          setSelectedPost({ ...post, name: post.username })
                        }
                      >
                        <i className="fa-solid fa-share"></i> {post.totalshare}{" "}
                        Share
                      </button>
                    </div>
                  </div>

                  {showCommentInput && (
                    <div className="post-footer">
                      <Comment postId={post.id} />
                      <div className="input-group">
                        <input
                          className="form-control"
                          placeholder="Add a comment"
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        />
                        <span className="input-group-addon">
                          <button
                            onClick={() => handleComment(post.id)}
                            style={{
                              backgroundColor: "rgb(77, 159, 85",
                              padding: "8px",
                              margin: "7px",
                              borderRadius: "5px",
                            }}
                          >
                            <FaLocationArrow />
                          </button>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        <SharePosts selectedPost={selectedPost} />
        <Likes likesList={likesList} />
        <DisLikes DislikesList={DislikesList} />
        <EditPosts Post={EditPost} />

        <ToastContainer />
      </div>
    </>
  );
};
export default Home;
