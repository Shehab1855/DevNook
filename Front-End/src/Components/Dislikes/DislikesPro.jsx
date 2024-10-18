import React, { useState, useEffect } from "react";
import axios from "axios";

export default function DisLikes({ DislikesList }) {
  return (
    <div className="modal fade" id="DisshowLikesOnPro" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div className=" modal-dialog modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="staticBackdropLabel">All Dislikes</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          {DislikesList.length < 1 ? (
            <div className="bg-white p-1 text-danger d-flex vh-75 justify-content-center align-items-center flex-column text-center">
              <h1>Sorry,  There is no  Dislikes </h1>
            </div>
          ) : (
            DislikesList.map((Person) => (
              <ul key={Person.username} class="list-group list-group-flush">
                <li class="list-group-item pt-0 mb-3">
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0 me-3">
                      {/* <img src={DislikesList.image} alt="" class="avatar rounded-circle" /> 
                       */}
                   <img src="https://bootdey.com/img/Content/user_1.jpg" class="avatar rounded-circle" alt="user profile image" />

                    </div>
                    <div class="flex-grow-1">
                      <h6 class="mb-0">{Person.fname} {Person.lname}</h6>
                    </div>
                    <button style={{backgroundColor:"gray", padding:"10px" , border:"none", borderRadius:"5px"}}>Message</button>
                  </div>
                </li>
              </ul>
            ))

          )}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
   </div>
  );
}