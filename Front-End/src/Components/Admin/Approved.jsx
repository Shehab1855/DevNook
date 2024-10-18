import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Admindashboard.css";
import "./Admin.css";
const Approved = ({}) => {
  const token = localStorage.getItem("userToken");
  const [warehouseData, setWarehouseData] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
  });
  const myObject = warehouseData.results;
  console.log(myObject);
  const [isLoading, setIsLoading] = useState(false);
  const [isToggled, setIsToggled] = useState(false);

  const [completedProjects, setCompletedProjects] = useState([]);

  const getApprovedProjects = async () => {
    setWarehouseData((prevData) => ({ ...prevData, loading: true }));
    try {
      const response = await axios.get(
        `https://localhost:7134/api/Project/GetApprovedProjects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCompletedProjects(response.data);
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

  const DeletePro = async (projectId) => {
    try {
      await axios.delete(
        `https://localhost:7134/api/AdminDashboard/DeleteProjects/id:int ?id=${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  useEffect(() => {
    getApprovedProjects();
  }, []);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <link
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
        rel="stylesheet"
      />
      <div className="container">
        <table className="table project-table table-centered table-nowrap">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col"> Approved Projects</th>
              <th scope="col">Brief</th>
              <th scope="col">Status</th>

              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(warehouseData.results) &&
              warehouseData.results.map(
                (project) =>
                  project.status === "Approved" && (
                    <tr key={project.id}>
                      <td>{project.id}</td>
                      <td>{`${project.fileName}`}</td>
                      <td>{project.brief}</td>
                      <td>
                        <span className="text-success font-12">
                          <i className="mdi mdi-checkbox-blank-circle mr-1"></i>{" "}
                          {project.status}
                        </span>
                      </td>

                      <td>
                        <div className="action">
                          <button
                            href="#"
                            className="text-danger"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Close"
                            onClick={() => DeletePro(project.id)}
                          >
                            <i className="fa fa fa-remove h5 m-0"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
              )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Approved;
