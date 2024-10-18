
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { toast } from "react-toastify";



export default function ProjectDetails({userT , userData}) {
    const [projectCommentsVisibility, setProjectCommentsVisibility] = useState({});
    const [project ,setProjectDetails] = useState({})
    const [comment ,setcomment] = useState([])
    const allParmas = useParams()
    // console.log(allParmas)
    const id = allParmas.id
    // console.log(id)


    function toggleCommentsVisibility(projectID) {
        setProjectCommentsVisibility(prevState => ({
          ...prevState,
          [projectID]: !prevState[projectID] || false
        }));
      }

   async function getProjectbyid(id){
    try{
     const response = await axios.get(`https://localhost:7134/api/Project/GetFileById?id=${id}`,{
      headers:{
          Authorization: `Bearer ${userT}`
         }
        })
        console.log(response.data)
        setProjectDetails(response.data)
    }
    catch(error){

    }
   }
   async function getComment(id){
    try{
     const response = await axios.get(`https://localhost:7134/api/Project/Getcomment/id:int ?id=${id}`,{
      headers:{
          Authorization: `Bearer ${userT}`
         }
        })
        console.log(response.data)
        setcomment(response.data)
    }
    catch(error){

    }
   }

   async function deletecommnet(idd , projectID){
    try{
      await axios.delete(`https://localhost:7134/api/Project/comment/id:int ?ProjectEvent=${idd}`,{
        headers:{
          authorization:`Bearer ${userT}`
        }
      })
      getProjectbyid(projectID)
      getComment(projectID)
      
    }catch(error){
      console.log('ss')

    }
  }

   
   useEffect(()=>{
    getProjectbyid(id)
    getComment(id)
   },[id])




   const downloadProject = async (id , projectName) => {
    try {
      // Assuming userInfo.id is valid here
      const response = await axios.get(
        `https://localhost:7134/api/Project/downloadproject?projectid=${id}`,
        {
          headers: {
            Authorization: `Bearer ${userT}`,
          },
          responseType: "blob", // Ensure response is treated as blob
        }
      );

      if (!response || !response.data || response.data.size === 0) {
        toast.error("No Project uploaded for this user.");
        return;
      }

      const blob = new Blob([response.data], { type: "application/pdf" });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Setting filename correctly
      link.setAttribute("download",projectName );

      link.style.display = "none";
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
      toast.success("Project downloaded successfully");
    } catch (error) {
      console.error("Error downloading Porject:", error.message);
      toast.error("Failed to download Project. Please try again later.");
    }
  };



  return (
    <>
    <div className='p-3 '>
        <div className='border border-1 rounded-1 p-2 w-75'>
            <h6 className='ps-1 fw-light'><Link to={`/AnotherProfile/${project.userId}`}>{'< '}{project.userName}{' />'}</Link></h6>
            <h6 className='mt-1 fs-5 ps-2'>{project.brief}</h6>
            <div className='ps-2 my-3'>
              {/* <img src={`/projectFiles/${project.fileName}`} alt="" style={{ 
                maxWidth: '420px', 
                maxHeight: '420px'}}/> */}
                {/* <a href={`${project.filePath}/${project.fileName}`} download={project.fileName}>
                      Download {project.fileName}
                </a> */}
                {/* <a href='_blank' download={project.fileName}>
                      Download {project.fileName}
                </a> */}
                <div className='border rounded-1 p-1 px-3 d-flex w-50'>
                  <p className='mt-3'><i class="fa-regular fa-file"></i> Project File</p>

                <button type="button" className="btn ms-4 border rounded-3 ms-2" onClick={() => downloadProject(project.id , project.fileName)}>
                   Download
                 </button>
                </div>
            </div>
            <div className='d-flex'>
                <p className='me-2'>Likes: {project.totallike}</p>      
                <p>Dislikes: {project.totaldislike}</p> 
           </div>  
           <div className='d-flex'>
            
           <p>Comments: {project.totalcomment}</p>
           <button className='bg-white border-0 mb-3' onClick={() => toggleCommentsVisibility(project.id)}>
                      {projectCommentsVisibility[project.id] ? <i className="fa-solid fa-chevron-up"></i> : <i className="fa-solid fa-chevron-down"></i>}
            </button>
           </div>
           {projectCommentsVisibility[project.id] &&
                  comment.filter((comment) => comment.projectid === project.id) /// hena anta ma8earhaaaaaaaaaaa
                    .map((comment, idx) => (
                      <div key={idx}>
                        <div className='d-flex'>
                          <div className='mt-1 mb-0 pb-0 ps-2 pt-1 d-flex'>
                                <img src={`imgs/${project.imgeurl}`} alt="" style={{ 
                                  maxWidth: '40px', 
                                  maxHeight: '40px'}}/>
                                <h6 className='ps-1 fw-light'><Link to={`/AnotherProfile/${comment.userid}`}>{'< '}{comment.username}{' />'}</Link></h6>
                                <p className='ms-1'>{comment.taxt}</p>
                          </div>
                          <div>
                                {userData.uid === comment.userid? <button onClick={()=>deletecommnet(comment.eventid , project.id)} className=' mt-0 btn'><i className="fa-solid fa-trash"></i></button>:'' }
                          </div>
                      </div>
                      </div>
                  ))
                }

           <p className='text-black-50'>{project.createdDate}</p> 
        </div>
    </div>

    </>
  );}
 
   
  


