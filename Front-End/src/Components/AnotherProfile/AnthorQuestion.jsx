import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import AnthorQuestionItem from './AnthorQuestionItem';

export default function AnthorQuestion({ userData }) {
  const token = localStorage.getItem("userToken");
  const { userId } = useParams();
  const bookMark = localStorage.getItem("askBookmarked");
  const [askBookmarked, setAskBookmarked] = useState(
    JSON.parse(localStorage?.getItem("askBookmarked")) || {}
  );

  const [comments, setComments] = useState([]);
  const [warehouseData, setWarehouseData] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
  });

  async function getComments() {
    try {
      const response = await axios.get(
        "https://localhost:7134/api/Question/GetAllComment",
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
  const getQuestions = async (Id) => {
    try {
      const response = await axios.get(
        `https://localhost:7134/api/Question/GetANTHERQuestion/string:id?id=${Id}`,
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
    getQuestions(userId);
    getComments();
  }, [userId]);

  return (
    <div>
      {warehouseData &&
        warehouseData.results &&
        warehouseData.results.map((ask ,index) => (
         <AnthorQuestionItem  key={index} ask={ask} comments={comments}/>
        ))}
    </div>
  );
}
