import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BsUpload } from "react-icons/bs";

const UploadCV = ({ userInfo }) => {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [cvName, setCVName] = useState(""); // State to store the CV name
  const token = localStorage.getItem("userToken");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadMyCV = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "https://localhost:7134/api/profile/uploadCV",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("CV uploaded successfully");
        setCVName(file.name); // Set the uploaded CV name in state
      } else {
        setMessage("Failed to upload CV");
      }
      console.log(response);
    } catch (error) {
      console.error("Error uploading CV:", error);
      toast.error("An error occurred while uploading CV");
    }
  };

  
  const downloadCV = async (userId) => {
    try {
      // Assuming userInfo.id is valid here
      const response = await axios.get(
        `https://localhost:7134/api/profile/downloadCV?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Ensure response is treated as blob
        }
      );

      if (!response || !response.data || response.data.size === 0) {
        toast.error("No CV uploaded for this user.");
        return;
      }

      const blob = new Blob([response.data], { type: "application/pdf" });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Setting filename correctly
      link.setAttribute("download", cvName);

      link.style.display = "none";
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
      console.log(userId);
      toast.success("CV downloaded successfully");
    } catch (error) {
      console.error("Error downloading CV:", error.message);
      toast.error("Failed to download CV. Please try again later.");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ position: "relative", width: "50%" }}>
          <input
            onChange={handleFileChange}
            ref={inputRef}
            type="file"
            className="form-control mt-1"
            id=""
          />
        </div>
        <button
          type="button"
          className="btn btn-success ml-2"
          onClick={uploadMyCV}
          style={{ marginLeft: "30px" }}
        >
          Upload
        </button>
        {message && <p>{message}</p>}
        <button
          type="button"
          className="btn btn-primary ml-2"
          onClick={() => downloadCV(userInfo.id)}
          style={{ marginLeft: "40px" }}
        >
          Download
        </button>
      </div>
      <br />
      <br />
    </div>
  );
};

export default UploadCV;
