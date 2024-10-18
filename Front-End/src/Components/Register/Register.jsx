import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import registerStyle from './Register.module.css';

export default function Register() {
  let navigate = useNavigate();

  let [errorResFromApi, setErrorResFromApi] = useState({});
  let [isLoading, setIsLoading] = useState(false);

  let [user, setUser] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    birthdate: '',
    phoneNumber: ''
  });

  async function sendRegisterDataToApi() {
    try {
      let response = await axios.post('https://localhost:7134/api/Auth/register', user);
      
      if (response.status === 200) {
        navigate('/login');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const responseData = error.response.data;
         console.log(error.response.data)

        if (responseData.errors) {
          // Handle validation errors
          setErrorResFromApi(responseData.errors);
        } else if (responseData=== 'Email is already registered!') {
          // Handle email already registered error
          setErrorResFromApi({ email: ['Email is already registered!'] });
        } else {
          // Handle other errors
          setErrorResFromApi({ generic: error.response.data });
        }
      } else {
        console.error('An error occurred:', error.message);
        setErrorResFromApi({ generic: 'An error occurred. Please try again later.' });
      }
    } finally {
      setIsLoading(false);
    }
  }

  function submitForm(e) {
    e.preventDefault();
    setIsLoading(true);
    sendRegisterDataToApi();
  }

  function getUserData(e) {
    let myUser = { ...user };
    myUser[e.target.name] = e.target.value;
    setUser(myUser);
  }

  return (
    <>
 {Object.keys(errorResFromApi).length > 0 && (
  <div className='alert alert-danger my-2 p-2'>
    {Object.entries(errorResFromApi).map(([fieldName, errors]) => (
      <div key={fieldName}>
        {Array.isArray(errors) ? (
          errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))
        ) : (
          <p>{errors}</p>
        )}
      </div>
    ))}
  </div>
)}

      <div className="container">
        <div className="row bg-white my-0 border rounded-3">
          <div className="col-md-6">
            <img src="registerBg.png" className=' img-fluid' alt="" />
            <p className={registerStyle.text}>Community for programmers that can interact with each other and share knowledge, join us now</p>
          </div>
          <div className="col-md-6">
            <form onSubmit={submitForm} className='my-2'>
            <h2 className='text-center py-3'>Si<span className= {registerStyle.g}>g</span>n Up</h2>
              <div className='d-flex justify-content-around align-items-center'>
                <div className='input-group my-1 me-1'>
                  <span className='input-group-text'>
                    <i className="fa-solid fa-file-signature"></i>
                  </span>
                  <input onChange={getUserData} className='form-control input-form' placeholder='First Name' type="text" name='firstName'/>
                </div>
                <div className='input-group my-1'>
                  <span className='input-group-text'>
                    <i className="fa-solid fa-file-signature"></i>
                  </span>
                  <input onChange={getUserData} className='form-control input-form' placeholder='Last Name' type="text" name='lastName'/>
                </div>
              </div>
              <div className='input-group my-3'>
                <span className='input-group-text'>
                  <i className="fa-solid fa-user"></i>
                </span>
                <input onChange={getUserData} className='form-control input-form' placeholder='User Name' type="text" name='username'/>
              </div>
              <div className='input-group my-3'>
                <span className='input-group-text'>
                  <i className="fa-solid fa-envelope"></i>
                </span>
                <input onChange={getUserData} className='form-control input-form' placeholder='Email' type="text" name='email'/>
              </div>
              <div className='input-group my-3'>
                <span className='input-group-text'>
                  <i className="fa-solid fa-lock"></i>
                </span>
                <input onChange={getUserData} className='form-control input-form' placeholder='Password' type="password" name='password'/>
              </div>
              <div className='input-group my-3'>
                <span className='input-group-text'>
                  <i className="fa-solid fa-calendar-days"></i>
                </span>
                <input onChange={getUserData} className='form-control input-form' placeholder='Birthdate' type="text" name='birthdate'/>
              </div>
              <div className='input-group my-3'>
                <span className='input-group-text'>
                  <i className="fa-solid fa-phone fa-1x"></i>
                </span>
                <input onChange={getUserData} className='form-control input-form' placeholder='Phone Number' type="text" name='phoneNumber'/>
              </div>
              <button type='submit' className='px-2 btn btn-lg btn-primary w-100 '>
                {isLoading ? <i className='fas fa-spinner fa-spin'></i> : 'Register'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}






// import axios from 'axios';
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import registerStyle from './Register.module.css'

// export default function Register() {
//   let navigate = useNavigate();

//   let [errorResFromApi, setErrorResFromApi] = useState('');
//   let [isLoading, setIsLoading] = useState(false);

//   let [user, setUser] = useState({
//     firstName: '',
//     lastName: '',
//     username: '',
//     email: '',
//     password: '',
//     birthdate: '',
//     phoneNumber: ''
//   });

//   async function sendRegisterDataToApi() {
//     try {
//       let response = await axios.post('https://localhost:7134/api/Auth/register', user);
      
