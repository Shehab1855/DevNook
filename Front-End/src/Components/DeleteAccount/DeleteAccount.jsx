import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DeleteAccount.css";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaGratipay,
  FaAt,
  FaHeart,
  FaTransgender,
  FaUserEdit,
} from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";


const DeleteAccount = () => {
  const token = localStorage?.getItem("userToken");
  const user = jwtDecode(token);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  let navigate = useNavigate();

  const deleteUserAccount = async () => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger m-2",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: `Are you sure for deleting ${username} account?`,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((data) => {
        if (data.isConfirmed) {
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
          try {
            const res = axios.delete(`https://localhost:7134/api/profile`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            // if (res.status === 400) {
            //   toast.error("NOT FOUND");
            // }
            // toast.success("Deleting account done successfully");
            localStorage.removeItem("userToken");
            console.log("Deleting Account Done:");
              setTimeout(()=>{
                  navigate('/login');
           },2000)

          } catch (error) {
            console.error("Error Deleting Account:", error);
          }
        } else if (data.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your imaginary file is safe :)",
            icon: "error",
          });
        }
      });
  };
  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `https://localhost:7134/api/profile/getById / string id ?userId=${user?.uid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userData = response.data;
      console.log(userData);
      setUsername(userData.userName);
      setFirstName(userData.fname);
      setLastName(userData.lname);
      setEmail(userData.email);
      setPhone(userData.phoneNumber);
      setBirthdate(userData.birthdate);
      setBio(userData.bio);
      setGender(userData.ginder);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, [token]);

  return (
    <>
      <div className="container mt-4"style={{ maxWidth: '70%' }}>
        <div className="card mb-0">
          <div className="card-body mb-1">
            <form className="edit-profile-form">
              <div className="row gutters">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <h6 className="mb-4 text-success text-xl-start">
                    Account Info
                  </h6>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label for="username">User-Name</label>
                    <div className="input-group mb-2">
                      <div className="input-group-prepend">
                        <div className="input-group-text">
                          <FaAt />
                        </div>
                      </div>
                      <input
                        disabled
                        type="text"
                        id="username"
                        className="form-control"
                        // style={{borderRadius:"5px"}}
                        placeholder="Enter Username"
                        value={username}
                        style={{ borderRadius: "5px" }}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label for="eMail">Email</label>
                    <div className="input-group mb-2">
                      <div className="input-group-prepend">
                        <div className="input-group-text">
                          <FaEnvelope />
                        </div>
                      </div>
                      <input
                        disabled
                        type="email"
                        id="email"
                        className="form-control"
                        placeholder="Enter Email"
                        style={{ borderRadius: "5px" }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label for="firstname">First-Name</label>
                    <div className="input-group mb-2">
                      <div className="input-group-prepend">
                        <div className="input-group-text">
                          <FaUserEdit />
                        </div>
                      </div>
                      <input
                        disabled
                        type="text"
                        id="firstName"
                        className="form-control"
                        placeholder="Enter Fisrtname"
                        value={firstName}
                        style={{ borderRadius: "5px" }}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label for="lasttname">Last-Name</label>
                    <div className="input-group mb-2">
                      <div className="input-group-prepend">
                        <div className="input-group-text">
                          <FaUserEdit />
                        </div>
                      </div>
                      <input
                        disabled
                        type="text"
                        id="lastName"
                        className="form-control"
                        value={lastName}
                        placeholder="Enter Lastname"
                        style={{ borderRadius: "5px" }}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label for="phone">Phone</label>
                    <div className="input-group mb-2">
                      <div className="input-group-prepend">
                        <div className="input-group-text">
                          <FaPhoneAlt />
                        </div>
                      </div>
                      <input
                        disabled
                        type="text"
                        id="phone"
                        className="form-control"
                        placeholder="Enter Phone"
                        value={phone}
                        style={{ borderRadius: "5px" }}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label for="birthdate">Birthdate</label>
                    <div className="input-group mb-2">
                      <div className="input-group-prepend">
                        <div className="input-group-text">
                          <FaCalendarAlt />
                        </div>
                      </div>
                      <input
                        disabled
                        type="date"
                        id="birthdate"
                        className="form-control"
                        value={birthdate}
                        style={{ borderRadius: "5px" }}
                        onChange={(e) => setBirthdate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label for="firstname">Gender</label>
                    <div className="input-group mb-2">
                      <div className="input-group-prepend">
                        <div className="input-group-text">
                          <FaTransgender />
                        </div>
                      </div>
                      <select
                        disabled
                        className="form-control"
                        value={gender}
                        style={{ borderRadius: "5px", height: "39px" }}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label for="eMail">Bio</label>
                    <div className="input-group mb-2">
                      <div className="input-group-prepend">
                        <div className="input-group-text">
                          <FaGratipay />
                        </div>
                      </div>
                      <textarea
                        disabled
                        id="bio"
                        className="form-control bio"
                        placeholder="Enter Bio"
                        value={bio}
                        maxlength="70"
                        style={{ borderRadius: "5px", height: "39px" }}
                        onChange={(e) => setBio(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row gutters">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <div className="text-right">
                    <button
                      type="button"
                      name="submit"
                      className="deleteBtn ml-2"
                      onClick={() => deleteUserAccount()}
                    >
                      Delete my account
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* <ToastContainer position="bottom-right" /> */}
      </div>
    </>
  );
};

export default DeleteAccount;