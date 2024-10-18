// import  axios  from 'axios'
// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'


// export default function ResetPassword() {

//     let navigate = useNavigate()
//     const [email ,setEmail] = useState()
//     const [icn ,setICN] = useState({
//         id:'',
//         changePasswordTokken:'',
//         newPassword:''
//     })

//     async function sendEmail(e){
//         e.preventDefault()
//         // console.log('gg')
//         const res = await axios.put(`https://localhost:7134/api/Auth/ForgetPassword?Email=${email}`)
//         console.log(res.data)
//         setICN(res.data)
        
//     }

//     console.log(icn)

//     function getData(e){
//         let myIcn = {...icn}
//         myIcn[e.target.name] = e.target.value
//         setICN(myIcn)
//       }
      

//       async function sendNewPass() {
//         axios.put('https://localhost:7134/api/Auth/ResetPassword',icn)
//         navigate('/login')
             
//       }
    

//   return (
//     <>
//     <div className='w-50 border border-1 rounded-1 m-auto mt-4'>

//         <div>
//             <form onSubmit={sendEmail}>
//                 <div className=' p-3 d-flex'>
//                     <input onChange={(e)=>setEmail( e.target.value)} className='form-control w-75 mx-1' type="text" name="" id="" placeholder='E-mail' />
//                     <button className='btn btn-outline-info ' type='submit'>Submit</button>
//                 </div>
//             </form>
//         </div>

//         <div className=''>
//         {Object.keys(icn).length === 0 ? "" : <div className='d-flex p-3  '>
//             <input onChange={getData} className=' form-control mx-1 w-75' type="text" name='newPassword' placeholder='write a new password'/>
//             <button onClick={sendNewPass} className='btn btn-outline-info'>Submit</button>
//             </div>}
//         </div>
//     </div>
//     </>
//   )
// }











// import axios from 'axios';
// import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';

// export default function ResetPassword() {
//     // let navigate = useNavigate();
//     const [email, setEmail] = useState('');
//     const [icn, setICN] = useState({
//         id: '',
//         changePasswordTokken: '',
//         newPassword: ''
//     });
//     const [emailSubmitted, setEmailSubmitted] = useState(false);

//     async function sendEmail(e) {
//         e.preventDefault();
//         const res = await axios.put(`https://localhost:7134/api/Auth/ForgetPassword?Email=${email}`);
//         console.log(res.data);
//         setICN(res.data);
//         setEmailSubmitted(true); // Set emailSubmitted to true after submitting email
//     }

//     function getData(e) {
//         let myIcn = { ...icn };
//         myIcn[e.target.name] = e.target.value;
//         setICN(myIcn);
//     }

//     // async function sendNewPass() {
//     //     await axios.put('https://localhost:7134/api/Auth/ResetPassword', icn);
//     //     navigate('/login');
//     // }

//     return (
//         <>
//             <div className='w-50 border border-1 rounded-1 m-auto mt-4'>
//                 <div>
//                     <form onSubmit={sendEmail}>
//                         <div className='p-3 d-flex'>
//                             <input onChange={(e) => setEmail(e.target.value)} className='form-control w-75 mx-1' type="text" name="" id="" placeholder='E-mail' />
//                             <button className='btn btn-outline-info' type='submit'>Submit</button>
//                         </div>
//                     </form>
//                 </div>
//                 <div className=''>
//                     {/* Render newPassword field only if email is submitted */}
//                     {emailSubmitted && <div className='d-flex p-3'>
//                         <p>Check Your Mail</p>
//                     </div>}
//                 </div>
               
//             </div>
//         </>
//     );
// }

import axios from 'axios';
import React, { useState } from 'react';

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [icn, setICN] = useState({
        id: '',
        changePasswordTokken: '',
        newPassword: ''
    });
    const [emailSubmitted, setEmailSubmitted] = useState(false);

    async function sendEmail(e) {
        e.preventDefault();
        const res = await axios.put(`https://localhost:7134/api/Auth/ForgetPassword?Email=${email}`);
        console.log(res.data);
        setICN(res.data);
        setEmailSubmitted(true); // Set emailSubmitted to true after submitting email
        if (res.data.id && res.data.changePasswordTokken && res.data.newPassword) {
            // Redirect to the New Password component with icn object passed as URL parameters
            window.location.href = `/new-password?id=${res.data.id}&token=${res.data.changePasswordTokken}&newPassword=${res.data.newPassword}`;
        }
    }

    return (
        <>
            <div className='w-50 border border-1 rounded-1 m-auto mt-4'>
                <div>
                    <form onSubmit={sendEmail}>
                        <div className='p-3 d-flex'>
                            <input onChange={(e) => setEmail(e.target.value)} className='form-control w-75 mx-1' type="text" name="" id="" placeholder='E-mail' />
                            <button className='btn btn-outline-info' type='submit'>Submit</button>
                        </div>
                    </form>
                </div>
                <div className=''>
                    {/* Render newPassword field only if email is submitted */}
                    {emailSubmitted && <div className='d-flex p-3'>
                        <p>Check Your Mail</p>
                    </div>}
                </div>
            </div>
        </>
    );
}









// {/* <div className=''>
// {/* Render newPassword field only if email is submitted */}
// {emailSubmitted && <div className='d-flex p-3'>
//     <input onChange={getData} className='form-control mx-1 w-75' type="password" name='newPassword' placeholder='Enter new password' />
//     <button onClick={sendNewPass} className='btn btn-outline-info'>Submit</button>
// </div>}
// </div> */}