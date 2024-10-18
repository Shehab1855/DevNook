import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import loginStyle from "./Login.module.css"



export default function Login({saveUserData}) {
  let navigate = useNavigate()
  let [errorResFromApi , setErrorResFromApi] = useState('')
  let [isLoading , setIsLoading] = useState('false')

  let [user , setUser] = useState({
    email: '',
    password: ''
  })
  
  
  
async function sendLoginDataToApi() {
  try {
    let response = await axios.post('https://localhost:7134/api/Auth/login', user);
    // console.log(response.data.token)
    localStorage.setItem('userToken', response.data.token)
    saveUserData()
    console.log(response)
    
    // if (response.status === 200) {
    //   if(response.roles === ){
    //     navigate('./admin')
    //   }
    //   navigate('/home');
    // } else {
    //   console.log('Unexpected status code:', response.status);
    // }
    if (response.status === 200) {
      const roles = response.data.roles || [];
      console.log(roles)

      if (roles.includes('User') && roles.includes('Admin')) {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } else {
      console.log('Unexpected status code:', response.status);
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      if (error.response.data.errors) {
        // Check for specific errors related to missing email or password
        if (error.response.data.errors.Email && error.response.data.errors.Email[0]) {
          setErrorResFromApi(error.response.data.errors.Email[0]); // Set error message for missing email
        } else if (error.response.data.errors.Password && error.response.data.errors.Password[0]) {
          setErrorResFromApi(error.response.data.errors.Password[0]); // Set error message for missing password
        } else {
          console.log('Bad Request:', error.response.data);
          setErrorResFromApi(error.response.data); // Set a generic error message for other 400 errors
        }
      } else {
        console.log('Bad Request:', error.response.data);
        setErrorResFromApi(error.response.data); // Set a generic error message for other 400 errors
      }
    } else {
      // Handle other errors
      console.error('An error occurred:', error.message);
    }
  } finally {
    setIsLoading(false); // Set loading to false regardless of the outcome
  }
}

// ---------------------------


function submitForm(e){
  e.preventDefault()
  sendLoginDataToApi()
  setIsLoading(true)
  
}

function getUserData(e){
  let myUser = {...user}
  myUser[e.target.name] = e.target.value
  setUser(myUser)
}

function forgetPassword(){
  navigate('/resetPassword')
}

// async function lol() {
//   try {
//       const res = await axios.get('https://localhost:7134/api/Auth/GoogleResponse');
//       console.log(res); // Log the response data
//   } catch (error) {
//       // console.error('Error:', error);
//       // Handle the error appropriately, for example:
//       // console.log('An error occurred while fetching data:', error.message);
//   }
// }


return <> 


{/* d-flex justify-content-center align-items-center min-vh-100 */}

    {errorResFromApi.length > 0 ? <div className='alert alert-danger my-2'>{errorResFromApi}</div>:''}

   <div className= "container my-2">
    <div className="row border rounded-3 p-5 bg-white shadow">

      <div className="col-md-6">
        <img src="/bglogin.png" className='img-fluid' alt="" />
      </div>

      
      <div className="col-md-6 my-4">

        <form onSubmit={submitForm} className='mt-4'>
          <h2 className={`${loginStyle.login}  text-center my-2`}>Lo<span className={loginStyle.g}>g</span> In</h2>
          <p className={`${loginStyle.logincap} text-center`}> puplic and private platform , join us now</p>

          {/* <label className='label text-black' htmlFor="email">Email :</label> */}
          {/* <input onChange={getUserData}  className= "form-control input-form my-4 " type="text" placeholder='Email address' name='Email' id='' /> */}
          <div className='input-group my-4'>
             <span className='input-group-text'>
                <i className="fa-solid fa-envelope"></i>
             </span>
             <input onChange={getUserData} className='form-control input-form' placeholder='Email address' type="text" name='email'/>
           </div>

          {/* <label className='label text-black' htmlFor="password">Password :</label> */}
           {/* <input onChange={getUserData} className='form-control input-form my-4'  placeholder='Password' type="text" name='password' id=''/> */}
           <div className='input-group my-3'>
              <span className='input-group-text'>
                <i className="fa-solid fa-lock"></i>
              </span>
              <input onChange={getUserData} className='form-control input-form' placeholder='Password' type="password" name='password'/>
           </div>         
          <button type = 'submit' className=' btn btn-lg btn-primary w-100 fs-6'>
            {isLoading === true? <i className='fas fa-spinner fa-spin'></i> : 'Login'}
          </button>
        </form>
        <button onClick={forgetPassword} className='border-0 bg-body fw-light ps-2'>Forget Password ?</button>
        {/* <button onClick={lol} className='border-0 bg-body fw-light ps-2'>google login</button> */}


      </div>
    </div>
   </div>
  </>
}



// //with Chat help

//   async function sendLoginDataToApi() {
//     try {
//       let response = await axios.post('https://localhost:7134/api/Auth/login', user);
//       console.log(response.data.token)
//       localStorage.setItem('userToken',response.data.token)
//       saveUserData()


//       if (response.status === 200) {
//         navigate('/home');
//       } else {
//         console.log('Unexpected status code:', response.status);
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 400) {
//         // Handle 400 Bad Request
//         console.log(error)

//         console.log('Bad Request:', error.response.data);
//         setErrorResFromApi(error.response.data); // Set error message from the API
//       } else {
//         // Handle other errors
//         console.error('An error occurred:', error.message);
//       }
//     } finally {
//       setIsLoading(false); // Set loading to false regardless of the outcome
//     }
//   }





// {
  //   "message": null,
  //   "isAuthenticated": true,
//   "username": "mmmm",
//   "email": "m@gmail.com",
//   "roles": [
//     "User"
//   ],
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtbW1tIiwianRpIjoiMDIyNjg2ZWQtYmZkNC00OGRkLWEzMjctNzU3ZTcyOGJmYmQ4IiwiZW1haWwiOiJtQGdtYWlsLmNvbSIsInVpZCI6Ijc2ZGVmOTRhLTljMTEtNDY0ZC05ZGMyLTgzNjZiOGVjYzEzNCIsInJvbGVzIjoiVXNlciIsImV4cCI6MTcwNDMwMzY2MiwiaXNzIjoiU2VjdXJlQXBpIiwiYXVkIjoiU2VjdXJlQXBpVXNlciJ9.B-no70F1ehwZk6BC7Hm38achJqWqUkHqSVXAeHJNQ7k",
//   "expiresOn": "2024-01-03T17:41:02Z"
// }


// import React, { useState } from 'react'
// import axios from 'axios'
// import { setAuthUser } from '../Helper/Helper';
// import { useNavigate } from 'react-router-dom'

// export default function Login() {
//     const navigate = useNavigate
//     const [login , setLogin] = useState({
//       email: '',
//       password: '',
//       loading: false,
//       err: []
//   });


//     const LoginFun = (e)=>{
//     e.preventDefault();
//     setLogin({...login, loading: true, err:[]});
//     axios.post('https://localhost:7134/api/Auth/login',{
//       email: login.email,
//       password: login.password
//     }).then(resp => {
//      setLogin({...login, loading: false, err:[]});
//      setAuthUser(resp.data)
//      navigate('/home')
      
//     }).catch(error =>{
//       console.log('hello')
//        setLogin({...login, loading: false, err: error.response.data.errors});
      
//     });
  
//   };

//   return <>
//   {login.err.map((error ,index)=>{
//     return  <div key={index} className='alert alert-danger'>{error.msg}</div>
//   })}
  
//   <form onSubmit={LoginFun} className='my-4'>

//       <label className='label' htmlFor="email">email :</label>
//       <input onChange={e=>setLogin({...login,email:e.target.value})} required className='form-control input-form my-2' type="email" name='Email' id=''  value={login.email}/>

//       <label className='label' htmlFor="password">Password :</label>
//       <input onChange={e=>setLogin({...login,password:e.target.value})} required className='form-control input-form my-2' type="text" name='password' id='' value={login.password}/>

//       <button type = 'submit' className=' btn btn-outline-info my-2 px-4'>
//         {login.loading === true? <i className='fas fa-spinner fa-spin'></i> : 'Login'}
//       </button>

//   </form></>
// }