//       if (response.status === 200) {
//         navigate('/login');
//       } else {
//         console.log('Unexpected status code:', response.status);
//         navigate('/login');
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 400) {
//         console.log(error.response)
//         console.log('Validation error:', error.response.data);

//         // Set error messages for each field
//         setErrorResFromApi(error.response.data.errors || {}) ;
//       } else {
//         console.error('An error occurred:', error.message);
//         setErrorResFromApi({ generic: 'An error occurred. Please try again later.' });
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   function submitForm(e) {
//     e.preventDefault();
//     setIsLoading(true);
//     sendRegisterDataToApi();
//   }

//   function getUserData(e) {
//     let myUser = { ...user };
//     myUser[e.target.name] = e.target.value;
//     setUser(myUser);
//   }

//   return <>
//       {Object.keys(errorResFromApi).length > 0 && (
//         <div className='alert alert-danger my-2 p-2'>
//           {Object.entries(errorResFromApi).map(([fieldName, errors]) => (
//             <div key={fieldName}>
//               {errors.map((error, index) => (
//                 <p key={index}>{error}</p>
//               ))}
//             </div>
//           ))}
//         </div>
//          )}
//           <div className="container">
//             <div className="row bg-white my-1 border rounded-3">
//             <div className="col-md-6">
//               <img src="registerBg.png" className=' img-fluid' alt="" />
//               <p className={registerStyle.text}>Community for programmers that can interact with each other and share knowledge , join us now</p>
//             </div>

//             <div className="col-md-6">
//                 <form onSubmit={submitForm} className='my-2'>
//                   <h2 className='text-center py-3'>Si<span className= {registerStyle.g}>g</span>n Up</h2>


//                   <div className='d-flex justify-content-around align-items-center'>
//                       <div className='input-group my-1 me-1'>
//                           <span className='input-group-text'>
//                             <i className="fa-solid fa-file-signature"></i>
//                           </span>
//                           <input onChange={getUserData} className='form-control input-form' placeholder='First Name' type="text" name='firstName'/>
//                       </div>
//                       <div className='input-group my-1'>
//                             <span className='input-group-text'>
//                               <i className="fa-solid fa-file-signature"></i>
//                             </span>
//                             <input onChange={getUserData} className='form-control input-form' placeholder='Last Name' type="text" name='lastName'/>
//                       </div>
//                   </div>

//                   {/* <label htmlFor="username" className='label'>User Name :</label> */}
//                   <div className='input-group my-3'>
//                     <span className='input-group-text'>
//                       <i className="fa-solid fa-user"></i>
//                     </span>
//                     <input onChange={getUserData} className='form-control input-form' placeholder='User Name' type="text" name='username'/>
//                   </div>


//                   {/* <label htmlFor="email" className='label'>Email :</label> */}
//                   <div className='input-group my-3'>
//                       <span className='input-group-text'>
//                         <i className="fa-solid fa-envelope"></i>
//                       </span>
//                       <input onChange={getUserData} className='form-control input-form' placeholder='Email' type="text" name='email'/>
//                   </div>


//                   {/* <label htmlFor="password" className='label'>Password :</label> */}
//                   <div className='input-group my-3'>
//                     <span className='input-group-text'>
//                       <i className="fa-solid fa-lock"></i>
//                     </span>
//                     <input onChange={getUserData} className='form-control input-form' placeholder='Password' type="password" name='password'/>
//                   </div>


//                   {/* <label htmlFor="birthdate" className='label'>Birth Date :</label> */}
//                   <div className='input-group my-3'>
//                       <span className='input-group-text'>
//                         <i className="fa-solid fa-calendar-days"></i>
//                       </span>
//                       <input onChange={getUserData} className='form-control input-form' placeholder='Birthdate' type="text" name='birthdate'/>
//                   </div>

//                     <div className='input-group my-3'>
//                         <span className='input-group-text'>
//                           <i className="fa-solid fa-phone fa-1x"></i>
//                         </span>
//                         <input onChange={getUserData} className='form-control input-form' placeholder='Phone Number' type="text" name='phoneNumber'/>
//                     </div>


//                       <button type='submit' className='px-2 btn btn-lg btn-primary w-100 '>
//                         {isLoading ? <i className='fas fa-spinner fa-spin'></i> : 'Register'}
//                       </button>
//                 </form>
//             </div>
//       </div>
//     </div>
//   </>
// }






// // {
// //   "message": null,
// //   "isAuthenticated": true,
// //   "username": "vv",
// //   "email": "h@gmail.com",
// //   "roles": [
// //     "User"
// //   ],
// //   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2diIsImp0aSI6IjgxNWFmZTRhLTYyMTgtNDAzZi04MmRkLTE2MzY1YzlkN2JjOCIsImVtYWlsIjoiaEBnbWFpbC5jb20iLCJ1aWQiOiI2YTQzNTk0MC1jZDk3LTRlNTMtOWE2NS00NjE2ZDE2ODU0YmEiLCJyb2xlcyI6IlVzZXIiLCJleHAiOjE3MDQzMDY1ODUsImlzcyI6IlNlY3VyZUFwaSIsImF1ZCI6IlNlY3VyZUFwaVVzZXIifQ.YtyOEWuOqE9_3k_ESCOsW70P2OR4qYENr5BhD384WsA",
// //   "expiresOn": "2024-01-03T18:29:45Z"
// // }