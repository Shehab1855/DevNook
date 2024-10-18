import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaLocationArrow } from "react-icons/fa";
import "./SavedPosts.css"; // Import your CSS file
import { toast, ToastContainer } from "react-toastify";
import EditPosts from "../Post/EditPosts";
import Comment from "../Comment/Comment";
import SharePosts from "../SharePost/SharePost";
import Likes from "../Likes/Likes";
import DisLikes from "../Dislikes/Dislikes";
const SavedPosts = ({}) => {
  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDislike, setToggleDislike] = useState(false);
  const token = localStorage.getItem("userToken");
  const [likesList, setLikesList] = useState([]);
  const [selectedPost, setSelectedPost] = useState({});
  const [DislikesList, setDisLikesList] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const EditPost = useState({ reload: 0 });
  const [warehouseData, setWarehouseData] = useState({
    loading: false,
    results: [],
    err: null,
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
      setCommentText(""); // Clear the comment text input
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };
  const getPosts = async () => {
    setWarehouseData({ ...warehouseData, loading: true });
    try {
      const response = await axios.get(
        "https://localhost:7134/api/post/GetBookmark",
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
    } catch (error) {
      setWarehouseData({
        ...warehouseData,
        loading: false,
        err: error.response.data.err,
      });
    }
  };
  const unSavePost = async (postId) => {
    try {
      const response = await axios.put(
        `https://localhost:7134/api/post/unBookmark/id:int ?postid=${postId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Post unsaved successfully!");
        // You may want to update the state or perform other actions after unsaving a post
      } else if (response.status === 400) {
        toast.error("Failed to unsave post.");
      }
    } catch (error) {
      console.error("Error unsaving post:", error);
      toast.error("Error unsaving post.");
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
    getPosts();
  }, [toggleLike, toggleDislike]);

  return (
    <div className="timeline">
      {warehouseData.results.map((post) =>
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
                            <b>{post.username}</b>
                          </a>
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
                      className="btn btn-ellipsis "
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                    <ul className="dropdown-menu">
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

                      <li onClick={() => unSavePost(post.id)}>
                        <a className="dropdown-item">
                          <i className="fas fa-save"></i> UnSave Post
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
              </div>

              <div className="post-description">
                <p> {post.contant}</p>
                <div className="col-8">
                  <div className="panel panel-white post panel-shadow">
                    <div className="post-heading">
                      <div className="pull-left image">
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
                      </div>
                      <div className="pull-left meta">
                        <div className="title h5">
                          <a href="#">
                            <b>{post.username}</b>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="post-description">
                      <p> {post.contant}</p>
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
                      data-bs-target="#showLikesOnPro"
                      onClick={() => getLikesList(post.id)}
                    >
                      {" "}
                      <span className="fa-stack fa-fw stats-icon">
                        <i class="fa-solid fa-heart"></i>
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
                        <i class="fa-sharp fa-solid fa-heart-crack"></i>
                      </span>
                      {post.DislikesList} {""}
                      disLikes
                    </button>
                  </div>
                </div>

                <div class="stats">
                  {toggleLike ? (
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
                  {toggleDislike ? (
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
                    data-bs-target="#sharPost"
                    onClick={() =>
                      setSelectedPost({ ...post, name: post.username })
                    }
                  >
                    <i class="fa-solid fa-share"></i> {post.totalshare} Share
                  </button>
                </div>
              </div>

              {showCommentInput && (
                <div class="post-footer">
                  <Comment postId={post.id} />
                  <div class="input-group">
                    <input
                      class="form-control"
                      placeholder="Add a comment"
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <span class="input-group-addon">
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
        ) : (
          <div class="col-sm-9" key={post.id} style={{ position: "relative" }}>
            <div
              class="panel panel-white post panel-shadow post-p "
              style={{ borderRadius: "15px", margin: "20px auto" }}
              key={post.id}
            >
              <div class="post-heading" style={{ display: "flex" }}>
                <div class="pull-left image">
                  <img
                    src={`/imgs/${post.userimage}`}
                    className="img-circle avatar"
                    style={{ width: "50px", height: "50px" }}
                    alt="Avatar"
                  />
                </div>
                <div class="pull-left meta">
                  <span className="username">
                    <div class="title h5">
                      <a href="#">
                        <b>{post.username}</b>
                      </a>
                    </div>

                    <span class="time" style={{ float: "right" }}>
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

                    <li onClick={() => unSavePost(post.id)}>
                      <a className="dropdown-item">
                        <i className="fas fa-save"></i> UnSave Post
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
              <div class="post-description">
                <p> {post.contant}</p>{" "}
                <div class="pull-left image">
                  <img
                    src={`/Postimags/${post.postimage}`}
                    className="img-circle avatar"
                    style={{
                      width: "35%",
                      height: "auto",
                      position: "relative",
                      marginLeft: "60px",
                    }}
                  />
                </div>
                <div
                  className="buttonsOfPost"
                  style={{ display: "flex", float: "right", marginTop: "4px" }}
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
                      <i class="fa-solid fa-heart"></i>
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
                      <i class="fa-sharp fa-solid fa-heart-crack"></i>
                    </span>
                    {post.DislikesList} {""}
                    disLikes
                  </button>
                </div>
                <br />
                <hr />
                <div class="stats">
                  {toggleLike ? (
                    <button
                      className="m-r-15 text-inverse-lighter foot-btn active"
                      onClick={() => handleLike(post.id)}
                    >
                      <i className="fa fa-thumbs-up fa-fw fa-lg m-r-3"></i>{" "}
                      {post.totallike} Like
                    </button>
                  ) : (
                    <button
                      className="m-r-15 text-inverse-lighter foot-btn"
                      onClick={() => handleUnlike(post.id)}
                    >
                      <i className="fa fa-thumbs-up fa-fw fa-lg m-r-3"></i>{" "}
                      {post.totallike} Unlike
                    </button>
                  )}
                  {toggleDislike ? (
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
                    className="m-r-15 text-inverse- lighter foot-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#sharePost"
                    onClick={() =>
                      setSelectedPost({ ...post, name: post.username })
                    }
                  >
                    <i class="fa-solid fa-share"></i> {post.totalshare} Share
                  </button>
                </div>
              </div>

              {showCommentInput && (
                <div class="post-footer">
                  <Comment postId={post.id} />
                  <div class="input-group">
                    <input
                      class="form-control"
                      placeholder="Add a comment"
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <span class="input-group-addon">
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
      <EditPosts Post={EditPost} />
      <Likes likesList={likesList} />
        <DisLikes DislikesList={DislikesList} />
      <ToastContainer />
    </div>
  );
};

export default SavedPosts;
