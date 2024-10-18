import React from "react";
import "./NotFound.css";
import { FaCode, FaRegTired } from "react-icons/fa";
const NotFound = ({ textToShow }) => {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer"
      />
     
     <div class="card bg-purple card-hover mt-5">
          <div class="card-body text-center px-md-5 px-lg-6 my-2">
            <div class="card-icon-border-large border-purple mtn-80">
                  <i
                    class="fa fa-quote-left text-purple"
                    aria-hidden="true"
                  ></i>
                </div>
                <blockquote class="blockquote blockquote-sm mt-2">
                  <p class="font-normal mb-5" style={{ color: "white" }}>
                    {" "}
                     <FaCode style={{ color: "white" ,width : 50}}/>
                  </p>
                  <footer class="blockquote-footer text-uppercase text-white">
                    There is nothing to show!{" "}
                    <cite
                      class="d-block text-capitalize font-size-13 opacity-80 mt-1"
                      title="Source Title"
                    >
                      { textToShow }
                    </cite>
                  </footer>
                </blockquote>
              </div>
            </div>
    
    </>
  );
};

export default NotFound;