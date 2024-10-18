import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import QuestionItem from "./QuestionItem" ;
import { toast, ToastContainer } from "react-toastify";
export default function QuestionCard({ userData }) {
  const token = localStorage.getItem("userToken");
  const [questionText, setQuestionText] = useState("");
  const [comments, setComments] = useState([]);
  const [warehouseData, setWarehouseData] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
  });
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!questionText.trim()) {
      toast.error("Question cannot be empty");
      return;
    }
    try {
      const response = await axios.post(
        `https://localhost:7134/api/Question`,
        { question: questionText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Question submitted successfully");

      setQuestionText("");

      getQuestions();
    
    } catch (err) {
      console.error("Error submitting question:", err);
    }
  };

  const getQuestions = async () => {
    try {
      const response = await axios.get(
        `https://localhost:7134/api/Question/GetLOGINQuestion`,
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


  useEffect(() => {
    getQuestions();
  }, []);

  return (
    <div>
      <div className="container w-75 mt-1">
        <form className="border border-2 rounded-3 p-1" onSubmit={handleSubmit}>
          <div className="p-3 bg-white">
            <div className="d-flex">
              <input
                type="text"
                className="form-control border-1 border-secondary-subtle me-1"
                placeholder="Ask a question.."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
              <button type="submit" className="btn btn-outline-primary">
                Publish
              </button>
            </div>
          </div>
        </form>
      </div>
      {warehouseData &&
        warehouseData.results &&
        warehouseData.results.map((ask ,index) => (
       <QuestionItem key={index} ask={ask} comments={comments}/>
        ))}
        <ToastContainer />
    </div>
  );
}
