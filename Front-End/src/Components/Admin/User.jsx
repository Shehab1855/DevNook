import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Admindashboard.css";
import "./Admin.css";
import { Link } from "react-router-dom";
const Users = ({}) => {
  const token = localStorage.getItem("userToken");
  const [warehouseData, setWarehouseData] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
  });
  const getAlllUsers = async () => {
    setWarehouseData((prevData) => ({ ...prevData, loading: true }));
    try {
      const response = await axios.get(
        `https://localhost:7134/api/AdminDashboard/GetAlluser`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
  const DeleteUser = async (Id) => {
    try {
      await axios.delete(
        `https://localhost:7134/api/AdminDashboard/Deleteuser/string id?id=${Id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getAlllUsers();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  useEffect(() => {
    getAlllUsers();
  }, []);
  return (
    <>
      <table className="table project-table table-centered table-nowrap">
        <thead>
          <tr>
            <th>
              <span>User</span>
            </th>
            <th>
              <span>phone</span>
            </th>
            {/* <th class="text-center"><span>Status</span></th> */}
            <th>
              <span>Email</span>
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(warehouseData.results) &&
            warehouseData.results.map((user) => (
              <tr key={user.udi}>
                <td>
                  <img
                    src={`/imgs/${user.imgeurl}`}
                    className="img-circle avatar"
                    style={{ width: "50px", height: "50px" }}
                    alt="Avatar"
                  />
                  {/* <img src={`${user.imgeurl}`} alt="" width={"50px"} height={"50px"}/> */}
                  {/* <a href="#" class="user-link">{user.udi}</a> */}
                  <Link to={`/AnotherProfile/${user.udi}`}>
                    <span class="user-subhead"> @{user.userName}</span>
                  </Link>
                </td>
                <td>{user.phone}</td>

                <td>
                  <a href="#">{user.email}</a>
                </td>
                <td style={{ width: "20%" }}>
                  <a href="#" class="table-link danger">
                    <span class="fa-stack">
                      <i class="fa fa-square fa-stack-2x"></i>
                      <i
                        class="fa fa-trash-o fa-stack-1x fa-inverse"
                        onClick={() => DeleteUser(user.udi)}
                      ></i>
                    </span>
                  </a>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};
export default Users;
