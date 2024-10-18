// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function EditProject({ Project }) {
//   const token = localStorage.getItem('userToken');
//   const [editProject, setEditProject] = useState(Project);
//   const [editProjectName, setEditProjectName] = useState(editProject.name);
//   const [editProjectDescription, setEditProjectDescription] = useState(editProject.description);
//   const [editProjecturl, setEditProjecturl] = useState(editProject.url);

//   const handleEditProject = async (projectId) => {
//     try {
//       await axios.put(
//         https://localhost:7134/api/Project/id:int?id=${projectId},
//         {
//           name: editProjectName,
//           description: editProjectDescription,
//           url: editProjecturl
//         },
//         {
//           headers: {
//             Authorization: Bearer ${token},
//           },
//         }
//       );
//       setEditProject({
//         ...editProject,
//         name: editProjectName,
//         url: editProjecturl,
//         description: editProjectDescription
//       });
//     } catch (error) {
//       console.error("Error editing project:", error);
//     }
//   };

//   useEffect(() => {
//     setEditProjectName(editProject.name);
//     setEditProjecturl(editProject.url);
//     setEditProjectDescription(editProject.description);
//   }, [editProject]);

//   return (
//     <div className="container">
//       <h1>Edit Your Project</h1>
//       <form>
//         <div className="form-group">
//           <label htmlFor="name">Name</label>
//           <input
//             type="text"
//             className="form-control borderTest"
//             id="name"
//             value={editProjectName}
//             onChange={(e) => setEditProjectName(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="url">URL</label>
//           <input
//             type="text"
//             className="form-control borderTest"
//             id="url"
//             value={editProjecturl}
//             onChange={(e) => setEditProjecturl(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="description">Description</label>
//           <textarea
//             className="form-control borderTest"
//             id="description"
//             value={editProjectDescription}
//             onChange={(e) => setEditProjectDescription(e.target.value)}
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="btn btn-danger"
//           onClick={() => handleEditProject(editProject.id)}
//         >
//           Update
//         </button>
//       </form>
//     </div>
//   );
// }