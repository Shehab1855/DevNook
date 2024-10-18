import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Question({ userT, userData }) {
  const [asksReturned, setAsksReturned] = useState([]);
  const [comments, setComments] = useState([]);
  const [askSubmitted, setAskSubmitted] = useState(false);
  const [askContent, setAskContent] = useState("");
  const [commentSubmitted, setCommentSubmitted] = useState("");
  const [likedQuestion, setLikedQuestion] = useState({});

  const [askBookmarked, setAskBookmarked] = useState({});

  const [questionUploadedSuccessfully, setQuestionUploadedSuccessfully] = useState(false);


  useEffect(() => {
    const storedComments = localStorage.getItem("comments");
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  }, []);

  useEffect(() => {
    const storedLikedQuestions =
      JSON.parse(localStorage.getItem("likedQuestions")) || {};
    setLikedQuestion(storedLikedQuestions);
  }, []);

  async function getQuestion() {
    try {
      const response = await axios.get("https://localhost:7134/api/post", {
        headers: {
          Authorization: `Bearer ${userT}`,
        },
      });
      setAsksReturned(response.data);
      console.log(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // console.log('Unauthorized access');
      } else {
        console.error("Error fetching comments:", error); 
      }
    }
  }

  async function getComments() {
    try {
      const response = await axios.get(
        "https://localhost:7134/api/Question/GetAllComment",
        {
          headers: {
            Authorization: `Bearer ${userT}`,
          },
        }
      );
      setComments(response.data);
      console.log(response.data);
      localStorage.setItem("comments", JSON.stringify(response.data));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // console.log('Unauthorized access');
      } else {
        // console.error('Error fetching comments:', error);
      }
    }
  }

  useEffect(() => {
    getQuestion();
    getComments();
  }, [askSubmitted]);

  function ContentOfQuestion(e) {
    setAskContent(e.target.value);
  }

  async function submitAsk(e) {
    e.preventDefault();

    if (!askContent.trim()) {
      alert("Please enter a question");
      return;
    }

    try {
      await axios.post(
        "https://localhost:7134/api/Question",
        { question: askContent },
        {
          headers: {
            Authorization: `Bearer ${userT}`,
          },
        }
      );
      setAskSubmitted(true);
      setQuestionUploadedSuccessfully(true);
      getQuestion();
    } catch (error) {
      console.error("Error submitting question:", error);
    }
  }

  async function arrowUp(commentId, commentRating) {
    try {
      await axios.post(
        `https://localhost:7134/api/Question/LikeComment?id=${commentId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${userT}`,
          },
        }
      );
      updateCommentRating(commentId, commentRating + 1);
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  }

  async function arrowDown(commentId, commentRating) {
    try {
      await axios.post(
        `https://localhost:7134/api/Question/DisLikeComment?id=${commentId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${userT}`,
          },
        }
      );
      updateCommentRating(commentId, commentRating - 1);
    } catch (error) {
      console.error("Error disliking comment:", error);
    }
  }

  function updateCommentRating(commentId, rating) {
    // Update comments in state
    setComments((prevComments) => {
      return prevComments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, rateComment: rating };
        }
        return comment;
      });
    });

    // Update comments in local storage
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, rateComment: rating };
      }
      return comment;
    });
    localStorage.setItem("comments", JSON.stringify(updatedComments));
  }

  function contentOfCommentSubmitted(e) {
    setCommentSubmitted(e.target.value);
  }

  async function submitComment(questionId, commentSubmitted) {
    try {
      const response = await axios.post(
        `https://localhost:7134/api/Question/comment?id=${questionId}&Comment=${commentSubmitted}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${userT}`,
          },
        }
      );
      console.log("Comment submitted successfully");
      console.log("New comment:", response.data);

      // Ensure response.data contains the ID of the newly created comment
      updateCommentRating(response.data.id, 0); // Initialize rating to 0 for the newly submitted comment

      // Fetch updated comments after updating the rating
      getComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  }

  async function toggleLike(askID) {
    try {
      const isLiked = likedQuestion[askID] || false;
      if (isLiked) {
        await axios.delete(
          `https://localhost:7134/api/Question/DeleteLike/id:int ?questionid=${askID}`,
          {
            headers: {
              Authorization: `Bearer ${userT}`,
            },
          }
        );
        getQuestion();
      } else {
        await axios.post(
          `https://localhost:7134/api/Question/LikeQuestion/id:int?id=${askID}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${userT}`,
            },
          }
        );
        getQuestion();
      }
      // Update local storage with the new liked questions
      const updatedLikedQuestion = { ...likedQuestion, [askID]: !isLiked };
      localStorage.setItem(
        "likedQuestions",
        JSON.stringify(updatedLikedQuestion)
      );
      setLikedQuestion(updatedLikedQuestion);
    } catch (error) {
      console.error("Error toggling question like:", error);
    }
  }

  async function deleteQuestion(askID) {
    await axios.delete(
      `https://localhost:7134/api/Question/DeleteQuestion/id:int?id=${askID}`,
      {
        headers: {
          Authorization: `Bearer ${userT}`,
        },
      }
    );
    setAskSubmitted(true);
    getQuestion();
  }

  async function toggleProjectBookmarked(askID) {
    try {
      const isBookmarked = askBookmarked[askID] || false;
      if (isBookmarked) {
        await axios.put(
          `https://localhost:7134/api/Question/unBookmark/questionid?questionid=${askID}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${userT}`,
            },
          }
        );
      } else {
        await axios.post(
          `https://localhost:7134/api/Question/Bookmark/id ?id=${askID}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${userT}`,
            },
          }
        );
      }
      // Update local storage with the new bookmarked projects
      const updatedBookmarkedAsks = {
        ...askBookmarked,
        [askID]: !isBookmarked,
      };
      localStorage.setItem(
        "bookmarkedAsks",
        JSON.stringify(updatedBookmarkedAsks)
      );
      setAskBookmarked(updatedBookmarkedAsks);
    } catch (error) {
      // console.error('Error toggling project bookmark:', error);
    }
  }

  return (
    <>
      <div className="container w-75 mt-1">
        <form className="border border-2 rounded-3 p-1" onSubmit={submitAsk}>
          <div className="p-3 bg-white">
            <div className="d-flex">
              <input
                onChange={ContentOfQuestion}
                type="text"
                className="form-control border-1 border-secondary-subtle me-1"
                placeholder="Ask a question.."
              />
              <button className="btn btn-outline-primary">Publish</button>
            </div>
          </div>
        </form>
      {questionUploadedSuccessfully ?
         <div className=' ms-2 w-75'>
              <p className='border rounded-2 w-50'><i className="bg-info p-1 border rounded-2 fa-solid fa-check"></i> Your Question Submitted successfully</p>
         </div>
      : null
      }
      </div>


      <div className="p-1">
        <div className=" border-3 rounded-3 p-2 w-75 m-auto">
          {asksReturned.map((ask) => (
            <div
              className="border border-2 rounded-3 p-10 my-2 position-relative"
              key={ask.id}
            >
              <Link
                to={`/QuestionDetails/${ask.id}`}
                onClick={(e) => {
                  const clickedElement = e.target.tagName.toLowerCase();
                  const isButton = clickedElement === "button";
                  const isInput = clickedElement === "input";
                  const isUsernameLink =
                    e.target.classList.contains("username-link");

                  if (!isButton && !isInput && !isUsernameLink) {
                    // Navigate to QuestionDetails only if the clicked element is not a button, input, or username link
                    // You can handle the navigation here if needed
                  }
                }}
              >
                <div className="d-flex">
                  <h6 className="ps-1 fw-light username-link">
                    <Link to={`/AnotherProfile/${ask.userId}`}>
                      {"< "}
                      {ask.userName}
                      {" />"}
                    </Link>
                  </h6>
                </div>
                <h6 className="mt-1 font-monospace fs-5 ps-2">
                  {ask.question}
                </h6>
              </Link>

              <button
                onClick={() => toggleProjectBookmarked(ask.id)}
                className="border-0 ps-0 bg-white position-absolute top-10 start-100"
              >
                {askBookmarked[ask.id] ? (
                  <i className="fa-solid fa-bookmark"></i>
                ) : (
                  <i className="fa-regular fa-bookmark"></i>
                )}
              </button>

              <div className="position-absolute top-0 end-0">
                <button
                  onClick={() => toggleLike(ask.id)}
                  className="btn mt-1 ms-2 "
                >
                  {likedQuestion[ask.id] ? (
                    <i className="fa-solid fa-heart"></i>
                  ) : (
                    <i className="fa-regular fa-heart"></i>
                  )}
                </button>

                <p className="mt-0 ms-4">{ask.totalLike}</p>
              </div>
              {userData.uid === ask.userId ? (
                <button
                  onClick={() => deleteQuestion(ask.id)}
                  className="btn position-absolute top-0 start-100"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              ) : (
                ""
              )}
              <div className="d-flex my-1">
                <input
                  onChange={contentOfCommentSubmitted}
                  type="text"
                  className="form-control w-75 border-1 border-secondary-subtle me-1 ms-2"
                  placeholder="write an answer"
                />
                <button
                  onClick={() => submitComment(ask.id, commentSubmitted)}
                  className="btn btn-outline-primary ms-2"
                >
                  Submit
                </button>
              </div>

              {comments
                .filter((comment) => comment.questionId === ask.id)
                .map((comment, idx) => (
                  <div key={idx} className="d-flex align-items-center">
                    <div className="d-flex flex-column align-items-center  my-1">
                      <button
                        onClick={() => arrowUp(comment.id, comment.rateComment)}
                        className="mb-1 mt-1 px-2 border border-2 rounded"
                        style={{ background: "white" }}
                      >
                        <i className="fa-solid fa-caret-up"></i>
                      </button>
                      <p className="my-2">{comment.rateComment}</p>
                      <button
                        onClick={() =>
                          arrowDown(comment.id, comment.rateComment)
                        }
                        className="mb-1 mt-1 px-2 border border-2 rounded"
                        style={{ background: "white" }}
                      >
                        <i className="fa-solid fa-caret-down"></i>
                      </button>
                    </div>
                    <div>
                      <div className="d-flex flex-column pt-5 mt-1">
                        <p className="mx-2">{comment.text}</p>
                        <p className="fw-light ps-2">
                          <Link to={`/AnotherProfile/${comment.userid}`}>
                            {"< "}
                            {comment.userName}
                            {" />"}
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
