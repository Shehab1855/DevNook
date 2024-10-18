import React, {useEffect, useState } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './Components/Home/Home'
import Layout from './Components/Layout/Layout'
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'
import Bookmark from './Components/Bookmark/Bookmark'
import Settings from './Components/Settings/Settings'
import { jwtDecode } from 'jwt-decode'
import Authentication from './Components/Authentication/Authentication'
import PathNotExist from './Components/PathNotExist/PathNotExist'
import Project from './Components/Project/Project'
import EditProfile from './Components/EditProfile/EditProfile'
import Question from './Components/Question/Question'
import ChangePassword from './Components/ChangePassword/ChangePassword'
import GetRequestsRecieved from './Components/GetRequestsRecieved/GetRequestsRecieved'
import GetRequsetsSent from './Components/GetRequsetsSent/GetRequsetsSent'
import AnotherProfile from './Components/AnotherProfile/AnotherProfile'
import DeleteAccount from './Components/DeleteAccount/DeleteAccount'
import UserProfile from './Components/UserPorfile/UserProfile'
import NotFound from './Components/NotFound/NotFound'
import Chat from './Components/Chat/Chat'
import SavedProjects from "./Components/SavedProjects/SavedProjects"
import SavedQuestions from "./Components/SavedQuestions/SavedQuestions"
import Projects from './Components/Projects/Projects'
import Likes from './Components/Likes/Likes'
import Interactions from './Components/Interactions/Interactions'
import ProjectDetails from './Components/ProjectDetails/ProjectDetails'
import QuestionDetails from './Components/QuestionDetails/QuestionDetails'
import ResetPassword from './Components/ResetPassword/ResetPassword'
import SavedPosts from './Components/SavedPosts/SavedPosts'
import BlockList from './Components/BlockList/BlockList'
import Admindashboard from './Components/Admin/Admindashboard'
import NewPassword from './Components/NewPassword/NewPassword'
import PostDetails from './Components/PostDetails/PostDetails'


export default function App() {
  //handel el refresh الداتا متضيعش بمجرد معمل ريفريش
  useEffect(()=> {
    if(localStorage.getItem('userToken')!==null){
      saveUserData()
    }
  },[])

  let [userData , setUserData] = useState(null)
  let [userT , setUserT] = useState(null)


  function saveUserData(){
   let encodedToken = localStorage.getItem('userToken')
   setUserT(encodedToken)
  //  console.log(localStorage.getItem('userToken'))
   let decodedToken = jwtDecode(encodedToken)
   setUserData(decodedToken) // there is id of the user and more information
   console.log(decodedToken)
  //  console.log(decodedToken)
  //  console.log(decodedToken.uid)
   //  let x = decodedToken.uid
   //  console.log(x)
  }


  let routers = createBrowserRouter([{
     path:'/', element:<Layout userT ={userT} setUserData={setUserData} userData={userData}/> , children :[
    { index: true, element:<Register/>},
    {path:'home', element:<Authentication><Home userT={userT}/></Authentication>},
    {path:'question', element:<Authentication><Question userT ={userT} userData={userData}/></Authentication>},
    { path:'login', element:<Login saveUserData ={saveUserData}/>},
    { path:'resetPassword', element:<ResetPassword/>},
    // { path:'profile', element:<Authentication><UserProfile userT ={userT}/></Authentication>},
    { path:'bookmark', element:<Authentication><Bookmark/></Authentication>},
    { path:'project', element:<Authentication><Project userData ={userData} userT ={userT}/></Authentication>},
    { path:'settings', element:<Authentication><Settings/></Authentication>},
    { path:'editprofile', element:<Authentication><EditProfile userData={userData} userT ={userT} /></Authentication>},
    { path:'changepassword', element:<Authentication><ChangePassword userData={userData} userT ={userT} /></Authentication>},
    { path:'getRequestsRecieved', element:<Authentication><GetRequestsRecieved userData={userData} userT ={userT} /></Authentication>},
    { path:'interactions', element:<Authentication><Interactions userData={userData} userT ={userT} /></Authentication>},
    { path:'getRequsestsSent', element:<Authentication><GetRequsetsSent userData={userData} userT ={userT} /></Authentication>},
    { path:'AnotherProfile/:userId', element:<Authentication><AnotherProfile userData={userData} userT ={userT} /></Authentication>},
    { path:'deleteAccount', element:<Authentication><DeleteAccount userData={userData} userT ={userT} /></Authentication>},
    { path:'profile', element:<Authentication><UserProfile userData={userData} userT ={userT} /></Authentication>},
    { path:'notFound', element:<Authentication><NotFound userData={userData} userT ={userT} /></Authentication>},
    { path:'projectdetails/:id', element:<Authentication><ProjectDetails userData={userData} userT ={userT} /></Authentication>},
    { path:'questiondetails/:id', element:<Authentication><QuestionDetails userData={userData} userT ={userT} /></Authentication>},
    { path:'postdetails/:id', element:<Authentication><PostDetails userData={userData} userT ={userT} /></Authentication>},
    { path:'savedPosts', element:<Authentication><SavedPosts userData={userData}  /></Authentication>},
    { path:'blockList', element:<Authentication><BlockList userData={userData} userT ={userT} /></Authentication>},
    { path:'admin', element:<Authentication><Admindashboard userData={userData} userT ={userT} /></Authentication>},
    { path:'savedProjects', element:<Authentication><SavedProjects userData={userData}  /></Authentication>},
    { path:'savedQuestions', element:<Authentication><SavedQuestions userData={userData}  /></Authentication>},
    { path:'Chat/:userId', element:<Authentication><Chat userData={userData} userT ={userT} /></Authentication>},
    { path:'likes', element:<Authentication><Likes userData={userData} userT ={userT} /></Authentication>},
    { path:'newpassword', element:<NewPassword userData={userData} userT ={userT} />},
    { path:'projects', element:<Authentication><Projects /></Authentication>},
    { path:'*', element: <PathNotExist/>}
    
    ]}])
  
  return (
    <RouterProvider router={routers}/>
  )
}

