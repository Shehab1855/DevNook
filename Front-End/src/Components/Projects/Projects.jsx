// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import DisLikesPro from '../Dislikes/DislikesPro';
// import LikesPro from '../Likes/LikesPro';
// import ProjectCard from '../ProjectCard/ProjectCard'
// import './Projects.css'

// const Projects = ({ name }) => {
//   const token = localStorage.getItem('userToken');
//   const [warehouseData, setWarehouseData] = useState({
//     loading: true,
//     results: [],
//     err: null,
//     reload: 0,
//   });
//   const [likesList, setLikesList] = useState([]);
//   const [DislikesList, setDisLikesList] = useState([]);
//   const EditProject = useState({ reload: 0 });
//   const getPro = async () => {
//     setWarehouseData({ ...warehouseData, loading: true });
//     try {
//       const response = await axios.get(`https://localhost:7134/api/Project/GetPendingProject`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setWarehouseData({
//         ...warehouseData,
//         results: response.data.reverse(), // Reverse the data if needed
//         loading: false,
//         err: null,
//       });
//     } catch (err) {
//       setWarehouseData({
//         ...warehouseData,
//         loading: false,
//         err: err.response?.data?.err || "Error fetching projects", // Corrected error message
//       });
//     }
//   };
//   useEffect(() => {
//     getPro();
//   }, []);

//   return (
//     <>

//       <div className="main">
//         {warehouseData.results.map((post) =>
//           <ProjectCard post={{ ...post, name }}
//             setDisLikesList={setDisLikesList}
//             setLikesList={setLikesList}
//             setWarehouseData={setWarehouseData}
//             warehouseData={warehouseData}
//           />)}

//         <DisLikesPro DislikesList={DislikesList} />
//         <LikesPro likesList={likesList} />
//         {/* <EditProjects Project={EditProject} /> */}
//       </div>
//     </>
//   );
// };

// export default Projects;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DisLikesPro from '../Dislikes/DislikesPro';
import LikesPro from '../Likes/LikesPro';
import ProjectCard from '../ProjectCard/ProjectCard'
import './Projects.css'

const Projects = ({ name }) => {
  const token = localStorage.getItem('userToken');
  const [warehouseData, setWarehouseData] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
  });
  const [likesList, setLikesList] = useState([]);
  const [DislikesList, setDisLikesList] = useState([]);
  const EditProject = useState({ reload: 0 });
  const getPro = async () => {
    setWarehouseData({ ...warehouseData, loading: true });
    try {
      const response = await axios.get(`https://localhost:7134/api/Project/GetProjectByUserId`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWarehouseData({
        ...warehouseData,
        results: response.data.reverse(), // Reverse the data if needed
        loading: false,
        err: null,
      });
    } catch (err) {
      setWarehouseData({
        ...warehouseData,
        loading: false,
        err: err.response?.data?.err || "Error fetching projects", // Corrected error message
      });
    }
  };
  useEffect(() => {
    getPro();
  }, []);

  return (
    <>
      <div className="btn-pro">

        <button className="up-pro "
        >
          <Link to={"/up"}>
            <label className="upload-label">
              <span> + New project</span>
            </label>
          </Link>
        </button>
      </div>


      <div className="main">

        {warehouseData.results.map((post) =>
          <ProjectCard post={{ ...post, name }}
            setDisLikesList={setDisLikesList}
            setLikesList={setLikesList}
            setWarehouseData={setWarehouseData}
            warehouseData={warehouseData}
          />)}

        <DisLikesPro DislikesList={DislikesList} />
        <LikesPro likesList={likesList} />
        {/* <EditProjects Project={EditProject} /> */}
        

      </div>
    </>
  );
};

export default Projects;