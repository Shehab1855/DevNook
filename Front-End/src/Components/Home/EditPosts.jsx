import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

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
        `https://localhost:7134/api/post/id:int?id=${postId}&post1=${EditPostText}`,
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
      class="modal fade"
      id="editPost"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              EditPost
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="panel panel-white post panel-shadow">
              <div class="post-heading">
                <div class="pull-left image">
                  <img
                    src={`/imgs/${EditPost.userimage}`}
                    className="img-circle avatar"
                    style={{ width: "50px", height: "50px" }}
                    alt="Avatar"
                  />
                </div>
                <div class="pull-left meta">
                  <div class="title h5">
                    <a href="#">
                      <b>{EditPost.name}</b>
                    </a>
                  </div>
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
              <div class="post-description">
                <input
                  placeholder="What's in your mind?"
                  className="w-100 py-5"
                  type="text"
                  value={EditPostText}
                  onChange={(e) => setEditPostText(e.target.value)}
                />
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
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              onClick={() => handleEditPost(EditPost.id)}
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Update
            </button>
          </div>
        </div>
      </div>
       
    </div>
  );
}
