import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Admindashboard.css";
import "./Admin.css";

const Pending = ({}) => {
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
  const [pendingProjects, setPendingProjects] = useState([]);

  const getpendingProjects = async () => {
    setWarehouseData((prevData) => ({ ...prevData, loading: true }));
    try {
      const response = await axios.get(
        `https://localhost:7134/api/Project/GetPendingProject`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPendingProjects(response.data);
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
 
  const handleAcceptPro = async (id) => {
    try {
      setIsToggled(isToggled);
      setIsLoading(true);
      const res = await axios.put(
        `https://localhost:7134/api/Project/aprovedProject?id=${id}`,
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      console.log("Request was sent successfully!");

      // If the project was successfully approved, remove it from pending projects
      setWarehouseData((prevData) => ({
        ...prevData,
        results: prevData.results.filter((project) => project.id !== id), // Remove the approved project from the pending projects
      }));
     
    } catch (error) {
      console.log("Error sending request:", error.response.data);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleRefusePro = async (id) => {
    try {
      setIsToggled(isToggled);
      setIsLoading(true);
      const res = await axios.put(
        `https://localhost:7134/api/Project/RejectedProject?id=${id}`,
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      console.log("Request was sent successfully!");

      // If the project was successfully approved, remove it from pending projects
      setWarehouseData((prevData) => ({
        ...prevData,
        results: prevData.results.filter((project) => project.id !== id), // Remove the approved project from the pending projects
      }));
     
    } catch (error) {
      console.log("Error sending request:", error.response.data);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
 
  useEffect(() => {
   
    getpendingProjects();
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
       


        {/* Display pending projects */}
       
                    <table className="table project-table table-centered table-nowrap">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">  Pending Projects</th>
                          <th scope="col">Brief</th>
                          <th scope="col">Status</th>
                          
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(warehouseData.results) &&
                          warehouseData.results.map(
                            (project) =>
                              project.status === "Pending" && (
                                <tr key={project.id}>
                                  <td>{project.id}</td>
                                  <td>{project.fileName}</td>
                                  <td>{project.brief}</td>
                                  <td>
                                    <span className="text-primary font-12">
                                      <i className="mdi mdi-checkbox-blank-circle mr-1"></i>{" "}
                                      {project.status}
                                    </span>
                                  </td>
                                  
                                  <td>
                                    <div className="action">
                                      <button
                                        className="text-success mr-4"
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="accept"
                                        onClick={() =>
                                          handleAcceptPro(project.id)
                                        }
                                      >
                                        <i className="fa-solid fa-check"></i>
                                      </button>
                                      <button
                                        className="text-danger"
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="reject"
                                        onClick={() =>
                                          handleRefusePro(project.id)
                                        }
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

export default Pending;
