import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DarkMode from '../DarkMode/DarkMode';
import axios from 'axios';
import NavbarStyle from "./Navbar.module.css";

export default function Navbar({ userData, logout, userT }) {
  const [searchContent, setSearchContent] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  async function getSearch(e) {
    e.preventDefault();
    try {
      const { data } = await axios.get(`https://localhost:7134/api/profile/search/string:text ?text=${searchContent}`, {
        headers: {
          Authorization: `Bearer ${userT}`,
        },
      });
      console.log(data)
      // Update search results state based on different categories
      setSearchResults({
        users: data.filtereduser,
        projects: data.filterProject,
        posts: data.filteredPost,
        questions: data.filterQuestion,
      });
    } catch (error) {
      // console.error('Error searching:', error);
      console.error('no data');
    }
  }

  return (
    <nav className='border-bottom border-2 p-2 d-flex justify-content-around'>
    <div className='letf-nav d-flex align-items-center'>
      {/* Your logo */}
      

     
      <li className='px-3'>
      
        <img src={`/lll.png`}style={{ width: '32px', height: '32px' }} />
      </li>
    
      <h3 className='px-2'>DEV<span className='text-warning m-0'>NOOK </span> </h3>
      {userData && (
        <ul className='list-unstyled d-flex m-0 align-items-center px-5 '>
          <li className='px-3'><Link to='home'><i className="fa-solid fa-house fa-xl"></i></Link></li>
          <li className='px-3'><Link to='interactions'><i className="fa-solid fa-bell fa-xl"></i></Link></li>
          <li className='px-3'><Link to='profile'><i className="fa-sharp fa-solid fa-address-card fa-xl"></i></Link></li>
          <DarkMode />
        </ul>
      )}
    </div>
      <div className='right-nav d-flex'>
        <ul className='list-unstyled d-flex m-0 align-items-center px-2'>
          {userData ? (
            <>
              <form className="d-flex" role="search">
                <input
                  onChange={(e) => setSearchContent(e.target.value)}
                  className="form-control border-1 border-secondary-subtle me-2 w-100"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button onClick={getSearch} className='bg-white border-0'><i className="fa-solid fa-magnifying-glass fa-lg"></i></button>
              </form>
                <li onClick={logout} className='px-4'><Link to='/login'> LogOut </Link></li>
            </>
          ) : (
            <>
              <li className='px-2'><Link to='/'> Register </Link></li>
              <li className='px-2'><Link to='/login'> Login </Link></li>
            </>
          )}
        </ul>
      </div>


      {/* Render search results */}
      {searchContent.length > 0 && (
       <div className={`${NavbarStyle.background}`}>


        <div className=''>
          {/* Render users */}
          {searchResults.users && searchResults.users.length > 0 && (
            <div className={`${NavbarStyle.loxl}`}>
              <h6 className={`${NavbarStyle.head}`}>Users</h6>
              {searchResults.users.map((user, index) => (
                <div className={`${NavbarStyle.loll}`}  key={index}>
                <div className='d-flex' key={index}>
                  {/* <img src={`/imgs/${user.imgeurl}`} alt="Profile" /> */}
                  {/* <img src={require(`/imgs/${user.imgeurl}`).default} alt="Profile" /> */}
                  <img src={`/imgs/${user.imgeurl}`} className='border rounded35 me-1' alt="" style={{ 
                  maxWidth: '26px', // Set the maximum width of the image
                  maxHeight: '26px' // Set the maximum height of the image
                }} />
                  {/* <img src="./" alt="" /> */}
                   <p><Link to={`/AnotherProfile/${user.udi}`}>{'<'}{user.userName}{'/>'}</Link></p>
                 </div> </div>
              ))}
            </div>
          )}

          {/* Render projects */}


          {searchResults.projects && searchResults.projects.length > 0 && (
             <div className={`${NavbarStyle.loxl}`}>
            <h6 className={`${NavbarStyle.head}`}>Projects</h6>
            {searchResults.projects.map((project, index) => (
              <div className={`${NavbarStyle.loll}`}  key={index}>
              <div key={index} className='d-flex'>
                 <img src={`/imgs/${project.imgeurl}`} className='border rounded35 me-1' alt="" style={{ 
                  maxWidth: '26px', // Set the maximum width of the image
                  maxHeight: '26px' // Set the maximum height of the image
                }} />
                <p className='me-1'><Link to={`/AnotherProfile/${project.userId}`}>{'<'}{project.userName}{'/>'}</Link></p>
                <Link to={`/projectdetails/${project.id}`}>{project.brief}</Link>
              </div></div>
            ))}
            </div>
          )} 


          {/* Render questions */}
          {searchResults.questions && searchResults.questions.length > 0 && (
             <div className={`${NavbarStyle.lo0l}`}>
              <h6 className={`${NavbarStyle.head}`}>Questions</h6>
              {searchResults.questions.map((question, index) => (
                <div className={`${NavbarStyle.loll}`}  key={index}>
                  <div className='d-flex'>
                  <p className='me-1'><Link to={`/AnotherProfile/${question.userId}`}>{'<'}{question.userName}{'/>'}</Link></p>
                  <Link to={`/questiondetails/${question.id}`}>{question.question}</Link>
                  </div>
                  </div>
              ))}
            </div>
          )}


         


          {/* Render posts */}

          {searchResults.posts && searchResults.posts.length > 0 && (
            <div className={`${NavbarStyle.category}`}>
              
            <h6 className={`${NavbarStyle.head}`}>Posts</h6>
            {searchResults.posts.map((post, index) => (
              <div className={`${NavbarStyle.loll}`}  key={index}>
              <div key={index} className='d-flex'>
                <img src={`/imgs/${post.userimage}`} className='border rounded-3 me-1' alt="" style={{ 
                  maxWidth: '26px', // Set the maximum width of the image
                  maxHeight: '26px' // Set the maximum height of the image
                }} />
                <p className='me-1'><Link to={`/AnotherProfile/${post.userid}`}>{'<'}{post.username}{'/>'}</Link></p>
                <Link to={`/postdetails/${post.id}`}>{post.contant}</Link>
              </div></div>
            ))}
            </div>
          )} 


        </div>
      </div>
      )}
      </nav>
      
  );
}


