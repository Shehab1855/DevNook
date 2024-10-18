import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
function SharePost({ selectedPost }) {
  const token = localStorage.getItem("userToken");
  const [ShareText, setShareText] = useState("");
 
  
  const handleShare = async (postId) => {
    try {
      const response = await axios.put(
        `https://localhost:7134/api/post/shere/id:int/post id  ?id=${postId}`,
        { contant: ShareText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      selectedPost((prev) => ({ ...prev, reload: prev.reload + 1 }));
      toast.success("post Shared successfully");
    } catch (error) {
      console.error("Error sharing post:", error);
    }
  };
 
  return (
    <div
      className="modal fade"
      id="sharePost"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Share Post
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <input
              placeholder="What's in your mind?"
              className="w-100 py-5"
              type="text"
              value={ShareText}
              onChange={(e) => setShareText(e.target.value)}
            />
            <div className="col-sm-8">
              <div className="panel panel-white post panel-shadow">
                <div className="post-heading">
                  <div className="pull-left image">
                    <img
                      src={`/imgs/${selectedPost.userimage}`}
                      className="img-circle avatar"
                      style={{ width: "50px", height: "50px" }}
                      alt="Avatar"
                    />
                  </div>
                  <div className="pull-left meta">
                    <div className="title h5">
                      <a href="#">
                        <b>{selectedPost.name}</b>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="post-description">
                <div  
                style={{ maxWidth: "100%", overflowWrap: "break-word" }}>
                  <p> {selectedPost.contant} </p>
                  </div>
                </div>
                {selectedPost.postimage ? (
                  <img
                    src={`/Postimags/${selectedPost.postimage}`}
                    className="img-circle avatar"
                    style={{ width: "100%", height: "auto" }}
                  />
                ) : (
                  " "
                )}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              onClick={() => handleShare(selectedPost.id)}
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Share
            </button>
          </div>
        </div>
      </div>
      
      <ToastContainer />
    </div>
  );
}

export default SharePost;
