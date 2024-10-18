import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Comment.css";

function Comment({ postId }) {
  const token = localStorage.getItem("userToken");
  console.log(token);

  const [warehouseData, setWarehouseData] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
  });

  const getComments = async (postId) => {
    setWarehouseData({ ...warehouseData, loading: true });
    axios
      .get(`https://localhost:7134/api/post/Getcomment/id:int ?id=${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
      })
      .then((resp) => {
        setWarehouseData({
          ...warehouseData,
          results: resp.data,
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

  const deleteComment = async (commentId) => {
    try {
      const response = await axios.delete(
        `https://localhost:7134/api/post/comment/id:int ?postid=${postId}&eventid=${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Remove the deleted comment from the state
      setWarehouseData({
        ...warehouseData,
        results: warehouseData.results.filter(
          (comment) => comment.id !== commentId
        ),
      });
      console.log("Comment deleted successfully:", response.data);
    } catch (error) {
      console.error("Error deleting comment:", error.response.data);
    }
  };

  useEffect(() => {
    getComments(postId);
  }, []);

  return (
    <>
      <link
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        rel="stylesheet"
        integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN"
        crossOrigin="anonymous"
      />
     
        <div className="row">
          {warehouseData.results.map((post) => (
            <div className="col-md-12" key={post.id}>
            <button className="delete-icon"style={{float:"right" , marginLeft:"40px"}}
                     onClick={() => deleteComment(post.id)}>
                      <i className="fa fa-trash" aria-hidden="true" ></i>
                    </button>
                    <div class="panel-body">
              <ul className="media-list">
                <li className="media">
                  <a href="#" className="pull-left">
                    <img
                      src={`/imgs/${post.imgeurl}`}
                      className="img-circle avatar"
                      style={{ width: "50px", height: "50px" }}
                      alt="Avatar"
                    />
                  </a>

                  <div className="media-body">
                    <span className="text-muted pull-right">
                      <small className="text-muted">{post.eventDate} </small>
                    </span>
                    <strong className="text-success">{post.username}</strong>
                    <p>
                      {post.taxt}
                      
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            </div>
          ))}
        </div>
     
    </>
  );
}

export default Comment;