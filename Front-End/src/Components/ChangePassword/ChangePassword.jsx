import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {toast, ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import "./ChangePassword.css";
import {
  FaEyeSlash,
  FaEye,
  FaLock,
} from "react-icons/fa";
const ChangePassword = ({ userT }) => {
  const token = localStorage?.getItem("userToken");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  let navigate = useNavigate();
  // console.log(token);

  const handleCancelSubmit = () => {
    navigate("/profile");
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const updatedUserData = {
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      };

      const res = await axios.put(
        "https://localhost:7134/api/profile/profile/changepassword",
        updatedUserData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);
      const {message} = res.data;
      if(res.status === 400)
      {
        toast.error(message)
        console.log(res);
      }
       setMessage(message);
     
      toast.success("Data updated successfully!")
      
    //   setTimeout(() => {
    //     navigate("/profile");
    //   }, 2000);

      console.log("Profile updated successfully!");
    } catch (error) {
     // console.log("Error updating profile:", error.response.status);
      console.log("Error updating profile:", error.response.data);
      toast.error(error.response.data[0])
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container mt-4">
        <div className="row gutters">
          <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12 mx-auto p-3">
            <div className="card mb-0">
              <div className="card-body mb-1">
                <form className="edit-profile-form" onSubmit={handleFormSubmit}>
                  <div className="row gutters">
                    <div className="col-12">
                      <h6 className="mb-4 text-success text-xl-start fw-bold fs-5">
                        Change Account Password
                      </h6>
                    </div>

                    {/* Current Password field */}
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="currentPassword" className="fw-medium">
                          Current Password
                        </label>
                        <div className="input-group mb-2">
                          <div className="input-group-prepend">
                            <div className="input-group-text">
                              <FaLock />
                            </div>
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            id="currentPassword"
                            className="form-control fst-italic"
                            placeholder="Enter Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            style={{ borderRadius: "3px" }}
                          />
                          <div className="input-group-append bg-dark"
                            style={{ borderRadius: "3px" }}>
                            <div
                              className="input-group-text bg-transparent text-light border-0"
                              onClick={() => setShowPassword(!showPassword)}
                              autoComplete="off"
                            >
                              {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* New Password field */}
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="newPassword"className="fw-medium">New Password</label>
                        <div className="input-group mb-2">
                          <div className="input-group-prepend">
                            <div className="input-group-text">
                              <FaLock />
                            </div>
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            id="newPassword"
                            className="form-control fst-italic"
                            placeholder="Enter New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={{ borderRadius: "3px 0 0 3px" }}
                            autoComplete="off"
                          />
                          <div
                            className="input-group-append bg-dark"
                            style={{ borderRadius: "3px" }}
                          >
                            <div
                              className="input-group-text bg-transparent text-light border-0"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Confirm Password field */}
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="confirmPassword" className="fw-medium">
                          Confirm Password
                        </label>
                        <div className="input-group mb-2">
                          <div className="input-group-prepend">
                            <div className="input-group-text">
                              <FaLock />
                            </div>
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            id="confirmPassword"
                            className="form-control fst-italic"
                            placeholder="Enter Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{ borderRadius: "3px" }}
                          />
                          <div className="input-group-append bg-dark"
                            style={{ borderRadius: "3px" }}>
                            <div
                              className="input-group-text bg-transparent text-light border-0"
                              onClick={() => setShowPassword(!showPassword)}
                              autoComplete="off"
                            >
                              {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>


                    {/* <div className="d-flex justify-content-between align-items-center mt-3"> */}
                      
                        {/* <div
                          className={`alert alert-${
                            
                          } d-flex align-items-center w-75 mb-0 ${message || 'invisible'}`}
                          role="alert"
                        >
                          <div>{message.data || 'This is an alert message'}</div>
                        </div> */}
                     

                      <div className="row gutters justify-content-end mt-4">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                          <div className="text-right">
                            <button
                              type="button"
                              id="submit"
                              name="submit"
                              className="btn btn-danger mr-1 cancelBtn"
                              onClick={handleCancelSubmit}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              id="submit"
                              name="submit"
                              className="btn btn-success ml-2"
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>


                  {/* </div> */}
                </form>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer position="bottom-right"/>
      </div>
    </>
  );
};

export default ChangePassword;