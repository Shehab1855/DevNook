import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Chat.css";
import { useNavigate, useParams } from "react-router-dom";

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("userToken"));
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);
  const { userId } = useParams();
  const [infoudi, setinfoudi] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [editMessageId, setEditMessageId] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");
  const [WarehouseData, setWarehouseData] = useState({
    loading: true,
    results: {},
    err: null,
    reload: 0,
  });
  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `https://localhost:7134/api/profile/getUserLogin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setinfoudi(response.data);
      console.log(infoudi);
      setWarehouseData({
        ...WarehouseData,
        results: response.data,
        loading: false,
        err: null,
      });
    } catch (error) {
      setWarehouseData({
        ...WarehouseData,
        loading: false,
        err: error.response.data.err,
      });
    }
  };
  const getMessages = async (receiverId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://localhost:7134/api/Chat/get?receiverId=${receiverId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages(response.data);
    } catch (error) {
      console.log("Error getting messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getHistory = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://localhost:7134/api/Chat/Historymessages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHistory(response.data);
    } catch (error) {
      console.log("Error getting history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("receiverId", userId);
      formData.append("text", newMessage);
      if (file) {
        formData.append("file", file);
      }
      const response = await axios.post(
        `https://localhost:7134/api/Chat/send?Receiverid=${userId}&text=${newMessage}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Set content type to multipart form-data
          },
        }
      );
      console.log("Message sent:", response.data);
      getMessages(userId);
      setNewMessage("");
      setFile(null); // Reset the file state after sending the message
    } catch (error) {
      console.log("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await axios.delete(`https://localhost:7134/api/Chat/${messageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Remove the deleted message from the messages state
      setMessages(messages.filter((msg) => msg.id !== messageId));
    } catch (error) {
      console.log("Error deleting message:", error);
    }
  };
  const handleCameraClick = () => {
    inputRef.current.click();
  };
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    inputRef.current.click();
  };
  const handleChatClick = (receiverId) => {
    navigate(`/Chat/${receiverId}`);
  };

  const handleEditMessage = (messageId, messageText) => {
    setEditMessageId(messageId);
    setEditedMessage(messageText);
    setShowDropdown(false);
  };

  const saveEditedMessage = async (editMessageId) => {
    try {
      // Send edited message to server
      await axios.put(
        `https://localhost:7134/api/Chat/${editMessageId}?Messages=${editedMessage}`,
        { Messages: editedMessage, messageId: editMessageId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === editMessageId
            ? { ...msg, messageText: editedMessage }
            : msg
        )
      );
      setEditMessageId(null);
      setEditedMessage("");
    } catch (error) {
      console.log("Error editing message:", error);
    }
  };

  useEffect(() => {
    getHistory();
    if (userId) {
      getMessages(userId);
    }
    fetchUserData();
  }, [userId]);

  return (
    <>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css"
        type="text/css"
        rel="stylesheet"
      />
      <div class="container">
        <h3 class=" text-center">Messaging</h3>
        <div class="messaging">
          <div class="inbox_msg">
            <div class="inbox_people">
              <div class="headind_srch">
                <div class="recent_heading">
                  <h4>Recent</h4>
                </div>
                
              </div>
              <div className="inbox_chat">
                {history.map((his) => (
                  <div
                    className={`chat_list ${
                      userId === his.userid && "active_chat"
                    }`}
                    key={his.userid}
                  >
                    <div
                      className="chat_people"
                      onClick={() => handleChatClick(his.userid)}
                    >
                      <div className="chat_img">
                        <img
                          src={`/imgs/${his.imgeurl}`}
                          className="img-circle avatar"
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "20px",
                          }}
                          alt="Avatar"
                        />
                      </div>
                      <div className="chat_ib">
                        <h5>
                          {his.username}
                          <span className="chat_date">{his.messagetime}</span>
                        </h5>
                        <p>{his.lastmessage}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div class="mesgs">
              <div class="msg_history">
                {messages.map((msg, index) => (
                  <div key={index}>
                    {msg.username === infoudi.userName ? (
                      <div className="outgoing_msg">
                        <div className="sent_msg">
                          {msg.file && (
                            <img
                              src={`/ChatImgs/${msg.file}`}
                              className="message_image"
                            />
                          )}
                          <div className="message_container">
                            <p className="message_text">{msg.messageText}</p>
                            <span className="time_date">{msg.sendat}</span>
                            {index === messages.length - 1 && (
                              <div className="dropdown">
                                <button
                                  className="dropbtn"
                                  onClick={() => setShowDropdown(!showDropdown)}
                                >
                                  &#10247;
                                </button>
                                {showDropdown &&
                                  (editMessageId === msg.id ? (
                                    <div className="dropdown-content">
                                      <input
                                        type="text"
                                        value={editedMessage}
                                        onChange={(e) =>
                                          setEditedMessage(e.target.value)
                                        }
                                      />
                                      <button
                                        onClick={() =>
                                          saveEditedMessage(msg.id)
                                        }
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setEditMessageId(null)}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="dropdown-content">
                                      <button
                                        onClick={() =>
                                          handleEditMessage(
                                            msg.id,
                                            msg.messageText
                                          )
                                        }
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => deleteMessage(msg.id)}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div class="incoming_msg">
                      <div className="received_msg">
                        {msg.file && (
                          <img
                            src={`/ChatImgs/${msg.file}`}
                            className="message_image"
                          />
                        )}
                        <div className="message_container">
                          <p className="message_text">{msg.messageText}</p>
                          <span className="time_date">{msg.sendat}</span>
                        </div>
                      </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="type_msg">
                <div className="input_msg_write">
                  <input
                    type="text"
                    className="write_msg"
                    placeholder="Type a message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <div>
                    <a href="#" onClick={handleCameraClick}>
                      <i className="fa-solid fa-camera"></i>
                    </a>
                    <input
                      type="file"
                      ref={inputRef}
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </div>
                  <button
                    className="msg_send_btn"
                    type="button"
                    onClick={sendMessage}
                  >
                    <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
