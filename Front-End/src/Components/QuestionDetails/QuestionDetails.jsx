import React from 'react'
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom'
import  axios  from 'axios';


export default function QuestionDetails({userT , userData}) {

  const allParams = useParams()
  const id = allParams.id
  const [questionCommentsVisibility, setQuestionCommentsVisibility] = useState({});
  const [question , setQuestionn]= useState({})
  const [comment , setcomment]= useState([])


  function toggleCommentsVisibility(QuestionID) {
    setQuestionCommentsVisibility(prevState => ({
      ...prevState,
      [QuestionID]: !prevState[QuestionID] || false
    }));
  }
  async function getQuestionById(id){
    try{
      const response = await axios.get(`https://localhost:7134/api/Question/id:string?id=${id}`,{

      headers:{
        authorization: `Bearer ${userT}`
      }
      })
      console.log(response.data);
      setQuestionn(response.data)
    }
    catch(error){
      //lol
    }
  }
  async function getCommentById(id){
    try{
      const response = await axios.get(`https://localhost:7134/api/Question/GetComment/id:int ?id=${id}`,{

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
    getQuestionById(id);
    getCommentById(id);
  },[id])

  return (<>
    <div className='w-75'>
      <div className='border border-1 rounded-1 p-10 m-1'>

          <div className='d-flex'>
            <h6 className='ps-1 fw-light username-link'><Link to={`/AnotherProfile/${question.userId}`}>{'< '}{question.userName}{' />'}</Link></h6>
          </div>
          <h6 className='mt-1 font-monospace fs-5 ps-2'>{question.question}</h6>
          <p className='ps-2'>Likes: {question.totalLike}</p>
          <div className='d-flex m-0'>
                <p className='ps-2 '>Comments: {question.totalComment}</p>
                <button className='bg-white border-0 mb-3' onClick={() => toggleCommentsVisibility(question.id)}>
                  {questionCommentsVisibility[question.id] ? <i className="fa-solid fa-chevron-up"></i> : <i className="fa-solid fa-chevron-down"></i>}
                </button>
          </div>
          {questionCommentsVisibility[question.id] &&
                  comment.filter((comment) => comment.questionId === question.id)
                    .map((comment, idx) => (
                      <div key={idx}>
                        <div className='mt-1 mb-0 pb-0 ps-2 pt-1 d-flex'>
                          <h6 className='ps-1 fw-light'><Link to={`/AnotherProfile/${comment.userid}`}>{'< '}{comment.userName}{' />'}</Link></h6>
                          <p className='ms-1'>{comment.text}</p>
                        </div>
                      </div>
                  ))
           }

          <p className='text-black-50'>{question.createdDate}</p> 


      </div>
    </div>
  </>
  )
}
