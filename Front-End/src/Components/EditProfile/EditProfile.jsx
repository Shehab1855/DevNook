import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";
import myImage from "./beauty.jpg";
import { toast, ToastContainer } from "react-toastify";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaGratipay,
  FaAt,
  FaHeart,
  FaTransgender,
  FaUserEdit,
  FaUpload,
} from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import UploadCV from "../UploadCv/UploadCv";

const EditProfile = ({ userT, id }) => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [photo, setphoto] = useState(null);
  const [toggleshow, setToggleshow] = useState([]);
  let navigate = useNavigate();
  const handleCancelSubmit = () => {
    navigate("/profile");
  };
  const [warehouse, setWarehouse] = useState({
    loading: true,
    results: {},
    err: null,
    reload: 0,
    activeTab: "projects",
  });
  const myObject = warehouse.results;
 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://localhost:7134/api/profile/getUserLogin`,
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
        setUserInfo(userData);
        setphoto(userData.imgeurl);
        setToggleshow(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token]);
  console.log(toggleshow);
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const updatedUserData = {
        lname: lastName,
        userName: username,
        fname: firstName,
        email: email,
        bio: bio,
        birthdate: birthdate,
        phone: phone,
        ginder: gender,
      };

      const res = await axios.put(
        "https://localhost:7134/api/profile/updatedProfile",
        updatedUserData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { message } = res.data;
      if (res.status === 400) {
        toast.error(message);
        console.log(res);
      }
      setMessage(message);
      toast.success("Data updated successfully!");
      // setMessage({code:true , data:(<><FaRegSmileBeam/> Data Updated Successfully!</>)})
      // setTimeout(()=>{
      //   navigate('/profile');
      // },2000)

      console.log("Profile updated successfully!");
    } catch (error) {
      // setMessage({code:false , data:(<><FaRegFrown/> Data dosn't change</>)})
      console.log("Error updating profile:", error.response.data);
      toast.error(error.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const toggleisPublic = async () => {
    try {
      setIsLoading(true);
      await axios.put(
        `https://localhost:7134/api/profile/public`,
        { isPublic: !myObject.isPublic },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    
      setWarehouse({
        ...warehouse,
        results: {
          ...myObject,
          isPublic: !myObject.isPublic,
        },
      });
      // setToggleshow(false);
    } catch (error) {
      console.error("Error toggling profile visibility:", error);
    }
  };
  const toggleisPrivate = async () => {
    try {
      setIsLoading(true);
      await axios.put(
        `https://localhost:7134/api/profile/Private`,
        { isPublic: !myObject.isPrivate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update local state after successful toggle
      setWarehouse({
        ...warehouse,
        results: {
          ...myObject,
          isPublic: !myObject.isPrivate,
        },
      });
      // setToggleshow(true);
    } catch (error) {
      console.error("Error toggling profile visibility:", error);
    }
  };
  return (
    <>
      <div className="container mt-4">
        <div className="row gutters">
          <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
            <div className="card h-100">
              <div className="card-body">
                <div className="account-settings">
                  <div className="user-profile mb-0">
                    <div className="user-avatar">
                      {/* <h5 className='text-success'>Account Details</h5> */}
                      <img
                        src={`/imgs/${photo}`}
                        className="img-circle avatar"
                        style={{ width: "50px", height: "50px" }}
                        alt="Avatar"
                      />
                    </div>
                    <h5 className="user-name text-success">
                      {firstName} {lastName}
                    </h5>
                  </div>

                  <div className="about mt-0 d-block">
                    <h6
                      className="emailAccount"
                      style={{ display: "block", textAlign: "left" }}
                    >
                      <FaAt className="mb-1" /> {username}
                    </h6>
                    <h6
                      className="emailAccount"
                      style={{ display: "block", textAlign: "left" }}
                    >
                      <FaEnvelope className="mb-1" /> {email}
                    </h6>
                    <h6
                      className="emailAccount"
                      style={{ display: "block", textAlign: "left" }}
                    >
                      <FaHeart className="mb-1" /> {bio}
                    </h6>
                    <h6
                      className="emailAccount"
                      style={{ display: "block", textAlign: "left" }}
                    >
                      <FaTransgender className="mb-1" /> {gender}
                    </h6>
                    <h6
                      className="emailAccount"
                      style={{ display: "block", textAlign: "left" }}
                    >
                      <FaCalendarAlt className="mb-1" /> {birthdate}
                    </h6>
                    <h6
                      className="emailAccount"
                      style={{ display: "block", textAlign: "left" }}
                    >
                      <FaPhoneAlt className="mb-1" /> {phone}
                    </h6>
                  </div>
                  {!toggleshow.isPrivate ? (
                    <button
                      className="m-r-15 text-inverse- lighter foot-btn"
                      onClick={() => toggleisPublic()}
                    >
                      <i class="fa-solid fa-earth-americas"></i>
                      public
                    </button>
                  ) : (
                    <button
                      className="m-r-15 text-inverse- lighter foot-btn"
                      onClick={() => toggleisPrivate()}
                    >
                      <i class="fa-solid fa-lock"></i>
                      Private
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
            <div className="card mb-0">
              <div className="card-body mb-1">
                <form className="edit-profile-form" onSubmit={handleFormSubmit}>
                  <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                      <h6 className="mb-4 text-success text-xl-start">
                        Personal Details
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

                  {/* {message &&
         <div className={alert alert-${message.code? 'success' : 'danger'} d-flex align-items-center mt-3} role="alert">
         <div>
           {message.data}
         </div>
       </div>} */}
                  <UploadCV userInfo={userInfo} />

                  <div className="row gutters">
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
                </form>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer position="bottom-right" />
      </div>
    </>
  );
};

export default EditProfile;
