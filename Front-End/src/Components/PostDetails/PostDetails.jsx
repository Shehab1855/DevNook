import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
// import SytlePostDetails from "./Homee.module.css"
export default function PostDetails({userT , userData}){

    const allParams = useParams();
    const id = allParams.id
    const [post , setPost]= useState({})



    const [likedPost, setLikedPost] = useState([]);
    const [dislikePost, setDislikePost] = useState([]);
    
    
    const [comment , setcomment]= useState([])
    const [postCommentsVisibility, setPostCommentsVisibility] = useState({});


    function toggleCommentsVisibility(idd) {
      setPostCommentsVisibility(prevState => ({
        ...prevState,
        [idd]: !prevState[idd] || false
      }));
    }

      async function getCommentById(id){
        try{
          const response = await axios.get(`https://localhost:7134/api/post/Getcomment/id:int ?id=${id}`,{
    
          headers:{
            authorization: `Bearer ${userT}`
          }
          })
          console.log(response.data);
          setcomment(response.data)
        }
        catch(error){
          //lol
        }
      }


    useEffect(()=>{
      getPost(id);
      getCommentById(id);
    },[id])


  async function getPost(id){
    try{
        const response = await axios.get(`https://localhost:7134/api/post/GetSpecialpost/id ?id=${id}`,{
        headers:{
          authorization: `Bearer ${userT}`
        }
        })
        console.log(response.data)
        setPost(response.data)
        // console.log('ssss')
    }catch(error){
        console.log('lol')
    }
  }

  // async function like(id) {
  //   try {
  //     const response = await axios.post(
  //       `https://localhost:7134/api/post/like/id ?id=${id}`,
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${userT}`
  //         }
  //       }
  //     );
  //     console.log(response);
  //     getPost(id);
  //   } catch (error) {
  //     // Handle error
  //   }
  // }

  async function like(idd) {
    try {
      if (likedPost.includes(idd)) {
        await deleteLike(idd);
      } else {
         await axios.post(
          `https://localhost:7134/api/post/like/id ?id=${idd}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${userT}`
            }
          })
        setLikedPost([...likedPost, idd]);
        getPost(id);
      }
    } catch (error) {
      // console.error('Error toggling like:', error);
    }
  }

  
  
  async function deleteLike(idd) {
    try {
      await axios.put(`https://localhost:7134/api/post/unlike/id:int ?postid=${idd}`,  {}, {
        headers: {
          Authorization: `Bearer ${userT}`
        }
      });
      setLikedPost(likedPost.filter(id => id !== idd));
      getPost(id);
    } catch (error) {
      // console.error('Error deleting like:', error);
    }
  }


  async function dislike(idd) {
    try {
      if (dislikePost.includes(idd)) {
        await deleteDislike(idd);
      } else {
        await axios.post(`https://localhost:7134/api/post/dislike/id:int ?id=${idd}`, {}, {
          headers: {
            Authorization: `Bearer ${userT}`
          }
        });
        setDislikePost([...dislikePost, idd])
        getPost(id);
      }
    } catch (error) {
      console.error('Error disliking project:', error);
    }
  }
    
  async function deleteDislike(idd) {
    try {
      await axios.put(`https://localhost:7134/api/post/undislike/id:int ?postid=${idd}`,{}, {
        headers: {
          Authorization: `Bearer ${userT}`
        }
      });
      setDislikePost(dislikePost.filter(id => id !== idd));
      getPost(id);
    } catch (error) {
      // console.error('Error deleting dislike:', error);
    }
  }

  async function deletecommnet(idd , postid){
    try{
      await axios.delete(`https://localhost:7134/api/post/comment/id:int ?eventid=${idd}`,{
        headers:{
          authorization:`Bearer ${userT}`
        }
      })
      getPost(postid)
      getCommentById(postid)
      
    }catch(error){
      console.log('ss')

    }
  }
  
  

  return (
    <>
     <div className='w-75'>
        <div className='border border-1 rounded-1 p-10 m-1 '>
            <div className="d-flex">
                <img src={`/imgs/${post.userimage}`} className='border rounded-3 me-1' alt="" style={{ 
                    maxWidth: '26px', // Set the maximum width of the image
                    maxHeight: '26px' // Set the maximum height of the image
                }} />
            <p className='me-1'><Link to={`/AnotherProfile/${post.userid}`}>{'<'}{post.username}{'/>'}</Link></p>
        </div>
        <div className="ms-4">
            <h6 className="ps-2">{post.contant}</h6>
            <img src={`/Postimags/${post.postimage}`} className='border rounded-4 me-1' alt="" style={{ 
                    maxWidth: '420px', // Set the maximum width of the image
                    maxHeight: '420px' // Set the maximum height of the image
                }} />
        </div>
        <div className="mt-1 ms-4">
          <button onClick={()=>like(post.id)} className='btn btn-info text-white me-1'> {likedPost > 0? 'UnLike' : 'Like'} {post.totallike}</button>
          <button onClick={()=>dislike(post.id)} className='btn btn-info text-white me-1'> {dislikePost > 0? 'UnDislike' : 'Dislike'} {post.totaldislike}</button>
         <div className="d-flex mt-2 ms-1">
                <p>comments {post.totalcomment}</p>
                <button className='bg-white border-0 mb-3' onClick={() =>toggleCommentsVisibility(post.id)}>
                        {postCommentsVisibility[post.id] ? <i className="fa-solid fa-chevron-up"></i> : <i className="fa-solid fa-chevron-down"></i>}
                </button>
         </div>
        </div>
        {postCommentsVisibility[post.id] &&
                  comment.filter((comment) => comment.postid=== post.id)
                    .map((comment, idx) => (
                      <div className="d-flex" key={idx}>
                        <div className='mb-1 pb-0 ps-2 pt-1 d-flex'>
                          <h6 className='ps-1 fw-light'><Link to={`/AnotherProfile/${comment.userid}`}>{'< '}{comment.username}{' />'}</Link></h6>
                          <p className='ms-1'>{comment.taxt}</p>
                        </div>
                        <div>
                        {userData.uid === comment.userid? <button onClick={()=>deletecommnet(comment.eventid , post.id)} className=' mt-0 btn'><i className="fa-solid fa-trash"></i></button>:'' }
                        </div>
                      </div>
                  ))
                }
        
        </div>
        <p className='text-black-50'>{post.createdDate}</p> 

    </div>

    </>
  );
};




