import React from 'react'
import Navbar from '../Navbar/Navbar'
import {Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '../Sidebar/Sidebar'


export default function Layout({userData , setUserData ,userT}) {

  let navigate = useNavigate()
  function logout() {
    localStorage.removeItem('userToken')
    setUserData(null)
    navigate('/login') 
  }
  
  return <>
    <Navbar userT={userT} logout={logout} userData = {userData}/>
    <div className="container-fluid">
      {userData? <div className='row'>
       <div className='col-1'><Sidebar/></div> 
        <div className='col-10 offset-1'><Outlet></Outlet></div> 
        </div>: <Outlet></Outlet>} 
      
    </div>
  </>
}
