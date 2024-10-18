import axios from "axios";
import React, { useEffect, useState } from "react";
import myImage from "./beauty.jpg";
import { Link } from "react-router-dom";


const MutualFriends = ({id}) => {


  // console.log(id)
  const token = localStorage?.getItem("userToken");
  const [isLoading, setIsLoading] = useState(false);
  const [mutualFriends, setMutualFriends] = useState([]);
  const [NumNutualFriends, setNumNutualFriends] = useState([]);

  const getMutualFriends = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://localhost:7134/api/friend/GetMutualFriends/id?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMutualFriends(response.data);
      console.log(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoading(false);
    }
  };
  // const getNumOfMutualFriends = async () => {
  //   try {
  //     setIsLoading(true);
  //     const response = await axios.get(
  //       https://localhost:7134/api/friend/GetNumberMutualFriends/id?id==${id},
  //       {
  //         headers: {
  //           Authorization: Bearer ${token},
  //         },
  //       }
  //     );
  //     setNumNutualFriends(response.data);
  //   //    console.log(response.data);
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    getMutualFriends();
    // getNumOfMutualFriends();
  }, []);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      {/* <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
          >
            Launch static backdrop modal
          </button>
     */}
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Mutual Friends {mutualFriends.length}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            {mutualFriends.length < 1 ? (
              <div className="bg-white p-1 text-danger d-flex vh-75 justify-content-center align-items-center flex-column text-center">
                <h1>Sorry, no mutual friends found</h1>
              </div>
            ) : (
              mutualFriends.map((mutualFriend) => (
                <ul key={mutualFriend.id} class="list-group list-group-flush">
                  <li class="list-group-item pt-0 mb-3">
                    <div class="d-flex align-items-center">
                      <div class="flex-shrink-0 me-3">
                        <img
                          src={myImage}
                          alt=""
                          class="avatar rounded-circle"
                        />
                      </div>
                      <div class="flex-grow-1">
                        <h6 onClick={()=>{window.location.reload();}} class="mb-0">
                        <Link to={`/AnotherProfile/${mutualFriend.udi}`}>
                            {" "}
                            {mutualFriend.username}
                       </Link>
                        </h6>
                      </div>
                    </div>
                  </li>
                </ul>
              ))
            )}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MutualFriends;