import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import './Sidebar.css'
import { FaRegUser,  FaTh, FaTasks , FaTable, FaChild, FaBell, FaCog, FaArrowCircleLeft, FaQuestionCircle  } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { FaUserAltSlash } from "react-icons/fa"

export default function Sidebar({userId}) {

  const [toggle, setToggle] = useState(false);

  return <>
  <div className="wrapper">
        <aside id="sidebar" className={`${toggle && 'expand'}`}>
            <div className="d-flex">
                <button className="toggle-btn" style={{textAlign: toggle === false && "center", width: toggle === false && "100%"}} onClick={()=>setToggle(prev=>!prev)} type="button">
                    <FaTh />
                </button>
                {toggle === true && (
                  <div className="sidebar-logo">
                  <Link to="">DEVNOOK</Link>
              </div>
                )}
            </div>
            <ul className="sidebar-nav">
                <li className="sidebar-item">
                    <Link to="/profile" className="sidebar-link" style={{textAlign: toggle === false && "center"}}>
                        <FaRegUser />
                        <span>Profile</span>
                    </Link>
                </li>
                <li className="sidebar-item">
                    <Link to="/project" className="sidebar-link" style={{textAlign: toggle === false && "center"}}>
                        <FaTasks/>
                        <span>Projcts</span>
                    </Link>
                </li>
                <li className="sidebar-item">
                    <Link to="/question" className="sidebar-link" style={{textAlign: toggle === false && "center"}}>
                     <FaQuestionCircle/>
                        <span>Questions</span>
                    </Link>
                </li>


                <li className="sidebar-item">
                    <Link to="" className="sidebar-link collapsed has-dropdown" style={{textAlign: toggle === false && "center"}} data-bs-toggle="collapse"
                        data-bs-target="#auth" aria-expanded="false" aria-controls="auth">
                        <FaCog />
                        <span>Setting</span>
                    </Link>

                    <ul id="auth" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                        <li className="sidebar-item">
                            <Link to="/editprofile" className="sidebar-link">Edit Profile</Link>
                        </li>
                        <li className="sidebar-item">
                            <Link to="/changepassword" className="sidebar-link">Change Password</Link>
                        </li>
                        <li className="sidebar-item">
                            <Link to="/deleteAccount" className="sidebar-link">Delete Account</Link>
                        </li>
                    </ul>
                </li>


                <li className="sidebar-item">
                    <Link to="" className="sidebar-link collapsed has-dropdown" style={{textAlign: toggle === false && "center"}} data-bs-toggle="collapse"
                        data-bs-target="#multi" aria-expanded="false" aria-controls="multi">
                        <FaBell />
                        <span>Notification</span>
                    </Link>
                    <ul id="multi" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                        <li className="sidebar-item">
                            <Link to="/getRequestsRecieved" className="sidebar-link">Requests Received</Link>
                        </li>
                        <li className="sidebar-item">
                            <Link to="/getRequsestsSent" className="sidebar-link">Requests Sent</Link>
                        </li>
                        <li className="sidebar-item">
                            <Link to="/interactions" className="sidebar-link">Interactions</Link>
                        </li>
                        <li className="sidebar-item">
                            <Link to={`/Chat/:userId`} className="sidebar-link">Chats</Link>
                        </li>
                    </ul>
                </li>
                <li className="sidebar-item">
                    <Link to="" className="sidebar-link collapsed has-dropdown" style={{textAlign: toggle === false && "center"}} data-bs-toggle="collapse"
                        data-bs-target="#multi" aria-expanded="false" aria-controls="multi">
                        <FaBookmark />
                        <span>Saved</span>
                    </Link>
                    <ul id="multi" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                        <li className="sidebar-item">
                            <Link to="/savedPosts" className="sidebar-link">Posts</Link>
                        </li>
                        <li className="sidebar-item">
                            <Link to="/savedProjects" className="sidebar-link">Projects</Link>
                        </li>
                        <li className="sidebar-item">
                            <Link to="/savedQuestions" className="sidebar-link">Questions</Link>
                        </li>
                    </ul>
                </li>

           
                {/* <li className="sidebar-item">
                    <Link to="Saved" className="sidebar-link" style={{textAlign: toggle === false && "center"}}>
                    <FaBookmark />
                        <span>Saved</span>
                    </Link>
                </li> */}
                <li className="sidebar-item">
                    <Link to="BlockList" className="sidebar-link" style={{textAlign: toggle === false && "center"}}>
                    <FaUserAltSlash />
                        <span>Block</span>
                    </Link>
                </li>

            </ul>
            <div className="sidebar-footer">
                <Link to="" className="sidebar-link" style={{textAlign: toggle === false && "center"}}>
                    <FaArrowCircleLeft />
                    <span>Logout</span>
                </Link>
            </div>
        </aside>
        {/* <div className="main p-3">
            <div className="text-center">
                <h1>
                    Sidebar Bootstrap 5
                </h1>
            </div>
        </div> */}
   </div>

</>
}
