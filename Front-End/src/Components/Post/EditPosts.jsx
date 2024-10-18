import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
export default function EditPosts({ Post }) {
  const token = localStorage.getItem("userToken");
  const [EditPost, setEditPost] = Post;
  const [EditPostText, setEditPostText] = useState(EditPost.post1);
  const [EditPostPhoto, setEditPostPhoto] = useState(EditPost.file);
  const photoInputRef = useRef(null);
  console.log(EditPost);

  const handleEditPost = async (postId) => {
    try {
      const formData = new FormData();
      formData.append("post1", EditPostText);
      formData.append("file", EditPostPhoto);

      await axios.put(
        `https://localhost:7134/api/post/${postId}?post1=${EditPostText}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Reload posts after editing
      setEditPost((prev) => ({ ...prev, reload: prev.reload + 1 }));
      toast.success("post Updated successfully");
    } catch (error) {
      console.error("Error editing post:", error);
    }
  };

  useEffect(() => {
    setEditPostText(EditPost.post1);
    setEditPostPhoto(EditPost.file);
  }, [EditPost.post1, EditPost.file]);

  const handlePhotoChange = (e) => {
    setEditPostPhoto(e.target.files[0]);
  };

  const handlePhotoClick = () => {
    photoInputRef.current.click();
  };

  return (
    <div
      className="modal fade"
      id="editPost"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered"
        style={{ width: "600px" }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Edit Post
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="row g-3 align-items-center mb-3">
              <img
                src={`/imgs/${EditPost.userimage}`}
                className="img-circle avatar"
                style={{ width: "50px", height: "50px" }}
                alt="Avatar"
              />

              <div className="col">
                <a href="#">{EditPost.name}</a>
              </div>
              <div className="col-auto" style={{ float: "right" }}>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="d-none"
                  onChange={handlePhotoChange}
                />
                <i
                  className="fas fa-edit"
                  onClick={handlePhotoClick}
                  style={{ cursor: "pointer" }}
                ></i>
              </div>
            </div>
            <textarea
              className="form-control mb-3"
              rows="4"
              value={EditPostText}
              onChange={(e) => setEditPostText(e.target.value)}
            ></textarea>

            {EditPostPhoto && (
              <img
                src={URL.createObjectURL(EditPostPhoto)}
                className="img-fluid rounded"
                alt="Post"
                style={{
                  width: "auto",
                  height: "auto",
                }}
              />
            )}
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
              type="button"
              className="btn btn-primary"
              onClick={() => handleEditPost(EditPost.id)}
              data-bs-dismiss="modal"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
      
      <ToastContainer />
    </div>
  );
}
