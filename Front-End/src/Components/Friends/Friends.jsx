import React, { useState, useEffect } from "react";
import "./Friends.css";
import myImage from "./beauty.jpg";
import axios from "axios";
import MutualFriends from "../MutualFriends/MutualFriends";
import { Link } from "react-router-dom";
import NotFound from "../NotFound/NotFound";
const Friends = ({ userT, history }) => {
  const textToShow = "Your Friends List Is Empty";
  const token = localStorage?.getItem("userToken");
  const [isLoading, setIsLoading] = useState(false);
  const [friends, setFriends] = useState([]);

  const getAllFriends = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://localhost:7134/api/friend/GetAllFriends`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFriends(response.data);
      // console.log(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllFriends();
  }, []);

  const handleUnFriend = async (id) => {
    try {
      setIsLoading(true);
      await axios.delete(
        `https://localhost:7134/api/friend/unfriend/id:string ?SenderID=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      getAllFriends();
      console.log("Request was canceled successfully!");
    } catch (error) {
      console.error("Error canceling request:", error);
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="container">
        <div className="row">
          <div classNameName="col-xl-12 mb-3 mb-lg-5">
            <div className="card">
              <div className="d-flex card-header justify-content-between">
                <h5 className="me-3 mb-0">All Friends</h5>
                {/* <a href="#!.html">View All</a> */}
              </div>
              <div className="card-body">
                {friends.length < 1 ? (
                  
                    <NotFound textToShow={textToShow} className="justify-content-center text-center ml-5"/>
                ) : (
                  friends.map((friend) => (
                    <ul key={friend.id} className="list-group list-group-flush">
                      <li className="list-group-item pt-0 mb-3">
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0 me-3">
                          <img
                            src={`/imgs/${friend.imgeurl}`}
                            className="img-circle avatar"
                            style={{ width: "50px", height: "50px" }}
                            alt="Avatar"
                          /> 
                          
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-0">
                              <Link to={`/AnotherProfile/${friend.udi}`} className="nameProfile">
                                {" "}
                                {friend.fname} {friend.lname}
                              </Link>
                            </h6>
                            <p
                              type="button"
                              classNameName="d-block mutualBtn"
                              data-bs-toggle="modal"
                              data-bs-target="#staticBackdrop"
                            >
                              {" "}
                              {friend.mutualFriends} {""}
                              mutual friends
                            </p>
                          </div>
                          <div className="flex-shrink-0 text-end">
                            <button
                              className="btn btn-danger btn-round"
                              onClick={() => handleUnFriend(friend.udi)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                      <MutualFriends id={friend.udi} />
                    </ul>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Friends;