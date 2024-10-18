import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Admindashboard.css";
import "./Admin.css";
const Questions = ({}) => {
  const token = localStorage.getItem("userToken");
  const [warehouseData, setWarehouseData] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
  });
  const [questions, setQuestions] = useState([]);
  const getAlllQuestions = async () => {
    setWarehouseData((prevData) => ({ ...prevData, loading: true }));
    try {
      const response = await axios.get(
        `https://localhost:7134/api/AdminDashboard/GetAllQuestion`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQuestions(response.data);
      setWarehouseData((prevData) => ({
        ...prevData,
        results: response.data.reverse(), // Reverse the data if needed
        loading: false,
        err: null,
      }));
    } catch (err) {
      setWarehouseData((prevData) => ({
        ...prevData,
        loading: false,
        err: err.response?.data?.err || "Error fetching projects", // Corrected error message
      }));
    }
  };
  const Deletequestion = async (projectId) => {
    try {
      await axios.delete(
        `https://localhost:7134/api/AdminDashboard/DeleteQuestion/id:int ?id=${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Reload posts after deletion
      getAlllQuestions()
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  useEffect(() => {
    getAlllQuestions();
  }, []);
  return (
    <>
      <table className="table project-table table-centered table-nowrap">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">userName</th>
            <th scope="col">Question</th>
            <th scope="col">createdDate</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(warehouseData.results) &&
            warehouseData.results.map((project) => (
              <tr key={project.id}>
                <td>{project.id}</td>
                <td>{project.userName}</td>
                <td>{project.question}</td>
                <td>{project.createdDate}</td>
                <td>
                  <div className="action">
                    <a href="#" class="table-link danger">
                      <span class="fa-stack">
                        <i class="fa fa-square fa-stack-2x"></i>
                        <i
                          class="fa fa-trash-o fa-stack-1x fa-inverse"
                          onClick={() => Deletequestion(project.id)}
                        ></i>
                      </span>
                    </a>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};
export default Questions;
