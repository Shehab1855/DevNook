import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


export default function Project({ userT, userData }) {
  const [file, setFile] = useState(null);
  const [brief ,setBrief] = useState('');
  const [projectsReturned, setProjectsReturned] = useState([]);
  const [projectSubmitted, setProjectSubmitted] = useState(false);
  const [likedProjects, setLikedProjects] = useState([]);
  const [dislikedProjects, setDisLikedProjects] = useState([]);
  const [commentSubmitted, setCommnetSubmitted] = useState('');
  const [comments, setComments] = useState([]);
  const [projectCommentsVisibility, setProjectCommentsVisibility] = useState({});
  const [projectBookmarked, setProjectBookmarked] = useState({});

  const [projectUplaodedSuccessfully, setProjectUplaodedSuccessfully] = useState(false);


  async function getProjects() {
    try {
      const { data } = await axios.get('https://localhost:7134/api/Project/GetApprovedProjects', {
        headers: {
          Authorization: `Bearer ${userT}`
        }
      });
      console.log(data)
      setProjectsReturned(data);
    } catch (error) {
      // console.error('Error fetching projects:', error);
    }
  }

  async function getComment() {
    try {
      const response = await axios.get('https://localhost:7134/api/Project/GetAllComment',
        {
          headers: {
            Authorization: `Bearer ${userT}`
          }
        }
      );
      setComments(response.data);
      console.log(response.data)
    } catch (error) {
      // console.error('Error fetching comments:', error);
    }
  }

  useEffect(() => {
    // Retrieve bookmarked projects from local storage when component mounts
    const storedBookmarkedProjects = JSON.parse(localStorage.getItem('bookmarkedProjects')) || {};
    setProjectBookmarked(storedBookmarkedProjects);
    getProjects();
    getComment();
  }, [projectSubmitted]);

  async function submitProject(e) {
    e.preventDefault();
    if (brief === '' && file === null ) {
      alert('Can not publish Empty Data!');
      return;
    }

    try {
      let formData = new FormData();
      formData.append('file', file);

      await axios.post(`https://localhost:7134/api/Project/UploadFile?Brief=${brief}`, formData, {
        headers: {
          Authorization: `Bearer ${userT}`
        }
      });
      setProjectSubmitted(true);
      setProjectUplaodedSuccessfully(true);
      // getProjects();
    } catch (error) {
      // console.error('Error submitting project:', error);
    }
  }

  function fileUploaded(e) {
    let selectedFile = e.target.files[0];
    setFile(selectedFile);
  }

  async function toggleLike(projectID) {
    try {
      if (likedProjects.includes(projectID)) {
        await deleteLike(projectID);
      } else {
        await axios.post(`https://localhost:7134/api/Project/like/id:int?id=${projectID}`, null, {
          headers: {
            Authorization: `Bearer ${userT}`
          }
        });
        setLikedProjects([...likedProjects, projectID]);
        setProjectSubmitted(true);
        getProjects();
      }
    } catch (error) {
      // console.error('Error toggling like:', error);
    }
  }
  
  async function deleteLike(projectID) {
    try {
      await axios.delete(`https://localhost:7134/api/Project/DeleteLike/id:int ?projectid=${projectID}`, {
        headers: {
          Authorization: `Bearer ${userT}`
        }
      });
      setLikedProjects(likedProjects.filter(id => id !== projectID));
      setProjectSubmitted(true);
      getProjects();
    } catch (error) {
      // console.error('Error deleting like:', error);
    }
  }
  
  async function dislike(projectID) {
    try {
      if (dislikedProjects.includes(projectID)) {
        await deleteDislike(projectID);
      } else {
        await axios.post(`https://localhost:7134/api/Project/dislike/id:int ?id=${projectID}`, null, {
          headers: {
            Authorization: `Bearer ${userT}`
          }
        });
        setDisLikedProjects([...dislikedProjects, projectID])
        setProjectSubmitted(true);
        getProjects();
      }
    } catch (error) {
      console.error('Error disliking project:', error);
    }
  }
    
  async function deleteDislike(projectID) {
    try {
      await axios.delete(`https://localhost:7134/api/Project/DeleteDisLike/id:int ?projectid=${projectID}`, {
        headers: {
          Authorization: `Bearer ${userT}`
        }
      });
      setDisLikedProjects(dislikedProjects.filter(id => id !== projectID));
      setProjectSubmitted(true);
      getProjects();
    } catch (error) {
      // console.error('Error deleting dislike:', error);
    }
  }
  
  async function deleteProject(projectID) {
    await axios.delete(`https://localhost:7134/api/Project/DeleteFiles?id=${projectID}`, {
      headers:{
        Authorization: `Bearer ${userT}`
      }
    })
    setProjectSubmitted(true)
    getProjects();
  }

  async function submitComment(projectID, commentSubmitted) {
    try {
      await axios.post(`https://localhost:7134/api/Project/comment?id=${projectID}&Comment=${commentSubmitted}`, null,{
          headers: {
            Authorization: `Bearer ${userT}`
          }
        }
      );
      getComment();
    } catch (error) {
      // console.error('Error submitting comment:', error);
    }
  }

  function toggleCommentsVisibility(projectID) {
    setProjectCommentsVisibility(prevState => ({
      ...prevState,
      [projectID]: !prevState[projectID] || false
    }));
  }
  
  async function deleteComment(commentID) {
    try {
      await axios.delete(`https://localhost:7134/api/Project/comment/id:int ?ProjectEvent=${commentID}`, {
        headers: {
          Authorization: `Bearer ${userT}`
        }
      });
      getComment();
      getProjects()
    } catch (error) {
      // console.error('Error deleting comment:', error);
    }
  }
  
  async function toggleProjectBookmarked(projectID) {
    try {
      const isBookmarked = projectBookmarked[projectID] || false;
      if (isBookmarked) {
        await axios.put(`https://localhost:7134/api/Project/unBookmark/projectid?projectid=${projectID}`, null,{
          headers: {
            Authorization: `Bearer ${userT}`
          }
        });
      } else {
        await axios.post(`https://localhost:7134/api/Project/Bookmark/id ?id=${projectID}`, null,{
          headers: {
            Authorization: `Bearer ${userT}`
          }
        });
      }
      // Update local storage with the new bookmarked projects
      const updatedBookmarkedProjects = { ...projectBookmarked, [projectID]: !isBookmarked };
      localStorage.setItem('bookmarkedProjects', JSON.stringify(updatedBookmarkedProjects));
      setProjectBookmarked(updatedBookmarkedProjects);
    } catch (error) {
      // console.error('Error toggling project bookmark:', error);
    }
  }

  return (
    <>
      <div className="">
        <div className="container w-75 ms-1">
          <div className='border border-1 rounded-3 mt-1'>
            <form onSubmit={submitProject}>
              <div className="input-group p-3">
                <div className='w-100'>
                   <input onChange={(e)=>setBrief(e.target.value)} type="text" placeholder='Brief about project..' className='form-control mb-1' />
                </div>
                <div className='w-100 d-flex'>
                  <input onChange={fileUploaded} type="file" className="form-control mt-1" id="" />
                  <button type="submit" className="btn border border-1 rounded-4 btn-outline-info text-black ">
                    Upload
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

{projectUplaodedSuccessfully ?
  <div className='w-50 ms-4'>
    <p className='border rounded-2 w-50'><i className="bg-info p-1 border rounded-2 fa-solid fa-check"></i> Your Project uploaded successfully</p>
  </div>
  : null
}

        {projectsReturned.map((project, index) => (
         <div key={index} className='border border-1 rounded-3 w-75 my-3'>
            <div className='mx-1 py-1 m-3 position-relative'>
                <Link to={`/projectDetails/${project.id}`} onClick={(e) => {
                  const clickedElement = e.target.tagName.toLowerCase();
                  if (clickedElement !== 'button' && clickedElement !== 'input'  && clickedElement !== <h6 className='ps-1 fw-light'><Link to={`/AnotherProfile/${project.userId}`}>{'< '}{project.userName}{' />'}</Link></h6>) {
                    // Navigate to projectDetails only if the clicked element is not a button or input
                   
                  }
                }}>
                  <h6 className='ps-1 fw-light'><Link to={`/AnotherProfile/${project.userId}`}>{'< '}{project.userName}{' />'}</Link>   <span style={{ fontSize: '15px',display: 'block', whiteSpace: 'nowrap', color: 'gray', textShadow: '1px 1px 2px rgba(190,255,247,0.3)' }}>
                                      {project.isfrind == true ? 'frind ' : 'recommended for you'}
                                </span></h6>
                  <h6 className='mt-1 font-monospace fs-5 ps-2'>{project.brief}</h6>
                </Link>
                <button onClick={()=>toggleProjectBookmarked(project.id)} className='border-0 bg-white position-absolute top-10 start-100'>
                  {projectBookmarked[project.id] ? <i className="fa-solid fa-bookmark"></i> : <i className="fa-regular fa-bookmark"></i>}
                </button>
                <div className='d-flex'>
                  <button onClick={() => toggleLike(project.id)} className='btn btn-info px-2 mx-2'><i className="fa-solid fa-thumbs-up"></i> {project.totallike}</button>
                  <button onClick={() => dislike(project.id)} className='btn btn-dark px-2'><i className="fa-solid fa-thumbs-down"></i> {project.totaldislike}</button>
                  <div className='d-flex w-75'>
                    <input onChange={(e)=> setCommnetSubmitted(e.target.value)} type="text" className='form-control border border-1 rounded-3 border-info ms-1 me-1' placeholder='comment' />
                    <button onClick={()=>submitComment(project.id , commentSubmitted)} className='btn border border-1 rounded-4 btn-outline-info text-black'>submit</button>
                    <button className='bg-white border-0' onClick={() => toggleCommentsVisibility(project.id)}>
                      {projectCommentsVisibility[project.id] ? <i className="fa-solid fa-chevron-up"></i> : <i className="fa-solid fa-chevron-down"></i>}
                    </button>
                  </div>
                </div>
                {projectCommentsVisibility[project.id] &&
                  comments.filter((comment) => comment.projectid === project.id)
                    .map((comment, idx) => (
                      <div key={idx}>
                        <div className='mt-1 mb-0 pb-0 ps-2 pt-1 d-flex'>
                          <h6 className='ps-1 fw-light'><Link to={`/AnotherProfile/${comment.userId}`}>{'< '}{comment.userName}{' />'}</Link></h6>
                          <p className='ms-1'>{comment.text}</p>
                          {userData.uid === comment.userid && 
                            <button onClick={()=>deleteComment(comment.id)} className='btn p-1 pt-0 mb-2 ms-2'><i className="fa-solid fa-trash fa-xs"></i></button>
                          }
                        </div>
                      </div>
                  ))
                }
                {userData.uid === project.userId && 
                  <button onClick={()=>deleteProject(project.id)} className='btn position-absolute top-0 end-0'><i className="fa-solid fa-trash"></i></button>
                }
            </div>
         </div>
))}


      </div>
    </>
  );
}


